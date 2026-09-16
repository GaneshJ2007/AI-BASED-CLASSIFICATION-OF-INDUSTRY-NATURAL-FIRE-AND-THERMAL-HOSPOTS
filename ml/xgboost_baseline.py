"""
THERMAL TRACERS - Phase 7: Baseline Model 2 (Sample-Weighted Multi-Class XGBoost)
Trains an XGBoost gradient boosted decision tree model with class-balanced sample weighting
and early stopping on spatial validation blocks.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.impute import SimpleImputer
from sklearn.utils.class_weight import compute_sample_weight

sys.path.append(r"d:\IndustryFire")
from ml.features_config import FEATURE_COLUMNS, TARGET_COLUMN, CLASS_NAMES
from ml.evaluation import evaluate_multiclass

TRAIN_PATH = r"d:\IndustryFire\data\final\train_spatial_split.csv"
VAL_PATH = r"d:\IndustryFire\data\final\val_spatial_split.csv"
TEST_PATH = r"d:\IndustryFire\data\final\test_spatial_split.csv"
MODEL_DIR = r"d:\IndustryFire\models\xgboost"
os.makedirs(MODEL_DIR, exist_ok=True)

def train_xgboost():
    print("=" * 60)
    print("PHASE 7: Training Baseline Multi-Class XGBoost Classifier")
    print("=" * 60)
    
    train_df = pd.read_csv(TRAIN_PATH)
    val_df = pd.read_csv(VAL_PATH)
    test_df = pd.read_csv(TEST_PATH)
    
    # Feature matrices
    X_train = train_df[FEATURE_COLUMNS].copy()
    y_train = train_df[TARGET_COLUMN].values
    
    X_val = val_df[FEATURE_COLUMNS].copy()
    y_val = val_df[TARGET_COLUMN].values
    
    X_test = test_df[FEATURE_COLUMNS].copy()
    y_test = test_df[TARGET_COLUMN].values
    
    # Imputation fit on train ONLY
    imputer = SimpleImputer(strategy="median")
    X_train_imp = imputer.fit_transform(X_train)
    X_val_imp = imputer.transform(X_val)
    X_test_imp = imputer.transform(X_test)
    
    # Compute balanced sample weights for training
    train_weights = compute_sample_weight(class_weight="balanced", y=y_train)
    val_weights = compute_sample_weight(class_weight="balanced", y=y_val)
    
    # XGBoost Classifier
    model = xgb.XGBClassifier(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.85,
        colsample_bytree=0.85,
        objective="multi:softprob",
        num_class=3,
        eval_metric=["mlogloss", "merror"],
        random_state=42,
        tree_method="hist",
        early_stopping_rounds=30
    )
    
    print(f"Fitting XGBoost on {len(X_train)} samples across {len(FEATURE_COLUMNS)} features...")
    model.fit(
        X_train_imp, y_train,
        sample_weight=train_weights,
        eval_set=[(X_train_imp, y_train), (X_val_imp, y_val)],
        sample_weight_eval_set=[train_weights, val_weights],
        verbose=50
    )
    
    # Validation evaluation
    y_val_pred = model.predict(X_val_imp)
    y_val_prob = model.predict_proba(X_val_imp)
    print("\n--- Validation Set Performance ---")
    val_metrics = evaluate_multiclass(y_val, y_val_pred, y_val_prob, CLASS_NAMES, model_name="XGBoost (Validation)")
    
    # Test evaluation
    y_test_pred = model.predict(X_test_imp)
    y_test_prob = model.predict_proba(X_test_imp)
    print("\n--- Out-of-Sample Spatial Test Set Performance ---")
    test_metrics = evaluate_multiclass(y_test, y_test_pred, y_test_prob, CLASS_NAMES, model_name="XGBoost (Spatial Test)")
    
    # Save artifacts
    model.save_model(os.path.join(MODEL_DIR, "xgb_model.json"))
    joblib.dump(model, os.path.join(MODEL_DIR, "xgb_model.joblib"))
    joblib.dump(imputer, os.path.join(MODEL_DIR, "xgb_imputer.joblib"))
    
    with open(os.path.join(MODEL_DIR, "xgb_test_metrics.json"), "w") as f:
        json.dump(test_metrics, f, indent=2)
        
    test_res_df = test_df[["latitude", "longitude", "spatial_block_id", TARGET_COLUMN]].copy()
    test_res_df["xgb_pred"] = y_test_pred
    for c in range(3):
        test_res_df[f"xgb_prob_c{c}"] = y_test_prob[:, c]
    test_res_df.to_csv(os.path.join(MODEL_DIR, "xgb_test_predictions.csv"), index=False)
    
    print(f"XGBoost artifacts successfully saved to: {MODEL_DIR}")
    return test_metrics

if __name__ == "__main__":
    train_xgboost()
