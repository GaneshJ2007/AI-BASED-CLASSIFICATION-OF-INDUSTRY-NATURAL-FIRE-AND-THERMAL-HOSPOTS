"""
THERMAL TRACERS - Phase 8: FT-Transformer (Feature Tokenizer + Transformer for Tabular Data)
Implements PyTorch deep tabular representation learning with multi-head self-attention
over numerical satellite features, extracting rich latent embeddings for hybrid fusion.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import f1_score

sys.path.append(r"d:\IndustryFire")
from ml.features_config import FEATURE_COLUMNS, TARGET_COLUMN, CLASS_NAMES
from ml.evaluation import evaluate_multiclass

TRAIN_PATH = r"d:\IndustryFire\data\final\train_spatial_split.csv"
VAL_PATH = r"d:\IndustryFire\data\final\val_spatial_split.csv"
TEST_PATH = r"d:\IndustryFire\data\final\test_spatial_split.csv"
MODEL_DIR = r"d:\IndustryFire\models\ft_transformer"
os.makedirs(MODEL_DIR, exist_ok=True)

class TabularDataset(Dataset):
    def __init__(self, X, y=None):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.long) if y is not None else None

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        if self.y is not None:
            return self.X[idx], self.y[idx]
        return self.X[idx]

class FeatureTokenizer(nn.Module):
    """
    Transforms continuous numerical tabular features into vector tokens.
    For each feature j, e_j = x_j * W_j + b_j in R^d.
    """
    def __init__(self, num_features: int, d_token: int):
        super().__init__()
        self.weight = nn.Parameter(torch.empty(num_features, d_token))
        self.bias = nn.Parameter(torch.empty(num_features, d_token))
        nn.init.kaiming_uniform_(self.weight, a=np.sqrt(5))
        nn.init.zeros_(self.bias)

    def forward(self, x):
        # x: (batch_size, num_features)
        # return: (batch_size, num_features, d_token)
        return x.unsqueeze(-1) * self.weight.unsqueeze(0) + self.bias.unsqueeze(0)

class FTTransformer(nn.Module):
    """
    Full FT-Transformer Architecture:
    [CLS] + Feature Tokens -> Multi-Head Self-Attention Transformer -> Latent Embedding & Logits
    """
    def __init__(self, num_features: int, num_classes: int = 3, d_token: int = 64, 
                 n_heads: int = 4, n_layers: int = 3, d_ffn: int = 128, dropout: float = 0.15):
        super().__init__()
        self.tokenizer = FeatureTokenizer(num_features, d_token)
        self.cls_token = nn.Parameter(torch.empty(1, 1, d_token))
        nn.init.normal_(self.cls_token, std=0.02)
        
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_token,
            nhead=n_heads,
            dim_feedforward=d_ffn,
            dropout=dropout,
            activation="gelu",
            batch_first=True,
            norm_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=n_layers)
        self.norm = nn.LayerNorm(d_token)
        self.head = nn.Linear(d_token, num_classes)

    def forward(self, x, return_embeddings: bool = False):
        batch_size = x.shape[0]
        # Tokenize features: (B, num_features, d_token)
        tokens = self.tokenizer(x)
        # Prepend [CLS] token: (B, 1 + num_features, d_token)
        cls_tokens = self.cls_token.expand(batch_size, -1, -1)
        tokens = torch.cat([cls_tokens, tokens], dim=1)
        
        # Transformer pass
        out = self.transformer(tokens)
        
        # Extract [CLS] latent representation
        cls_out = self.norm(out[:, 0, :])
        logits = self.head(cls_out)
        
        if return_embeddings:
            return logits, cls_out
        return logits

def train_ft_transformer():
    print("=" * 60)
    print("PHASE 8: Training FT-Transformer Deep Tabular Model")
    print("=" * 60)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using compute device: {device}")
    
    train_df = pd.read_csv(TRAIN_PATH)
    val_df = pd.read_csv(VAL_PATH)
    test_df = pd.read_csv(TEST_PATH)
    
    X_train = train_df[FEATURE_COLUMNS].copy()
    y_train = train_df[TARGET_COLUMN].values
    
    X_val = val_df[FEATURE_COLUMNS].copy()
    y_val = val_df[TARGET_COLUMN].values
    
    X_test = test_df[FEATURE_COLUMNS].copy()
    y_test = test_df[TARGET_COLUMN].values
    
    # Preprocessing: Imputation & Scaling fit on Train ONLY
    imputer = SimpleImputer(strategy="median")
    scaler = StandardScaler()
    
    X_train_proc = scaler.fit_transform(imputer.fit_transform(X_train))
    X_val_proc = scaler.transform(imputer.transform(X_val))
    X_test_proc = scaler.transform(imputer.transform(X_test))
    
    # Class weights for CrossEntropyLoss
    class_counts = np.bincount(y_train)
    total_samples = len(y_train)
    class_weights = total_samples / (len(class_counts) * class_counts)
    weight_tensor = torch.tensor(class_weights, dtype=torch.float32).to(device)
    print(f"Class Weights: {class_weights}")
    
    # DataLoaders
    train_ds = TabularDataset(X_train_proc, y_train)
    val_ds = TabularDataset(X_val_proc, y_val)
    test_ds = TabularDataset(X_test_proc, y_test)
    
    train_loader = DataLoader(train_ds, batch_size=128, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=256, shuffle=False)
    test_loader = DataLoader(test_ds, batch_size=256, shuffle=False)
    
    # Model instantiation
    num_features = len(FEATURE_COLUMNS)
    model = FTTransformer(
        num_features=num_features,
        num_classes=3,
        d_token=64,
        n_heads=4,
        n_layers=3,
        d_ffn=128,
        dropout=0.15
    ).to(device)
    
    criterion = nn.CrossEntropyLoss(weight=weight_tensor)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="max", factor=0.5, patience=5)
    
    # Training Loop with Early Stopping
    epochs = 40
    best_macro_f1 = 0.0
    best_model_path = os.path.join(MODEL_DIR, "ft_transformer_best.pt")
    
    print(f"\nTraining FT-Transformer ({epochs} epochs)...")
    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0.0
        for bx, by in train_loader:
            bx, by = bx.to(device), by.to(device)
            optimizer.zero_grad()
            logits = model(bx)
            loss = criterion(logits, by)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            train_loss += loss.item() * len(bx)
            
        train_loss /= len(train_ds)
        
        # Validation
        model.eval()
        val_preds, val_targets = [], []
        with torch.no_grad():
            for bx, by in val_loader:
                bx = bx.to(device)
                logits = model(bx)
                preds = torch.argmax(logits, dim=-1).cpu().numpy()
                val_preds.extend(preds)
                val_targets.extend(by.numpy())
                
        val_macro_f1 = f1_score(val_targets, val_preds, average="macro", zero_division=0)
        scheduler.step(val_macro_f1)
        
        if val_macro_f1 > best_macro_f1:
            best_macro_f1 = val_macro_f1
            torch.save(model.state_dict(), best_model_path)
            
        if epoch % 5 == 0 or epoch == 1:
            print(f"Epoch {epoch:02d}/{epochs} | Train Loss: {train_loss:.4f} | Val Macro-F1: {val_macro_f1:.4f} (Best: {best_macro_f1:.4f})")
            
    # Load best model for evaluation
    model.load_state_dict(torch.load(best_model_path, weights_only=True))
    model.eval()
    
    # Test evaluation
    test_probs, test_preds = [], []
    with torch.no_grad():
        for bx, by in test_loader:
            bx = bx.to(device)
            logits = model(bx)
            probs = torch.softmax(logits, dim=-1).cpu().numpy()
            preds = np.argmax(probs, axis=-1)
            test_probs.append(probs)
            test_preds.append(preds)
            
    y_test_prob = np.concatenate(test_probs, axis=0)
    y_test_pred = np.concatenate(test_preds, axis=0)
    
    test_metrics = evaluate_multiclass(y_test, y_test_pred, y_test_prob, CLASS_NAMES, model_name="FT-Transformer (Spatial Test)")
    
    # Save artifacts
    joblib.dump(imputer, os.path.join(MODEL_DIR, "ftt_imputer.joblib"))
    joblib.dump(scaler, os.path.join(MODEL_DIR, "ftt_scaler.joblib"))
    
    with open(os.path.join(MODEL_DIR, "ftt_test_metrics.json"), "w") as f:
        json.dump(test_metrics, f, indent=2)
        
    test_res_df = test_df[["latitude", "longitude", "spatial_block_id", TARGET_COLUMN]].copy()
    test_res_df["ftt_pred"] = y_test_pred
    for c in range(3):
        test_res_df[f"ftt_prob_c{c}"] = y_test_prob[:, c]
    test_res_df.to_csv(os.path.join(MODEL_DIR, "ftt_test_predictions.csv"), index=False)
    
    print(f"FT-Transformer artifacts successfully saved to: {MODEL_DIR}")
    return test_metrics

if __name__ == "__main__":
    train_ft_transformer()
