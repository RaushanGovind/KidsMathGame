import ast

def main():
    # 1. Read the update data
    with open('backend/batch_4_output.txt', 'r', encoding='utf-8') as f:
        update_code = f.read()
    
    # Extract dict
    dict_content_str = update_code.replace("BILINGUAL_GK_DATA_BATCH_4 = ", "").strip()
    update_data = ast.literal_eval(dict_content_str)
    
    # 2. Rename keys to avoid collisions
    collision_map = {
        'water_animals': 'water_animals_facts',
        'directions': 'directions_info',
        'my_family': 'family_members',
        'home_family': 'home_family_ext', # if present
    }
    
    final_data = {}
    for k, v in update_data.items():
        new_key = collision_map.get(k, k)
        final_data[new_key] = v
        
    # 3. Formatter
    insertion_lines = []
    
    for key, items in final_data.items():
        insertion_lines.append(f'        "{key}": [')
        for item in items:
            insertion_lines.append('            {')
            insertion_lines.append(f'                "id": {item["id"]},')
            # Handle quotes escape
            hi_q = item["hi_q"].replace('"', '\\"')
            en_q = item["en_q"].replace('"', '\\"')
            hi_a = item["hi_a"].replace('"', '\\"')
            en_a = item["en_a"].replace('"', '\\"')
            
            insertion_lines.append(f'                "hi_q": "{hi_q}",')
            insertion_lines.append(f'                "en_q": "{en_q}",')
            insertion_lines.append(f'                "hi_a": "{hi_a}",')
            insertion_lines.append(f'                "en_a": "{en_a}"')
            insertion_lines.append('            },')
        insertion_lines.append('        ],')

    insertion_block = "\n".join(insertion_lines)
    
    # 4. Insert into seed_content.py
    target_file = r"c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\backend\seed_content.py"
    with open(target_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_line = -1
    # We look for `BILINGUAL_GK_DATA = {`
    for i, line in enumerate(lines):
        if line.startswith("BILINGUAL_GK_DATA = {"):
            start_line = i
            break
            
    if start_line == -1:
        print("Could not find BILINGUAL_GK_DATA")
        return

    # Find insertion point: The `sets` dict end.
    # It ends with `    }` and then `}` for the whole dict.
    # We will search backwards from end of file again, similar to previous script.
    
    insert_index = -1
    for i in range(len(lines) - 50, start_line, -1):
        if lines[i].strip() == '}' and lines[i-1].rstrip() == '    }':
             insert_index = i - 1
             break
    
    if insert_index == -1:
         # Try finding `    "sets": {` and then matching ending brace?
         # Or just look for the last added batch 3 key "water_animals"
         # Batch 3 added `        ],` at the end of `sets` logic?
         # Wait, Batch 3 inserted into `sets`?
         # Batch 3 script logic:
         # lines.insert(insert_index, insertion_block + "\n")
         # It looked for `}` and `    }`.
         # So it appended to the end of the `sets` dictionary (if that's where I pointed it).
         # Let's verify if BILINGUAL_GK_DATA has "sets".
         # Yes, line 2228: "sets": {
         
         # So we just do the same logic.
         pass
         
    # Redo search
    for i in range(len(lines) - 1, start_line, -1):
        if lines[i].strip() == '}' and lines[i-1].rstrip() == '    }':
             insert_index = i - 1
             print(f"Found insertion point at {insert_index+1}")
             break

    if insert_index != -1:
        lines.insert(insert_index, insertion_block + "\n")
        with open(target_file, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Updated seed_content.py with Batch 4")
    else:
        print("Insertion point not found.")

if __name__ == "__main__":
    main()
