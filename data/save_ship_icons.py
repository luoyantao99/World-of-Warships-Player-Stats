import json
import requests
import os


with open('ship_encyclopedia.json', 'r', encoding='utf-8') as file:
    ships_data = json.load(file)

images_directory = 'ship_profiles'
os.makedirs(images_directory, exist_ok=True)

for ship_id, ship_info in ships_data.items():
    image_url = ship_info.get('images', {}).get('large', None)

    if image_url:
        try:
            response = requests.get(image_url)
            
            if response.status_code == 200:
                ship_id_str = ship_info.get('ship_id_str', 'unknown_id')
                ship_name = ship_info.get('name', 'unknown_ship').replace(' ', '_')
                file_name = f"{ship_id_str}_{ship_name}.png"
                file_path = os.path.join(images_directory, file_name)

                with open(file_path, 'wb') as img_file:
                    img_file.write(response.content)
                
                print(f"Downloaded {ship_id_str}")
            else:
                print(f"Failed to download image for ship ID {ship_id}. Status code: {response.status_code}")
        except Exception as e:
            print(f"An error occurred while downloading image for ship ID {ship_id}: {e}")
    else:
        print(f"No large image URL for ship ID {ship_id}")

print("Download complete.")
