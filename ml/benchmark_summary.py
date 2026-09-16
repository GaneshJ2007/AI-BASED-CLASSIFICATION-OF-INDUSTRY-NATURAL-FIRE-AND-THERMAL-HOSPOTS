"""
THERMAL TRACERS - Comprehensive Model Benchmarking & Comparison
Compiles performance metrics across candidate architectures on the disjoint spatial test set:
1. XGBoost (Gradient Boosted Trees)
2. FT-Transformer (Deep Tabular Attention)
3. Hybrid FT-Transformer + XGBoost (Representation Fusion)
"""

import os
import json
import pandas as pd

XGB_PATH = r"d:\IndustryFire\models\xgboost\xgb_test_metrics.json"
FTT_PATH = r"d:\IndustryFire\models\ft_transformer\ftt_test_metrics.json"
HYBRID_PATH = r"d:\IndustryFire\models\hybrid\hybrid_test_metrics.json"
OUTPUT_DIR = r"d:\IndustryFire\data\processed"

def compile_benchmarks():
    models = {
        "XGBoost": XGB_PATH,
        "FT-Transformer": FTT_PATH,
        "Hybrid FT-Transformer + XGBoost": HYBRID_PATH
    }
    
    rows = []
    full_data = {}
    
    for name, path in models.items():
        if os.path.exists(path):
            with open(path, "r") as f:
                data = json.load(f)
                full_data[name] = data
                
                c0 = data["per_class"].get("Forest/Natural Fire", {})
                c1 = data["per_class"].get("Industrial Fire", {})
                c2 = data["per_class"].get("Persistent Thermal Source", {})
                
                rows.append({
                    "Model": name,
                    "Accuracy (%)": round(data["accuracy"] * 100, 2),
                    "Macro-F1": data["macro_f1"],
                    "Mean PR-AUC": data["mean_pr_auc"],
                    "Forest Fire F1": c0.get("f1_score", 0),
                    "Industrial Fire F1": c1.get("f1_score", 0),
                    "Industrial Fire Rec": c1.get("recall", 0),
                    "Persistent Source F1": c2.get("f1_score", 0),
                    "Persistent Source Rec": c2.get("recall", 0)
                })
                
    df = pd.DataFrame(rows)
    print("=" * 75)
    print("THERMAL TRACERS: MODEL BENCHMARK COMPARISON (SPATIAL TEST SET)")
    print("=" * 75)
    print(df.to_string(index=False))
    print("=" * 75)
    
    # Save comparison table
    out_json = os.path.join(OUTPUT_DIR, "model_benchmark_comparison.json")
    out_csv = os.path.join(OUTPUT_DIR, "model_benchmark_comparison.csv")
    df.to_csv(out_csv, index=False)
    with open(out_json, "w") as f:
        json.dump(full_data, f, indent=2)
        
    print(f"\nSaved benchmark comparison table to:\n - {out_csv}\n - {out_json}")
    return df

if __name__ == "__main__":
    compile_benchmarks()
