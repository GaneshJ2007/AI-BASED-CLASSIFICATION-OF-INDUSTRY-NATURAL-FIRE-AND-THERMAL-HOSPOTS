"""
THERMAL TRACERS - FastAPI Backend Server
Geospatial Intelligence REST API for Industrial Fire & Persistent Thermal Source Detection
"""

import os
import sys
import json
from typing import Optional
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add root directory to sys.path
sys.path.append(r"d:\IndustryFire")
from backend.services.inference_service import service

app = FastAPI(
    title="THERMAL TRACERS API",
    description="AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources",
    version="1.0.0"
)

# Enable CORS for React dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TelemetryPayload(BaseModel):
    latitude: float
    longitude: float
    LST_C: Optional[float] = 32.0
    NO2: Optional[float] = 3.0e-5
    SO2: Optional[float] = 7.0e-5
    CO: Optional[float] = 0.035
    DW_trees_norm: Optional[float] = 0.15
    DW_built_norm: Optional[float] = 0.25
    DW_crops_norm: Optional[float] = 0.30
    DW_shrub_norm: Optional[float] = 0.10
    DW_grass_norm: Optional[float] = 0.05
    DW_bare_norm: Optional[float] = 0.10
    DW_water_norm: Optional[float] = 0.05
    NDVI: Optional[float] = 0.35
    NBR: Optional[float] = 0.10
    NDMI: Optional[float] = -0.05
    S1_VH: Optional[float] = -15.0
    S1_VV: Optional[float] = -8.0
    recurrence_count_1km: Optional[int] = 1
    persistence_score: Optional[float] = 0.083

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "THERMAL TRACERS AI Geospatial Intelligence",
        "problem_statement": "SIH26162 - Industrial Fire & Persistent Thermal Source Detection",
        "models_ready": service.model is not None,
        "total_cached_hotspots": len(service.hotspots_cache)
    }

@app.get("/api/stats")
def get_stats():
    return service.get_stats()

@app.get("/api/hotspots")
def list_hotspots(
    class_code: Optional[int] = Query(None, description="0: Forest, 1: Industrial, 2: Persistent"),
    risk_tier: Optional[str] = Query(None, description="Low, Medium, High, Critical"),
    min_lst: Optional[float] = Query(None, description="Minimum Land Surface Temp in C"),
    limit: int = Query(500, ge=1, le=5000),
    offset: int = Query(0, ge=0)
):
    hotspots, total = service.get_hotspots(
        class_code=class_code,
        risk_tier=risk_tier,
        min_lst=min_lst,
        limit=limit,
        offset=offset
    )
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "count": len(hotspots),
        "hotspots": hotspots
    }

@app.get("/api/hotspots/{hotspot_id}")
def get_hotspot_detail(hotspot_id: int):
    # Find hotspot by ID
    for h in service.hotspots_cache:
        if h["id"] == hotspot_id:
            # Fetch precomputed SHAP if available
            shap_data = None
            if service.explainer:
                try:
                    shap_data = service.explainer.explain_single_instance(h, predicted_class=h["class_code"])
                except Exception as e:
                    shap_data = {"error": str(e)}
            return {
                **h,
                "shap_explanation": shap_data
            }
    raise HTTPException(status_code=404, detail=f"Hotspot ID {hotspot_id} not found")

@app.get("/api/facilities")
def get_industrial_facilities():
    facilities = service.get_facilities()
    return {
        "count": len(facilities),
        "facilities": facilities
    }

@app.get("/api/shap/global")
def get_global_shap():
    shap_path = r"d:\IndustryFire\models\shap\shap_global_importance.json"
    if os.path.exists(shap_path):
        with open(shap_path, "r") as f:
            return json.load(f)
    return {"error": "Global SHAP profile not computed yet."}

@app.post("/api/predict")
def predict_hotspot(payload: TelemetryPayload):
    telemetry_dict = payload.model_dump()
    result = service.predict_single(telemetry_dict)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
