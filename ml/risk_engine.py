"""
THERMAL TRACERS - Phase 12: Multi-Factor Risk Scoring Engine
Calculates an independent continuous risk score (0-100) and assigns a 4-tier alert level
(Low, Medium, High, Critical) based on thermal intensity, atmospheric toxicity,
exposure vulnerability, and recurrence persistence.
"""

import numpy as np
import pandas as pd

class MultiFactorRiskEngine:
    """
    Independent Risk Scoring Engine for Industrial Fires, Forest Fires, and Persistent Thermal Sources.
    """
    def __init__(self):
        # Factor weights
        self.w_thermal = 0.30
        self.w_hazard = 0.25
        self.w_vulnerability = 0.25
        self.w_persistence = 0.20

    def compute_risk(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Computes continuous risk_score (0-100), risk_level, and recommended mitigation actions.
        """
        df = df.copy()
        
        # 1. Thermal Sub-score (0 to 1)
        # Baseline 25 C -> 45 C
        lst = df["LST_C"] if "LST_C" in df.columns else pd.Series(30.0, index=df.index)
        s_thermal = np.clip((lst - 25.0) / 20.0, 0.0, 1.0)
        
        # 2. Atmospheric Hazard Sub-score (0 to 1)
        # Elevated NO2, SO2, or CO
        no2_norm = np.clip(df.get("NO2", 2e-5) / 6e-5, 0.0, 1.0)
        so2_norm = np.clip(df.get("SO2", 5e-5) / 2e-4, 0.0, 1.0)
        co_norm = np.clip((df.get("CO", 0.035) - 0.025) / 0.020, 0.0, 1.0)
        s_hazard = 0.40 * no2_norm + 0.40 * so2_norm + 0.20 * co_norm
        
        # 3. Vulnerability & Exposure Sub-score (0 to 1)
        built = df.get("DW_built_norm", 0.05)
        ind_prox = df.get("industrial_proximity_score", 0.1)
        trees = df.get("DW_trees_norm", 0.2)
        dryness = df.get("fuel_dryness_indicator", 0.5)
        
        # High built + industrial proximity = high urban/chemical vulnerability
        # High trees + high dryness = high forest wildfire spread vulnerability
        vuln_urban = built * 0.6 + ind_prox * 0.4
        vuln_wildfire = trees * dryness
        s_vulnerability = np.clip(np.maximum(vuln_urban, vuln_wildfire), 0.0, 1.0)
        
        # 4. Persistence & Recurrence Sub-score (0 to 1)
        p_score = df.get("persistence_score", 0.083)
        rec_count = df.get("recurrence_count_1km", 1)
        s_persistence = np.clip(p_score * 0.5 + np.clip(rec_count / 4.0, 0.0, 1.0) * 0.5, 0.0, 1.0)
        
        # Weighted Overall Risk Score (0 to 100)
        raw_risk = (
            self.w_thermal * s_thermal +
            self.w_hazard * s_hazard +
            self.w_vulnerability * s_vulnerability +
            self.w_persistence * s_persistence
        )
        risk_score = np.round(raw_risk * 100.0, 1)
        df["risk_score"] = risk_score
        
        # 4-Tier Categorization
        conditions = [
            (risk_score < 35.0),
            (risk_score >= 35.0) & (risk_score < 60.0),
            (risk_score >= 60.0) & (risk_score < 80.0),
            (risk_score >= 80.0)
        ]
        tier_names = ["Low", "Medium", "High", "Critical"]
        df["risk_tier"] = np.select(conditions, tier_names, default="Medium")
        
        # Color codes for mapping
        color_map = {
            "Low": "#10B981",       # Emerald Green
            "Medium": "#F59E0B",    # Amber
            "High": "#F97316",      # Orange
            "Critical": "#EF4444"   # Red
        }
        df["risk_color"] = df["risk_tier"].map(color_map)
        
        # Action Recommendation Engine
        actions = []
        for _, row in df.iterrows():
            tier = row["risk_tier"]
            pred_class = row.get("target_class", row.get("predicted_class", 0))
            
            if tier == "Critical":
                if pred_class == 1:
                    act = "CRITICAL INDUSTRIAL ALERT: Immediate evacuation of 1km radius, HAZMAT chemical containment and emergency foam deployment required."
                elif pred_class == 0:
                    act = "CRITICAL WILDFIRE: Immediate airborne water bombing, fireline trenching, and frontline settlement evacuation."
                else:
                    act = "CRITICAL THERMAL SOURCE: Extreme thermal anomaly at facility; emergency shutdown and flare stack pressure inspection mandated."
            elif tier == "High":
                if pred_class == 1:
                    act = "HIGH RISK: Dispatch industrial fire brigade, verify volatile chemical storage tanks, and initiate localized cordoning."
                elif pred_class == 0:
                    act = "HIGH RISK: Forest watchtower alert; deploy ground crews for rapid containment of perimeter spread."
                else:
                    act = "HIGH RISK: Sustained industrial heat emission; schedule urgent industrial safety audit and sulfur scrubber check."
            elif tier == "Medium":
                act = "MEDIUM RISK: Continuous satellite monitoring active; ground verification team alerted for anomaly surveillance."
            else:
                act = "LOW RISK: Routine observation within permissible environmental and thermal baseline thresholds."
            actions.append(act)
            
        df["recommended_action"] = actions
        return df

if __name__ == "__main__":
    engine = MultiFactorRiskEngine()
    sample_df = pd.DataFrame({
        "LST_C": [41.5, 33.0, 28.0],
        "NO2": [5e-5, 2e-5, 1e-5],
        "SO2": [1.5e-4, 5e-5, 2e-5],
        "CO": [0.045, 0.035, 0.030],
        "DW_built_norm": [0.45, 0.10, 0.02],
        "industrial_proximity_score": [0.85, 0.20, 0.01],
        "DW_trees_norm": [0.05, 0.60, 0.10],
        "fuel_dryness_indicator": [0.3, 0.8, 0.4],
        "persistence_score": [0.75, 0.08, 0.08],
        "recurrence_count_1km": [4, 1, 1],
        "target_class": [1, 0, 0]
    })
    res = engine.compute_risk(sample_df)
    print(res[["risk_score", "risk_tier", "recommended_action"]])
