"""
THERMAL TRACERS - FastAPI Backend Server
Geospatial Intelligence REST API for Industrial Fire & Persistent Thermal Source Detection
Problem Statement: SIH26162 (NTRO)
"""

import os
import sys
import json
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Query, HTTPException, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Add root directory to sys.path
sys.path.append(r"d:\IndustryFire")
from backend.services.inference_service import service

app = FastAPI(
    title="THERMAL TRACERS API",
    description="AI-Based Geospatial Intelligence for Industrial Fire & Persistent Thermal Source Detection (SIH26162)",
    version="2.0.0"
)

# Enable CORS for React dashboard and external clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TelemetryPayload(BaseModel):
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    LST_C: Optional[float] = Field(32.0, description="Land Surface Temperature in Celsius")
    NO2: Optional[float] = Field(3.0e-5, description="Tropospheric NO2 Column (mol/m²)")
    SO2: Optional[float] = Field(7.0e-5, description="Sulfur Dioxide SO2 Column (mol/m²)")
    CO: Optional[float] = Field(0.035, description="Carbon Monoxide CO Column (mol/m²)")
    DW_trees_norm: Optional[float] = Field(0.15, description="Dynamic World Trees fraction (0-1)")
    DW_built_norm: Optional[float] = Field(0.25, description="Dynamic World Built fraction (0-1)")
    DW_crops_norm: Optional[float] = Field(0.30, description="Dynamic World Crops fraction (0-1)")
    DW_shrub_norm: Optional[float] = Field(0.10, description="Dynamic World Shrub fraction (0-1)")
    DW_grass_norm: Optional[float] = Field(0.05, description="Dynamic World Grass fraction (0-1)")
    DW_bare_norm: Optional[float] = Field(0.10, description="Dynamic World Bare ground fraction (0-1)")
    DW_water_norm: Optional[float] = Field(0.05, description="Dynamic World Water fraction (0-1)")
    NDVI: Optional[float] = Field(0.35, description="Normalized Difference Vegetation Index")
    NBR: Optional[float] = Field(0.10, description="Normalized Burn Ratio")
    NDMI: Optional[float] = Field(-0.05, description="Normalized Difference Moisture Index")
    S1_VH: Optional[float] = Field(-15.0, description="Sentinel-1 SAR VH backscatter (dB)")
    S1_VV: Optional[float] = Field(-8.0, description="Sentinel-1 SAR VV backscatter (dB)")
    recurrence_count_1km: Optional[int] = Field(1, description="30-day thermal recurrence within 1km")
    persistence_score: Optional[float] = Field(0.083, description="Temporal persistence score (0-1)")

class AlertUpdatePayload(BaseModel):
    status: str = Field(..., description="NEW, ACKNOWLEDGED, INVESTIGATING, or RESOLVED")
    notes: Optional[str] = Field("", description="Audit log note or operational dispatch message")

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "THERMAL TRACERS AI Geospatial Intelligence",
        "problem_statement": "SIH26162 - Industrial Fire & Persistent Thermal Source Detection",
        "models_ready": service.model is not None,
        "total_cached_hotspots": len(service.hotspots_cache),
        "total_active_alerts": len([a for a in service.alerts_registry if a["status"] != "RESOLVED"]),
        "version": "2.0.0"
    }

@app.get("/api/stats")
def get_stats():
    return service.get_stats()

# Hotspot listing with canonical alias /api/thermal-events
@app.get("/api/hotspots")
@app.get("/api/thermal-events")
def list_thermal_events(
    class_code: Optional[int] = Query(None, description="0: Natural Fire, 1: Industrial Fire, 2: Persistent Thermal"),
    risk_tier: Optional[str] = Query(None, description="Low, Medium, High, Critical, or All"),
    min_lst: Optional[float] = Query(None, description="Minimum Land Surface Temp in Celsius"),
    search: Optional[str] = Query(None, description="Search by ID, location, or facility"),
    is_alert: Optional[bool] = Query(None, description="Filter for critical and high risk active alerts"),
    limit: int = Query(500, ge=1, le=5000),
    offset: int = Query(0, ge=0)
):
    hotspots, total = service.get_hotspots(
        class_code=class_code,
        risk_tier=risk_tier,
        min_lst=min_lst,
        search=search,
        is_alert=is_alert,
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
@app.get("/api/thermal-events/{hotspot_id}")
def get_thermal_event_detail(hotspot_id: str):
    # Find hotspot by ID (supports string like TT-2021-0001 or int ID)
    for h in service.hotspots_cache:
        if str(h.get("id")) == str(hotspot_id):
            shap_data = None
            if service.explainer:
                try:
                    shap_data = service.explainer.explain_single_instance(h, predicted_class=h.get("class_code", 0))
                except Exception as e:
                    shap_data = {"error": str(e)}
            return {
                **h,
                "shap_explanation": shap_data
            }
    raise HTTPException(status_code=404, detail=f"Thermal event ID {hotspot_id} not found")

@app.get("/api/thermal-events/{hotspot_id}/history")
def get_thermal_event_history(hotspot_id: str):
    return service.get_event_history(hotspot_id)

@app.get("/api/thermal-events/{hotspot_id}/explanation")
def get_thermal_event_explanation(hotspot_id: str):
    for h in service.hotspots_cache:
        if str(h.get("id")) == str(hotspot_id):
            if service.explainer:
                try:
                    return service.explainer.explain_single_instance(h, predicted_class=h.get("class_code", 0))
                except Exception as e:
                    return {"error": str(e)}
            return {"note": "Local SHAP explainer not available."}
    raise HTTPException(status_code=404, detail=f"Thermal event ID {hotspot_id} not found")

@app.get("/api/thermal-events/{hotspot_id}/risk")
def get_thermal_event_risk(hotspot_id: str):
    for h in service.hotspots_cache:
        if str(h.get("id")) == str(hotspot_id):
            return {
                "id": h.get("id"),
                "risk_score": h.get("riskScore") or h.get("risk_score"),
                "risk_tier": h.get("riskTier") or h.get("risk_tier"),
                "risk_color": h.get("riskColor") or h.get("risk_color"),
                "recommended_action": h.get("recommendedAction") or h.get("recommended_action"),
                "factors": {
                    "lst_c": h.get("lst_c"),
                    "dist_to_industrial_km": h.get("dist_to_industrial_km"),
                    "nearest_facility": h.get("nearestFacility") or h.get("nearest_facility"),
                    "facility_category": h.get("facilityCategory") or h.get("facility_category")
                }
            }
    raise HTTPException(status_code=404, detail=f"Thermal event ID {hotspot_id} not found")

# Enterprise Alerts Center API
@app.get("/api/alerts")
def list_alerts(
    status: Optional[str] = Query(None, description="NEW, ACKNOWLEDGED, INVESTIGATING, RESOLVED, or All"),
    risk_tier: Optional[str] = Query(None, description="Critical, High, Medium, or All"),
    limit: int = Query(100, ge=1, le=500)
):
    alerts = service.get_alerts(status=status, risk_tier=risk_tier, limit=limit)
    return {
        "count": len(alerts),
        "alerts": alerts
    }

@app.patch("/api/alerts/{alert_id}")
def update_alert(alert_id: str, payload: AlertUpdatePayload):
    success, result = service.update_alert_status(alert_id, payload.status, payload.notes)
    if not success:
        raise HTTPException(status_code=400, detail=result)
    return {
        "message": f"Alert {alert_id} successfully updated to {payload.status.upper()}",
        "alert": result
    }

# Analytics & False-Alarm Reduction
@app.get("/api/analytics")
def get_analytics():
    return service.get_analytics()

# Comprehensive Multi-Sensor Data Sources
@app.get("/api/data-sources")
def get_data_sources():
    sources = service.get_data_sources()
    return {
        "total_sources": len(sources),
        "data_sources": sources
    }

# Facilities Cadastre
@app.get("/api/facilities")
def get_industrial_facilities():
    facilities = service.get_facilities()
    return {
        "count": len(facilities),
        "facilities": facilities
    }

# Global SHAP
@app.get("/api/shap/global")
def get_global_shap():
    if os.path.exists(SHAP_GLOBAL_PATH):
        with open(SHAP_GLOBAL_PATH, "r") as f:
            return json.load(f)
    return {"error": "Global SHAP profile not found."}

# Real-time Prediction / Processing
@app.post("/api/predict")
@app.post("/api/process-event")
def predict_hotspot(payload: TelemetryPayload):
    telemetry_dict = payload.model_dump()
    result = service.predict_single(telemetry_dict)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
 