#!/usr/bin/env python3
"""
Process Apify-scraped solar park data for the Ombaa directory.
This script converts the raw Google Maps data for French solar parks into a structured format
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
        "herbe": "Grass",
        "prairie": "Meadow",
        "pâturage": "Pasture",
        "fleur": "Wild flowers",
        "sauvage": "Wild flowers",
        "herb": "Herbs and wildflowers",
        "végétation": "Mixed vegetation"
    }
    
    text_lower = text.lower()
    for keyword, veg_type in vegetation_keywords.items():
        if keyword in text_lower:
            return veg_type
    
    return "Mixed grass"  # Default value

def extract_region_from_address(address, city):
    """Extract region information from address."""
    # French regions
    regions = {
        "Auvergne-Rhône-Alpes": ["auvergne", "rhône", "rhone", "alpes", "ain", "allier", "ardèche", "ardeche", "cantal", "drôme", "drome", "isère", "isere", "loire", "haute-loire", "puy-de-dôme", "puy de dome", "rhône", "rhone", "savoie", "haute-savoie"],
        "Bourgogne-Franche-Comté": ["bourgogne", "franche", "comté", "comte", "côte-d'or", "cote d'or", "doubs", "jura", "nièvre", "nievre", "haute-saône", "haute saone", "saône-et-loire", "saone et loire", "yonne", "territoire de belfort"],
        "Bretagne": ["bretagne", "côtes-d'armor", "cotes d'armor", "finistère", "finistere", "ille-et-vilaine", "morbihan"],
        "Centre-Val de Loire": ["centre", "val de loire", "cher", "eure-et-loir", "indre", "indre-et-loire", "loir-et-cher", "loiret"],
        "Corse": ["corse", "haute-corse", "corse-du-sud"],
        "Grand Est": ["grand est", "alsace", "champagne", "ardenne", "lorraine", "ardennes", "aube", "marne", "haute-marne", "meurthe-et-moselle", "meuse", "moselle", "bas-rhin", "haut-rhin", "vosges"],
        "Hauts-de-France": ["hauts-de-france", "hauts de france", "aisne", "nord", "oise", "pas-de-calais", "pas de calais", "somme"],
        "Île-de-France": ["île-de-france", "ile de france", "paris", "seine-et-marne", "yvelines", "essonne", "hauts-de-seine", "seine-saint-denis", "val-de-marne", "val-d'oise", "val d'oise"],
        "Normandie": ["normandie", "calvados", "eure", "manche", "orne", "seine-maritime"],
        "Nouvelle-Aquitaine": ["nouvelle-aquitaine", "nouvelle aquitaine", "charente", "charente-maritime", "corrèze", "correze", "creuse", "dordogne", "gironde", "landes", "lot-et-garonne", "pyrénées-atlantiques", "pyrenees atlantiques", "deux-sèvres", "deux sevres", "vienne", "haute-vienne"],
        "Occitanie": ["occitanie", "ariège", "ariege", "aude", "aveyron", "gard", "haute-garonne", "gers", "hérault", "herault", "lot", "lozère", "lozere", "hautes-pyrénées", "hautes pyrenees", "pyrénées-orientales", "pyrenees orientales", "tarn", "tarn-et-garonne"],
        "Pays de la Loire": ["pays de la loire", "loire-atlantique", "maine-et-loire", "mayenne", "sarthe", "vendée", "vendee"],
        "Provence-Alpes-Côte d'Azur": ["provence", "alpes", "côte d'azur", "cote d'azur", "alpes-de-haute-provence", "hautes-alpes", "alpes-maritimes", "bouches-du-rhône", "bouches du rhone", "var", "vaucluse"]
    }
    
    if not address and not city:
        return ""
    
    search_text = (address or "").lower() + " " + (city or "").lower()
    
    # Try to find region in address
    for region, keywords in regions.items():
        for keyword in keywords:
            if keyword in search_text:
                return region
    
    # Some city-to-region mappings for common cities
    city_to_region = {
        "paris": "Île-de-France",
        "marseille": "Provence-Alpes-Côte d'Azur",
        "lyon": "Auvergne-Rhône-Alpes",
        "toulouse": "Occitanie",
        "nice": "Provence-Alpes-Côte d'Azur",
        "nantes": "Pays de la Loire",
        "strasbourg": "Grand Est",
        "montpellier": "Occitanie",
        "bordeaux": "Nouvelle-Aquitaine",
        "lille": "Hauts-de-France",
        "rennes": "Bretagne",
        "reims": "Grand Est",
        "toulon": "Provence-Alpes-Côte d'Azur",
        "grenoble": "Auvergne-Rhône-Alpes",
        "dijon": "Bourgogne-Franche-Comté",
        "angers": "Pays de la Loire",
        "nîmes": "Occitanie",
        "villeurbanne": "Auvergne-Rhône-Alpes"
    }
    
    if city and city.lower() in city_to_region:
        return city_to_region[city.lower()]
    
    # Extract department code from postal code and map to region
    if address:
        postal_match = re.search(r'(\d{5})', address)
        if postal_match:
            dept_code = postal_match.group(1)[:2]
            
            # Map department codes to regions
            dept_to_region = {
                "01": "Auvergne-Rhône-Alpes", "03": "Auvergne-Rhône-Alpes", "07": "Auvergne-Rhône-Alpes", 
                "15": "Auvergne-Rhône-Alpes", "26": "Auvergne-Rhône-Alpes", "38": "Auvergne-Rhône-Alpes", 
                "42": "Auvergne-Rhône-Alpes", "43": "Auvergne-Rhône-Alpes", "63": "Auvergne-Rhône-Alpes", 
                "69": "Auvergne-Rhône-Alpes", "73": "Auvergne-Rhône-Alpes", "74": "Auvergne-Rhône-Alpes",
                "21": "Bourgogne-Franche-Comté", "25": "Bourgogne-Franche-Comté", "39": "Bourgogne-Franche-Comté", 
                "58": "Bourgogne-Franche-Comté", "70": "Bourgogne-Franche-Comté", "71": "Bourgogne-Franche-Comté", 
                "89": "Bourgogne-Franche-Comté", "90": "Bourgogne-Franche-Comté",
                "22": "Bretagne", "29": "Bretagne", "35": "Bretagne", "56": "Bretagne",
                "18": "Centre-Val de Loire", "28": "Centre-Val de Loire", "36": "Centre-Val de Loire", 
                "37": "Centre-Val de Loire", "41": "Centre-Val de Loire", "45": "Centre-Val de Loire",
                "2A": "Corse", "2B": "Corse", "20": "Corse",
                "08": "Grand Est", "10": "Grand Est", "51": "Grand Est", "52": "Grand Est", 
                "54": "Grand Est", "55": "Grand Est", "57": "Grand Est", "67": "Grand Est", 
                "68": "Grand Est", "88": "Grand Est",
                "02": "Hauts-de-France", "59": "Hauts-de-France", "60": "Hauts-de-France", 
                "62": "Hauts-de-France", "80": "Hauts-de-France",
                "75": "Île-de-France", "77": "Île-de-France", "78": "Île-de-France", "91": "Île-de-France", 
                "92": "Île-de-France", "93": "Île-de-France", "94": "Île-de-France", "95": "Île-de-France",
                "14": "Normandie", "27": "Normandie", "50": "Normandie", "61": "Normandie", "76": "Normandie",
                "16": "Nouvelle-Aquitaine", "17": "Nouvelle-Aquitaine", "19": "Nouvelle-Aquitaine", 
                "23": "Nouvelle-Aquitaine", "24": "Nouvelle-Aquitaine", "33": "Nouvelle-Aquitaine", 
                "40": "Nouvelle-Aquitaine", "47": "Nouvelle-Aquitaine", "64": "Nouvelle-Aquitaine", 
                "79": "Nouvelle-Aquitaine", "86": "Nouvelle-Aquitaine", "87": "Nouvelle-Aquitaine",
                "09": "Occitanie", "11": "Occitanie", "12": "Occitanie", "30": "Occitanie", 
                "31": "Occitanie", "32": "Occitanie", "34": "Occitanie", "46": "Occitanie", 
                "48": "Occitanie", "65": "Occitanie", "66": "Occitanie", "81": "Occitanie", "82": "Occitanie",
                "44": "Pays de la Loire", "49": "Pays de la Loire", "53": "Pays de la Loire", 
                "72": "Pays de la Loire", "85": "Pays de la Loire",
                "04": "Provence-Alpes-Côte d'Azur", "05": "Provence-Alpes-Côte d'Azur", 
                "06": "Provence-Alpes-Côte d'Azur", "13": "Provence-Alpes-Côte d'Azur", 
                "83": "Provence-Alpes-Côte d'Azur", "84": "Provence-Alpes-Côte d'Azur"
            }
            
            if dept_code in dept_to_region:
                return dept_to_region[dept_code]
    
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
        solar_keywords = ['solar', 'solaire', 'photovoltaïque', 'photovoltaique', 'pv']
        park_keywords = ['parc', 'centrale', 'ferme', 'installation', 'plant', 'farm']
        
        for solar_kw in solar_keywords:
            if solar_kw in title:
                for park_kw in park_keywords:
                    if park_kw in title:
                        is_solar_park = True
                        break
                if 'flottante' in title or 'flottant' in title:  # Floating solar specific check
                    is_solar_park = True
        
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
            hectares = 20.0  # Average size for French solar parks
        
        # Extract vegetation type
        vegetation_type = extract_vegetation_type(description)
        
        # Extract region
        region = extract_region_from_address(item.get('address', ''), item.get('city', ''))
        
        # Create processed entry
        processed_entry = {
            "name": item.get('title', ''),
            "location": item.get('address', ''),
            "country": "France",
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
    input_file = "/home/ubuntu/upload/France dataset_crawler-google-places_2025-05-20_08-59-22-073.json"
    output_file = "/home/ubuntu/processed_solar_parks_france.json"
    
    count = process_solar_parks(input_file, output_file)
    print(f"Processed {count} solar parks in France. Output saved to {output_file}")
