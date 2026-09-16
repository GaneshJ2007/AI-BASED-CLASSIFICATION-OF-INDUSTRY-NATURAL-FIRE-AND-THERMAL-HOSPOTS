"""
THERMAL TRACERS - Predictor Features Configuration
Defines the canonical, leakage-safe list of 38 multi-sensor, spatial, temporal,
and industrial features used across all ML and Deep Learning models.
"""

FEATURE_COLUMNS = [
    # 1. Sentinel-1 SAR (Structural & Soil/Roughness)
    "S1_VH",
    "S1_VV",
    "S1_VV_VH",
    "radar_biomass_proxy",
    
    # 2. Sentinel-2 Optical & Biophysical Indices
    "S2_B4_refl",
    "S2_B8_refl",
    "S2_B11_refl",
    "S2_B12_refl",
    "NDVI",
    "NBR",
    "NDMI",
    "fuel_dryness_indicator",
    "vegetation_stress_index",
    
    # 3. Sentinel-5P Atmospheric Chemistry & Combustion Emissions
    "NO2",
    "SO2",
    "CO",
    "atmospheric_SO2_NO2_ratio",
    "industrial_gas_emission_score",
    
    # 4. Dynamic World Normalized Land Cover Probabilities
    "DW_built_norm",
    "DW_trees_norm",
    "DW_crops_norm",
    "DW_bare_norm",
    "DW_shrub_norm",
    "DW_grass_norm",
    "DW_water_norm",
    "DW_flooded_norm",
    "DW_dominant_prob",
    
    # 5. OpenStreetMap Industrial Infrastructure & Proximity
    "dist_to_industrial_km",
    "industrial_density_5km",
    "industrial_density_15km",
    "industrial_density_30km",
    "is_industrial_zone",
    "industrial_proximity_score",
    "built_industrial_interaction",
    
    # 6. Thermal Hotspot Radiometry
    "LST_C",
    "thermal_vegetation_ratio",
    
    # 7. Spatio-Temporal Recurrence & Seasonality
    "recurrence_count_1km",
    "active_months_count",
    "persistence_score",
    "is_recurrent_hotspot",
    "month_sin",
    "month_cos",
    "day_sin",
    "day_cos"
]

TARGET_COLUMN = "target_class"
CLASS_NAMES = {
    0: "Forest/Natural Fire",
    1: "Industrial Fire",
    2: "Persistent Thermal Source"
}
