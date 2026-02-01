import ast

def main():
    # 1. Read the update data
    with open('backend/batch_5_output.txt', 'r', encoding='utf-8') as f:
        update_code = f.read()
    
    # Extract dict
    dict_content_str = update_code.replace("BILINGUAL_GK_DATA_BATCH_5 = ", "").strip()
    update_data = ast.literal_eval(dict_content_str)
    
    # 2. Formatter
    insertion_lines = []
    
    for key, items in update_data.items():
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
    
    # 3. Insert into seed_content.py
    target_file = r"c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\backend\seed_content.py"
    with open(target_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_line = -1
    for i, line in enumerate(lines):
        if line.startswith("BILINGUAL_GK_DATA = {"):
            start_line = i
            break
            
    if start_line == -1:
        print("Could not find BILINGUAL_GK_DATA")
        return

    # Find insertion point: The `sets` dict end.
    insert_index = -1
    for i in range(len(lines) - 1, start_line, -1):
        if lines[i].strip() == '}' and lines[i-1].rstrip() == '    }':
             insert_index = i - 1
             print(f"Found insertion point at {insert_index+1}")
             break

    if insert_index != -1:
        lines.insert(insert_index, insertion_block + "\n")
        with open(target_file, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Updated seed_content.py with Batch 5")
    else:
        print("Insertion point not found.")

if __name__ == "__main__":
    main()
