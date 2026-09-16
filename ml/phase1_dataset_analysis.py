"""
THERMAL TRACERS - Phase 1 Dataset Quality Analysis
Script to perform comprehensive, rigorous data inspection on South_India_Fire_2021.csv
"""

import json
import os
import sys
import numpy as np
import pandas as pd

CSV_PATH = r"d:\IndustryFire\data\raw\South_India_Fire_2021.csv"
OUTPUT_DIR = r"d:\IndustryFire\data\processed"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def run_phase1_analysis():
    print(f"Loading dataset from: {CSV_PATH}")
    df = pd.read_csv(CSV_PATH)
    
    report = {}
    
    # 1. Dataset Shape
    n_rows, n_cols = df.shape
    report["shape"] = {"rows": n_rows, "columns": n_cols}
    print(f"1. Dataset Shape: {n_rows} rows, {n_cols} columns")
    
    # 2. Column List
    columns = list(df.columns)
    report["columns"] = columns
    print(f"2. Total columns: {len(columns)}")
    
    # 3. Data Types & Memory
    dtypes = {col: str(df[col].dtype) for col in columns}
    mem_mb = df.memory_usage(deep=True).sum() / (1024 * 1024)
    report["dtypes"] = dtypes
    report["memory_usage_mb"] = round(mem_mb, 2)
    print(f"3. Memory usage: {mem_mb:.2f} MB")
    
    # 4. Missing Values
    null_counts = df.isnull().sum().to_dict()
    null_pct = (df.isnull().sum() / n_rows * 100).to_dict()
    missing_info = {
        col: {"count": int(null_counts[col]), "percentage": round(float(null_pct[col]), 3)}
        for col in columns if null_counts[col] > 0
    }
    report["missing_values"] = missing_info
    print(f"4. Columns with missing values: {len(missing_info)}")
    for col, info in missing_info.items():
        print(f"   - {col}: {info['count']} ({info['percentage']}%)")
        
    # 5. Invalid / Sentinel values
    # Check for Inf, -Inf, NaNs, negative values where unexpected, sentinel values (-9999, 9999, -1 etc.)
    invalid_summary = {}
    
    # Check numeric columns
    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    cat_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
    
    for col in num_cols:
        series = df[col]
        inf_count = int(np.isinf(series).sum())
        nan_count = int(series.isna().sum())
        min_val = float(series.min())
        max_val = float(series.max())
        sentinel_9999 = int((series == -9999).sum() + (series == 9999).sum() + (series == -999).sum())
        
        entry = {
            "min": min_val,
            "max": max_val,
            "inf_count": inf_count,
            "sentinel_count": sentinel_9999
        }
        
        # Specific domain validation
        if col.startswith("DW_"):
            # Dynamic World probabilities should be 0 to 1
            out_of_bounds = int(((series < 0) | (series > 1)).sum())
            entry["out_of_bounds_0_1"] = out_of_bounds
        elif col in ["NDVI", "NDMI", "NBR"]:
            # Indices theoretically in [-1, 1]
            out_of_bounds = int(((series < -1.0) | (series > 1.0)).sum())
            entry["out_of_bounds_neg1_to_1"] = out_of_bounds
        elif col == "confidence":
            # Confidence in 0 to 100
            entry["unique_vals"] = series.nunique()
        elif col == "T21":
            # Brightness temperature in Kelvin (FIRMS MODIS/VIIRS 4um band usually 250K to 500K)
            entry["under_250K"] = int((series < 250).sum())
            entry["over_500K"] = int((series > 500).sum())
        elif col == "LST_C":
            # Land surface temp in Celsius
            entry["under_neg10C"] = int((series < -10).sum())
            entry["over_70C"] = int((series > 70).sum())
            
        invalid_summary[col] = entry
        
    report["invalid_values_check"] = invalid_summary
    
    # Check DW sum per row
    dw_cols = [c for c in columns if c.startswith("DW_")]
    if dw_cols:
        dw_sum = df[dw_cols].sum(axis=1)
        report["dynamic_world_sum_stats"] = {
            "mean": float(dw_sum.mean()),
            "min": float(dw_sum.min()),
            "max": float(dw_sum.max()),
            "not_summing_to_1": int((np.abs(dw_sum - 1.0) > 0.05).sum())
        }
        print(f"Dynamic World sum check (mean={dw_sum.mean():.4f}, min={dw_sum.min():.4f}, max={dw_sum.max():.4f})")
    
    # Coordinate validation
    lat_min, lat_max = df["latitude"].min(), df["latitude"].max()
    lon_min, lon_max = df["longitude"].min(), df["longitude"].max()
    report["coordinate_bounds"] = {
        "latitude_min": float(lat_min), "latitude_max": float(lat_max),
        "longitude_min": float(lon_min), "longitude_max": float(lon_max)
    }
    print(f"Coordinates: Lat [{lat_min:.4f}, {lat_max:.4f}], Lon [{lon_min:.4f}, {lon_max:.4f}]")
    
    # 6. Duplicates
    exact_duplicates = int(df.duplicated().sum())
    coord_date_duplicates = int(df.duplicated(subset=["latitude", "longitude", "fire_date"]).sum())
    geo_duplicates = int(df.duplicated(subset=[".geo", "fire_date"]).sum())
    system_index_duplicates = int(df.duplicated(subset=["system:index"]).sum())
    report["duplicates"] = {
        "exact_duplicates": exact_duplicates,
        "coord_date_duplicates": coord_date_duplicates,
        "geo_date_duplicates": geo_duplicates,
        "system_index_duplicates": system_index_duplicates
    }
    print(f"6. Duplicates: exact={exact_duplicates}, coord+date={coord_date_duplicates}, system:index={system_index_duplicates}")
    
    # 7. Target distribution & sample_type
    target_dist = df["fire_label"].value_counts(dropna=False).to_dict()
    target_pct = (df["fire_label"].value_counts(normalize=True, dropna=False) * 100).to_dict()
    report["target_distribution"] = {
        str(k): {"count": int(v), "pct": round(float(target_pct[k]), 2)} for k, v in target_dist.items()
    }
    print(f"7. Target distribution (fire_label): {report['target_distribution']}")
    
    # Categorical breakdown of sample_type and source
    sample_type_dist = df["sample_type"].value_counts(dropna=False).to_dict()
    source_dist = df["source"].value_counts(dropna=False).to_dict()
    report["sample_type_distribution"] = {str(k): int(v) for k, v in sample_type_dist.items()}
    report["source_distribution"] = {str(k): int(v) for k, v in source_dist.items()}
    print(f"   sample_type: {report['sample_type_distribution']}")
    print(f"   source: {report['source_distribution']}")
    
    # Cross-tab between fire_label and sample_type
    crosstab_fire_sample = pd.crosstab(df["fire_label"], df["sample_type"]).to_dict()
    report["crosstab_fire_sample"] = crosstab_fire_sample
    print(f"   Cross-tab (fire_label vs sample_type): {crosstab_fire_sample}")
    
    # 8. Numerical Feature Statistics
    num_stats = {}
    for col in num_cols:
        s = df[col].dropna()
        q1 = float(s.quantile(0.25))
        q3 = float(s.quantile(0.75))
        iqr = q3 - q1
        num_stats[col] = {
            "count": int(len(s)),
            "mean": round(float(s.mean()), 5),
            "std": round(float(s.std()), 5),
            "min": round(float(s.min()), 5),
            "p1": round(float(s.quantile(0.01)), 5),
            "p5": round(float(s.quantile(0.05)), 5),
            "p25": round(q1, 5),
            "median": round(float(s.median()), 5),
            "p75": round(q3, 5),
            "p95": round(float(s.quantile(0.95)), 5),
            "p99": round(float(s.quantile(0.99)), 5),
            "max": round(float(s.max()), 5),
            "iqr": round(iqr, 5),
            "skew": round(float(s.skew()), 4),
            "kurtosis": round(float(s.kurtosis()), 4)
        }
    report["numerical_statistics"] = num_stats
    
    # 9. Categorical Feature Statistics
    cat_stats = {}
    for col in cat_cols:
        s = df[col]
        cat_stats[col] = {
            "num_unique": int(s.nunique()),
            "top_values": s.value_counts().head(5).to_dict()
        }
    report["categorical_statistics"] = cat_stats
    
    # Temporal range
    if "fire_date" in df.columns:
        report["temporal_range"] = {
            "min_date": str(df["fire_date"].min()),
            "max_date": str(df["fire_date"].max()),
            "unique_dates": int(df["fire_date"].nunique()),
            "monthly_counts": df["month"].value_counts().sort_index().to_dict()
        }
        print(f"Dates: {report['temporal_range']['min_date']} to {report['temporal_range']['max_date']}")
        print(f"Monthly breakdown: {report['temporal_range']['monthly_counts']}")
        
    # 10. Correlation Analysis
    # Filter numerical features
    corr_matrix = df[num_cols].corr()
    # Find high correlations (|r| > 0.85)
    high_corr = []
    for i in range(len(num_cols)):
        for j in range(i + 1, len(num_cols)):
            c1 = num_cols[i]
            c2 = num_cols[j]
            val = corr_matrix.loc[c1, c2]
            if abs(val) >= 0.80:
                high_corr.append({"feature_1": c1, "feature_2": c2, "correlation": round(float(val), 4)})
    high_corr.sort(key=lambda x: abs(x["correlation"]), reverse=True)
    report["high_correlations_above_0.80"] = high_corr
    print(f"10. Highly correlated feature pairs (|r| >= 0.80): {len(high_corr)}")
    for pair in high_corr[:10]:
        print(f"    - {pair['feature_1']} vs {pair['feature_2']}: {pair['correlation']}")
        
    # Correlation with fire_label
    corr_with_target = corr_matrix["fire_label"].drop("fire_label").sort_values(ascending=False)
    report["correlation_with_target"] = {k: round(float(v), 4) for k, v in corr_with_target.items()}
    print(f"\nTop 5 positive correlations with fire_label:")
    for k, v in corr_with_target.head(5).items():
        print(f"    + {k}: {v:.4f}")
    print(f"Top 5 negative correlations with fire_label:")
    for k, v in corr_with_target.tail(5).items():
        print(f"    - {k}: {v:.4f}")

    # 11. Potential Data Leakage Analysis
    leakage_findings = []
    
    # Check if sample_type perfectly separates fire_label
    st_leak = pd.crosstab(df["sample_type"], df["fire_label"])
    if (st_leak > 0).sum(axis=1).max() == 1:
        leakage_findings.append({
            "column": "sample_type",
            "type": "Target proxy / Direct Leakage",
            "description": "sample_type (FIRMS_FIRE vs BACKGROUND) has 100% mutual information with fire_label."
        })
        
    # Check if system:index encodes the target
    if df["system:index"].astype(str).str.startswith("1_").mean() == (df["fire_label"] == 1).mean():
        leakage_findings.append({
            "column": "system:index",
            "type": "ID Leakage",
            "description": "system:index starts with '1_' for fire samples and '0_' or different for background samples."
        })
        
    # Check confidence in background vs fire
    conf_by_label = df.groupby("fire_label")["confidence"].describe().to_dict()
    report["confidence_by_label"] = conf_by_label
    print(f"\nConfidence by fire_label: {conf_by_label}")
    # In FIRMS, background points have confidence = 0 or NaN or special?
    if df[df["fire_label"] == 0]["confidence"].nunique() == 1:
        leakage_findings.append({
            "column": "confidence",
            "type": "Potential Leakage",
            "description": f"All non-fire samples have identical confidence: {df[df['fire_label']==0]['confidence'].iloc[0]}"
        })
        
    # Check T21 in background vs fire
    t21_by_label = df.groupby("fire_label")["T21"].describe().to_dict()
    report["T21_by_label"] = t21_by_label
    
    report["leakage_findings"] = leakage_findings
    print(f"\n11. Data leakage findings: {len(leakage_findings)}")
    for lf in leakage_findings:
        print(f"    ! [{lf['type']}] {lf['column']}: {lf['description']}")
        
    # 12. Class Imbalance Analysis
    pos_count = int(df["fire_label"].sum())
    neg_count = n_rows - pos_count
    ratio = neg_count / pos_count if pos_count > 0 else 0
    report["class_imbalance"] = {
        "positive_fire_count": pos_count,
        "negative_background_count": neg_count,
        "imbalance_ratio": round(ratio, 3),
        "target_3class_present": False,
        "target_3class_explanation": "Current dataset only has binary fire_label (FIRMS hotspot vs background). Industrial Fire and Persistent Thermal Source classes are NOT yet labeled."
    }
    print(f"\n12. Class Imbalance: Fire={pos_count} ({pos_count/n_rows*100:.1f}%), Non-fire={neg_count} ({neg_count/n_rows*100:.1f}%), Ratio={ratio:.2f}:1")

    # 13. Column categorization
    # Available model feature groups
    available_features = {
        "thermal_features": ["T21", "confidence"],
        "vegetation_fire_features": ["Burned_Area", "NDVI", "NDMI", "NBR", "SAVI"],
        "radar_features": ["S1_VV", "S1_VH", "S1_VV_VH"],
        "spectral_features": ["S2_B4", "S2_B8", "S2_B11", "S2_B12"],
        "atmospheric_features": ["CO", "NO2", "SO2"],
        "land_cover_dynamic_world": [
            "DW_water", "DW_trees", "DW_grass", "DW_flooded",
            "DW_crops", "DW_shrub", "DW_built", "DW_bare"
        ],
        "environmental_features": ["LST_C"],
        "temporal_metadata": ["fire_date", "year", "month", "day"],
        "spatial_metadata": ["latitude", "longitude", ".geo"],
        "administrative_id_leakage": ["system:index", "sample_type", "source"]
    }
    report["available_features_grouped"] = available_features
    
    # 14. Missing features required by system specification
    missing_features = {
        "industrial_features": [
            "distance_to_nearest_industrial_facility",
            "industrial_facilities_count_1km",
            "industrial_facilities_count_5km",
            "industrial_density_kde",
            "distance_to_power_plant",
            "distance_to_refinery",
            "distance_to_factory",
            "industrial_land_use_indicator"
        ],
        "thermal_extended": [
            "FRP (Fire Radiative Power)",
            "brightness_temperature_b31",
            "day_night_flag"
        ],
        "environmental_extended": [
            "rainfall / precipitation (CHIRPS / ERA5)",
            "wind_speed / wind_direction (ERA5)",
            "soil_moisture (SMAP / ERA5)",
            "aerosol_optical_depth (AOD)"
        ],
        "temporal_historical_recurrence": [
            "historical_hotspot_recurrence_count",
            "multi_year_active_persistence_score",
            "days_since_previous_thermal_detection",
            "seasonal_recurrence_index",
            "spatial_cluster_hotspot_id"
        ],
        "topographic_features": [
            "elevation (SRTM)",
            "slope (SRTM)"
        ],
        "ground_truth_target_3class": [
            "target_3class (0: Forest Fire, 1: Industrial Fire, 2: Persistent Thermal Source)"
        ]
    }
    report["missing_features"] = missing_features
    
    # Save complete JSON report
    report_path = os.path.join(OUTPUT_DIR, "phase1_data_quality_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"\nSaved JSON quality report to: {report_path}")
    
    return report

if __name__ == "__main__":
    run_phase1_analysis()
