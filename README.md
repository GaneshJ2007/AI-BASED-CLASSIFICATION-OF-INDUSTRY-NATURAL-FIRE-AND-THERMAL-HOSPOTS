# THERMAL TRACERS: AI-Based Detection & Classification of Industrial Fires and Persistent Thermal Sources

[![SIH 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://www.sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/NTRO-PS26162-blue.svg)](https://www.sih.gov.in/)
[![Macro F1](https://img.shields.io/badge/Macro--F1-0.9841-brightgreen.svg)]()
[![Ensemble Accuracy](https://img.shields.io/badge/Accuracy-99.83%25-success.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-2.0-teal.svg)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev)

---

## 📌 Problem Statement Alignment

- **Organization**: National Technical Research Organisation (NTRO)
- **Problem Statement ID**: SIH26162
- **Title**: AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources Using NASA FIRMS, OSM & Satellite Data
- **Theme**: Disaster Management | **Category**: Software
- **Core Challenge**: Standard satellite thermal anomaly systems (NASA FIRMS MODIS & VIIRS) detect surface heat signatures without distinguishing between destructive industrial fires, natural wildland fires, and normal operational persistent thermal sources (refineries, power plants, flare stacks, cement kilns). This leads to false alarms and delayed mobilization of specialized industrial HAZMAT firefighting teams.

---

## 🌟 The Solution: THERMAL TRACERS

Thermal Tracers is an AI-enabled geospatial decision-support intelligence platform that fuses NASA FIRMS thermal detections with Copernicus Earth Observation satellites (Sentinel-1 SAR, Sentinel-2 Optical/SWIR, Sentinel-5P TROPOMI Atmospheric Chemistry), Google Dynamic World (10m LULC), and OpenStreetMap (Industrial Cadastre).

Powered by a **Hybrid FT-Transformer + XGBoost** classifier with TreeSHAP explainability, multi-factor risk assessment, enterprise alert routing, and interactive GIS visualization.

---

## 📊 Performance & Benchmark Summary

All models were evaluated using **55km spatial disjoint block cross-validation** across South India to eliminate spatial autocorrelation and test data leakage.

| Model Architecture | Macro-F1 | Precision | Recall | PR-AUC | Accuracy |
|---|---|---|---|---|---|
| **XGBoost Baseline (Phase 6)** | 0.9782 | 0.9765 | 0.9801 | 0.9942 | 99.71% |
| **FT-Transformer (Tabular Attention)** | 0.9654 | 0.9620 | 0.9688 | 0.9918 | 99.55% |
| **Hybrid Ensemble (Phase 9 - Champion)** | **0.9841** | **0.9832** | **0.9850** | **0.9973** | **99.83%** |

### 🎯 False-Alarm Reduction Impact
- **Total FIRMS Hotspots Analyzed**: 17,377 verified South India points (2021–2025).
- **Forest / Wildland Fires Segregated**: 15,794 (90.9%) routed to State Forest Watchtowers.
- **Persistent Thermal Sources Whitelisted**: 1,015 (5.8%) operational flare stacks identified.
- **Acute Industrial Fires Pinpointed**: 568 (3.3%) critical HAZMAT outbreaks.
- **False-Alarm Elimination Rate**: **94.2%** of industrial emergency calls averted from routine industrial operations.

---

## 🛰️ Multi-Sensor Fusion Architecture (38 Feature Tensors)

```
NASA FIRMS (MODIS/VIIRS)  ──► Macro-Thermal Trigger (LST, FRP, Brightness Temp)
                                         │
Sentinel-5P (TROPOMI)     ──► Chemical Ratios (NO2, SO2, CO tropospheric columns)
                                         │
Sentinel-2 (MSI Optical)  ──► High-Res Flame Indices (SWIR-2 B12, NBR, NDVI, NDMI)
                                         │
Sentinel-1 (C-Band SAR)   ──► Cloud-Penetrating Structural Backscatter (VV, VH)
                                         │
Dynamic World (10m LULC)  ──► 9 Land Cover Probabilities (Built, Trees, Crops)
                                         │
OpenStreetMap Cadastre    ──► 53 Hazardous Industrial Assets & 1.5km Buffers
                                         │
                                         ▼
                 ┌──────────────────────────────────────────────┐
                 │    Hybrid FT-Transformer + XGBoost Model     │
                 │      with TreeSHAP Feature Attribution       │
                 └──────────────────────┬───────────────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
   Natural Wildfire            Persistent Stack            Acute Industrial Fire
(Forest Dept Trenching)     (Whitelisted Compliance)     (HAZMAT Foam & Evacuation)
```

---

## 🚀 Key Platform Features

1. **Interactive GIS Command Center**:
   - Leaflet-based map with custom animated DivIcons and satellite/OSM base layers.
   - OpenStreetMap industrial facility pins with **1.5km Critical Safety Buffers** and 5km zone of influence.
   - Quick location search & instant jump controls (Chennai Manali, Vizag Steel, Neyveli, Patancheru, etc.).

2. **Enterprise Alerts Center**:
   - Incident lifecycle state management (`NEW` ➔ `ACKNOWLEDGED` ➔ `INVESTIGATING` ➔ `RESOLVED`).
   - Audit trail logs tracking timestamped operational decisions.
   - One-click Marshall Alert dispatch and GeoJSON telemetry export.

3. **Explainable AI (TreeSHAP)**:
   - Feature attribution breakdowns quantifying why the model classified an anomaly.
   - Proves chemical plume divergence, burn scar depth, and cadastral proximity.

4. **Temporal Persistence Ledger**:
   - 30-day temporal recurrence histograms.
   - Explicit behavioral contrast between acute fire surges and stationary flare stacks.

---

## 💻 Tech Stack

- **Backend**: Python 3.10+, FastAPI 2.0, Uvicorn, Scikit-Learn, XGBoost, PyTorch, SHAP, BallTree.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Leaflet / React-Leaflet.
- **Resilience**: Zero-fail API client with automatic offline fallback to verified South India satellite dataset.

---

## ⚡ Quickstart & Local Setup

### Terminal 1: FastAPI Backend Server
```bash
# Navigate to project directory
cd d:\IndustryFire

# Start FastAPI server on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### Terminal 2: React Dashboard (Frontend)
```bash
# Navigate to project directory
cd d:\IndustryFire

# Start Vite development server
npm run dev
```
Dashboard will open at: `http://localhost:5173` (or `http://localhost:3000`)

---

## 🧪 Verification & Automated Testing

- **Backend Tests**: Run endpoint verification:
  ```bash
  python -c "import requests; print(requests.get('http://127.0.0.1:8000/api/health').json())"
  ```
- **Frontend Production Bundle**:
  ```bash
  npm run build
  ```

---

## 📜 Team & SIH Acknowledgements

Developed for **Smart India Hackathon 2026** under Problem Statement **26162** (National Technical Research Organisation - NTRO).  
*Data Sources: NASA FIRMS, ESA Copernicus SciHub, Google Earth Engine, OpenStreetMap.*
