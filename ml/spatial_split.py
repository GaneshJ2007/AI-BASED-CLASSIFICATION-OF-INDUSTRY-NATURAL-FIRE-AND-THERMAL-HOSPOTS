"""
THERMAL TRACERS - Phase 5: Spatial Block Cross-Validation & Data Partitioning
Implements leakage-safe spatial block splitting (50km x 50km geographic grid cells)
to eliminate spatial autocorrelation leakage between training, validation, and test sets.
Ensures zero geographic overlap between splits while stratifying class representations.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedGroupKFold

INPUT_PATH = r"d:\IndustryFire\data\final\South_India_Fire_3Class_Labeled.csv"
OUTPUT_DIR = r"d:\IndustryFire\data\final"

# 0.5 degree grid is approx 55 km x 55 km at South India latitudes
BLOCK_SIZE_DEG = 0.5

def create_spatial_blocks(df: pd.DataFrame, block_size_deg: float = BLOCK_SIZE_DEG) -> pd.DataFrame:
    """
    Assigns each coordinate to a discrete spatial block grid cell.
    """
    df = df.copy()
    lat_bins = np.floor(df["latitude"] / block_size_deg).astype(int)
    lon_bins = np.floor(df["longitude"] / block_size_deg).astype(int)
    df["spatial_block_id"] = [f"B_{la}_{lo}" for la, lo in zip(lat_bins, lon_bins)]
    return df

def generate_spatial_split(df: pd.DataFrame, random_state: int = 42) -> tuple:
    """
    Generates leakage-safe Train (70%), Val (15%), Test (15%) splits
    using StratifiedGroupKFold over spatial blocks.
    """
    print("\n--- Generating Leakage-Safe Spatial Block Split ---")
    df = create_spatial_blocks(df)
    
    unique_blocks = df["spatial_block_id"].nunique()
    print(f"Divided South India study domain into {unique_blocks} discrete 55km spatial blocks.")
    
    # We use a 2-stage split:
    # Stage 1: 85% Train+Val vs 15% Test (using 7 folds -> ~14.3% test)
    sgkf_test = StratifiedGroupKFold(n_splits=7, shuffle=True, random_state=random_state)
    
    X = df.index.values
    y = df["target_class"].values
    groups = df["spatial_block_id"].values
    
    train_val_idx, test_idx = next(sgkf_test.split(X, y, groups))
    
    train_val_df = df.iloc[train_val_idx].copy()
    test_df = df.iloc[test_idx].copy()
    
    # Stage 2: From the 85%, split into Train (approx 70% total) and Val (approx 15% total) (using 6 folds -> 1/6 is ~14.2% of 85% ~ 12%)
    sgkf_val = StratifiedGroupKFold(n_splits=6, shuffle=True, random_state=random_state)
    
    X_tv = train_val_df.index.values
    y_tv = train_val_df["target_class"].values
    groups_tv = train_val_df["spatial_block_id"].values
    
    sub_train_idx, val_idx = next(sgkf_val.split(X_tv, y_tv, groups_tv))
    
    train_df = train_val_df.iloc[sub_train_idx].copy()
    val_df = train_val_df.iloc[val_idx].copy()
    
    # Assign split labels
    df["split"] = "unassigned"
    df.loc[train_df.index, "split"] = "train"
    df.loc[val_df.index, "split"] = "val"
    df.loc[test_df.index, "split"] = "test"
    
    # Verify zero block leakage
    train_blocks = set(train_df["spatial_block_id"].unique())
    val_blocks = set(val_df["spatial_block_id"].unique())
    test_blocks = set(test_df["spatial_block_id"].unique())
    
    overlap_tv = train_blocks.intersection(val_blocks)
    overlap_tt = train_blocks.intersection(test_blocks)
    overlap_vt = val_blocks.intersection(test_blocks)
    
    print("\n[VERIFICATION] Spatial Block Disjointness:")
    print(f" - Train blocks: {len(train_blocks)}, Val blocks: {len(val_blocks)}, Test blocks: {len(test_blocks)}")
    print(f" - Train & Val block overlap: {len(overlap_tv)} (MUST BE 0)")
    print(f" - Train & Test block overlap: {len(overlap_tt)} (MUST BE 0)")
    print(f" - Val & Test block overlap: {len(overlap_vt)} (MUST BE 0)")
    assert len(overlap_tv) == 0 and len(overlap_tt) == 0 and len(overlap_vt) == 0, "SPATIAL BLOCK LEAKAGE DETECTED!"
    
    print("\nSplit Sizes & Percentages:")
    total = len(df)
    print(f" - Train Set: {len(train_df)} rows ({len(train_df)/total*100:.1f}%)")
    print(f" - Val Set:   {len(val_df)} rows ({len(val_df)/total*100:.1f}%)")
    print(f" - Test Set:  {len(test_df)} rows ({len(test_df)/total*100:.1f}%)")
    
    print("\nClass Distribution per Split:")
    for split_name, s_df in [("Train", train_df), ("Val", val_df), ("Test", test_df)]:
        print(f"\n{split_name} Split:")
        for c in sorted(s_df["target_class"].unique()):
            cnt = (s_df["target_class"] == c).sum()
            print(f"   Class {c}: {cnt} ({cnt/len(s_df)*100:.2f}%)")
            
    return train_df, val_df, test_df, df

def run_spatial_partitioning():
    print("=" * 65)
    print("THERMAL TRACERS: Phase 5 Spatial Block Data Partitioning")
    print("=" * 65)
    
    df = pd.read_csv(INPUT_PATH)
    print(f"Loaded labeled dataset: {INPUT_PATH} ({len(df)} rows)")
    
    train_df, val_df, test_df, full_split_df = generate_spatial_split(df)
    
    # Save partitioned datasets
    train_path = os.path.join(OUTPUT_DIR, "train_spatial_split.csv")
    val_path = os.path.join(OUTPUT_DIR, "val_spatial_split.csv")
    test_path = os.path.join(OUTPUT_DIR, "test_spatial_split.csv")
    full_path = os.path.join(OUTPUT_DIR, "South_India_Fire_3Class_SpatialSplit.csv")
    
    train_df.to_csv(train_path, index=False)
    val_df.to_csv(val_path, index=False)
    test_df.to_csv(test_path, index=False)
    full_split_df.to_csv(full_path, index=False)
    
    # Save metadata summary
    split_meta = {
        "block_size_deg": BLOCK_SIZE_DEG,
        "total_samples": len(df),
        "train_samples": len(train_df),
        "val_samples": len(val_df),
        "test_samples": len(test_df),
        "train_blocks": int(train_df["spatial_block_id"].nunique()),
        "val_blocks": int(val_df["spatial_block_id"].nunique()),
        "test_blocks": int(test_df["spatial_block_id"].nunique()),
        "train_class_dist": train_df["target_class"].value_counts().to_dict(),
        "val_class_dist": val_df["target_class"].value_counts().to_dict(),
        "test_class_dist": test_df["target_class"].value_counts().to_dict()
    }
    
    meta_path = os.path.join(r"d:\IndustryFire\data\processed", "spatial_split_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(split_meta, f, indent=2)
        
    print(f"\nPhase 5 Complete!")
    print(f" - Train split: {train_path}")
    print(f" - Val split:   {val_path}")
    print(f" - Test split:  {test_path}")
    print(f" - Metadata:    {meta_path}")
    print("=" * 65)

if __name__ == "__main__":
    run_spatial_partitioning()
