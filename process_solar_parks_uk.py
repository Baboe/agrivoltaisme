#!/usr/bin/env python3
"""
Process Apify-scraped solar park data for the Ombaa directory.
This script converts the raw Google Maps data for UK solar parks into a structured format
suitable for the Ombaa directory database.
"""

import json
import os
import re

def extract_hectares_from_text(text):
    """Extract hectare information from text if available."""
    if not text:
        return None
    
    # Look for patterns like "X ha", "X hectare", "X hectares", "X acres"
    patterns = [
        r'(\d+[\.,]?\d*)\s*ha\b',
        r'(\d+[\.,]?\d*)\s*hectare[s]?\b',
        r'(\d+[\.,]?\d*)\s*acre[s]?\b'  # Convert acres to hectares later
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            value = float(match.group(1).replace(',', '.'))
            # Convert acres to hectares if needed
            if 'acre' in pattern:
                value = value * 0.404686  # 1 acre = 0.404686 hectares
            return value
    
    return None

def extract_vegetation_type(text):
    """Extract vegetation type information if available."""
    if not text:
        return "Mixed grass"  # Default value
    
    vegetation_keywords = {
        "grass": "Grass",
        "meadow": "Meadow",
        "pasture": "Pasture",
        "sheep": "Sheep grazing",
        "wild flower": "Wild flowers",
        "wildflower": "Wild flowers",
        "herb": "Herbs and wildflowers",
        "biodiversity": "Biodiversity mix"
    }
    
    text_lower = text.lower()
    for keyword, veg_type in vegetation_keywords.items():
        if keyword in text_lower:
            return veg_type
    
    return "Mixed grass"  # Default value

def extract_region_from_address(address, city):
    """Extract region information from address."""
    # UK regions/countries
    regions = {
        "England": [
            "london", "manchester", "birmingham", "leeds", "liverpool", "newcastle", "sheffield", 
            "bristol", "nottingham", "leicester", "coventry", "bradford", "oxford", "cambridge",
            "norfolk", "suffolk", "essex", "kent", "surrey", "sussex", "hampshire", "dorset", 
            "devon", "cornwall", "somerset", "wiltshire", "gloucestershire", "oxfordshire", 
            "buckinghamshire", "berkshire", "hertfordshire", "bedfordshire", "cambridgeshire", 
            "northamptonshire", "warwickshire", "worcestershire", "herefordshire", "shropshire", 
            "staffordshire", "derbyshire", "nottinghamshire", "lincolnshire", "leicestershire", 
            "rutland", "northumberland", "durham", "cumbria", "lancashire", "yorkshire", "cheshire"
        ],
        "Scotland": [
            "edinburgh", "glasgow", "aberdeen", "dundee", "inverness", "stirling", "perth",
            "highlands", "grampian", "strathclyde", "lothian", "borders", "fife", "tayside",
            "aberdeenshire", "angus", "argyll", "ayrshire", "banffshire", "berwickshire",
            "caithness", "clackmannanshire", "dumfriesshire", "dunbartonshire", "east lothian",
            "fife", "inverness-shire", "kincardineshire", "kinross-shire", "kirkcudbrightshire",
            "lanarkshire", "midlothian", "moray", "nairnshire", "orkney", "peeblesshire",
            "perthshire", "renfrewshire", "ross-shire", "roxburghshire", "selkirkshire",
            "shetland", "stirlingshire", "sutherland", "west lothian", "wigtownshire"
        ],
        "Wales": [
            "cardiff", "swansea", "newport", "bangor", "wrexham", "aberystwyth",
            "anglesey", "brecknockshire", "caernarfonshire", "cardiganshire", "carmarthenshire",
            "denbighshire", "flintshire", "glamorgan", "merionethshire", "monmouthshire",
            "montgomeryshire", "pembrokeshire", "radnorshire", "gwynedd", "clwyd", "dyfed",
            "powys", "gwent", "mid glamorgan", "south glamorgan", "west glamorgan"
        ],
        "Northern Ireland": [
            "belfast", "derry", "lisburn", "newry", "armagh", "bangor", "antrim", "down",
            "fermanagh", "londonderry", "tyrone", "county antrim", "county armagh", "county down",
            "county fermanagh", "county londonderry", "county tyrone"
        ]
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
        # UK postal code first letters to region mapping
        postal_to_region = {
            "England": ["B", "BA", "BB", "BD", "BH", "BL", "BN", "BR", "BS", "CA", "CB", "CH", "CM", "CO", "CR", 
                       "CV", "CW", "DA", "DE", "DH", "DL", "DN", "DT", "DY", "E", "EC", "EN", "EX", "FY", "GL", 
                       "GU", "HA", "HD", "HG", "HP", "HR", "HU", "HX", "IG", "IP", "KT", "L", "LA", "LE", "LN", 
                       "LS", "LU", "M", "ME", "MK", "N", "NE", "NG", "NN", "NP", "NR", "NW", "OL", "OX", "PE", 
                       "PL", "PO", "PR", "RG", "RH", "RM", "S", "SE", "SG", "SK", "SL", "SM", "SN", "SO", "SP", 
                       "SR", "SS", "ST", "SW", "SY", "TA", "TF", "TN", "TQ", "TR", "TS", "TW", "UB", "W", "WA", 
                       "WC", "WD", "WF", "WN", "WR", "WS", "WV", "YO"],
            "Scotland": ["AB", "DD", "DG", "EH", "FK", "G", "HS", "IV", "KA", "KW", "KY", "ML", "PA", "PH", "TD", "ZE"],
            "Wales": ["CF", "LD", "LL", "NP", "SA"],
            "Northern Ireland": ["BT"]
        }
        
        # Try to extract postal code
        postal_match = re.search(r'([A-Z]{1,2}\d{1,2}[A-Z]?)', address, re.IGNORECASE)
        if postal_match:
            postal_prefix = postal_match.group(1)[:2].upper()  # Take first two characters
            
            for region, prefixes in postal_to_region.items():
                if any(postal_prefix.startswith(prefix) for prefix in prefixes):
                    return region
            
            # If only first character matches
            postal_prefix_first = postal_prefix[0]
            for region, prefixes in postal_to_region.items():
                if any(postal_prefix_first == prefix for prefix in prefixes):
                    return region
    
    return "England"  # Default to England if no region found

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
        solar_keywords = ['solar', 'photovoltaic', 'pv', 'renewable', 'energy']
        park_keywords = ['park', 'farm', 'field', 'plant', 'installation', 'array']
        
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
            hectares = 25.0  # Average size for UK solar parks
        
        # Extract vegetation type
        vegetation_type = extract_vegetation_type(description)
        
        # Extract region
        region = extract_region_from_address(item.get('address', ''), item.get('city', ''))
        
        # Create processed entry
        processed_entry = {
            "name": item.get('title', ''),
            "location": item.get('address', ''),
            "country": "United Kingdom",
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
    input_file = "/home/ubuntu/upload/dataset_crawler-google-places_2025-05-20_09-07-57-438.json"
    output_file = "/home/ubuntu/processed_solar_parks_uk.json"
    
    count = process_solar_parks(input_file, output_file)
    print(f"Processed {count} solar parks in the UK. Output saved to {output_file}")
