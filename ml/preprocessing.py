"""
THERMAL TRACERS - Phase 2 Data Preprocessing & Cleaning Pipeline
Cleans invalid sentinel values (-9999 in LST_C), normalizes Dynamic World probabilities,
scales Sentinel-2 optical bands to physical reflectance [0, 1], eliminates multicollinear
redundancies (SAVI), and outputs cleaned geospatial tabular data.
"""

import os
import sys
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors

RAW_DATA_PATH = r"d:\IndustryFire\data\raw\South_India_Fire_2021_2025.csv"
OUTPUT_CLEANED_PATH = r"d:\IndustryFire\data\processed\South_India_Fire_cleaned.csv"

def impute_spatial_lst(df: pd.DataFrame) -> pd.DataFrame:
    """
    Imputes -9999.0 missing values and cloud-contamination outliers (< 0 C)
    in LST_C using Spatial Nearest Neighbors from valid observations.
    """
    print("\n--- Imputing LST_C Sentinel Values & Cloud Outliers ---")
    df = df.copy()
    
    # Identify invalid LST values
    invalid_mask = (df["LST_C"] <= -50.0) | (df["LST_C"] < 0.0) | df["LST_C"].isna()
    num_invalid = invalid_mask.sum()
    print(f"Found {num_invalid} invalid / sentinel LST_C values out of {len(df)} rows.")
    
    if num_invalid > 0:
        valid_df = df[~invalid_mask]
        invalid_df = df[invalid_mask]
        
        coords_valid = valid_df[["latitude", "longitude"]].values
        coords_invalid = invalid_df[["latitude", "longitude"]].values
        
        # Fit 5-NN on valid coordinates with ball_tree for fast query
        knn = NearestNeighbors(n_neighbors=5, metric="haversine", algorithm="ball_tree")
        # Convert degrees to radians for haversine
        coords_valid_rad = np.radians(coords_valid)
        coords_invalid_rad = np.radians(coords_invalid)
        
        knn.fit(coords_valid_rad)
        distances, indices = knn.kneighbors(coords_invalid_rad)
        
        # Distance-weighted interpolation
        weights = 1.0 / np.maximum(distances, 1e-6)
        weights /= weights.sum(axis=1, keepdims=True)
        
        imputed_lst = np.sum(valid_df["LST_C"].values[indices] * weights, axis=1)
        df.loc[invalid_mask, "LST_C"] = imputed_lst
        print(f"Successfully imputed {num_invalid} LST_C records via Haversine Spatial 5-NN.")
        print(f"New LST_C range: [{df['LST_C'].min():.2f}°C, {df['LST_C'].max():.2f}°C], Mean: {df['LST_C'].mean():.2f}°C")
    
    return df

def scale_sentinel2_bands(df: pd.DataFrame) -> pd.DataFrame:
    """
    Scales Sentinel-2 raw digital numbers (typically 100-5000) to physical surface reflectance [0.0, 1.0].
    """
    print("\n--- Scaling Sentinel-2 Optical Bands ---")
    df = df.copy()
    s2_bands = ["S2_B4", "S2_B8", "S2_B11", "S2_B12"]
    
    for band in s2_bands:
        if band in df.columns:
            orig_max = df[band].max()
            if orig_max > 10.0:  # Raw integer DNs
                df[f"{band}_refl"] = (df[band] / 10000.0).clip(0.0, 1.0)
                print(f"Scaled {band} (max {orig_max}) -> {band}_refl range: [{df[f'{band}_refl'].min():.4f}, {df[f'{band}_refl'].max():.4f}]")
            else:
                df[f"{band}_refl"] = df[band].clip(0.0, 1.0)
    return df

def normalize_dynamic_world(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalizes Dynamic World 8 probability bands to strictly sum to 1.0,
    and extracts dominant land use classification.
    """
    print("\n--- Normalizing Dynamic World Land Cover Probabilities ---")
    df = df.copy()
    dw_cols = [
        "DW_water", "DW_trees", "DW_grass", "DW_flooded",
        "DW_crops", "DW_shrub", "DW_built", "DW_bare"
    ]
    
    # Check present columns
    present_dw = [c for c in dw_cols if c in df.columns]
    if present_dw:
        raw_sum = df[present_dw].sum(axis=1)
        print(f"Dynamic World raw sum mean: {raw_sum.mean():.4f}, min: {raw_sum.min():.4f}, max: {raw_sum.max():.4f}")
        
        # Normalize each class
        for c in present_dw:
            df[f"{c}_norm"] = (df[c] / np.maximum(raw_sum, 1e-6)).clip(0.0, 1.0)
            
        # Extract dominant class
        norm_cols = [f"{c}_norm" for c in present_dw]
        class_names = [c.replace("DW_", "") for c in present_dw]
        dominant_idx = np.argmax(df[norm_cols].values, axis=1)
        df["DW_dominant_class"] = [class_names[i] for i in dominant_idx]
        df["DW_dominant_prob"] = np.max(df[norm_cols].values, axis=1)
        
        print(f"Dynamic World normalized. Dominant class distribution:\n{df['DW_dominant_class'].value_counts()}")
        
    return df

def clean_and_preprocess(input_path: str = RAW_DATA_PATH, output_path: str = OUTPUT_CLEANED_PATH) -> pd.DataFrame:
    """
    Full Phase 2 Preprocessing Pipeline
    """
    print(f"Loading raw dataset from: {input_path}")
    df = pd.read_csv(input_path)
    print(f"Input shape: {df.shape}")
    
    # 1. Spatial KNN Imputation for LST
    df = impute_spatial_lst(df)
    
    # 2. Scale Sentinel-2 bands to surface reflectance
    df = scale_sentinel2_bands(df)
    
    # 3. Dynamic World Normalization
    df = normalize_dynamic_world(df)
    
    # 4. Remove redundant / collinear features
    drop_cols = []
    if "SAVI" in df.columns:
        # Perfect collinearity with NDVI (r = 1.0000)
        drop_cols.append("SAVI")
        print("\nDropping 'SAVI' due to 100% multicollinearity with 'NDVI'.")
    if "year" in df.columns and df["year"].nunique() == 1:
        drop_cols.append("year")
        print("Dropping 'year' due to zero variance (constant 2021).")
        
    df.drop(columns=drop_cols, inplace=True, errors="ignore")
    
    # 5. Add atmospheric plume ratio features
    if "NO2" in df.columns and "SO2" in df.columns:
        # High SO2/NO2 ratio often indicates heavy sulfurous industrial emissions/smelting
        so2_safe = np.maximum(df["SO2"].clip(lower=0.0), 1e-7)
        no2_safe = np.maximum(df["NO2"].clip(lower=0.0), 1e-7)
        df["atmospheric_SO2_NO2_ratio"] = so2_safe / no2_safe
        print(f"Engineered 'atmospheric_SO2_NO2_ratio': mean {df['atmospheric_SO2_NO2_ratio'].mean():.2f}")
    
    # Save cleaned dataset
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"\nPhase 2 Complete! Cleaned dataset saved to: {output_path} ({df.shape[0]} rows, {df.shape[1]} columns)")
    
    return df

if __name__ == "__main__":
    clean_and_preprocess()
