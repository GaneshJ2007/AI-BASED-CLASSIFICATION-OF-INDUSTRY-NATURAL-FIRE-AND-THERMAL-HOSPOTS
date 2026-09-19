"""
THERMAL TRACERS - Phase 9: Hybrid FT-Transformer + XGBoost Architecture
Implements intermediate representation fusion combining deep nonlinear latent tokens
from the FT-Transformer self-attention encoder with gradient-boosted decision modeling
from XGBoost.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
import torch
import xgboost as xgb
from sklearn.metrics import classification_report
from sklearn.utils.class_weight import compute_sample_weight

sys.path.append(r"d:\IndustryFire")
from ml.features_config import FEATURE_COLUMNS, TARGET_COLUMN, CLASS_NAMES
from ml.ft_transformer import FTTransformer, TabularDataset
from ml.evaluation import evaluate_multiclass

TRAIN_PATH = r"d:\IndustryFire\data\final\train_spatial_split.csv"
VAL_PATH = r"d:\IndustryFire\data\final\val_spatial_split.csv"
TEST_PATH = r"d:\IndustryFire\data\final\test_spatial_split.csv"

FTT_DIR = r"d:\IndustryFire\models\ft_transformer"
XGB_DIR = r"d:\IndustryFire\models\xgboost"
HYBRID_DIR = r"d:\IndustryFire\models\hybrid"
os.makedirs(HYBRID_DIR, exist_ok=True)

class HybridFusionPipeline:
    """
    Representation Fusion Engine combining FT-Transformer latent representation
    with XGBoost structured boosting.
    """
    def __init__(self, ftt_model, ftt_scaler, ftt_imputer, xgb_model, xgb_imputer, device="cpu"):
        self.ftt_model = ftt_model
        self.ftt_scaler = ftt_scaler
        self.ftt_imputer = ftt_imputer
        self.xgb_model = xgb_model
        self.xgb_imputer = xgb_imputer
        self.device = device
        self.meta_fusion_model = None

    def extract_ftt_representations(self, X_df):
        """
        Extracts 64-dimensional [CLS] latent embeddings and 3-class probabilities from FT-Transformer.
        """
        X_proc = self.ftt_scaler.transform(self.ftt_imputer.transform(X_df))
        X_tensor = torch.tensor(X_proc, dtype=torch.float32).to(self.device)
        self.ftt_model.eval()
        with torch.no_grad():
            logits, embeddings = self.ftt_model(X_tensor, return_embeddings=True)
            probs = torch.softmax(logits, dim=-1).cpu().numpy()
            embeddings = embeddings.cpu().numpy()
        return embeddings, probs

    def extract_xgb_features(self, X_df):
        """
        Extracts calibrated probabilities and raw feature matrix from XGBoost.
        """
        X_proc = self.xgb_imputer.transform(X_df)
        probs = self.xgb_model.predict_proba(X_proc)
        return X_proc, probs

    def build_fused_representation(self, X_df):
        """
        Concatenates:
        1. Original physical features (X_proc)
        2. FT-Transformer latent [CLS] embeddings (64 dimensions)
        3. FT-Transformer predicted probabilities (3 dimensions)
        4. XGBoost predicted probabilities (3 dimensions)
        """
        ftt_emb, ftt_prob = self.extract_ftt_representations(X_df)
        xgb_proc, xgb_prob = self.extract_xgb_features(X_df)
        
        fused = np.hstack([
            xgb_proc,      # 44 features
            ftt_emb,       # 64 latent transformer dims
            ftt_prob,      # 3 class probabilities
            xgb_prob       # 3 class probabilities
        ])
        return fused

    def fit(self, X_train_df, y_train, X_val_df, y_val):
        print("\nExtracting intermediate representations for Training and Validation...")
        fused_train = self.build_fused_representation(X_train_df)
        fused_val = self.build_fused_representation(X_val_df)
        print(f"Fused representation dimensionality: {fused_train.shape[1]} channels.")
        
        # Train meta-fusion model
        train_weights = compute_sample_weight("balanced", y_train)
        val_weights = compute_sample_weight("balanced", y_val)
        
        self.meta_fusion_model = xgb.XGBClassifier(
            n_estimators=250,
            learning_rate=0.03,
            max_depth=5,
            subsample=0.85,
            colsample_bytree=0.80,
            objective="multi:softprob",
            num_class=3,
            random_state=42,
            eval_metric=["mlogloss", "merror"],
            tree_method="hist",
            early_stopping_rounds=25
        )
        
        print("Optimizing Meta-Fusion Classifier on fused representations...")
        self.meta_fusion_model.fit(
            fused_train, y_train,
            sample_weight=train_weights,
            eval_set=[(fused_train, y_train), (fused_val, y_val)],
            sample_weight_eval_set=[train_weights, val_weights],
            verbose=50
        )
        return self

    def predict_proba(self, X_df):
        fused = self.build_fused_representation(X_df)
        return self.meta_fusion_model.predict_proba(fused)

    def predict(self, X_df):
        probs = self.predict_proba(X_df)
        return np.argmax(probs, axis=1)

def run_hybrid_training():
    print("=" * 65)
    print("PHASE 9: Training Hybrid FT-Transformer + XGBoost Fusion Model")
    print("=" * 65)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Load Datasets
    train_df = pd.read_csv(TRAIN_PATH)
    val_df = pd.read_csv(VAL_PATH)
    test_df = pd.read_csv(TEST_PATH)
    
    X_train = train_df[FEATURE_COLUMNS].copy()
    y_train = train_df[TARGET_COLUMN].values
    
    X_val = val_df[FEATURE_COLUMNS].copy()
    y_val = val_df[TARGET_COLUMN].values
    
    X_test = test_df[FEATURE_COLUMNS].copy()
    y_test = test_df[TARGET_COLUMN].values
    
    # Load Pre-trained Components
    print("Loading pre-trained FT-Transformer and XGBoost components...")
    ftt_imputer = joblib.load(os.path.join(FTT_DIR, "ftt_imputer.joblib"))
    ftt_scaler = joblib.load(os.path.join(FTT_DIR, "ftt_scaler.joblib"))
    
    ftt_model = FTTransformer(
        num_features=len(FEATURE_COLUMNS),
        num_classes=3,
        d_token=64,
        n_heads=4,
        n_layers=3,
        d_ffn=128,
        dropout=0.15
    ).to(device)
    ftt_model.load_state_dict(torch.load(os.path.join(FTT_DIR, "ft_transformer_best.pt"), map_location=device, weights_only=True))
    ftt_model.eval()
    
    xgb_model = joblib.load(os.path.join(XGB_DIR, "xgb_model.joblib"))
    xgb_imputer = joblib.load(os.path.join(XGB_DIR, "xgb_imputer.joblib"))
    
    # Initialize and Train Hybrid Pipeline
    hybrid_pipeline = HybridFusionPipeline(
        ftt_model=ftt_model,
        ftt_scaler=ftt_scaler,
        ftt_imputer=ftt_imputer,
        xgb_model=xgb_model,
        xgb_imputer=xgb_imputer,
        device=device
    )
    
    hybrid_pipeline.fit(X_train, y_train, X_val, y_val)
    
    # Evaluate on Out-of-Sample Spatial Test Set
    print("\n--- Evaluating Hybrid Model on Spatial Test Set ---")
    y_test_prob = hybrid_pipeline.predict_proba(X_test)
    y_test_pred = np.argmax(y_test_prob, axis=1)
    
    test_metrics = evaluate_multiclass(y_test, y_test_pred, y_test_prob, CLASS_NAMES, model_name="Hybrid FT-Transformer + XGBoost (Spatial Test)")
    
    # Save artifacts
    joblib.dump(hybrid_pipeline, os.path.join(HYBRID_DIR, "hybrid_pipeline.joblib"))
    with open(os.path.join(HYBRID_DIR, "hybrid_test_metrics.json"), "w") as f:
        json.dump(test_metrics, f, indent=2)
        
    test_res_df = test_df[["latitude", "longitude", "spatial_block_id", TARGET_COLUMN]].copy()
    test_res_df["hybrid_pred"] = y_test_pred
    for c in range(3):
        test_res_df[f"hybrid_prob_c{c}"] = y_test_prob[:, c]
    test_res_df.to_csv(os.path.join(HYBRID_DIR, "hybrid_test_predictions.csv"), index=False)
    
    print(f"Hybrid model artifacts successfully saved to: {HYBRID_DIR}")
    return test_metrics

if __name__ == "__main__":
    run_hybrid_training()
