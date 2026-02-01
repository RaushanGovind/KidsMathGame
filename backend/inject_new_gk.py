
import os

def inject_data():
    seed_path = 'backend/seed_content.py'
    new_data_path = 'backend/new_gk_formatted.txt'

    with open(seed_path, 'r', encoding='utf-8') as f:
        seed_content = f.read()

    with open(new_data_path, 'r', encoding='utf-8') as f:
        new_data = f.read()

    # The marker is the end of the solar_system list inside topics
    # We look for the closing of topics } and BILINGUAL_GK_DATA }
    # A safe marker is the last question of solar system followed by closing brackets
    
    marker_str = '"en_a": "Stars produce their own light, planets do not"\n            }\n        ]\n    }\n}'
    
    if marker_str not in seed_content:
        print("Error: Could not find strict insertion marker.")
        # Fallback: try to find the end of BILINGUAL_GK_DATA by regex or simpler string
        # It's defined right before "async def seed():" usually? No, there is some space.
        # Let's try to find the end of the 'solar_system' array.
        pass

    # We want to replace the closing of the solar_system list and the topics dict
    # with the comma, the new data, and then close them.
    
    # Current end:
    #         ]
    #     }
    # }
    
    # New end:
    #         ],
    # <NEW_DATA>
    #     }
    # }
    
    # We strip the trailing newline from new_data if present
    new_data = new_data.strip()
    
    # Replacement string
    replacement = '"en_a": "Stars produce their own light, planets do not"\n            }\n        ],\n' + new_data + '\n    }\n}'
    
    if marker_str in seed_content:
        new_seed_content = seed_content.replace(marker_str, replacement)
        
        with open(seed_path, 'w', encoding='utf-8') as f:
            f.write(new_seed_content)
        print("Successfully injected new data.")
    else:
        print("Marker not found. content dump of relevant section:")
        start_idx = seed_content.find("Stars produce their own light")
        if start_idx != -1:
            print(seed_content[start_idx:start_idx+200])
        else:
            print("Could not even find the last question text.")

if __name__ == "__main__":
    inject_data()
