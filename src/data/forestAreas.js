// Curated South India Forest Reserves, National Parks & Biosphere Reserves
// with vector bounds, centroids, canopy classification, and wildfire flammability index

export const SOUTH_INDIA_FOREST_AREAS = [
  {
    id: 'FOR-01',
    name: 'Mudumalai Tiger Reserve & Nilgiris Biosphere',
    category: 'Tiger Reserve & Moist Deciduous Canopy',
    state: 'Tamil Nadu / Kerala Border',
    district: 'Nilgiris',
    lat: 11.5833,
    lng: 76.5333,
    bounds: [
      [11.50, 76.45],
      [11.68, 76.65]
    ],
    flammability: 'High (Dry Season Leaf Litter)',
    fireSeason: 'Jan - May',
    areaSqKm: 321,
    canopyCover: '78%',
    description: 'Dense deciduous forest and elephant corridor. High vulnerability to seasonal ground fires spreading from fringe settlements.',
    color: '#10b981'
  },
  {
    id: 'FOR-02',
    name: 'Bandipur National Park',
    category: 'Dry Deciduous & Scrub Forest',
    state: 'Karnataka',
    district: 'Chamarajanagar',
    lat: 11.7500,
    lng: 76.6000,
    bounds: [
      [11.64, 76.48],
      [11.88, 76.78]
    ],
    flammability: 'Critical (Severe Recurrent Fire History)',
    fireSeason: 'Feb - May',
    areaSqKm: 874,
    canopyCover: '65%',
    description: 'Major wildlife habitat connecting Western and Eastern Ghats. Highly prone to catastrophic dry-season wildfires fueled by lantana camara thickets.',
    color: '#059669'
  },
  {
    id: 'FOR-03',
    name: 'Nallamala Forest & Srisailam Tiger Reserve',
    category: 'Tropical Dry Deciduous & Scrub Canopy',
    state: 'Andhra Pradesh / Telangana',
    district: 'Kurnool / Nalgonda',
    lat: 15.9500,
    lng: 78.9500,
    bounds: [
      [15.65, 78.70],
      [16.25, 79.25]
    ],
    flammability: 'Extreme (High Temperature & Low Humidity)',
    fireSeason: 'Jan - June',
    areaSqKm: 3568,
    canopyCover: '55%',
    description: 'Largest contiguous tiger reserve in India. Extremely dry rocky plateau with steep valleys prone to rapid wind-driven wildfire spread.',
    color: '#047857'
  },
  {
    id: 'FOR-04',
    name: 'Western Ghats - Wayanad & Silent Valley Reserve',
    category: 'Tropical Wet Evergreen & Shola Grasslands',
    state: 'Kerala',
    district: 'Wayanad / Palakkad',
    lat: 11.2000,
    lng: 76.5000,
    bounds: [
      [11.05, 76.38],
      [11.38, 76.62]
    ],
    flammability: 'Moderate (High Canopy Moisture)',
    fireSeason: 'Feb - April',
    areaSqKm: 89,
    canopyCover: '88%',
    description: 'High biodiversity rainforest. Wildfire risk primarily confined to high-altitude shola grasslands and forest boundaries during dry spells.',
    color: '#10b981'
  },
  {
    id: 'FOR-05',
    name: 'Seshachalam Biosphere Reserve (Tirupati Hills)',
    category: 'Southern Tropical Dry Deciduous (Red Sanders)',
    state: 'Andhra Pradesh',
    district: 'Tirupati / Chittoor',
    lat: 13.7200,
    lng: 79.3500,
    bounds: [
      [13.58, 79.18],
      [13.88, 79.52]
    ],
    flammability: 'High (Anthropogenic & Summer Ignitions)',
    fireSeason: 'Feb - May',
    areaSqKm: 475,
    canopyCover: '60%',
    description: 'Home to endemic Pterocarpus santalinus (Red Sanders). Rugged sandstone terrain with recurrent summer fires in steep gorges.',
    color: '#059669'
  },
  {
    id: 'FOR-06',
    name: 'Nagarhole National Park (Kabini Corridor)',
    category: 'Moist Deciduous & Teak Plantation Reserve',
    state: 'Karnataka',
    district: 'Kodagu / Mysore',
    lat: 12.0500,
    lng: 76.1800,
    bounds: [
      [11.95, 76.05],
      [12.18, 76.32]
    ],
    flammability: 'High (Undergrowth Bamboo Die-off Risk)',
    fireSeason: 'Jan - April',
    areaSqKm: 643,
    canopyCover: '72%',
    description: 'Dense deciduous forest adjoining Kabini river reservoir. High wildlife concentration requiring rapid forest department fire alerts.',
    color: '#047857'
  },
  {
    id: 'FOR-07',
    name: 'Shendurney Wildlife Sanctuary & Agasthyamalai',
    category: 'Semi-Evergreen & Montane Reserve',
    state: 'Kerala / Tamil Nadu',
    district: 'Kollam / Tirunelveli',
    lat: 8.9200,
    lng: 77.1600,
    bounds: [
      [8.82, 77.06],
      [9.02, 77.26]
    ],
    flammability: 'Moderate (Foothill & Grassland Margin Risk)',
    fireSeason: 'Jan - March',
    areaSqKm: 171,
    canopyCover: '82%',
    description: 'Southern tip of Western Ghats biosphere. Low-frequency natural fires with localized dry ridge hazards.',
    color: '#10b981'
  },
  {
    id: 'FOR-08',
    name: 'Anamalai Tiger Reserve & Valparai Forest',
    category: 'Evergreen, Deciduous & Grassland Mosaic',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    lat: 10.4500,
    lng: 76.9500,
    bounds: [
      [10.28, 76.80],
      [10.62, 77.12]
    ],
    flammability: 'High (Grassland & Tea Fringe Flammability)',
    fireSeason: 'Jan - April',
    areaSqKm: 958,
    canopyCover: '74%',
    description: 'Extensive ecological corridor in the Anamalai Hills. Rapidly spreading grass fires during pre-monsoon winds.',
    color: '#059669'
  }
];
