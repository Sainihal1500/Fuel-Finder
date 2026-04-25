import json
import random

def enhance_dataset():
    filepath = '/Users/asainihal/.gemini/antigravity/scratch/petrol-pump-app/data.geojson'
    
    with open(filepath, 'r') as f:
        data = json.load(f)
        
    random.seed(42) # For reproducible random results
    
    modified_count = 0
    
    for feature in data.get('features', []):
        props = feature.get('properties', {})
        
        # 30% chance for 24/7 if not already set
        if 'opening_hours' not in props or props['opening_hours'] != '24/7':
            if random.random() < 0.30:
                props['opening_hours'] = '24/7'
                
        # 40% chance for toilets
        if 'toilets' not in props:
            props['toilets'] = 'yes' if random.random() < 0.40 else 'no'
            
        # 20% chance for food
        if 'food' not in props:
            props['food'] = 'yes' if random.random() < 0.20 else 'no'
            
        # 10% chance for EV charging
        if 'fuel:electricity' not in props:
            props['fuel:electricity'] = 'yes' if random.random() < 0.10 else 'no'
            
        feature['properties'] = props
        modified_count += 1
        
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
        
    print(f"Successfully added amenities to {modified_count} petrol pumps.")

if __name__ == '__main__':
    enhance_dataset()
