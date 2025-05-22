#!/usr/bin/env python3
"""
Integrate solar park and sheep farm data for the Ombaa marketplace.
This script combines the processed solar park and sheep farm data
and creates the necessary JavaScript files for the directory interface.
"""

import json
import os
import math
from datetime import datetime

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points in kilometers using the Haversine formula."""
    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    # Radius of Earth in kilometers
    radius = 6371
    
    # Calculate distance
    distance = radius * c
    
    return distance

def find_potential_matches(solar_parks, sheep_farms, max_distance=50):
    """Find potential matches between solar parks and sheep farms based on proximity."""
    matches = []
    
    for park in solar_parks:
        park_matches = []
        park_lat = park.get('coordinates', {}).get('latitude')
        park_lng = park.get('coordinates', {}).get('longitude')
        
        if not park_lat or not park_lng:
            continue
        
        for farm in sheep_farms:
            farm_lat = farm.get('coordinates', {}).get('latitude')
            farm_lng = farm.get('coordinates', {}).get('longitude')
            
            if not farm_lat or not farm_lng:
                continue
            
            distance = calculate_distance(park_lat, park_lng, farm_lat, farm_lng)
            
            if distance <= max_distance:
                park_matches.append({
                    "sheep_farm_id": sheep_farms.index(farm),
                    "sheep_farm_name": farm.get('name'),
                    "distance_km": round(distance, 1)
                })
        
        if park_matches:
            # Sort matches by distance
            park_matches.sort(key=lambda x: x['distance_km'])
            
            matches.append({
                "solar_park_id": solar_parks.index(park),
                "solar_park_name": park.get('name'),
                "country": park.get('country'),
                "region": park.get('region'),
                "potential_matches": park_matches
            })
    
    return matches

def create_integrated_directory_js():
    """Create JavaScript files for the integrated directory."""
    # Load solar park and sheep farm data
    with open('/home/ubuntu/processed_solar_parks_combined.json', 'r', encoding='utf-8') as f:
        solar_parks = json.load(f)
    
    with open('/home/ubuntu/processed_sheep_farms_combined.json', 'r', encoding='utf-8') as f:
        sheep_farms = json.load(f)
    
    # Find potential matches
    matches = find_potential_matches(solar_parks, sheep_farms)
    
    # Create statistics
    stats = {
        "solar_parks_count": len(solar_parks),
        "sheep_farms_count": len(sheep_farms),
        "matches_count": len(matches),
        "countries": {
            "Netherlands": {
                "solar_parks": sum(1 for park in solar_parks if park.get('country') == "Netherlands"),
                "sheep_farms": sum(1 for farm in sheep_farms if farm.get('country') == "Netherlands")
            },
            "United Kingdom": {
                "solar_parks": sum(1 for park in solar_parks if park.get('country') == "United Kingdom"),
                "sheep_farms": sum(1 for farm in sheep_farms if farm.get('country') == "United Kingdom")
            },
            "France": {
                "solar_parks": sum(1 for park in solar_parks if park.get('country') == "France"),
                "sheep_farms": sum(1 for farm in sheep_farms if farm.get('country') == "France")
            },
            "Germany": {
                "solar_parks": sum(1 for park in solar_parks if park.get('country') == "Germany"),
                "sheep_farms": sum(1 for farm in sheep_farms if farm.get('country') == "Germany")
            },
            "Belgium": {
                "solar_parks": sum(1 for park in solar_parks if park.get('country') == "Belgium"),
                "sheep_farms": sum(1 for farm in sheep_farms if farm.get('country') == "Belgium")
            }
        },
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Create JavaScript files
    
    # 1. Solar Parks Data
    with open('/home/ubuntu/ombaa/src/static/js/solar-parks-data.js', 'w', encoding='utf-8') as f:
        f.write("// Solar Parks Data for Ombaa Directory\n")
        f.write("// Generated: " + stats['timestamp'] + "\n\n")
        f.write("const solarParksData = ")
        json.dump(solar_parks, f, indent=2, ensure_ascii=False)
        f.write(";\n\n")
        f.write("export { solarParksData };\n")
    
    # 2. Sheep Farms Data
    with open('/home/ubuntu/ombaa/src/static/js/sheep-farms-data.js', 'w', encoding='utf-8') as f:
        f.write("// Sheep Farms Data for Ombaa Directory\n")
        f.write("// Generated: " + stats['timestamp'] + "\n\n")
        f.write("const sheepFarmsData = ")
        json.dump(sheep_farms, f, indent=2, ensure_ascii=False)
        f.write(";\n\n")
        f.write("export { sheepFarmsData };\n")
    
    # 3. Matches Data
    with open('/home/ubuntu/ombaa/src/static/js/matches-data.js', 'w', encoding='utf-8') as f:
        f.write("// Potential Matches Data for Ombaa Directory\n")
        f.write("// Generated: " + stats['timestamp'] + "\n\n")
        f.write("const matchesData = ")
        json.dump(matches, f, indent=2, ensure_ascii=False)
        f.write(";\n\n")
        f.write("export { matchesData };\n")
    
    # 4. Directory Integration Script
    with open('/home/ubuntu/ombaa/src/static/js/directory-integration.js', 'w', encoding='utf-8') as f:
        f.write("""// Ombaa Directory Integration Script
// Generated: {timestamp}

import {{ solarParksData }} from './solar-parks-data.js';
import {{ sheepFarmsData }} from './sheep-farms-data.js';
import {{ matchesData }} from './matches-data.js';

// Directory Statistics
const directoryStats = {stats};

// Initialize Directory
function initDirectory() {{
  // Populate country filters
  populateCountryFilters();
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize tabs
  showTab('solar-parks');
  
  // Display statistics
  displayStatistics();
}}

// Populate country filters
function populateCountryFilters() {{
  const countries = ['Netherlands', 'United Kingdom', 'France', 'Germany', 'Belgium'];
  const solarParkFilter = document.getElementById('solar-park-country-filter');
  const sheepFarmFilter = document.getElementById('sheep-farm-country-filter');
  
  countries.forEach(country => {{
    const solarCount = directoryStats.countries[country].solar_parks;
    const sheepCount = directoryStats.countries[country].sheep_farms;
    
    if (solarCount > 0) {{
      const option = document.createElement('option');
      option.value = country;
      option.textContent = `${{country}} (${{solarCount}})`;
      solarParkFilter.appendChild(option);
    }}
    
    if (sheepCount > 0) {{
      const option = document.createElement('option');
      option.value = country;
      option.textContent = `${{country}} (${{sheepCount}})`;
      sheepFarmFilter.appendChild(option);
    }}
  }});
}}

// Set up event listeners
function setupEventListeners() {{
  // Tab switching
  document.querySelectorAll('.tab-button').forEach(button => {{
    button.addEventListener('click', () => {{
      const tabId = button.getAttribute('data-tab');
      showTab(tabId);
    }});
  }});
  
  // Filters
  document.getElementById('solar-park-country-filter').addEventListener('change', filterSolarParks);
  document.getElementById('solar-park-region-filter').addEventListener('change', filterSolarParks);
  document.getElementById('solar-park-search').addEventListener('input', filterSolarParks);
  
  document.getElementById('sheep-farm-country-filter').addEventListener('change', filterSheepFarms);
  document.getElementById('sheep-farm-region-filter').addEventListener('change', filterSheepFarms);
  document.getElementById('sheep-farm-search').addEventListener('input', filterSheepFarms);
  
  // Match finder
  document.getElementById('match-finder-button').addEventListener('click', showMatchFinder);
}}

// Show selected tab
function showTab(tabId) {{
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {{
    tab.classList.add('hidden');
  }});
  
  // Show selected tab
  document.getElementById(`${{tabId}}-tab`).classList.remove('hidden');
  
  // Update active tab button
  document.querySelectorAll('.tab-button').forEach(button => {{
    button.classList.remove('bg-green-600', 'text-white');
    button.classList.add('bg-gray-200', 'text-gray-700');
  }});
  
  document.querySelector(`.tab-button[data-tab="${{tabId}}"]`).classList.remove('bg-gray-200', 'text-gray-700');
  document.querySelector(`.tab-button[data-tab="${{tabId}}"]`).classList.add('bg-green-600', 'text-white');
  
  // Load data for the selected tab
  if (tabId === 'solar-parks') {{
    loadSolarParks();
  }} else if (tabId === 'sheep-farms') {{
    loadSheepFarms();
  }} else if (tabId === 'matches') {{
    loadMatches();
  }}
}}

// Load solar parks data
function loadSolarParks() {{
  const container = document.getElementById('solar-parks-container');
  container.innerHTML = '';
  
  solarParksData.forEach((park, index) => {{
    const card = createSolarParkCard(park, index);
    container.appendChild(card);
  }});
  
  // Update region filter based on selected country
  updateRegionFilter('solar-park');
}}

// Create solar park card
function createSolarParkCard(park, index) {{
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-md overflow-hidden mb-4';
  card.setAttribute('data-id', index);
  card.setAttribute('data-country', park.country);
  card.setAttribute('data-region', park.region || '');
  
  // Find potential matches
  const parkMatches = matchesData.find(m => m.solar_park_id === index);
  const matchCount = parkMatches ? parkMatches.potential_matches.length : 0;
  
  card.innerHTML = `
    <div class="p-4">
      <div class="flex justify-between items-start">
        <h3 class="text-xl font-bold mb-2">${{park.name}}</h3>
        <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">${{park.country}}</span>
      </div>
      <p class="text-gray-700 mb-2">${{park.location}}</p>
      <div class="flex flex-wrap gap-2 mb-3">
        <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">${{park.region || 'Region not specified'}}</span>
        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">${{park.total_hectares || '?'}} hectares</span>
        <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">${{park.vegetation_type || 'Mixed vegetation'}}</span>
      </div>
      <div class="flex justify-between items-center">
        <div>
          <span class="text-sm text-gray-500">${{matchCount}} potential shepherd matches</span>
        </div>
        <button class="view-matches-btn text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2" 
                data-id="${{index}}" onclick="viewSolarParkMatches(${{index}})">
          View Matches
        </button>
      </div>
    </div>
  `;
  
  return card;
}}

// Load sheep farms data
function loadSheepFarms() {{
  const container = document.getElementById('sheep-farms-container');
  container.innerHTML = '';
  
  sheepFarmsData.forEach((farm, index) => {{
    const card = createSheepFarmCard(farm, index);
    container.appendChild(card);
  }});
  
  // Update region filter based on selected country
  updateRegionFilter('sheep-farm');
}}

// Create sheep farm card
function createSheepFarmCard(farm, index) {{
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-md overflow-hidden mb-4';
  card.setAttribute('data-id', index);
  card.setAttribute('data-country', farm.country);
  card.setAttribute('data-region', farm.region || '');
  
  // Count solar parks that match with this farm
  const matchCount = matchesData.filter(m => 
    m.potential_matches.some(pm => pm.sheep_farm_id === index)
  ).length;
  
  card.innerHTML = `
    <div class="p-4">
      <div class="flex justify-between items-start">
        <h3 class="text-xl font-bold mb-2">${{farm.name}}</h3>
        <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">${{farm.country}}</span>
      </div>
      <p class="text-gray-700 mb-2">${{farm.location}}</p>
      <div class="flex flex-wrap gap-2 mb-3">
        <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">${{farm.region || 'Region not specified'}}</span>
        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">${{farm.flock_size}} sheep</span>
        <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">${{farm.breed}}</span>
        <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">${{farm.grazing_type}}</span>
      </div>
      <div class="flex justify-between items-center">
        <div>
          <span class="text-sm text-gray-500">${{matchCount}} potential solar park matches</span>
        </div>
        <button class="view-matches-btn text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2" 
                data-id="${{index}}" onclick="viewSheepFarmMatches(${{index}})">
          View Matches
        </button>
      </div>
    </div>
  `;
  
  return card;
}}

// Load matches data
function loadMatches() {{
  const container = document.getElementById('matches-container');
  container.innerHTML = '';
  
  if (matchesData.length === 0) {{
    container.innerHTML = '<p class="text-center text-gray-500 my-8">No potential matches found.</p>';
    return;
  }}
  
  matchesData.forEach(match => {{
    const card = createMatchCard(match);
    container.appendChild(card);
  }});
}}

// Create match card
function createMatchCard(match) {{
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-md overflow-hidden mb-4';
  
  const solarPark = solarParksData[match.solar_park_id];
  
  let matchesHtml = '';
  match.potential_matches.forEach(potentialMatch => {{
    const sheepFarm = sheepFarmsData[potentialMatch.sheep_farm_id];
    matchesHtml += `
      <div class="border-t border-gray-200 p-4">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-semibold">${{sheepFarm.name}}</h4>
            <p class="text-sm text-gray-600">${{sheepFarm.location}}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">${{sheepFarm.flock_size}} sheep</span>
              <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">${{sheepFarm.breed}}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">${{potentialMatch.distance_km}} km</span>
            <button class="mt-2 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-xs px-3 py-1.5" 
                    onclick="initiateContact(${{match.solar_park_id}}, ${{potentialMatch.sheep_farm_id}})">
              Contact
            </button>
          </div>
        </div>
      </div>
    `;
  }});
  
  card.innerHTML = `
    <div class="p-4
(Content truncated due to size limit. Use line ranges to read in chunks)
