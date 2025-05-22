#!/usr/bin/env python3
"""
Process Apify-scraped solar park data for the Ombaa directory.
This script converts the raw Google Maps data for German solar parks into a structured format
suitable for the Ombaa directory database.
"""

import json
import os
import re

def extract_hectares_from_text(text):
    """Extract hectare information from text if available."""
    if not text:
        return None
    
    # Look for patterns like "X ha", "X Hektar", "X Hektaren"
    patterns = [
        r'(\d+[\.,]?\d*)\s*ha\b',
        r'(\d+[\.,]?\d*)\s*hektar[en]?\b',
        r'(\d+[\.,]?\d*)\s*hectare[s]?\b'
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
        "gras": "Grass",
        "wiese": "Meadow",
        "weide": "Pasture",
        "schaf": "Sheep grazing",
        "blumen": "Wild flowers",
        "wildblumen": "Wild flowers",
        "kräuter": "Herbs and wildflowers",
        "biodiversität": "Biodiversity mix"
    }
    
    text_lower = text.lower()
    for keyword, veg_type in vegetation_keywords.items():
        if keyword in text_lower:
            return veg_type
    
    return "Mixed grass"  # Default value

def extract_region_from_address(address, city):
    """Extract region information from address."""
    # German federal states (Bundesländer)
    regions = {
        "Baden-Württemberg": ["baden-württemberg", "baden-wurttemberg", "baden württemberg", "baden wurttemberg", "stuttgart", "karlsruhe", "freiburg", "tübingen", "tubingen"],
        "Bayern": ["bayern", "bavaria", "münchen", "munchen", "nürnberg", "nurnberg", "augsburg", "regensburg", "würzburg", "wurzburg", "ingolstadt"],
        "Berlin": ["berlin"],
        "Brandenburg": ["brandenburg", "potsdam", "cottbus", "frankfurt an der oder"],
        "Bremen": ["bremen", "bremerhaven"],
        "Hamburg": ["hamburg"],
        "Hessen": ["hessen", "hesse", "wiesbaden", "frankfurt am main", "kassel", "darmstadt"],
        "Mecklenburg-Vorpommern": ["mecklenburg-vorpommern", "mecklenburg vorpommern", "schwerin", "rostock", "neubrandenburg", "stralsund"],
        "Niedersachsen": ["niedersachsen", "lower saxony", "hannover", "braunschweig", "osnabrück", "osnabruck", "oldenburg", "göttingen", "gottingen"],
        "Nordrhein-Westfalen": ["nordrhein-westfalen", "north rhine-westphalia", "düsseldorf", "dusseldorf", "köln", "koln", "cologne", "dortmund", "essen", "duisburg", "bochum", "wuppertal", "bonn", "münster", "munster"],
        "Rheinland-Pfalz": ["rheinland-pfalz", "rhineland-palatinate", "mainz", "ludwigshafen", "koblenz", "trier", "kaiserslautern"],
        "Saarland": ["saarland", "saarbrücken", "saarbrucken"],
        "Sachsen": ["sachsen", "saxony", "dresden", "leipzig", "chemnitz", "zwickau"],
        "Sachsen-Anhalt": ["sachsen-anhalt", "saxony-anhalt", "magdeburg", "halle", "dessau-roßlau", "dessau-rosslau"],
        "Schleswig-Holstein": ["schleswig-holstein", "kiel", "lübeck", "lubeck", "flensburg", "neumünster", "neumunster"],
        "Thüringen": ["thüringen", "thuringen", "thuringia", "erfurt", "jena", "gera", "weimar"]
    }
    
    if not address and not city:
        return ""
    
    search_text = (address or "").lower() + " " + (city or "").lower()
    
    # Try to find region in address
    for region, keywords in regions.items():
        for keyword in keywords:
            if keyword in search_text:
                return region
    
    # Extract postal code and map to region
    if address:
        # German postal code to region mapping
        postal_match = re.search(r'(\d{5})', address)
        if postal_match:
            postal_code = postal_match.group(1)
            first_digit = postal_code[0]
            
            # Map postal code first digit to region
            postal_to_region = {
                "0": "Sachsen, Thüringen, Sachsen-Anhalt",
                "1": "Berlin, Brandenburg",
                "2": "Hamburg, Mecklenburg-Vorpommern, Schleswig-Holstein",
                "3": "Niedersachsen, Bremen",
                "4": "Niedersachsen, Bremen",
                "5": "Nordrhein-Westfalen",
                "6": "Hessen, Saarland",
                "7": "Baden-Württemberg",
                "8": "Bayern",
                "9": "Bayern"
            }
            
            if first_digit in postal_to_region:
                # For postal codes that could be in multiple regions, try to narrow down
                possible_regions = postal_to_region[first_digit].split(", ")
                if len(possible_regions) == 1:
                    return possible_regions[0]
                else:
                    # Try to narrow down by looking for region names in the address
                    for region in possible_regions:
                        region_keywords = regions.get(region, [])
                        for keyword in region_keywords:
                            if keyword in search_text:
                                return region
                    
                    # If still not found, return the first possible region
                    return possible_regions[0]
    
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
        solar_keywords = ['solar', 'photovoltaik', 'pv', 'sonnen', 'erneuerbare energie']
        park_keywords = ['park', 'anlage', 'farm', 'feld', 'kraftwerk']
        
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
            hectares = 22.0  # Average size for German solar parks
        
        # Extract vegetation type
        vegetation_type = extract_vegetation_type(description)
        
        # Extract region
        region = extract_region_from_address(item.get('address', ''), item.get('city', ''))
        
        # Create processed entry
        processed_entry = {
            "name": item.get('title', ''),
            "location": item.get('address', ''),
            "country": "Germany",
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
    input_file = "/home/ubuntu/upload/GE dataset_crawler-google-places_2025-05-20_09-11-05-042.json"
    output_file = "/home/ubuntu/processed_solar_parks_germany.json"
    
    count = process_solar_parks(input_file, output_file)
    print(f"Processed {count} solar parks in Germany. Output saved to {output_file}")
