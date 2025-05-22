#!/usr/bin/env python3
"""
Process scraped sheep farm data for the Ombaa directory.
This script converts the raw Google Maps data for sheep farms/shepherds into a structured format
suitable for the Ombaa directory database.
"""

import json
import os
import re

def extract_flock_size_from_text(text):
    """Extract flock size information from text if available."""
    if not text:
        return None
    
    # Look for patterns like "X sheep", "X animals", "flock of X"
    patterns = [
        r'(\d+)[\s-]sheep',
        r'(\d+)[\s-]animals',
        r'(\d+)[\s-]ewes',
        r'flock of (\d+)',
        r'troupeau de (\d+)',
        r'(\d+) moutons',
        r'(\d+) schapen',
        r'(\d+) Schafe',
        r'Herde von (\d+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    
    return None

def extract_grazing_type(text):
    """Extract grazing type information if available."""
    if not text:
        return "Mixed grazing"  # Default value
    
    grazing_keywords = {
        "rotational": "Rotational grazing",
        "rotation": "Rotational grazing",
        "seasonal": "Seasonal grazing",
        "continuous": "Continuous grazing",
        "mobile": "Mobile grazing",
        "nomadic": "Mobile grazing",
        "transhumance": "Transhumance",
        "organic": "Organic grazing",
        "bio": "Organic grazing",
        "ecological": "Ecological grazing",
        "conservation": "Conservation grazing",
        "nature": "Conservation grazing",
        "contract": "Contract grazing",
        "service": "Service grazing",
    }
    
    text_lower = text.lower()
    for keyword, grazing_type in grazing_keywords.items():
        if keyword in text_lower:
            return grazing_type
    
    return "Mixed grazing"  # Default value

def extract_breed_from_text(text):
    """Extract sheep breed information if available."""
    if not text:
        return None
    
    # Common sheep breeds by country
    breeds = [
        # English breeds
        "suffolk", "texel", "hampshire", "dorset", "romney", "lincoln", "cotswold", 
        "leicester", "southdown", "shropshire", "oxford", "cheviot", "jacob", 
        "wensleydale", "devon", "exmoor", "dartmoor", "herdwick", "swaledale",
        # French breeds
        "lacaune", "mérinos", "préalpes", "charollais", "île-de-france", "berrichon",
        "romanov", "rava", "caussenard", "bizet", "mourerous", "tarasconnais",
        # German breeds
        "merino", "schwarzkopf", "rhönschaf", "skudde", "rauhwolliges", "pommersches",
        "ostfriesisches", "leineschaf", "bentheimer", "coburger", "waldschaf",
        # Dutch breeds
        "zwartbles", "drenthe", "veluwe", "kempisch", "fries", "schoonebeeker",
        # Belgian breeds
        "ardennais", "entre-sambre-et-meuse", "lakens", "vlaams", "houtlandschaap",
        # Generic terms
        "breed", "race", "ras", "rasse"
    ]
    
    text_lower = text.lower()
    
    # First look for specific breed mentions
    for breed in breeds:
        if breed in text_lower:
            # Capitalize breed name
            return breed.title()
    
    # Look for breed mentions with the word "breed" or similar
    breed_patterns = [
        r'breed[s]?:?\s+([A-Za-z\s]+)',
        r'race[s]?:?\s+([A-Za-z\s]+)',
        r'ras:?\s+([A-Za-z\s]+)',
        r'rasse[n]?:?\s+([A-Za-z\s]+)',
    ]
    
    for pattern in breed_patterns:
        match = re.search(pattern, text_lower)
        if match:
            breed_text = match.group(1).strip()
            # Limit to first 30 chars and capitalize
            return breed_text[:30].title()
    
    return None

def extract_region_from_address(address, city, country_code):
    """Extract region information from address based on country."""
    if not address and not city:
        return ""
    
    search_text = (address or "").lower() + " " + (city or "").lower()
    
    # Define regions by country
    if country_code == "NL":
        # Dutch provinces
        regions = {
            "Noord-Holland": ["noord-holland", "amsterdam", "haarlem", "alkmaar", "hoorn", "den helder", "zaandam"],
            "Zuid-Holland": ["zuid-holland", "rotterdam", "den haag", "dordrecht", "leiden", "delft", "gouda"],
            "Utrecht": ["utrecht", "amersfoort", "veenendaal", "nieuwegein", "zeist"],
            "Gelderland": ["gelderland", "arnhem", "nijmegen", "apeldoorn", "ede", "doetinchem"],
            "Overijssel": ["overijssel", "enschede", "zwolle", "deventer", "hengelo", "almelo"],
            "Flevoland": ["flevoland", "lelystad", "almere", "emmeloord", "dronten"],
            "Noord-Brabant": ["noord-brabant", "eindhoven", "tilburg", "breda", "den bosch", "'s-hertogenbosch", "roosendaal"],
            "Limburg": ["limburg", "maastricht", "venlo", "roermond", "sittard", "heerlen"],
            "Zeeland": ["zeeland", "middelburg", "vlissingen", "terneuzen", "goes"],
            "Drenthe": ["drenthe", "assen", "emmen", "hoogeveen", "meppel"],
            "Friesland": ["friesland", "leeuwarden", "drachten", "heerenveen", "sneek"],
            "Groningen": ["groningen", "delfzijl", "stadskanaal", "winschoten"]
        }
    elif country_code == "UK" or country_code == "GB":
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
    elif country_code == "FR":
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
    elif country_code == "DE":
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
    elif country_code == "BE":
        # Belgian regions
        regions = {
            "Flanders": [
                "vlaanderen", "flandre", "flanders",
                "antwerpen", "antwerp", "anvers",
                "limburg", "limbourg",
                "oost-vlaanderen", "east flanders", "flandre orientale",
                "west-vlaanderen", "west flanders", "flandre occidentale",
                "vlaams-brabant", "flemish brabant", "brabant flamand",
                "gent", "ghent", "gand",
                "brugge", "bruges", "hasselt", "leuven", "louvain", "mechelen", "malines"
            ],
            "Wallonia": [
                "wallonie", "wallonia", "wallonië",
                "hainaut", "henegouwen",
                "liège", "luik", "liege",
                "luxembourg", "luxemburg",
                "namur", "namen",
                "brabant wallon", "waals-brabant", "walloon brabant",
                "charleroi", "mons", "bergen", "liège", "luik", "namur", "namen"
            ],
            "Brussels": [
                "brussels", "bruxelles", "brussel",
                "brussels hoofdstedelijk gewest", "région de bruxelles-capitale", "brussels capital region"
            ]
        }
    else:
        # Default empty regions if country not recognized
        regions = {}
    
    # Try to find region in address
    for region, keywords in regions.items():
        for keyword in keywords:
            if keyword in search_text:
                return region
    
    # Extract postal code and try to map to region
    if address:
        postal_match = None
        if country_code == "NL":
            postal_match = re.search(r'(\d{4})\s*[A-Z]{2}', address)
            if postal_match:
                postal_code = postal_match.group(1)
                first_digit = postal_code[0]
                # Map Dutch postal code first digit to province
                postal_to_region = {
                    "1": "Noord-Holland",
                    "2": "Noord-Holland/Zuid-Holland",
                    "3": "Utrecht/Zuid-Holland",
                    "4": "Zuid-Holland/Noord-Brabant/Zeeland",
                    "5": "Noord-Brabant/Limburg",
                    "6": "Gelderland/Limburg",
                    "7": "Gelderland/Overijssel",
                    "8": "Overijssel/Flevoland/Friesland",
                    "9": "Groningen/Drenthe/Friesland"
                }
                if first_digit in postal_to_region:
                    return postal_to_region[first_digit].split('/')[0]  # Take first option
        elif country_code == "UK" or country_code == "GB":
            # UK postal code first letters to region mapping
            postal_match = re.search(r'([A-Z]{1,2}\d{1,2}[A-Z]?)', address, re.IGNORECASE)
            if postal_match:
                postal_prefix = postal_match.group(1)[:2].upper()  # Take first two characters
                postal_to_region = {
                    "England": ["B", "BA", "BB", "BD", "BH", "BL", "BN", "BR", "BS", "CA", "CB", "CH", "CM", "CO", "CR", 
                               "CV", "CW", "DA", "DE", "DH", "DL", "DN", "DT", "DY", "E", "EC", "EN", "EX", "FY", "GL", 
                               "GU", "HA", "HD", "HG", "HP", "HR", "HU", "HX", "IG", "IP", "KT", "L", "LA", "LE", "LN", 
                               "LS", "LU", "M", "ME", "MK", "N", "NE", "NG", "NN", "NP", "NR", "NW", "OL", "OX", "PE", 
                               "PL", "PO", "PR", "RG", "RH", "RM", "S", "SE", "SG", "SK", "SL", "SM", "SN", "SO", "SP", 
                               "SR", "SS", "ST", "SW", "SY", "TA", "TF", "TN", "TQ", "TR", "TS", "TW", "UB", "W", "WA", 
                               "WC", "WD", "WF", "WN", "WR", "WS", "WV", "YO"],
    
(Content truncated due to size limit. Use line ranges to read in chunks)
