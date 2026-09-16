// THERMAL TRACERS - Realistic Mock Dataset for South India GIS Hotspots

export const INITIAL_HOTSPOTS = [
  // --- FLAGSHIP INDUSTRIAL FIRE HOTSPOTS ---
  {
    id: "TH-1024",
    location: "Manali Petrochemical Complex, Chennai",
    zone: "Industrial Zone",
    lat: 13.1672,
    lng: 80.2611,
    type: "Industrial Fire",
    riskScore: 87,
    confidence: 92,
    nearbyIndustry: "1.2 km (CPCL Refineries)",
    industryName: "Chennai Petroleum Corp Ltd",
    distanceToIndustryKm: 1.2,
    previousDetections: "7 events / 30 days",
    detectionCount: 7,
    status: "High",
    frp: 64.2, // MW
    brightnessTemp: "356.8 K",
    satellite: "VIIRS SNPP (375m)",
    swirBandRatio: "2.41 (Extreme)",
    osmMatch: "High-hazard Chemical Processing",
    windSpeed: "14 km/h NE",
    humidity: "42%",
    ambientTemp: "34°C",
    timestamp: "2026-09-01 07:42 UTC",
    keyFactors: [
      "High thermal intensity (FRP > 60 MW)",
      "Proximity to hazardous chemical storage (< 1.5 km)",
      "Recurring hotspot signature (7 detections in 30 days)",
      "Strong SWIR B12 reflectance anomaly on Sentinel-2"
    ],
    recommendedAction: "Trigger Immediate Industrial Safety Protocol & Dispatch Emergency Squad"
  },
  {
    id: "TH-1025",
    location: "Seshachalam Biosphere Reserve, Tirupati",
    zone: "Forest Region",
    lat: 13.6821,
    lng: 79.3512,
    type: "Natural Fire",
    riskScore: 62,
    confidence: 89,
    nearbyIndustry: "18.4 km (None - Protected Reserve)",
    industryName: "Forest Flora Zone",
    distanceToIndustryKm: 18.4,
    previousDetections: "1 event / 30 days",
    detectionCount: 1,
    status: "Medium",
    frp: 28.5,
    brightnessTemp: "329.1 K",
    satellite: "MODIS Aqua (1km)",
    swirBandRatio: "1.28 (Moderate)",
    osmMatch: "Protected Forest Area",
    windSpeed: "18 km/h NW",
    humidity: "31%",
    ambientTemp: "36°C",
    timestamp: "2026-09-01 06:15 UTC",
    keyFactors: [
      "Moderate thermal footprint in dense deciduous canopy",
      "Low moisture index (NDVI dry spell)",
      "Isolated forest fire with no industrial infrastructure nearby"
    ],
    recommendedAction: "Notify Forest Department for Routine Aerial Drone Surveillance"
  },
  {
    id: "TH-1026",
    location: "Ennore Thermal Power Station Area, Chennai",
    zone: "Plant Area",
    lat: 13.2084,
    lng: 80.3242,
    type: "Persistent Thermal",
    riskScore: 74,
    confidence: 94,
    nearbyIndustry: "0.4 km (TANGEDCO Boiler Facility)",
    industryName: "North Chennai Thermal Station",
    distanceToIndustryKm: 0.4,
    previousDetections: "28 events / 30 days",
    detectionCount: 28,
    status: "High",
    frp: 82.4,
    brightnessTemp: "371.4 K",
    satellite: "Sentinel-2 MSI (20m)",
    swirBandRatio: "2.85 (Steady Continuous)",
    osmMatch: "Active Coal-Fired Power Plant",
    windSpeed: "12 km/h E",
    humidity: "58%",
    ambientTemp: "33°C",
    timestamp: "2026-09-01 08:10 UTC",
    keyFactors: [
      "Consistent heat signature over 28 consecutive observation cycles",
      "Exact geometric match with registered boiler exhaust chimney",
      "Stable baseline FRP profile indicating normal operational stack"
    ],
    recommendedAction: "Whitelist as Known Operational Thermal Infrastructure"
  },
  {
    id: "TH-1027",
    location: "Sriperumbudur Auto-Component SIPCOT, Kanchipuram",
    zone: "Industrial Zone",
    lat: 12.9865,
    lng: 79.9482,
    type: "Industrial Fire",
    riskScore: 89,
    confidence: 91,
    nearbyIndustry: "0.6 km (Paint Shop & Polymer Unit)",
    industryName: "SIPCOT Special Economic Zone",
    distanceToIndustryKm: 0.6,
    previousDetections: "4 events / 30 days",
    detectionCount: 4,
    status: "High",
    frp: 58.1,
    brightnessTemp: "348.6 K",
    satellite: "VIIRS NOAA-20",
    swirBandRatio: "2.15 (High)",
    osmMatch: "Automotive & Resin Processing Unit",
    windSpeed: "11 km/h S",
    humidity: "48%",
    ambientTemp: "32°C",
    timestamp: "2026-09-01 05:50 UTC",
    keyFactors: [
      "Sudden thermal spike inside manufacturing cluster",
      "Within 600m of industrial solvent warehousing",
      "Sentinel-1 SAR coherence drop indicates structural heat event"
    ],
    recommendedAction: "Alert Industrial Safety & Fire Department (TNSFRS)"
  },
  {
    id: "TH-1028",
    location: "Ranipet Chemical Cluster SIPCOT, Ranipet",
    zone: "Industrial Zone",
    lat: 12.9348,
    lng: 79.3326,
    type: "Industrial Fire",
    riskScore: 92,
    confidence: 95,
    nearbyIndustry: "0.3 km (Chromium & Dye Chemical Plant)",
    industryName: "SIPCOT Phase-II Chemical Park",
    distanceToIndustryKm: 0.3,
    previousDetections: "6 events / 30 days",
    detectionCount: 6,
    status: "High",
    frp: 71.9,
    brightnessTemp: "362.1 K",
    satellite: "VIIRS SNPP (375m)",
    swirBandRatio: "2.68 (Critical)",
    osmMatch: "Chemical Manufacturing & Distillation Unit",
    windSpeed: "9 km/h W",
    humidity: "39%",
    ambientTemp: "35°C",
    timestamp: "2026-09-01 07:12 UTC",
    keyFactors: [
      "High fire radiative power adjacent to reactive chemical units",
      "Repeated anomaly in industrial hazardous zone",
      "Environmental dry bulb temperature 35°C accelerating propagation"
    ],
    recommendedAction: "Deploy Hazardous Materials (HAZMAT) Fire Response Unit"
  },
  {
    id: "TH-1029",
    location: "Neyveli Lignite Mine-II, Cuddalore",
    zone: "Industrial Zone",
    lat: 11.5385,
    lng: 79.4891,
    type: "Persistent Thermal",
    riskScore: 78,
    confidence: 96,
    nearbyIndustry: "0.5 km (Open Cast Lignite Mine & TPS-II)",
    industryName: "NLC India Mining Basin",
    distanceToIndustryKm: 0.5,
    previousDetections: "30 events / 30 days",
    detectionCount: 30,
    status: "High",
    frp: 94.6,
    brightnessTemp: "368.5 K",
    satellite: "Sentinel-2 MSI",
    swirBandRatio: "2.72 (Persistent)",
    osmMatch: "Open-Cast Coal/Lignite Extraction",
    windSpeed: "13 km/h SE",
    humidity: "54%",
    ambientTemp: "34°C",
    timestamp: "2026-09-01 06:40 UTC",
    keyFactors: [
      "Continuous thermal emission from deep pit extraction and thermal stack",
      "Identified as permanent industrial utility source in OSM baseline"
    ],
    recommendedAction: "Log Operational Thermal Emission Profile"
  },
  {
    id: "TH-1030",
    location: "Visakhapatnam Steel Plant & Refinery, AP",
    zone: "Industrial Zone",
    lat: 17.6321,
    lng: 83.1784,
    type: "Industrial Fire",
    riskScore: 85,
    confidence: 90,
    nearbyIndustry: "0.8 km (Blast Furnace & Coke Oven #2)",
    industryName: "Rashtriya Ispat Nigam Ltd (RINL)",
    distanceToIndustryKm: 0.8,
    previousDetections: "5 events / 30 days",
    detectionCount: 5,
    status: "High",
    frp: 69.3,
    brightnessTemp: "354.2 K",
    satellite: "MODIS Terra",
    swirBandRatio: "2.33 (Elevated)",
    osmMatch: "Heavy Metallurgical Smelting Works",
    windSpeed: "16 km/h ENE",
    humidity: "62%",
    ambientTemp: "33°C",
    timestamp: "2026-09-01 04:30 UTC",
    keyFactors: [
      "Thermal magnitude exceeds typical furnace baseline",
      "Proximity to ammonia and coal gas storage pipelines"
    ],
    recommendedAction: "Initiate Emergency Industrial Containment Protocol"
  },
  {
    id: "TH-1031",
    location: "Hosur SIPCOT Phase I & II, Krishnagiri",
    zone: "Industrial Zone",
    lat: 12.7408,
    lng: 77.8253,
    type: "Industrial Fire",
    riskScore: 81,
    confidence: 88,
    nearbyIndustry: "1.1 km (Forging & Special Alloy Unit)",
    industryName: "Hosur Heavy Industrial Complex",
    distanceToIndustryKm: 1.1,
    previousDetections: "3 events / 30 days",
    detectionCount: 3,
    status: "High",
    frp: 52.8,
    brightnessTemp: "344.0 K",
    satellite: "VIIRS NOAA-20",
    swirBandRatio: "1.95 (High)",
    osmMatch: "Automotive Precision & Metallurgical Cluster",
    windSpeed: "10 km/h SW",
    humidity: "50%",
    ambientTemp: "31°C",
    timestamp: "2026-09-01 07:05 UTC",
    keyFactors: [
      "Unscheduled thermal event outside metallurgical foundry envelope",
      "Fast spread risk towards adjacent electronics manufacturing units"
    ],
    recommendedAction: "Alert SIPCOT Fire Station & Factory Safety Marshall"
  },
  {
    id: "TH-1032",
    location: "Toranagallu JSW Steel Complex, Bellary",
    zone: "Plant Area",
    lat: 15.1952,
    lng: 76.6625,
    type: "Persistent Thermal",
    riskScore: 76,
    confidence: 97,
    nearbyIndustry: "0.2 km (JSW Vijayanagar Steel Works)",
    industryName: "Vijayanagar Integrated Steel Works",
    distanceToIndustryKm: 0.2,
    previousDetections: "29 events / 30 days",
    detectionCount: 29,
    status: "High",
    frp: 110.2,
    brightnessTemp: "382.4 K",
    satellite: "Sentinel-2 MSI",
    swirBandRatio: "3.10 (High Stable)",
    osmMatch: "Blast Furnace and Hot Strip Mill",
    windSpeed: "15 km/h NW",
    humidity: "35%",
    ambientTemp: "36°C",
    timestamp: "2026-09-01 08:00 UTC",
    keyFactors: [
      "Regular thermal emissions from continuous slab casting",
      "Calibrated high-temperature industrial source in OSM registry"
    ],
    recommendedAction: "Continuous Baseline Tracking"
  },
  {
    id: "TH-1033",
    location: "Ramagundam Super Thermal & Fertilizer, Telangana",
    zone: "Plant Area",
    lat: 18.7554,
    lng: 79.5142,
    type: "Persistent Thermal",
    riskScore: 72,
    confidence: 95,
    nearbyIndustry: "0.7 km (NTPC Ramagundam & RFCL)",
    industryName: "NTPC 2600MW Super Thermal Station",
    distanceToIndustryKm: 0.7,
    previousDetections: "26 events / 30 days",
    detectionCount: 26,
    status: "High",
    frp: 88.0,
    brightnessTemp: "365.2 K",
    satellite: "VIIRS SNPP",
    swirBandRatio: "2.60 (Steady)",
    osmMatch: "Thermal Power Station & Fertilizer Plant",
    windSpeed: "12 km/h N",
    humidity: "40%",
    ambientTemp: "37°C",
    timestamp: "2026-09-01 06:10 UTC",
    keyFactors: [
      "Cooling tower and boiler exhaust persistence",
      "Historical data confirms 26/30 days recurring heat signature"
    ],
    recommendedAction: "Mark as Verified Persistent Thermal Stack"
  },
  {
    id: "TH-1034",
    location: "Pashamylaram Industrial Estate, Hyderabad",
    zone: "Industrial Zone",
    lat: 17.5342,
    lng: 78.1824,
    type: "Industrial Fire",
    riskScore: 84,
    confidence: 89,
    nearbyIndustry: "0.9 km (Bulk Drug Active Ingredient Plant)",
    industryName: "Pharma City Industrial Cluster",
    distanceToIndustryKm: 0.9,
    previousDetections: "5 events / 30 days",
    detectionCount: 5,
    status: "High",
    frp: 49.3,
    brightnessTemp: "341.2 K",
    satellite: "MODIS Aqua",
    swirBandRatio: "1.89 (High)",
    osmMatch: "Active Pharmaceutical Ingredients (API) Park",
    windSpeed: "14 km/h NW",
    humidity: "44%",
    ambientTemp: "34°C",
    timestamp: "2026-09-01 05:22 UTC",
    keyFactors: [
      "Thermal flare in chemical storage tank yard",
      "High density of combustible solvent drums nearby"
    ],
    recommendedAction: "Mobilize Industrial Area Fire Tender and Foam Units"
  },
  {
    id: "TH-1035",
    location: "Kudankulam Industrial Sector, Tirunelveli",
    zone: "Plant Area",
    lat: 8.1746,
    lng: 77.7082,
    type: "Persistent Thermal",
    riskScore: 68,
    confidence: 98,
    nearbyIndustry: "1.5 km (Kudankulam Auxiliary Complex)",
    industryName: "KKNPP Power Substation & Auxiliary",
    distanceToIndustryKm: 1.5,
    previousDetections: "24 events / 30 days",
    detectionCount: 24,
    status: "Medium",
    frp: 34.2,
    brightnessTemp: "331.0 K",
    satellite: "Sentinel-2 MSI",
    swirBandRatio: "1.45 (Constant)",
    osmMatch: "Power Generation & Grid Substation",
    windSpeed: "22 km/h S (Coastal)",
    humidity: "72%",
    ambientTemp: "31°C",
    timestamp: "2026-09-01 07:35 UTC",
    keyFactors: [
      "Regulated turbine auxiliary exhaust thermal footprint",
      "Continuous spatial recurrence with invariant heat boundary"
    ],
    recommendedAction: "Routine Infrastructure Health Monitoring"
  },
  {
    id: "TH-1036",
    location: "Nilgiris Biosphere Reserve, Ooty Fringes",
    zone: "Forest Region",
    lat: 11.4162,
    lng: 76.6953,
    type: "Natural Fire",
    riskScore: 58,
    confidence: 86,
    nearbyIndustry: "22.5 km (No Industrial Presence)",
    industryName: "Protected Shola Forest",
    distanceToIndustryKm: 22.5,
    previousDetections: "2 events / 30 days",
    detectionCount: 2,
    status: "Medium",
    frp: 22.1,
    brightnessTemp: "324.5 K",
    satellite: "VIIRS NOAA-20",
    swirBandRatio: "1.15 (Low-Moderate)",
    osmMatch: "National Park & Shola Grasslands",
    windSpeed: "8 km/h W",
    humidity: "65%",
    ambientTemp: "22°C",
    timestamp: "2026-09-01 03:45 UTC",
    keyFactors: [
      "Brush fire spread along steep terrain contours",
      "Isolated wildland fire detected early by VIIRS 375m band"
    ],
    recommendedAction: "Send Warning Bulletin to Forest Range Officers"
  },
  {
    id: "TH-1037",
    location: "Ariyalur Cement Industrial Belt, Ariyalur",
    zone: "Plant Area",
    lat: 11.1401,
    lng: 79.0782,
    type: "Persistent Thermal",
    riskScore: 71,
    confidence: 93,
    nearbyIndustry: "0.5 km (Ramco / UltraTech Rotary Kilns)",
    industryName: "Ariyalur Clinker & Cement Works",
    distanceToIndustryKm: 0.5,
    previousDetections: "27 events / 30 days",
    detectionCount: 27,
    status: "High",
    frp: 76.5,
    brightnessTemp: "360.2 K",
    satellite: "Sentinel-2 MSI",
    swirBandRatio: "2.45 (Stable High)",
    osmMatch: "Industrial Rotary Kiln Unit",
    windSpeed: "11 km/h E",
    humidity: "47%",
    ambientTemp: "35°C",
    timestamp: "2026-09-01 07:15 UTC",
    keyFactors: [
      "Continuous 1400°C kiln operation signature",
      "Strictly confined to industrial zoning boundary"
    ],
    recommendedAction: "Maintain in Persistent Industrial Inventory"
  },
  {
    id: "TH-1038",
    location: "Tuticorin SIPCOT Industrial Complex, Thoothukudi",
    zone: "Industrial Zone",
    lat: 8.7842,
    lng: 78.1348,
    type: "Industrial Fire",
    riskScore: 86,
    confidence: 91,
    nearbyIndustry: "0.8 km (Copper & Smelting Ancillary Units)",
    industryName: "Tuticorin Port Chemical & Power Hub",
    distanceToIndustryKm: 0.8,
    previousDetections: "4 events / 30 days",
    detectionCount: 4,
    status: "High",
    frp: 55.4,
    brightnessTemp: "349.8 K",
    satellite: "VIIRS SNPP",
    swirBandRatio: "2.08 (High)",
    osmMatch: "Chemical & Fertilizer Industrial Park",
    windSpeed: "19 km/h SE",
    humidity: "68%",
    ambientTemp: "33°C",
    timestamp: "2026-09-01 06:55 UTC",
    keyFactors: [
      "Thermal plume detected over chemical fertilizer storage",
      "Near heavy port logistical corridor"
    ],
    recommendedAction: "Direct Local Disaster Mitigation Team"
  },
  {
    id: "TH-1039",
    location: "Bandipur National Park Border, Chamarajanagar",
    zone: "Forest Region",
    lat: 11.6625,
    lng: 76.6284,
    type: "Natural Fire",
    riskScore: 49,
    confidence: 82,
    nearbyIndustry: "31.0 km (None)",
    industryName: "Tiger Reserve Wildlife Corridor",
    distanceToIndustryKm: 31.0,
    previousDetections: "1 event / 30 days",
    detectionCount: 1,
    status: "Low",
    frp: 18.2,
    brightnessTemp: "321.4 K",
    satellite: "MODIS Terra",
    swirBandRatio: "1.05 (Low)",
    osmMatch: "Deciduous Dry Forest Buffer",
    windSpeed: "7 km/h S",
    humidity: "52%",
    ambientTemp: "28°C",
    timestamp: "2026-09-01 02:20 UTC",
    keyFactors: [
      "Low intensity ground fire / controlled forest department burn line",
      "Far from any infrastructure"
    ],
    recommendedAction: "Monitor Sentinel-2 Pass for Containment"
  },
  {
    id: "TH-1040",
    location: "Mettur Industrial Belt & Thermal Station, Salem",
    zone: "Plant Area",
    lat: 11.7942,
    lng: 77.8014,
    type: "Persistent Thermal",
    riskScore: 73,
    confidence: 94,
    nearbyIndustry: "0.6 km (Mettur Thermal Power Station)",
    industryName: "TANGEDCO Mettur Power Project",
    distanceToIndustryKm: 0.6,
    previousDetections: "25 events / 30 days",
    detectionCount: 25,
    status: "High",
    frp: 79.1,
    brightnessTemp: "363.5 K",
    satellite: "Sentinel-2 MSI",
    swirBandRatio: "2.51 (Persistent)",
    osmMatch: "Power Station & Metal Extrusion Units",
    windSpeed: "10 km/h W",
    humidity: "46%",
    ambientTemp: "34°C",
    timestamp: "2026-09-01 07:48 UTC",
    keyFactors: [
      "Coal combustion steady baseline",
      "Confirmed thermal chimney signature"
    ],
    recommendedAction: "Standard Industrial Emission Audit"
  }
];

// Helper to generate full synthetic initial set to reach exact prompt counts:
// Total Hotspots: 128 (Industrial Fire: 24, Natural Fire: 81, Persistent Thermal: 23)
const generateSyntheticDataset = () => {
  const dataset = [...INITIAL_HOTSPOTS];
  let idCounter = 1041;

  // Counts we currently have in initial array:
  const currentIndustrial = dataset.filter(d => d.type === "Industrial Fire").length; // 7
  const currentNatural = dataset.filter(d => d.type === "Natural Fire").length; // 3
  const currentPersistent = dataset.filter(d => d.type === "Persistent Thermal").length; // 7

  const neededIndustrial = 24 - currentIndustrial; // 17
  const neededNatural = 81 - currentNatural; // 78
  const neededPersistent = 23 - currentPersistent; // 16

  // Clusters for realistic generation
  const industrialClusters = [
    { name: "Manali Industrial Zone, Chennai", lat: 13.165, lng: 80.255, ind: "Petrochem & Fertilizer Plant" },
    { name: "Sriperumbudur Industrial Hub, TN", lat: 12.980, lng: 79.940, ind: "Automotive Paint & Foundry" },
    { name: "Ranipet SIPCOT Chemical Zone, TN", lat: 12.930, lng: 79.330, ind: "Specialty Chemicals Unit" },
    { name: "Ennore Port Logistics Corridor, Chennai", lat: 13.220, lng: 80.320, ind: "Oil & Gas Storage Depot" },
    { name: "Hosur SIPCOT Industrial Belt, TN", lat: 12.735, lng: 77.830, ind: "Precision Metallurgy Factory" },
    { name: "Patancheru Pharma Belt, Hyderabad", lat: 17.520, lng: 78.260, ind: "Synthetic Drug Manufacturing" },
    { name: "Visakhapatnam Autonagar, AP", lat: 17.690, lng: 83.190, ind: "Polymers & Packaging Facility" },
    { name: "Bellary Industrial Corridor, KA", lat: 15.180, lng: 76.670, ind: "Pellet & Sintering Plant" },
    { name: "Nanjangud Industrial Area, Mysore", lat: 12.120, lng: 76.680, ind: "Food Processing & Boiler Unit" },
    { name: "Coimbatore SIDCO Industrial Estate, TN", lat: 10.950, lng: 76.960, ind: "Foundry & Casting Works" }
  ];

  const naturalForestRegions = [
    { name: "Western Ghats, Wayanad Reserve", lat: 11.68, lng: 76.13 },
    { name: "Eastern Ghats, Nallamala Forest, AP", lat: 15.42, lng: 78.85 },
    { name: "Javadi Hills Forest Range, TN", lat: 12.58, lng: 78.92 },
    { name: "Kolli Hills Reserve Canopy, TN", lat: 11.25, lng: 78.34 },
    { name: "Seshachalam Hills, Kadapa Border", lat: 13.92, lng: 79.18 },
    { name: "Bandipur Buffer Scrublands, KA", lat: 11.75, lng: 76.55 },
    { name: "Mudumalai Forest Corridor, TN", lat: 11.56, lng: 76.58 },
    { name: "Silent Valley Peripheral Zone, KL", lat: 11.12, lng: 76.45 },
    { name: "Anamalai Tiger Reserve Scrub, TN", lat: 10.35, lng: 76.95 },
    { name: "Palani Hills Foothills, Dindigul", lat: 10.22, lng: 77.52 },
    { name: "Sirumalai Reserve Forest, TN", lat: 10.18, lng: 77.99 },
    { name: "Biligiriranga Hills Wildlife Sanctuary, KA", lat: 11.98, lng: 77.12 }
  ];

  const persistentFacilities = [
    { name: "Neyveli Lignite Thermal Pit, TN", lat: 11.54, lng: 79.48, ind: "Thermal Station II" },
    { name: "Ennore Coastal Thermal Plant, Chennai", lat: 13.21, lng: 80.31, ind: "Boiler Stack Unit 4" },
    { name: "Mettur Dam Thermal Complex, Salem", lat: 11.80, lng: 77.81, ind: "Power Station Stage III" },
    { name: "Raichur Super Thermal Power, KA", lat: 16.35, lng: 77.34, ind: "KPCL Boiler Block" },
    { name: "Ramagundam NTPC Plant, Telangana", lat: 18.76, lng: 79.52, ind: "Ultra Mega Chimney" },
    { name: "Simhadri Super Thermal, Visakhapatnam", lat: 17.60, lng: 83.05, ind: "NTPC Coastal Stacks" },
    { name: "Ariyalur Cement Kilns Complex, TN", lat: 11.15, lng: 79.08, ind: "Rotary Calcination Kiln" },
    { name: "Dalmiapuram Cement Works, Tiruchirappalli", lat: 10.96, lng: 78.85, ind: "Limestone Kiln #1" },
    { name: "JSW Toranagallu Steel Blast Unit, KA", lat: 15.20, lng: 76.65, ind: "Corex Reduction Plant" },
    { name: "Manali CPCL Crude Distillation Stack", lat: 13.17, lng: 80.26, ind: "Refinery Flare Stack" }
  ];

  // 1. Generate remaining Industrial Fire
  for (let i = 0; i < neededIndustrial; i++) {
    const cluster = industrialClusters[i % industrialClusters.length];
    const latOffset = (Math.random() - 0.5) * 0.04;
    const lngOffset = (Math.random() - 0.5) * 0.04;
    const risk = Math.floor(80 + Math.random() * 16); // 80 - 95%
    const conf = Math.floor(86 + Math.random() * 12); // 86 - 97%
    const dist = (0.2 + Math.random() * 1.6).toFixed(1);
    const detections = Math.floor(3 + Math.random() * 6);

    dataset.push({
      id: `TH-${idCounter++}`,
      location: cluster.name,
      zone: "Industrial Zone",
      lat: Number((cluster.lat + latOffset).toFixed(4)),
      lng: Number((cluster.lng + lngOffset).toFixed(4)),
      type: "Industrial Fire",
      riskScore: risk,
      confidence: conf,
      nearbyIndustry: `${dist} km (${cluster.ind})`,
      industryName: cluster.ind,
      distanceToIndustryKm: parseFloat(dist),
      previousDetections: `${detections} events / 30 days`,
      detectionCount: detections,
      status: risk > 85 ? "Critical" : "High",
      frp: Number((45 + Math.random() * 35).toFixed(1)),
      brightnessTemp: `${(340 + Math.random() * 25).toFixed(1)} K`,
      satellite: Math.random() > 0.5 ? "VIIRS SNPP (375m)" : "VIIRS NOAA-20",
      swirBandRatio: `${(1.9 + Math.random() * 0.9).toFixed(2)} (High)`,
      osmMatch: "Zoned Industrial Manufacturing / Chemical",
      windSpeed: `${Math.floor(8 + Math.random() * 15)} km/h`,
      humidity: `${Math.floor(35 + Math.random() * 25)}%`,
      ambientTemp: `${Math.floor(30 + Math.random() * 6)}°C`,
      timestamp: "2026-09-01 07:20 UTC",
      keyFactors: [
        "High thermal anomaly inside industrial cadastral boundary",
        `Within ${dist} km of hazardous processing infrastructure`,
        "Recurring heat signature over multi-day satellite overpasses"
      ],
      recommendedAction: "Alert Local Industrial Safety Command"
    });
  }

  // 2. Generate remaining Natural Fire
  for (let i = 0; i < neededNatural; i++) {
    const region = naturalForestRegions[i % naturalForestRegions.length];
    const latOffset = (Math.random() - 0.5) * 0.35;
    const lngOffset = (Math.random() - 0.5) * 0.35;
    const risk = Math.floor(40 + Math.random() * 32); // 40 - 71%
    const conf = Math.floor(75 + Math.random() * 20);
    const dist = (12 + Math.random() * 30).toFixed(1);
    const detections = Math.floor(1 + Math.random() * 2);

    dataset.push({
      id: `TH-${idCounter++}`,
      location: region.name,
      zone: "Forest Region",
      lat: Number((region.lat + latOffset).toFixed(4)),
      lng: Number((region.lng + lngOffset).toFixed(4)),
      type: "Natural Fire",
      riskScore: risk,
      confidence: conf,
      nearbyIndustry: `${dist} km (Protected Forest)`,
      industryName: "Forest & Grassland Area",
      distanceToIndustryKm: parseFloat(dist),
      previousDetections: `${detections} events / 30 days`,
      detectionCount: detections,
      status: risk > 65 ? "Medium" : "Low",
      frp: Number((15 + Math.random() * 25).toFixed(1)),
      brightnessTemp: `${(318 + Math.random() * 18).toFixed(1)} K`,
      satellite: Math.random() > 0.5 ? "MODIS Aqua (1km)" : "MODIS Terra",
      swirBandRatio: `${(1.05 + Math.random() * 0.35).toFixed(2)} (Moderate)`,
      osmMatch: "National Park / Forest Reserve",
      windSpeed: `${Math.floor(10 + Math.random() * 12)} km/h`,
      humidity: `${Math.floor(28 + Math.random() * 30)}%`,
      ambientTemp: `${Math.floor(26 + Math.random() * 8)}°C`,
      timestamp: "2026-09-01 05:40 UTC",
      keyFactors: [
        "Vegetation dry canopy thermal radiation",
        "Zero industrial buildings within 10 km radius",
        "Matches seasonal wildfire / scrubland burn profile"
      ],
      recommendedAction: "Send Advisory to State Forest Department"
    });
  }

  // 3. Generate remaining Persistent Thermal
  for (let i = 0; i < neededPersistent; i++) {
    const facility = persistentFacilities[i % persistentFacilities.length];
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;
    const risk = Math.floor(68 + Math.random() * 14); // 68 - 81%
    const conf = Math.floor(92 + Math.random() * 7); // 92 - 98%
    const dist = (0.1 + Math.random() * 0.8).toFixed(1);
    const detections = Math.floor(22 + Math.random() * 9); // 22 - 30 days

    dataset.push({
      id: `TH-${idCounter++}`,
      location: facility.name,
      zone: "Plant Area",
      lat: Number((facility.lat + latOffset).toFixed(4)),
      lng: Number((facility.lng + lngOffset).toFixed(4)),
      type: "Persistent Thermal",
      riskScore: risk,
      confidence: conf,
      nearbyIndustry: `${dist} km (${facility.ind})`,
      industryName: facility.ind,
      distanceToIndustryKm: parseFloat(dist),
      previousDetections: `${detections} events / 30 days`,
      detectionCount: detections,
      status: "High",
      frp: Number((70 + Math.random() * 45).toFixed(1)),
      brightnessTemp: `${(360 + Math.random() * 25).toFixed(1)} K`,
      satellite: "Sentinel-2 MSI (20m)",
      swirBandRatio: `${(2.4 + Math.random() * 0.8).toFixed(2)} (Continuous)`,
      osmMatch: "Thermal Power Station / Blast Furnace / Kiln",
      windSpeed: `${Math.floor(8 + Math.random() * 14)} km/h`,
      humidity: `${Math.floor(40 + Math.random() * 25)}%`,
      ambientTemp: `${Math.floor(32 + Math.random() * 5)}°C`,
      timestamp: "2026-09-01 08:05 UTC",
      keyFactors: [
        "Continuous persistent thermal source (>20 detections/30 days)",
        "Co-located with verified thermal power/smelting plant",
        "Predictable diurnal thermal profile"
      ],
      recommendedAction: "Maintain in Persistent Industrial Source Whitelist"
    });
  }

  return dataset;
};

export const INITIAL_DATASET = generateSyntheticDataset();

// SIMULATION NEW DATASET (12 New Hotspots: 3 Industrial-Risk, 2 Persistent, 7 Natural)
export const SIMULATED_NEW_HOTSPOTS = [
  {
    id: "TH-1024-LIVE",
    location: "Ennore Port Hazardous Cargo Depot, Chennai",
    zone: "Industrial Zone",
    lat: 13.2514,
    lng: 80.3341,
    type: "Industrial Fire",
    riskScore: 94,
    confidence: 96,
    nearbyIndustry: "0.4 km (LPG & Petrochemical Terminal)",
    industryName: "Ennore Port Logistics Zone",
    distanceToIndustryKm: 0.4,
    previousDetections: "8 events / 30 days",
    detectionCount: 8,
    status: "Critical",
    frp: 88.4,
    brightnessTemp: "368.2 K",
    satellite: "VIIRS SNPP (Real-Time Stream)",
    swirBandRatio: "2.95 (Severe)",
    osmMatch: "Liquid Fuel & Solvent Tank Farm",
    windSpeed: "16 km/h E",
    humidity: "48%",
    ambientTemp: "34°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: [
      "CRITICAL: Sudden thermal blowout near fuel tank containment",
      "Extremely high Fire Radiative Power (88.4 MW)",
      "Proximity to high-density coastal industrial logistics",
      "Sentinel-1 SAR interferometric displacement confirmed"
    ],
    recommendedAction: "FLASH ALERT: Initiate Tier-3 Port Emergency Protocol"
  },
  {
    id: "TH-2002-NEW",
    location: "Oragadam Industrial Corridor, Kanchipuram",
    zone: "Industrial Zone",
    lat: 12.8342,
    lng: 79.9125,
    type: "Industrial Fire",
    riskScore: 88,
    confidence: 93,
    nearbyIndustry: "0.7 km (Rubber & Tyre Processing Plant)",
    industryName: "SIPCOT Oragadam Industrial Growth Centre",
    distanceToIndustryKm: 0.7,
    previousDetections: "5 events / 30 days",
    detectionCount: 5,
    status: "High",
    frp: 62.0,
    brightnessTemp: "351.4 K",
    satellite: "Sentinel-2 MSI Pass",
    swirBandRatio: "2.35 (High)",
    osmMatch: "Automotive Ancillary & Vulcanization Facility",
    windSpeed: "12 km/h SE",
    humidity: "44%",
    ambientTemp: "33°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: [
      "Rapid heat buildup in polymer storage yard",
      "Dense black smoke absorption pattern on SWIR band 12",
      "Multi-source fusion matches OSM industrial boundary"
    ],
    recommendedAction: "Dispatch Fire Squad to Sector 4 Industrial Gate"
  },
  {
    id: "TH-2003-NEW",
    location: "Visakhapatnam Autonagar Phase-III, AP",
    zone: "Industrial Zone",
    lat: 17.6845,
    lng: 83.1812,
    type: "Industrial Fire",
    riskScore: 85,
    confidence: 91,
    nearbyIndustry: "0.5 km (Chemical Solvent Distillation)",
    industryName: "Autonagar Industrial Area",
    distanceToIndustryKm: 0.5,
    previousDetections: "4 events / 30 days",
    detectionCount: 4,
    status: "High",
    frp: 54.8,
    brightnessTemp: "346.0 K",
    satellite: "VIIRS NOAA-20",
    swirBandRatio: "2.12 (Elevated)",
    osmMatch: "Solvent Extraction & Packaging",
    windSpeed: "15 km/h ENE",
    humidity: "58%",
    ambientTemp: "32°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: [
      "Thermal anomaly adjacent to solvent recovery unit",
      "FRP exceeds baseline by 240%",
      "Elevated environmental risk"
    ],
    recommendedAction: "Alert AP Fire & Emergency Response Services"
  },
  {
    id: "TH-2004-NEW",
    location: "Kudankulam Coastal Substation Area, TN",
    zone: "Plant Area",
    lat: 8.1790,
    lng: 77.7120,
    type: "Persistent Thermal",
    riskScore: 71,
    confidence: 97,
    nearbyIndustry: "0.8 km (Power Transmission Grid)",
    industryName: "Heavy Electrical Transformer Yard",
    distanceToIndustryKm: 0.8,
    previousDetections: "29 events / 30 days",
    detectionCount: 29,
    status: "High",
    frp: 41.2,
    brightnessTemp: "338.5 K",
    satellite: "Sentinel-2 MSI",
    swirBandRatio: "1.65 (Constant)",
    osmMatch: "Grid Substation & Auxiliary Units",
    windSpeed: "20 km/h S",
    humidity: "70%",
    ambientTemp: "31°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: [
      "Known electrical substation continuous heat radiation",
      "Persistent footprint matches 29-day baseline history"
    ],
    recommendedAction: "Verify with Substation Thermal Log"
  },
  {
    id: "TH-2005-NEW",
    location: "Bellary Toranagallu Blast Furnace 4, KA",
    zone: "Plant Area",
    lat: 15.1912,
    lng: 76.6580,
    type: "Persistent Thermal",
    riskScore: 79,
    confidence: 96,
    nearbyIndustry: "0.3 km (Integrated Steel Works)",
    industryName: "Vijayanagar Blast Furnace #4",
    distanceToIndustryKm: 0.3,
    previousDetections: "30 events / 30 days",
    detectionCount: 30,
    status: "High",
    frp: 118.5,
    brightnessTemp: "386.0 K",
    satellite: "VIIRS SNPP",
    swirBandRatio: "3.22 (Persistent High)",
    osmMatch: "Continuous Iron Ore Smelting Unit",
    windSpeed: "14 km/h NW",
    humidity: "32%",
    ambientTemp: "37°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: [
      "Scheduled continuous metal tapping cycle",
      "Whitelisted industrial persistent anomaly"
    ],
    recommendedAction: "Continuous Satellite Telemetry Logging"
  },
  // 7 New Natural Wildfires
  {
    id: "TH-2006-NEW",
    location: "Western Ghats, Agasthyamalai Biosphere, TN",
    zone: "Forest Region",
    lat: 8.6125,
    lng: 77.2412,
    type: "Natural Fire",
    riskScore: 54,
    confidence: 84,
    nearbyIndustry: "28.0 km (Protected Forest)",
    industryName: "Tropical Evergreen Buffer",
    distanceToIndustryKm: 28.0,
    previousDetections: "1 event / 30 days",
    detectionCount: 1,
    status: "Medium",
    frp: 21.0,
    brightnessTemp: "323.0 K",
    satellite: "MODIS Aqua",
    swirBandRatio: "1.10 (Moderate)",
    osmMatch: "Protected Biosphere Reserve",
    windSpeed: "10 km/h SW",
    humidity: "62%",
    ambientTemp: "27°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: ["Fringe ridge brush fire", "Natural topography spread profile"],
    recommendedAction: "Notify Forest Watch Tower"
  },
  {
    id: "TH-2007-NEW",
    location: "Nallamala Hills, Srisailam North, AP",
    zone: "Forest Region",
    lat: 16.0824,
    lng: 78.8912,
    type: "Natural Fire",
    riskScore: 61,
    confidence: 87,
    nearbyIndustry: "35.0 km (None)",
    industryName: "Deciduous Tiger Habitat",
    distanceToIndustryKm: 35.0,
    previousDetections: "2 events / 30 days",
    detectionCount: 2,
    status: "Medium",
    frp: 26.5,
    brightnessTemp: "327.4 K",
    satellite: "VIIRS NOAA-20",
    swirBandRatio: "1.22 (Moderate)",
    osmMatch: "National Wildlife Corridor",
    windSpeed: "16 km/h N",
    humidity: "33%",
    ambientTemp: "36°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: ["Dry bamboo thicket combustion", "Low relative humidity"],
    recommendedAction: "Forest Patrol Notification"
  },
  {
    id: "TH-2008-NEW",
    location: "Javadi Hills, Vellore District, TN",
    zone: "Forest Region",
    lat: 12.6102,
    lng: 78.9541,
    type: "Natural Fire",
    riskScore: 48,
    confidence: 81,
    nearbyIndustry: "19.5 km (No Industrial Units)",
    industryName: "Reserve Forest Block 8",
    distanceToIndustryKm: 19.5,
    previousDetections: "1 event / 30 days",
    detectionCount: 1,
    status: "Low",
    frp: 17.8,
    brightnessTemp: "320.6 K",
    satellite: "MODIS Terra",
    swirBandRatio: "1.08 (Low)",
    osmMatch: "Deciduous Hill Forest",
    windSpeed: "9 km/h W",
    humidity: "45%",
    ambientTemp: "31°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: ["Scrub fire on hill slopes", "Zero industrial threat"],
    recommendedAction: "Monitor via Satellite"
  },
  {
    id: "TH-2009-NEW",
    location: "Kolli Hills Valley Sector, Namakkal, TN",
    zone: "Forest Region",
    lat: 11.2845,
    lng: 78.3612,
    type: "Natural Fire",
    riskScore: 52,
    confidence: 83,
    nearbyIndustry: "24.0 km (None)",
    industryName: "Shola and Grassland Patch",
    distanceToIndustryKm: 24.0,
    previousDetections: "1 event / 30 days",
    detectionCount: 1,
    status: "Medium",
    frp: 19.4,
    brightnessTemp: "322.8 K",
    satellite: "VIIRS SNPP",
    swirBandRatio: "1.14 (Moderate)",
    osmMatch: "Reserved Forest Zone",
    windSpeed: "8 km/h S",
    humidity: "55%",
    ambientTemp: "29°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: ["Agricultural clearing border fire", "Low velocity spread"],
    recommendedAction: "Local Beat Officer Alert"
  },
  {
    id: "TH-2010-NEW",
    location: "Kudremukh Foothills, Chikkamagaluru, KA",
    zone: "Forest Region",
    lat: 13.2145,
    lng: 75.2584,
    type: "Natural Fire",
    riskScore: 45,
    confidence: 80,
    nearbyIndustry: "40.0 km (None)",
    industryName: "National Park High Elevation Shola",
    distanceToIndustryKm: 40.0,
    previousDetections: "1 event / 30 days",
    detectionCount: 1,
    status: "Low",
    frp: 15.6,
    brightnessTemp: "318.5 K",
    satellite: "Sentinel-2 MSI",
    swirBandRatio: "1.02 (Low)",
    osmMatch: "National Park Wilderness",
    windSpeed: "12 km/h W",
    humidity: "68%",
    ambientTemp: "25°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: ["Small grassland flare-up", "High humidity dampening spread"],
    recommendedAction: "Log Observation"
  },
  {
    id: "TH-2011-NEW",
    location: "Seshachalam Western Ridges, Kadapa, AP",
    zone: "Forest Region",
    lat: 14.1205,
    lng: 78.9812,
    type: "Natural Fire",
    riskScore: 59,
    confidence: 85,
    nearbyIndustry: "26.0 km (None)",
    industryName: "Red Sanders Forest Belt",
    distanceToIndustryKm: 26.0,
    previousDetections: "2 events / 30 days",
    detectionCount: 2,
    status: "Medium",
    frp: 23.8,
    brightnessTemp: "326.1 K",
    satellite: "VIIRS NOAA-20",
    swirBandRatio: "1.18 (Moderate)",
    osmMatch: "Protected Wilderness Area",
    windSpeed: "15 km/h NW",
    humidity: "35%",
    ambientTemp: "35°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: ["Elevated summer temperature", "Dry leaf litter combustion"],
    recommendedAction: "Forest Patrol Notification"
  },
  {
    id: "TH-2012-NEW",
    location: "Anamalai Border Scrubland, Pollachi, TN",
    zone: "Forest Region",
    lat: 10.4512,
    lng: 76.9821,
    type: "Natural Fire",
    riskScore: 47,
    confidence: 82,
    nearbyIndustry: "21.0 km (None)",
    industryName: "Tiger Reserve Periphery",
    distanceToIndustryKm: 21.0,
    previousDetections: "1 event / 30 days",
    detectionCount: 1,
    status: "Low",
    frp: 16.9,
    brightnessTemp: "319.4 K",
    satellite: "MODIS Terra",
    swirBandRatio: "1.06 (Low)",
    osmMatch: "Reserve Forest Buffer Zone",
    windSpeed: "11 km/h SW",
    humidity: "59%",
    ambientTemp: "28°C",
    timestamp: "Just Now (Real-Time Ingestion)",
    isNew: true,
    keyFactors: ["Isolated brush patch fire", "Terrain barrier prevents spread"],
    recommendedAction: "Routine Satellite Log"
  }
];

// Industrial Cluster Overlay Polygons for Leaflet visualization
export const INDUSTRIAL_CLUSTERS = [
  {
    id: "IND-MANALI",
    name: "Manali Petrochemical Corridor",
    city: "Chennai, TN",
    bounds: [
      [13.145, 80.235],
      [13.185, 80.285]
    ],
    hazardLevel: "Critical Hazmat Zone",
    color: "#ef4444"
  },
  {
    id: "IND-ENNORE",
    name: "Ennore Port & Thermal Zone",
    city: "Chennai, TN",
    bounds: [
      [13.195, 80.295],
      [13.265, 80.345]
    ],
    hazardLevel: "High Energy Infrastructure",
    color: "#f97316"
  },
  {
    id: "IND-SRIPERUMBUDUR",
    name: "Sriperumbudur SIPCOT Megapark",
    city: "Kanchipuram, TN",
    bounds: [
      [12.955, 79.915],
      [13.015, 79.975]
    ],
    hazardLevel: "Heavy Automotive & Electronics",
    color: "#0284c7"
  },
  {
    id: "IND-RANIPET",
    name: "Ranipet Chemical Cluster SIPCOT",
    city: "Ranipet, TN",
    bounds: [
      [12.915, 79.305],
      [12.955, 79.355]
    ],
    hazardLevel: "Hazardous Chemical & Dye Works",
    color: "#dc2626"
  },
  {
    id: "IND-NEYVELI",
    name: "NLC Mining & Thermal Complex",
    city: "Cuddalore, TN",
    bounds: [
      [11.515, 79.455],
      [11.565, 79.525]
    ],
    hazardLevel: "Lignite Extraction & Power",
    color: "#8b5cf6"
  },
  {
    id: "IND-VIZAG",
    name: "Visakhapatnam Steel & Refinery Hub",
    city: "Visakhapatnam, AP",
    bounds: [
      [17.610, 83.140],
      [17.695, 83.210]
    ],
    hazardLevel: "Metallurgical & Petroleum Refining",
    color: "#ea580c"
  },
  {
    id: "IND-TORANAGALLU",
    name: "JSW Toranagallu Steel Complex",
    city: "Bellary, KA",
    bounds: [
      [15.170, 76.630],
      [15.220, 76.690]
    ],
    hazardLevel: "Heavy Smelting & Blast Furnaces",
    color: "#7c3aed"
  },
  {
    id: "IND-PATANCHERU",
    name: "Hyderabad Pharma & Bulk Drug Belt",
    city: "Hyderabad, TS",
    bounds: [
      [17.500, 78.150],
      [17.560, 78.280]
    ],
    hazardLevel: "Pharmaceuticals & Solvents",
    color: "#e11d48"
  }
];

// Multi-Source Data Ingestion Telemetry Specs
export const DATA_SOURCES = [
  {
    id: "firms",
    name: "NASA FIRMS",
    badge: "Active Telemetry",
    details: "VIIRS 375m & MODIS 1km Active Thermal Feeds",
    latency: "3.2 min",
    status: "Online",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    id: "sentinel",
    name: "Sentinel-1/2",
    badge: "SWIR / SAR",
    details: "ESA Multi-Spectral 20m SWIR Band 12 & SAR Coherence",
    latency: "Synch 20m",
    status: "Synchronized",
    color: "bg-sky-50 text-sky-700 border-sky-200"
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    badge: "Spatial Cadastre",
    details: "Zoned Industrial Polygons, Fuel Tanks & Hazmat Buffers",
    latency: "Indexed",
    status: "Integrated",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200"
  },
  {
    id: "env",
    name: "Environmental Data",
    badge: "Meteo Fusion",
    details: "Wind Speed, Relative Humidity, Ambient Temp & Dry-Spell Index",
    latency: "Real-Time",
    status: "Fused",
    color: "bg-amber-50 text-amber-700 border-amber-200"
  }
];
