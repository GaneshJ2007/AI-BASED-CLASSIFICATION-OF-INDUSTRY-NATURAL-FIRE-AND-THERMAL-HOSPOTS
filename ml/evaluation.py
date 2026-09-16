"""
THERMAL TRACERS - Standardized Model Evaluation Module
Computes Macro-F1, PR-AUC, ROC-AUC, Per-Class Precision/Recall, and Confusion Matrices.
"""

import numpy as np
import pandas as pd
from sklearn.metrics import (
    f1_score, precision_score, recall_score,
    accuracy_score, precision_recall_curve, auc,
    roc_auc_score, confusion_matrix, classification_report
)

def evaluate_multiclass(y_true, y_pred, y_prob, class_names=None, model_name="Model"):
    """
    Computes exhaustive evaluation metrics for multi-class classification.
    """
    if class_names is None:
        class_names = {0: "Forest Fire", 1: "Industrial Fire", 2: "Persistent Source"}
        
    classes = sorted(list(class_names.keys()))
    n_classes = len(classes)
    
    # Core Global Metrics
    acc = accuracy_score(y_true, y_pred)
    macro_f1 = f1_score(y_true, y_pred, average="macro", zero_division=0)
    weighted_f1 = f1_score(y_true, y_pred, average="weighted", zero_division=0)
    macro_prec = precision_score(y_true, y_pred, average="macro", zero_division=0)
    macro_rec = recall_score(y_true, y_pred, average="macro", zero_division=0)
    
    # Multi-class One-vs-Rest PR-AUC and ROC-AUC
    pr_aucs = {}
    roc_aucs = {}
    for c in classes:
        y_c = (np.array(y_true) == c).astype(int)
        prob_c = y_prob[:, c]
        precisions, recalls, _ = precision_recall_curve(y_c, prob_c)
        pr_aucs[c] = auc(recalls, precisions)
        try:
            roc_aucs[c] = roc_auc_score(y_c, prob_c)
        except Exception:
            roc_aucs[c] = 0.5
            
    mean_pr_auc = np.mean(list(pr_aucs.values()))
    mean_roc_auc = np.mean(list(roc_aucs.values()))
    
    # Per-Class Metrics
    per_class = {}
    for c in classes:
        y_true_c = (np.array(y_true) == c).astype(int)
        y_pred_c = (np.array(y_pred) == c).astype(int)
        p = precision_score(y_true_c, y_pred_c, zero_division=0)
        r = recall_score(y_true_c, y_pred_c, zero_division=0)
        f = f1_score(y_true_c, y_pred_c, zero_division=0)
        support = int(np.sum(y_true_c))
        per_class[class_names[c]] = {
            "precision": round(float(p), 4),
            "recall": round(float(r), 4),
            "f1_score": round(float(f), 4),
            "pr_auc": round(float(pr_aucs[c]), 4),
            "roc_auc": round(float(roc_aucs[c]), 4),
            "support": support
        }
        
    cm = confusion_matrix(y_true, y_pred, labels=classes)
    
    metrics = {
        "model_name": model_name,
        "accuracy": round(float(acc), 4),
        "macro_f1": round(float(macro_f1), 4),
        "weighted_f1": round(float(weighted_f1), 4),
        "macro_precision": round(float(macro_prec), 4),
        "macro_recall": round(float(macro_rec), 4),
        "mean_pr_auc": round(float(mean_pr_auc), 4),
        "mean_roc_auc": round(float(mean_roc_auc), 4),
        "per_class": per_class,
        "confusion_matrix": cm.tolist()
    }
    
    print(f"\n{'='*55}")
    print(f"BENCHMARK RESULTS: {model_name}")
    print(f"{'='*55}")
    print(f"Accuracy:        {acc*100:.2f}%")
    print(f"Macro-F1 Score:  {macro_f1:.4f}  (PRIMARY METRIC)")
    print(f"Weighted-F1:     {weighted_f1:.4f}")
    print(f"Macro Precision: {macro_prec:.4f}")
    print(f"Macro Recall:    {macro_rec:.4f}")
    print(f"Mean PR-AUC:     {mean_pr_auc:.4f}")
    print(f"Mean ROC-AUC:    {mean_roc_auc:.4f}")
    print(f"\nPer-Class Breakdown:")
    for cname, stats in per_class.items():
        print(f" - {cname:<25}: F1={stats['f1_score']:.4f} | Prec={stats['precision']:.4f} | Rec={stats['recall']:.4f} | PR-AUC={stats['pr_auc']:.4f} (N={stats['support']})")
    print(f"\nConfusion Matrix:\n{cm}")
    print(f"{'='*55}\n")
    
    return metrics
