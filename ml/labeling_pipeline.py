"""
THERMAL TRACERS - Phase 4: Multi-Criteria Defensible 3-Class Labeling Pipeline
Classifies thermal hotspots into:
  - Class 0: Forest / Natural Fire
  - Class 1: Industrial Fire
  - Class 2: Persistent Thermal Source

Applies multi-sensor physical convergence (NASA FIRMS, Sentinel-1 SAR, Sentinel-2 Optical/NBR,
Sentinel-5P NO2/SO2 atmospheric chemistry, Dynamic World land-use probabilities,
OpenStreetMap industrial proximity, and DBSCAN temporal persistence).
Never relies on distance alone.
"""

import os
import sys
import numpy as np
import pandas as pd

INPUT_PATH = r"d:\IndustryFire\data\processed\South_India_Fire_features.csv"
OUTPUT_HOTSPOTS_PATH = r"d:\IndustryFire\data\final\South_India_Fire_3Class_Labeled.csv"
OUTPUT_FULL_PATH = r"d:\IndustryFire\data\final\South_India_Fire_Full_Dataset.csv"

CLASS_NAMES = {
    0: "Forest/Natural Fire",
    1: "Industrial Fire",
    2: "Persistent Thermal Source"
}

def apply_defensible_labeling(df: pd.DataFrame) -> pd.DataFrame:
    """
    Applies rigorous multi-criteria physical rules to label thermal observations.
    """
    print("\n--- Applying Multi-Criteria Physical Convergence Labeling ---")
    df = df.copy()
    
    # 1. Identify Thermal Hotspot Candidates
    # Criteria: Elevated LST above regional baseline (>= 29.5°C) OR Burned Area detection OR NASA FIRMS detection
    is_hotspot = (df["LST_C"] >= 29.5) | (df.get("Burned_Area", 0) == 1) | (df.get("fire_label", 0) == 1)
    df["is_thermal_hotspot"] = is_hotspot.astype(int)
    print(f"Total observations: {len(df)}")
    print(f"Identified {is_hotspot.sum()} thermal hotspot candidate observations.")

    # 2. Rule for Class 2: Persistent Thermal Source
    # Physical Rationale: Sustained high thermal signature from permanent industrial operations
    # (refinery flaring, thermal power stations, blast furnaces, kiln belts)
    cond_persistent = is_hotspot & (
        # Recurrent multi-temporal detections near industrial facilities
        ((df["is_recurrent_hotspot"] == 1) & (df["dist_to_industrial_km"] <= 25.0)) |
        # High heat emission within 15km of industrial infrastructure with built/bare land cover
        ((df["dist_to_industrial_km"] <= 15.0) & (df["DW_built_norm"] >= 0.08) & (df["LST_C"] >= 31.0)) |
        # Immediate proximity (<=8km) to heavy industrial infrastructure with sustained high LST
        ((df["dist_to_industrial_km"] <= 8.0) & (df["LST_C"] >= 30.0))
    )

    # 3. Rule for Class 1: Industrial Fire
    # Physical Rationale: Acute, episodic combustion event occurring within industrial/built
    # infrastructure with elevated hazardous chemical emissions (NO2/SO2) and absence of heavy forest canopy
    cond_industrial = is_hotspot & ~cond_persistent & (
        (df["dist_to_industrial_km"] <= 25.0) &
        (df["DW_built_norm"] >= 0.08) &
        (df["DW_trees_norm"] < 0.35) &
        (
            (df["NO2"] >= 2.5e-5) |
            (df["SO2"] >= 8.0e-5) |
            (df["atmospheric_SO2_NO2_ratio"] >= 2.5)
        )
    )

    # 4. Rule for Class 0: Forest / Natural Fire
    # Physical Rationale: Biomass combustion in natural vegetative biomes (canopy/scrub/grass),
    # remote from factories, with high fuel dryness
    cond_forest = is_hotspot & ~cond_persistent & ~cond_industrial & (
        (
            (df["DW_trees_norm"] >= 0.22) |
            ((df["DW_shrub_norm"] + df["DW_grass_norm"] >= 0.20) & (df["NDVI"] >= 0.25))
        ) &
        (df["dist_to_industrial_km"] > 12.0) &
        (df["DW_built_norm"] < 0.15)
    )

    # Assign Target Class
    df["target_class"] = -1  # Default: Unassigned / Background
    df.loc[cond_forest, "target_class"] = 0
    df.loc[cond_industrial, "target_class"] = 1
    df.loc[cond_persistent, "target_class"] = 2

    df["target_class_name"] = df["target_class"].map(CLASS_NAMES).fillna("Background / Agricultural")

    print("\nTarget Class Distribution:")
    for code, name in CLASS_NAMES.items():
        count = (df["target_class"] == code).sum()
        pct = (count / len(df)) * 100
        print(f" - Class {code} ({name}): {count} ({pct:.2f}%)")
        
    bg_count = (df["target_class"] == -1).sum()
    print(f" - Background / Agricultural (-1): {bg_count} ({(bg_count/len(df))*100:.2f}%)")
    
    return df

def run_labeling_pipeline():
    print("=" * 65)
    print("THERMAL TRACERS: Phase 4 Multi-Criteria 3-Class Labeling Pipeline")
    print("=" * 65)
    
    print(f"Loading feature-engineered dataset: {INPUT_PATH}")
    df = pd.read_csv(INPUT_PATH)
    
    # Apply labeling
    labeled_df = apply_defensible_labeling(df)
    
    # Extract clean 3-Class Hotspot Dataset (Target Class >= 0)
    hotspots_df = labeled_df[labeled_df["target_class"] >= 0].copy()
    
    # Save full dataset and 3-class dataset
    os.makedirs(os.path.dirname(OUTPUT_HOTSPOTS_PATH), exist_ok=True)
    
    hotspots_df.to_csv(OUTPUT_HOTSPOTS_PATH, index=False)
    labeled_df.to_csv(OUTPUT_FULL_PATH, index=False)
    
    print(f"\nPhase 4 Complete!")
    print(f"1. 3-Class Hotspot Dataset saved to: {OUTPUT_HOTSPOTS_PATH}")
    print(f"   Shape: {hotspots_df.shape[0]} rows, {hotspots_df.shape[1]} columns")
    print(f"2. Full Dataset saved to: {OUTPUT_FULL_PATH}")
    print(f"   Shape: {labeled_df.shape[0]} rows, {labeled_df.shape[1]} columns")
    print("=" * 65)
    
    return hotspots_df

if __name__ == "__main__":
    run_labeling_pipeline()
