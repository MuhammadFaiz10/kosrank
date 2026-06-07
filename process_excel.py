import pandas as pd
import json
import random
import re

# Load both excels
df1 = pd.read_excel('Devox.xlsx')
df2 = pd.read_excel('Devox (1).xlsx')

# Verify index-wise alignment of room names
for i in range(len(df1)):
    name1 = str(df1.loc[i, 'room_name']).strip()
    name2 = str(df2.loc[i, 'room_name']).strip()
    assert name1 == name2, f"Mismatch at index {i}: '{name1}' vs '{name2}'"

# Create merged dataframe by copying df1 and adding C6 Access Transportation
df = df1.copy()
df['Akses Transportasi'] = df2['Akses Transportasi']

# Coordinates mapping for sub-districts in Depok
# BSI Margonda is at lat: -6.3685, lng: 106.8335
coordinates_mapping = {
    'beji': (-6.3685, 106.8335, 1.5), # Center Beji, ~1.5km max offset
    'pancoran mas': (-6.395, 106.820, 2.0), # Pancoran Mas, ~4km away
    'cimanggis': (-6.360, 106.875, 2.0), # Cimanggis, ~5-6km away
    'sukmajaya': (-6.395, 106.845, 2.0), # Sukmajaya, ~4-5km away
    'limo': (-6.385, 106.775, 2.0), # Limo, ~8-9km away
    'cinere': (-6.345, 106.782, 2.0), # Cinere, ~11-12km away
    'tapos': (-6.415, 106.875, 2.5), # Tapos, ~12-13km away
    'sawangan': (-6.405, 106.775, 2.5), # Sawangan, ~14km away
    'bojongsari': (-6.415, 106.745, 2.5), # Bojongsari, ~16-17km away
    'cilodong': (-6.435, 106.845, 2.5), # Cilodong, ~12-13km away
    'cipayung': (-6.425, 106.805, 2.5), # Cipayung, ~11km away
}

def get_coordinates(location_str):
    loc_lower = str(location_str).lower()
    
    # Match sub-district
    matched_key = 'beji' # Default fallback
    for key in coordinates_mapping:
        if key in loc_lower:
            matched_key = key
            break
            
    lat_center, lng_center, max_offset_km = coordinates_mapping[matched_key]
    
    # 1 degree of lat/lng is approx 111 km.
    # Convert max_offset_km to degrees.
    offset_degree = max_offset_km / 111.0
    
    # Generate a random offset in lat and lng
    lat_offset = random.uniform(-offset_degree, offset_degree)
    lng_offset = random.uniform(-offset_degree, offset_degree)
    
    return lat_center + lat_offset, lng_center + lng_offset

results = []
seen_slugs = set()

for idx, row in df.iterrows():
    # Clean gender type
    gender_map = {
        'Kos Campur': 'CAMPUR',
        'Kos Putri': 'PUTRI',
        'Kos Putra': 'PUTRA'
    }
    gender = gender_map.get(row['tipe_kos'], 'CAMPUR')
    
    # Clean price
    price_str = re.sub(r'[^0-9]', '', str(row['price']))
    price = int(price_str) if price_str else 0
    
    # Clean room size
    room_size = str(row['room_size']).strip()
    if not room_size or room_size == 'nan':
        room_size = '3x3 m' # default fallback
        
    # Generate coordinates
    lat, lng = get_coordinates(row['location'])
    
    # Parse facilities
    facilities_raw = str(row['all_facilities_bs']).split(';')
    facilities = []
    for f in facilities_raw:
        f_clean = f.strip()
        if f_clean and f_clean != 'nan' and not re.match(r'^[0-9.]+\s*x\s*[0-9.]+', f_clean, re.I):
            facilities.append(f_clean)
            
    # Access Transportasi
    transit = str(row['Akses Transportasi']).strip()
    if not transit or transit == 'nan':
        transit = 'Ojek online/kendaraan pribadi'
        
    # Create unique slug
    base_slug = re.sub(r'[^a-z0-9]+', '-', str(row['room_name']).lower()).strip('-')
    slug = base_slug
    counter = 1
    while slug in seen_slugs:
        slug = f"{base_slug}-{counter}"
        counter += 1
    seen_slugs.add(slug)
    
    # Description: use facilities or generic
    description = f"Kost nyaman di daerah {row['location']}, Depok. Tipe {row['tipe_kos']} dengan berbagai fasilitas pendukung terbaik."
    
    results.append({
        'name': str(row['room_name']).strip(),
        'slug': slug,
        'description': description,
        'price': price,
        'roomSize': room_size,
        'address': f"{row['location']}, Depok, Jawa Barat",
        'campus': 'BSI Margonda',
        'genderType': gender,
        'phone': '08123456789',
        'transit': transit,
        'latitude': float(round(lat, 6)),
        'longitude': float(round(lng, 6)),
        'facilities': list(set(facilities)),
        'image': str(row['url']) if 'url' in row and str(row['url']).startswith('http') else None
    })

# Write to JSON
with open('Devox_merged.json', 'w') as f:
    json.dump(results, f, indent=2)

print(f"Successfully merged and converted {len(results)} kos entries to Devox_merged.json")
