"""
THERMAL TRACERS - Backend Inference & Geospatial Intelligence Service
Provides unified real-time model scoring, risk evaluation, and SHAP interpretability.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd

# Add project root
sys.path.append(r"d:\IndustryFire")
from ml.features_config import FEATURE_COLUMNS, TARGET_COLUMN, CLASS_NAMES
from geospatial.industrial_features import IndustrialSpatialEngine, SOUTH_INDIA_INDUSTRIAL_FACILITIES
from ml.risk_engine import MultiFactorRiskEngine

XGB_MODEL_PATH = r"d:\IndustryFire\models\xgboost\xgb_model.joblib"
XGB_IMPUTER_PATH = r"d:\IndustryFire\models\xgboost\xgb_imputer.joblib"
HOTSPOTS_DATA_PATH = r"d:\IndustryFire\data\final\South_India_Fire_3Class_Labeled.csv"
SHAP_PROFILES_PATH = r"d:\IndustryFire\models\shap\test_hotspots_shap_explanations.json"

class GeospatialInferenceService:
    def __init__(self):
        self.industrial_engine = IndustrialSpatialEngine()
        self.risk_engine = MultiFactorRiskEngine()
        self.model = None
        self.imputer = None
        self.explainer = None
        self.hotspots_cache = []
        self._load_components()

    def _load_components(self):
        print("Initializing GeospatialInferenceService...")
        if os.path.exists(XGB_MODEL_PATH):
            self.model = joblib.load(XGB_MODEL_PATH)
            self.imputer = joblib.load(XGB_IMPUTER_PATH)
            print("Loaded XGBoost classification model.")
            
        # Try loading SHAP explainer
        try:
            from ml.shap_explainer import HotspotShapExplainer
            self.explainer = HotspotShapExplainer()
            print("Loaded SHAP explainer engine.")
        except Exception as e:
            print(f"SHAP explainer deferred: {e}")
            
        # Load and prepare full hotspots dataset for instant dashboard serving
        if os.path.exists(HOTSPOTS_DATA_PATH):
            df = pd.read_csv(HOTSPOTS_DATA_PATH)
            # Evaluate risk scores for all hotspots
            df = self.risk_engine.compute_risk(df)
            
            # Convert to list of records
            records = []
            for idx, row in df.iterrows():
                cls_code = int(row["target_class"])
                records.append({
                    "id": idx + 1,
                    "latitude": round(float(row["latitude"]), 5),
                    "longitude": round(float(row["longitude"]), 5),
                    "class_code": cls_code,
                    "class_name": CLASS_NAMES.get(cls_code, "Unknown"),
                    "confidence": round(float(row.get("confidence", 85.0)), 1),
                    "lst_c": round(float(row.get("LST_C", 30.0)), 1),
                    "risk_score": float(row["risk_score"]),
                    "risk_tier": row["risk_tier"],
                    "risk_color": row["risk_color"],
                    "dist_to_industrial_km": round(float(row.get("dist_to_industrial_km", 25.0)), 1),
                    "nearest_facility": row.get("nearest_facility_name", "Unknown Facility"),
                    "facility_category": row.get("nearest_facility_category", "Industrial"),
                    "trees_pct": round(float(row.get("DW_trees_norm", 0.1)) * 100, 1),
                    "built_pct": round(float(row.get("DW_built_norm", 0.1)) * 100, 1),
                    "no2": float(row.get("NO2", 2.5e-5)),
                    "so2": float(row.get("SO2", 5.0e-5)),
                    "co": float(row.get("CO", 0.035)),
                    "recommended_action": row["recommended_action"]
                })
            self.hotspots_cache = records
            print(f"Cached {len(self.hotspots_cache)} labeled hotspots for dashboard.")

    def get_facilities(self):
        return SOUTH_INDIA_INDUSTRIAL_FACILITIES

    def get_hotspots(self, class_code=None, risk_tier=None, min_lst=None, limit=500, offset=0):
        results = self.hotspots_cache
        if class_code is not None and class_code != -1:
            results = [h for h in results if h["class_code"] == class_code]
        if risk_tier is not None and risk_tier.lower() != "all":
            results = [h for h in results if h["risk_tier"].lower() == risk_tier.lower()]
        if min_lst is not None:
            results = [h for h in results if h["lst_c"] >= min_lst]
            
        total = len(results)
        paginated = results[offset:offset + limit]
        return paginated, total

    def get_stats(self):
        total = len(self.hotspots_cache)
        if total == 0:
            return {}
            
        class_counts = {name: 0 for name in CLASS_NAMES.values()}
        tier_counts = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
        
        for h in self.hotspots_cache:
            class_counts[h["class_name"]] = class_counts.get(h["class_name"], 0) + 1
            tier_counts[h["risk_tier"]] = tier_counts.get(h["risk_tier"], 0) + 1
            
        return {
            "total_hotspots": total,
            "classes": class_counts,
            "risk_tiers": tier_counts,
            "avg_lst": round(float(np.mean([h["lst_c"] for h in self.hotspots_cache])), 1),
            "critical_count": tier_counts["Critical"],
            "industrial_fire_count": class_counts.get("Industrial Fire", 0),
            "persistent_source_count": class_counts.get("Persistent Thermal Source", 0),
            "forest_fire_count": class_counts.get("Forest/Natural Fire", 0)
        }

    def predict_single(self, telemetry: dict):
        """
        Real-time scoring of a telemetry dict or coordinate.
        """
        # Ensure industrial distance is computed
        lat = float(telemetry["latitude"])
        lon = float(telemetry["longitude"])
        
        df_single = pd.DataFrame([telemetry])
        if "dist_to_industrial_km" not in df_single.columns:
            df_single = self.industrial_engine.compute_features(df_single, lat_col="latitude", lon_col="longitude")
            
        # Ensure missing features are filled with medians
        for col in FEATURE_COLUMNS:
            if col not in df_single.columns:
                df_single[col] = 0.0
                
        X_proc = self.imputer.transform(df_single[FEATURE_COLUMNS])
        probs = self.model.predict_proba(X_proc)[0]
        pred_class = int(np.argmax(probs))
        
        df_single["target_class"] = pred_class
        df_risk = self.risk_engine.compute_risk(df_single).iloc[0]
        
        # Local SHAP drivers
        shap_explanation = None
        if self.explainer:
            try:
                shap_explanation = self.explainer.explain_single_instance(df_single.iloc[0], predicted_class=pred_class)
            except Exception as e:
                shap_explanation = {"error": str(e)}
                
        return {
            "latitude": lat,
            "longitude": lon,
            "predicted_class": pred_class,
            "predicted_class_name": CLASS_NAMES.get(pred_class, "Unknown"),
            "probabilities": {CLASS_NAMES[c]: round(float(probs[c]), 4) for c in range(3)},
            "confidence": round(float(np.max(probs) * 100), 1),
            "risk_score": float(df_risk["risk_score"]),
            "risk_tier": df_risk["risk_tier"],
            "risk_color": df_risk["risk_color"],
            "recommended_action": df_risk["recommended_action"],
            "shap_explanation": shap_explanation
        }

# Singleton instance
service = GeospatialInferenceService()
