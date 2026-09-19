"""
THERMAL TRACERS - Phase 3 Master Feature Engineering Pipeline
Combines satellite preprocessed telemetry with OpenStreetMap industrial proximity,
spatial-temporal recurrence clustering, and multi-sensor interaction ratios.
"""

import os
import sys
import numpy as np
import pandas as pd

# Add project root to sys.path
sys.path.append(r"d:\IndustryFire")
from geospatial.industrial_features import IndustrialSpatialEngine
from geospatial.temporal_features import TemporalRecurrenceEngine

INPUT_PATH = r"d:\IndustryFire\data\processed\South_India_Fire_cleaned.csv"
OUTPUT_PATH = r"d:\IndustryFire\data\processed\South_India_Fire_features.csv"

def engineer_interaction_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes physical multi-sensor interaction features:
    - vegetation_stress_index: captures drought and moisture deficit
    - fuel_dryness_indicator: combined scorch and drying
    - thermal_vegetation_ratio: high heat in low vegetation vs high heat in dense canopy
    - built_industrial_interaction: co-presence of built infrastructure and industrial proximity
    - radar_biomass_proxy: radar backscatter and volumetric cross-ratio
    """
    print("\n--- Engineering Multi-Sensor Physical Interaction Terms ---")
    df = df.copy()
    
    # 1. Vegetation Stress Index
    if "NDVI" in df.columns and "NDMI" in df.columns:
        df["vegetation_stress_index"] = (df["NDVI"] - df["NDMI"]) / (df["NDVI"] + df["NDMI"] + 1e-6)
    
    # 2. Fuel Dryness Indicator (dry vegetation + scorch vulnerability)
    if "NBR" in df.columns and "NDMI" in df.columns:
        df["fuel_dryness_indicator"] = (1.0 - df["NDMI"].clip(-1, 1)) * (1.0 - df["NBR"].clip(-1, 1))
        
    # 3. Thermal to Vegetation Ratio
    if "LST_C" in df.columns and "NDVI" in df.columns:
        safe_ndvi = np.maximum(df["NDVI"] + 0.5, 0.1)
        df["thermal_vegetation_ratio"] = df["LST_C"] / safe_ndvi
        
    # 4. Built-up and Industrial Proximity Interaction
    if "DW_built_norm" in df.columns and "industrial_proximity_score" in df.columns:
        df["built_industrial_interaction"] = df["DW_built_norm"] * df["industrial_proximity_score"]
        
    # 5. Radar Biomass Proxy
    if "S1_VH" in df.columns and "S1_VV_VH" in df.columns:
        df["radar_biomass_proxy"] = df["S1_VH"] * df["S1_VV_VH"]
        
    # 6. Industrial Gas Emission Anomaly Score (NO2 * SO2)
    if "NO2" in df.columns and "SO2" in df.columns:
        df["industrial_gas_emission_score"] = (df["NO2"].clip(lower=0) * 1e4) * (df["SO2"].clip(lower=0) * 1e4)
        
    print(f"Interaction features computed successfully.")
    return df

def run_feature_engineering():
    print("=" * 60)
    print("THERMAL TRACERS: Phase 3 Feature Engineering Pipeline")
    print("=" * 60)
    
    print(f"Reading cleaned dataset from: {INPUT_PATH}")
    df = pd.read_csv(INPUT_PATH)
    print(f"Loaded {len(df)} rows, {df.shape[1]} columns.")
    
    # Step 1: Industrial Spatial Context
    print("\n--- Step 1: Ingesting OpenStreetMap Industrial Proximity ---")
    industrial_engine = IndustrialSpatialEngine()
    df = industrial_engine.compute_features(df, lat_col="latitude", lon_col="longitude")
    
    # Step 2: Temporal Recurrence & Persistence Clustering
    print("\n--- Step 2: Ingesting Spatio-Temporal Recurrence Clustering ---")
    temporal_engine = TemporalRecurrenceEngine(cluster_radius_km=1.0)
    df = temporal_engine.compute_features(df, lat_col="latitude", lon_col="longitude", month_col="month", day_col="day")
    
    # Step 3: Interaction Terms
    df = engineer_interaction_features(df)
    
    # Save output
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"\nPhase 3 Complete! Enriched features saved to:\n{OUTPUT_PATH}")
    print(f"Final shape: {df.shape[0]} rows, {df.shape[1]} columns.")
    print("=" * 60)
    
    return df

if __name__ == "__main__":
    run_feature_engineering()
