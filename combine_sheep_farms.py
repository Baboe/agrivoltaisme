#!/usr/bin/env python3
"""
Combine processed sheep farm data from all countries into a single dataset
for the Ombaa directory.
"""

import json
import os

def combine_sheep_farms():
    """Combine sheep farm data from all countries into a single dataset."""
    # Define input and output files
    input_files = {
        "Netherlands": "/home/ubuntu/processed_sheep_farms_netherlands.json",
        "United Kingdom": "/home/ubuntu/processed_sheep_farms_uk.json",
        "France": "/home/ubuntu/processed_sheep_farms_france.json",
        "Germany": "/home/ubuntu/processed_sheep_farms_germany.json",
        "Belgium": "/home/ubuntu/processed_sheep_farms_belgium.json"
    }
    
    output_file = "/home/ubuntu/processed_sheep_farms_combined.json"
    
    # Load and combine data
    combined_data = []
    country_counts = {}
    
    for country, file_path in input_files.items():
        with open(file_path, 'r', encoding='utf-8') as f:
            country_data = json.load(f)
            combined_data.extend(country_data)
            country_counts[country] = len(country_data)
    
    # Write combined data to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, indent=2, ensure_ascii=False)
    
    return len(combined_data), country_counts

if __name__ == "__main__":
    total_count, country_counts = combine_sheep_farms()
    print(f"Combined {total_count} sheep farms from all countries. Output saved to /home/ubuntu/processed_sheep_farms_combined.json")
    print("Country breakdown:")
    for country, count in country_counts.items():
        print(f"  - {country}: {count} sheep farms")
