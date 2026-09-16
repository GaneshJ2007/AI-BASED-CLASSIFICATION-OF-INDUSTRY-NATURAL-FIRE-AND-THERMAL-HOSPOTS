"""
THERMAL TRACERS - Phase 11: SHAP Geospatial Explainability Engine
Generates global feature attributions and local per-hotspot SHAP explanations (Top-5 drivers)
using TreeSHAP, providing transparency into why a hotspot was classified as Industrial, Forest,
or Persistent Thermal Source.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
import shap

sys.path.append(r"d:\IndustryFire")
from ml.features_config import FEATURE_COLUMNS, TARGET_COLUMN, CLASS_NAMES

XGB_MODEL_PATH = r"d:\IndustryFire\models\xgboost\xgb_model.joblib"
XGB_IMPUTER_PATH = r"d:\IndustryFire\models\xgboost\xgb_imputer.joblib"
TEST_DATA_PATH = r"d:\IndustryFire\data\final\test_spatial_split.csv"
OUTPUT_DIR = r"d:\IndustryFire\models\shap"
os.makedirs(OUTPUT_DIR, exist_ok=True)

class HotspotShapExplainer:
    """
    SHAP explanation engine providing global and local interpretability for thermal hotspot classification.
    """
    def __init__(self, model_path: str = XGB_MODEL_PATH, imputer_path: str = XGB_IMPUTER_PATH):
        print(f"Loading model for TreeSHAP from: {model_path}")
        self.model = joblib.load(model_path)
        self.imputer = joblib.load(imputer_path)
        self.feature_names = FEATURE_COLUMNS
        self.explainer = shap.TreeExplainer(self.model)
        print("TreeExplainer initialized successfully.")

    def explain_dataset(self, df: pd.DataFrame, max_samples: int = 300):
        """
        Computes SHAP values across a representative dataset sample for global feature importance.
        """
        sample_df = df[self.feature_names].iloc[:max_samples].copy()
        X_proc = self.imputer.transform(sample_df)
        
        print(f"Computing TreeSHAP values for {len(X_proc)} samples across {len(self.feature_names)} features...")
        shap_values = self.explainer.shap_values(X_proc)
        
        # If list (one array per class), convert or handle
        # shap_values format: list of 3 arrays of shape (N, features), or array of shape (N, features, 3)
        if isinstance(shap_values, list):
            shap_array = np.array(shap_values)  # (3, N, features)
            # permute to (N, features, 3)
            shap_array = np.transpose(shap_array, (1, 2, 0))
        else:
            shap_array = shap_values
            
        # Global mean absolute SHAP per class
        global_importance = {}
        for c in range(3):
            c_name = CLASS_NAMES[c]
            mean_abs = np.mean(np.abs(shap_array[:, :, c]), axis=0)
            top_indices = np.argsort(mean_abs)[::-1]
            global_importance[c_name] = [
                {"feature": self.feature_names[i], "mean_abs_shap": round(float(mean_abs[i]), 5)}
                for i in top_indices
            ]
            
        return shap_array, global_importance

    def explain_single_instance(self, feature_row: dict or pd.Series, predicted_class: int = None):
        """
        Generates local Top-5 positive and negative contributing factors for an individual hotspot.
        """
        if isinstance(feature_row, dict):
            df_inst = pd.DataFrame([feature_row])[self.feature_names]
        else:
            df_inst = pd.DataFrame([feature_row[self.feature_names]])
            
        X_proc = self.imputer.transform(df_inst)
        shap_vals = self.explainer.shap_values(X_proc)
        
        if isinstance(shap_vals, list):
            sv = [sv_c[0] for sv_c in shap_vals]  # 3 arrays of shape (features,)
        elif shap_vals.ndim == 3:
            sv = [shap_vals[0, :, c] for c in range(3)]
        else:
            sv = [shap_vals[0]]
            
        if predicted_class is None:
            preds = self.model.predict_proba(X_proc)[0]
            predicted_class = int(np.argmax(preds))
            
        class_shap = sv[predicted_class]
        
        # Sort features by absolute contribution
        sorted_indices = np.argsort(np.abs(class_shap))[::-1]
        
        contributions = []
        for idx in sorted_indices[:5]:  # Top-5 features
            feat = self.feature_names[idx]
            val = float(df_inst[feat].values[0])
            contrib = float(class_shap[idx])
            direction = "Supports Classification" if contrib > 0 else "Counter-Evidence"
            contributions.append({
                "feature": feat,
                "feature_value": round(val, 4),
                "shap_impact": round(contrib, 4),
                "direction": direction,
                "description": self._get_feature_human_desc(feat, val, contrib, predicted_class)
            })
            
        return {
            "predicted_class": predicted_class,
            "predicted_class_name": CLASS_NAMES[predicted_class],
            "top_drivers": contributions
        }

    def _get_feature_human_desc(self, feat, val, contrib, pred_class):
        """Translates numerical feature impacts into clear domain explanations."""
        if feat == "dist_to_industrial_km":
            if val < 5.0:
                return f"Located {val:.1f}km from nearest industrial facility (critical industrial zone)."
            else:
                return f"Located {val:.1f}km away from industrial infrastructure (remote natural zone)."
        elif feat == "DW_trees_norm":
            return f"Tree canopy cover density is {val*100:.1f}%."
        elif feat == "DW_built_norm":
            return f"Built-up urban/industrial infrastructure density is {val*100:.1f}%."
        elif feat == "NO2":
            return f"Sentinel-5P NO2 column concentration is {val:.2e} mol/m²."
        elif feat == "SO2":
            return f"Sentinel-5P SO2 plume concentration is {val:.2e} mol/m²."
        elif feat == "LST_C":
            return f"Land Surface Temperature is {val:.1f}°C (elevated thermal anomaly)."
        elif feat == "is_recurrent_hotspot":
            return f"Multi-temporal recurrence indicator: {int(val)} (observed across multiple dates)."
        elif feat == "persistence_score":
            return f"Temporal persistence score is {val:.2f}."
        elif feat == "fuel_dryness_indicator":
            return f"Fuel dryness / scorch index is {val:.2f}."
        elif feat == "NDVI":
            return f"Vegetation vigor index (NDVI) is {val:.2f}."
        else:
            return f"{feat} = {val:.3f} with SHAP contribution of {contrib:+.3f}."

def run_shap_pipeline():
    print("=" * 60)
    print("PHASE 11: Computing Global and Local SHAP Explanations")
    print("=" * 60)
    
    explainer = HotspotShapExplainer()
    test_df = pd.read_csv(TEST_DATA_PATH)
    
    # 1. Global Explanations
    _, global_importance = explainer.explain_dataset(test_df, max_samples=300)
    
    global_path = os.path.join(OUTPUT_DIR, "shap_global_importance.json")
    with open(global_path, "w") as f:
        json.dump(global_importance, f, indent=2)
    print(f"\nGlobal feature importance saved to: {global_path}")
    
    print("\nTop-5 Global Drivers per Class:")
    for c_name, top_feats in global_importance.items():
        print(f"\n[{c_name}] Top Features:")
        for f_item in top_feats[:5]:
            print(f" - {f_item['feature']:<28}: {f_item['mean_abs_shap']:.5f}")
            
    # 2. Local Explanations for Representative Samples of Each Class
    local_examples = {}
    for target_c in [0, 1, 2]:
        sub = test_df[test_df[TARGET_COLUMN] == target_c]
        if len(sub) > 0:
            sample_row = sub.iloc[0]
            explanation = explainer.explain_single_instance(sample_row, predicted_class=target_c)
            local_examples[CLASS_NAMES[target_c]] = {
                "sample_coords": {"lat": sample_row["latitude"], "lon": sample_row["longitude"]},
                "explanation": explanation
            }
            
    local_path = os.path.join(OUTPUT_DIR, "shap_local_examples.json")
    with open(local_path, "w") as f:
        json.dump(local_examples, f, indent=2)
    print(f"\nLocal hotspot explanations saved to: {local_path}")
    
    # 3. Generate SHAP explanations for ALL test points for frontend dashboard lookup
    print("\nGenerating per-hotspot SHAP driver summaries for all test hotspots...")
    hotspot_explanations = []
    for idx, row in test_df.iterrows():
        exp = explainer.explain_single_instance(row)
        hotspot_explanations.append({
            "latitude": round(float(row["latitude"]), 5),
            "longitude": round(float(row["longitude"]), 5),
            "true_class": int(row[TARGET_COLUMN]),
            "predicted_class": exp["predicted_class"],
            "predicted_class_name": exp["predicted_class_name"],
            "top_drivers": exp["top_drivers"]
        })
        
    all_exp_path = os.path.join(OUTPUT_DIR, "test_hotspots_shap_explanations.json")
    with open(all_exp_path, "w") as f:
        json.dump(hotspot_explanations, f, indent=2)
    print(f"Saved {len(hotspot_explanations)} precomputed hotspot SHAP profiles to: {all_exp_path}")
    print("=" * 60)

if __name__ == "__main__":
    run_shap_pipeline()
