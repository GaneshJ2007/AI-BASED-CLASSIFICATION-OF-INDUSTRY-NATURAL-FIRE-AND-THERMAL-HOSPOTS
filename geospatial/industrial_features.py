"""
THERMAL TRACERS - Phase 3: Industrial Context Geospatial Engine
Computes geodesic distance to nearest industrial facilities, industrial densities within 5km/15km/30km,
and proximity risk metrics across South India using BallTree Haversine spatial indexing.
"""

import os
import json
import numpy as np
import pandas as pd

from sklearn.neighbors import BallTree

# Curated High-Precision South India Industrial Facilities Geo-Catalog
# Encompasses Refineries, Thermal Power Plants, Steel Mills, Chemical/Fertilizer complexes, Cement corridors, and Mega Industrial Parks
SOUTH_INDIA_INDUSTRIAL_FACILITIES = [
    # --- Refineries & Petrochemicals ---
    {"name": "CPCL Manali Refinery", "category": "Refinery", "lat": 13.1672, "lon": 80.2641, "state": "Tamil Nadu"},
    {"name": "MRPL Mangalore Refinery", "category": "Refinery", "lat": 12.9972, "lon": 74.8344, "state": "Karnataka"},
    {"name": "BPCL Kochi Refinery Ambalamugal", "category": "Refinery", "lat": 9.9734, "lon": 76.3682, "state": "Kerala"},
    {"name": "HPCL Visakhapatnam Refinery", "category": "Refinery", "lat": 17.6894, "lon": 83.2553, "state": "Andhra Pradesh"},
    {"name": "Nagarjuna Oil Refinery Cuddalore", "category": "Refinery", "lat": 11.6661, "lon": 79.7712, "state": "Tamil Nadu"},
    
    # --- Thermal Power Plants (High Flaring / Chimneys / Fly Ash) ---
    {"name": "NLC Neyveli Thermal Power Station I & II", "category": "Thermal Power", "lat": 11.5975, "lon": 79.4892, "state": "Tamil Nadu"},
    {"name": "North Chennai Thermal Power Station (NCTPS)", "category": "Thermal Power", "lat": 13.2453, "lon": 80.3281, "state": "Tamil Nadu"},
    {"name": "Ennore Thermal Power Station", "category": "Thermal Power", "lat": 13.2031, "lon": 80.3235, "state": "Tamil Nadu"},
    {"name": "Vallur Thermal Power Plant NTPC", "category": "Thermal Power", "lat": 13.2530, "lon": 80.3015, "state": "Tamil Nadu"},
    {"name": "Mettur Thermal Power Station", "category": "Thermal Power", "lat": 11.7994, "lon": 77.7991, "state": "Tamil Nadu"},
    {"name": "Tuticorin Thermal Power Station (TTPS)", "category": "Thermal Power", "lat": 8.7612, "lon": 78.1754, "state": "Tamil Nadu"},
    {"name": "Ramagundam Super Thermal Power Station NTPC", "category": "Thermal Power", "lat": 18.7562, "lon": 79.4542, "state": "Telangana"},
    {"name": "Kothagudem Thermal Power Station Palwancha", "category": "Thermal Power", "lat": 17.5521, "lon": 80.7014, "state": "Telangana"},
    {"name": "Kakatiya Thermal Power Station Warangal", "category": "Thermal Power", "lat": 18.2324, "lon": 79.8145, "state": "Telangana"},
    {"name": "Simhadri Super Thermal Power Plant NTPC", "category": "Thermal Power", "lat": 17.6012, "lon": 83.0882, "state": "Andhra Pradesh"},
    {"name": "Dr Narla Tata Rao Thermal Power Station (VTPS)", "category": "Thermal Power", "lat": 16.5982, "lon": 80.5284, "state": "Andhra Pradesh"},
    {"name": "Rayalaseema Thermal Power Station (RTPS)", "category": "Thermal Power", "lat": 14.7112, "lon": 78.4571, "state": "Andhra Pradesh"},
    {"name": "Sri Damodaram Sanjeevaiah (Krishnapatnam) TPS", "category": "Thermal Power", "lat": 14.3312, "lon": 80.1251, "state": "Andhra Pradesh"},
    {"name": "Bellary Thermal Power Station (BTPS Kudatini)", "category": "Thermal Power", "lat": 15.1952, "lon": 76.7174, "state": "Karnataka"},
    {"name": "Raichur Thermal Power Station (RTPS Shaktinagar)", "category": "Thermal Power", "lat": 16.3531, "lon": 77.3452, "state": "Karnataka"},
    {"name": "Yeramarus Thermal Power Station Raichur", "category": "Thermal Power", "lat": 16.2891, "lon": 77.3484, "state": "Karnataka"},
    {"name": "Udupi Power Corporation (UPCL Nandikoor)", "category": "Thermal Power", "lat": 13.1462, "lon": 74.7981, "state": "Karnataka"},

    # --- Steel & Heavy Metallurgy Plants ---
    {"name": "JSW Steel Vijayanagar Toranagallu", "category": "Steel / Metallurgy", "lat": 15.1882, "lon": 76.6651, "state": "Karnataka"},
    {"name": "Visakhapatnam Steel Plant (RINL)", "category": "Steel / Metallurgy", "lat": 17.6321, "lon": 83.1812, "state": "Andhra Pradesh"},
    {"name": "Salem Steel Plant (SAIL)", "category": "Steel / Metallurgy", "lat": 11.6421, "lon": 78.0772, "state": "Tamil Nadu"},
    {"name": "Kirloskar Ferrous Industries Koppal", "category": "Steel / Metallurgy", "lat": 15.3412, "lon": 76.1554, "state": "Karnataka"},

    # --- Chemical, Fertilizer & Petrochemical Complexes ---
    {"name": "SIPCOT Cuddalore Chemical Complex", "category": "Chemical", "lat": 11.6912, "lon": 79.7612, "state": "Tamil Nadu"},
    {"name": "SIPCOT Ranipet Industrial Estate", "category": "Chemical / Leather", "lat": 12.9271, "lon": 79.3332, "state": "Tamil Nadu"},
    {"name": "FACT Udyogamandal Eloor-Edayar Industrial Belt", "category": "Chemical / Fertilizer", "lat": 10.0782, "lon": 76.3021, "state": "Kerala"},
    {"name": "SPIC Fertilizers & Petrochem Tuticorin", "category": "Fertilizer", "lat": 8.8152, "lon": 78.1341, "state": "Tamil Nadu"},
    {"name": "Madras Fertilizers Limited (MFL Manali)", "category": "Fertilizer", "lat": 13.1612, "lon": 80.2541, "state": "Tamil Nadu"},
    {"name": "Coromandel International Kakinada", "category": "Fertilizer", "lat": 16.9851, "lon": 82.2612, "state": "Andhra Pradesh"},
    {"name": "Nagarjuna Fertilizers (NFCL) Kakinada", "category": "Fertilizer", "lat": 17.0211, "lon": 82.2852, "state": "Andhra Pradesh"},
    {"name": "Zuari Agro Chemicals Zuarinagar", "category": "Fertilizer", "lat": 15.3951, "lon": 73.8682, "state": "Goa"},

    # --- Industrial Development Areas & Mega Corridors ---
    {"name": "Patancheru Industrial Development Area (IDA)", "category": "Industrial Estate", "lat": 17.5281, "lon": 78.2612, "state": "Telangana"},
    {"name": "Bollaram Industrial Area Hyderabad", "category": "Industrial Estate", "lat": 17.5582, "lon": 78.3614, "state": "Telangana"},
    {"name": "Jeedimetla Industrial Area Hyderabad", "category": "Industrial Estate", "lat": 17.5121, "lon": 78.4412, "state": "Telangana"},
    {"name": "SIPCOT Sriperumbudur Industrial Park", "category": "Industrial Estate", "lat": 12.9832, "lon": 79.9481, "state": "Tamil Nadu"},
    {"name": "Oragadam Industrial Corridor", "category": "Industrial Estate", "lat": 12.8391, "lon": 79.9524, "state": "Tamil Nadu"},
    {"name": "Irungattukottai SIPCOT Industrial Park", "category": "Industrial Estate", "lat": 13.0012, "lon": 79.9812, "state": "Tamil Nadu"},
    {"name": "Peenya Industrial Area Bangalore", "category": "Industrial Estate", "lat": 13.0292, "lon": 77.5181, "state": "Karnataka"},
    {"name": "Baikampady Industrial Area Mangalore", "category": "Industrial Estate", "lat": 12.9461, "lon": 74.8082, "state": "Karnataka"},
    {"name": "Autonagar Industrial Area Guntur", "category": "Industrial Estate", "lat": 16.3212, "lon": 80.4621, "state": "Andhra Pradesh"},
    {"name": "Autonagar Industrial Estate Vijayawada", "category": "Industrial Estate", "lat": 16.4952, "lon": 80.6812, "state": "Andhra Pradesh"},
    {"name": "Sri City Multi-Product SEZ", "category": "Industrial SEZ", "lat": 13.5291, "lon": 80.0382, "state": "Andhra Pradesh"},
    {"name": "SIPCOT Hosur Industrial Complex", "category": "Industrial Estate", "lat": 12.7412, "lon": 77.8251, "state": "Tamil Nadu"},
    {"name": "Cheyyar SIPCOT SEZ", "category": "Industrial SEZ", "lat": 12.6581, "lon": 79.5421, "state": "Tamil Nadu"},
    {"name": "BHEL Heavy Electricals Tiruchirappalli", "category": "Heavy Engineering", "lat": 10.7931, "lon": 78.7562, "state": "Tamil Nadu"},
    {"name": "BHEL Ramachandrapuram Hyderabad", "category": "Heavy Engineering", "lat": 17.5021, "lon": 78.2912, "state": "Telangana"},

    # --- Major Cement & Mineral Industrial Clusters ---
    {"name": "Ariyalur Cement Manufacturing Belt", "category": "Cement", "lat": 11.1412, "lon": 79.0762, "state": "Tamil Nadu"},
    {"name": "Yerraguntla Cement Cluster Kadapa", "category": "Cement", "lat": 14.6361, "lon": 78.5362, "state": "Andhra Pradesh"},
    {"name": "Sedam Cement Industrial Hub Kalaburagi", "category": "Cement", "lat": 17.1782, "lon": 77.2831, "state": "Karnataka"},
    {"name": "Macherla Cement Cluster Palnadu", "category": "Cement", "lat": 16.4782, "lon": 79.4321, "state": "Andhra Pradesh"}
]

class IndustrialSpatialEngine:
    """
    Geospatial engine that builds spatial indices over South India's industrial facilities
    and computes distances, densities, and proximity zones for any coordinate.
    """
    EARTH_RADIUS_KM = 6371.0088

    def __init__(self, facilities: list = None):
        self.facilities = facilities or SOUTH_INDIA_INDUSTRIAL_FACILITIES
        self.facility_df = pd.DataFrame(self.facilities)
        
        # Coordinates in radians [lat, lon]
        coords_deg = self.facility_df[["lat", "lon"]].values
        self.coords_rad = np.radians(coords_deg)
        
        # BallTree with haversine distance metric
        self.tree = BallTree(self.coords_rad, metric="haversine")
        print(f"Initialized IndustrialSpatialEngine with {len(self.facility_df)} industrial infrastructure assets.")

    def compute_features(self, df: pd.DataFrame, lat_col: str = "latitude", lon_col: str = "longitude") -> pd.DataFrame:
        """
        Computes industrial context features for each row in the dataframe:
        - dist_to_industrial_km: Geodesic distance to nearest facility (km)
        - nearest_facility_name: Name of closest industrial infrastructure
        - nearest_facility_category: Category (Thermal Power, Refinery, Steel, Chemical, etc.)
        - industrial_density_5km: Count of facilities within 5km
        - industrial_density_15km: Count of facilities within 15km
        - industrial_density_30km: Count of facilities within 30km
        - is_industrial_zone: Binary flag (dist < 3.0 km)
        """
        df = df.copy()
        pts_deg = df[[lat_col, lon_col]].values
        pts_rad = np.radians(pts_deg)
        
        # 1. Nearest Neighbor Distance
        dists_rad, indices = self.tree.query(pts_rad, k=1)
        dists_km = dists_rad.flatten() * self.EARTH_RADIUS_KM
        nearest_idx = indices.flatten()
        
        df["dist_to_industrial_km"] = np.round(dists_km, 2)
        df["nearest_facility_name"] = self.facility_df["name"].iloc[nearest_idx].values
        df["nearest_facility_category"] = self.facility_df["category"].iloc[nearest_idx].values
        df["is_industrial_zone"] = (df["dist_to_industrial_km"] <= 3.0).astype(int)
        
        # 2. Radius Queries for Densities
        # 5 km
        rad_5km = 5.0 / self.EARTH_RADIUS_KM
        counts_5km = self.tree.query_radius(pts_rad, r=rad_5km, count_only=True)
        df["industrial_density_5km"] = counts_5km
        
        # 15 km
        rad_15km = 15.0 / self.EARTH_RADIUS_KM
        counts_15km = self.tree.query_radius(pts_rad, r=rad_15km, count_only=True)
        df["industrial_density_15km"] = counts_15km

        # 30 km
        rad_30km = 30.0 / self.EARTH_RADIUS_KM
        counts_30km = self.tree.query_radius(pts_rad, r=rad_30km, count_only=True)
        df["industrial_density_30km"] = counts_30km
        
        # 3. Industrial Proximity Decay Score: exp(-dist / 10.0) -> [0, 1]
        df["industrial_proximity_score"] = np.round(np.exp(-df["dist_to_industrial_km"] / 10.0), 4)

        print(f"Industrial features engineered:")
        print(f" - Min distance: {df['dist_to_industrial_km'].min():.2f} km")
        print(f" - Median distance: {df['dist_to_industrial_km'].median():.2f} km")
        print(f" - Observations in industrial zones (<3km): {df['is_industrial_zone'].sum()}")
        print(f" - Observations within 15km of industry: {(df['dist_to_industrial_km'] <= 15.0).sum()}")
        
        return df

if __name__ == "__main__":
    engine = IndustrialSpatialEngine()
    test_df = pd.DataFrame({
        "latitude": [13.165, 17.525, 11.590, 8.500],
        "longitude": [80.260, 78.260, 79.485, 77.000]
    })
    res = engine.compute_features(test_df)
    print(res[["dist_to_industrial_km", "nearest_facility_name", "industrial_proximity_score"]])
