"""
THERMAL TRACERS - Phase 3: Spatio-Temporal Recurrence & Persistence Engineering
Performs DBSCAN clustering over hotspot coordinates to quantify multi-temporal recurrence,
persistence scores, cluster spans, and cyclical seasonal embeddings.
"""

import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN

EARTH_RADIUS_KM = 6371.0088

class TemporalRecurrenceEngine:
    """
    Engine that performs spatio-temporal clustering to identify persistent thermal emitters
    vs episodic/seasonal events.
    """
    def __init__(self, cluster_radius_km: float = 1.0):
        self.cluster_radius_km = cluster_radius_km
        self.eps_rad = cluster_radius_km / EARTH_RADIUS_KM

    def compute_features(self, df: pd.DataFrame, lat_col: str = "latitude", lon_col: str = "longitude", 
                         month_col: str = "month", day_col: str = "day") -> pd.DataFrame:
        """
        Computes temporal recurrence and seasonal features:
        - cluster_id: DBSCAN spatial cluster ID (-1 for isolated singletons)
        - recurrence_count_1km: Number of observations in same 1km cluster
        - active_months_count: Number of distinct months hotspot is detected in this cluster
        - persistence_score: (active_months_count / 12) scaled measure of temporal persistence
        - temporal_cyclical_sin_month, temporal_cyclical_cos_month: Periodic calendar features
        """
        df = df.copy()
        
        # 1. Cyclical Seasonal Encodings
        # Month: 1 to 12 (if 0 or missing, fill with 6 as neutral)
        month_series = df[month_col].replace(0, 6).clip(1, 12)
        df["month_sin"] = np.round(np.sin(2 * np.pi * month_series / 12.0), 4)
        df["month_cos"] = np.round(np.cos(2 * np.pi * month_series / 12.0), 4)
        
        day_series = df[day_col].replace(0, 15).clip(1, 31)
        df["day_sin"] = np.round(np.sin(2 * np.pi * day_series / 31.0), 4)
        df["day_cos"] = np.round(np.cos(2 * np.pi * day_series / 31.0), 4)
        
        # 2. Spatial Clustering using DBSCAN
        coords_deg = df[[lat_col, lon_col]].values
        coords_rad = np.radians(coords_deg)
        
        db = DBSCAN(eps=self.eps_rad, min_samples=1, metric="haversine")
        cluster_labels = db.fit_predict(coords_rad)
        df["spatial_cluster_id"] = cluster_labels
        
        # 3. Cluster-Level Aggregations
        # Recurrence count per cluster
        cluster_sizes = df["spatial_cluster_id"].value_counts().to_dict()
        df["recurrence_count_1km"] = df["spatial_cluster_id"].map(cluster_sizes)
        
        # Active months per cluster
        cluster_active_months = df.groupby("spatial_cluster_id")[month_col].nunique().to_dict()
        df["active_months_count"] = df["spatial_cluster_id"].map(cluster_active_months)
        
        # Persistence Score:
        # High when a thermal anomaly recurs across multiple distinct months
        # For singletons, persistence is 0.083 (1/12)
        df["persistence_score"] = np.round(df["active_months_count"] / 12.0, 4)
        
        # Thermal Source Recurrence Flag: >= 2 detections at exact coordinate cluster
        df["is_recurrent_hotspot"] = (df["recurrence_count_1km"] >= 2).astype(int)
        
        print(f"Temporal Recurrence engineered:")
        print(f" - Total spatial clusters formed: {len(cluster_sizes)}")
        print(f" - Max cluster recurrence: {df['recurrence_count_1km'].max()} observations")
        print(f" - Recurrent points (count >= 2): {df['is_recurrent_hotspot'].sum()}")
        print(f" - Persistent points (active in >= 2 distinct months): {(df['active_months_count'] >= 2).sum()}")
        
        return df

if __name__ == "__main__":
    engine = TemporalRecurrenceEngine(cluster_radius_km=1.0)
    test_df = pd.DataFrame({
        "latitude": [13.165, 13.166, 17.525, 11.590],
        "longitude": [80.260, 80.261, 78.260, 79.485],
        "month": [2, 5, 3, 4],
        "day": [10, 15, 20, 25]
    })
    res = engine.compute_features(test_df)
    print(res[["spatial_cluster_id", "recurrence_count_1km", "active_months_count", "persistence_score"]])
