#!/usr/bin/env python3
"""
Combine all processed solar park data into a single file for the Ombaa directory.
This script merges data from the Netherlands, France, UK, and Germany into one comprehensive dataset.
"""

import json
import os

def combine_solar_parks(input_files, output_file):
    """Combine multiple solar park data files into one."""
    combined_data = []
    
    for input_file in input_files:
        if os.path.exists(input_file):
            with open(input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                combined_data.extend(data)
    
    # Write combined data to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, indent=2, ensure_ascii=False)
    
    return len(combined_data)

if __name__ == "__main__":
    input_files = [
        "/home/ubuntu/processed_solar_parks.json",        # Netherlands
        "/home/ubuntu/processed_solar_parks_france.json", # France
        "/home/ubuntu/processed_solar_parks_uk.json",     # UK
        "/home/ubuntu/processed_solar_parks_germany.json" # Germany
    ]
    output_file = "/home/ubuntu/processed_solar_parks_combined.json"
    
    count = combine_solar_parks(input_files, output_file)
    print(f"Combined {count} solar parks from all countries. Output saved to {output_file}")
