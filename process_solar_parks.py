#!/usr/bin/env python3
"""
Process Apify-scraped solar park data for the Ombaa directory.
This script converts the raw Google Maps data into a structured format
suitable for the Ombaa directory database.
"""

import json
import os
import re

def extract_hectares_from_text(text):
    """Extract hectare information from text if available."""
    if not text:
        return None
    
    # Look for patterns like "X ha", "X hectare", "X hectares"
    patterns = [
        r'(\d+[\.,]?\d*)\s*ha\b',
        r'(\d+[\.,]?\d*)\s*hectare[s]?\b',
        r'(\d+[\.,]?\d*)\s*hectaren\b'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return float(match.group(1).replace(',', '.'))
    
    return None

def extract_vegetation_type(text):
    """Extract vegetation type information if available."""
    if not text:
        return "Mixed grass"  # Default value
    
    vegetation_keywords = {
        "grass": "Grass",
        "gras": "Grass",
        "meadow": "Meadow",
        "weide": "Meadow",
        "wild": "Wild flowers",
        "bloem": "Wild flowers",
        "flower": "Wild flowers",
        "herb": "Herbs and wildflowers",
        "kruid": "Herbs and wildflowers"
    }
    
    text_lower = text.lower()
    for keyword, veg_type in vegetation_keywords.items():
        if keyword in text_lower:
            return veg_type
    
    return "Mixed grass"  # Default value

def extract_region_from_address(address, city):
    """Extract region information from address."""
    # Dutch provinces
    provinces = {
        "Groningen": ["groningen"],
        "Friesland": ["friesland", "fryslân", "fryslan"],
        "Drenthe": ["drenthe"],
        "Overijssel": ["overijssel"],
        "Flevoland": ["flevoland"],
        "Gelderland": ["gelderland"],
        "Utrecht": ["utrecht"],
        "Noord-Holland": ["noord-holland", "noord holland", "north holland"],
        "Zuid-Holland": ["zuid-holland", "zuid holland", "south holland"],
        "Zeeland": ["zeeland"],
        "Noord-Brabant": ["noord-brabant", "noord brabant", "north brabant"],
        "Limburg": ["limburg"]
    }
    
    if not address:
        return ""
    
    address_lower = address.lower()
    
    # Try to find province in address
    for province, keywords in provinces.items():
        for keyword in keywords:
            if keyword in address_lower:
                return province
    
    # Some city-to-province mappings for common cities
    city_to_province = {
        "amsterdam": "Noord-Holland",
        "rotterdam": "Zuid-Holland",
        "den haag": "Zuid-Holland",
        "utrecht": "Utrecht",
        "eindhoven": "Noord-Brabant",
        "groningen": "Groningen",
        "tilburg": "Noord-Brabant",
        "almere": "Flevoland",
        "breda": "Noord-Brabant",
        "nijmegen": "Gelderland",
        "enschede": "Overijssel",
        "apeldoorn": "Gelderland",
        "haarlem": "Noord-Holland",
        "arnhem": "Gelderland",
        "zaanstad": "Noord-Holland",
        "amersfoort": "Utrecht",
        "haarlemmermeer": "Noord-Holland",
        "zwolle": "Overijssel",
        "zoetermeer": "Zuid-Holland",
        "leiden": "Zuid-Holland",
        "maastricht": "Limburg",
        "dordrecht": "Zuid-Holland",
        "ede": "Gelderland",
        "leeuwarden": "Friesland",
        "almelo": "Overijssel",
        "delft": "Zuid-Holland",
        "venlo": "Limburg",
        "deventer": "Overijssel",
        "sittard": "Limburg",
        "roermond": "Limburg"
    }
    
    if city and city.lower() in city_to_province:
        return city_to_province[city.lower()]
    
    return ""  # Return empty string if no region found

def process_solar_parks(input_file, output_file):
    """Process solar park data from Apify and convert to Ombaa format."""
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    processed_data = []
    
    for item in data:
        # Skip entries that don't look like solar parks
        title = item.get('title', '').lower()
        categories = [cat.lower() for cat in item.get('categories', [])]
        
        # Check if this is likely a solar park
        is_solar_park = False
        solar_keywords = ['solar', 'zon', 'zonne', 'pv', 'photovoltaic', 'fotovoltaïsche']
        park_keywords = ['park', 'veld', 'field', 'farm', 'centrale', 'plant']
        
        for solar_kw in solar_keywords:
            if solar_kw in title:
                for park_kw in park_keywords:
                    if park_kw in title:
                        is_solar_park = True
                        break
        
        # Also check categories
        for category in categories:
            for solar_kw in solar_keywords:
                if solar_kw in category:
                    is_solar_park = True
                    break
        
        if not is_solar_park:
            continue
        
        # Extract description from reviews if available
        description = ""
        if item.get('reviews'):
            for review in item['reviews']:
                if review.get('text') and len(review.get('text', '')) > len(description):
                    description = review.get('text', '')
        
        # Extract hectares from description or default to None
        hectares = extract_hectares_from_text(description)
        if not hectares and item.get('description'):
            hectares = extract_hectares_from_text(item['description'])
        
        # If no hectares found, make an estimate based on the name
        if not hectares:
            # Solar parks are often named with their capacity
            capacity_match = re.search(r'(\d+[\.,]?\d*)\s*[mM][wW]', title)
            if capacity_match:
                # Rough estimate: 1 MW ≈ 1-2 hectares
                mw = float(capacity_match.group(1).replace(',', '.'))
                hectares = mw * 1.5
        
        # If still no hectares, provide a default range
        if not hectares:
            hectares = 15.0  # Average size
        
        # Extract vegetation type
        vegetation_type = extract_vegetation_type(description)
        
        # Extract region
        region = extract_region_from_address(item.get('address', ''), item.get('city', ''))
        
        # Create processed entry
        processed_entry = {
            "name": item.get('title', ''),
            "location": item.get('address', ''),
            "country": "Netherlands",
            "region": region,
            "total_hectares": hectares,
            "vegetation_type": vegetation_type,
            "contact_email": "",  # Not available in the data
            "contact_phone": item.get('phone', ''),
            "website": item.get('website', ''),
            "coordinates": {
                "latitude": item.get('location', {}).get('lat'),
                "longitude": item.get('location', {}).get('lng')
            }
        }
        
        processed_data.append(processed_entry)
    
    # Write processed data to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, indent=2, ensure_ascii=False)
    
    return len(processed_data)

if __name__ == "__main__":
    input_file = "/home/ubuntu/upload/dataset_crawler-google-places_2025-05-20_08-52-55-349.json"
    output_file = "/home/ubuntu/processed_solar_parks.json"
    
    count = process_solar_parks(input_file, output_file)
    print(f"Processed {count} solar parks. Output saved to {output_file}")
