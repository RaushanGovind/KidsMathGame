import ast

def main():
    # Read the parsed Batch 6 data
    with open('backend/batch_6_output.txt', 'r', encoding='utf-8') as f:
        update_code = f.read()
    
    # Extract dict
    dict_content_str = update_code.replace("BILINGUAL_GK_DATA_BATCH_6 = ", "").strip()
    update_data = ast.literal_eval(dict_content_str)
    
    # Format for insertion
    insertion_lines = []
    
    for key, items in update_data.items():
        insertion_lines.append(f'        "{key}": [')
        for item in items:
            insertion_lines.append('            {')
            insertion_lines.append(f'                "id": {item["id"]},')
            # Escape quotes
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
    
    # Insert into seed_content.py
    target_file = r"c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\backend\seed_content.py"
    with open(target_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    # Find BILINGUAL_GK_DATA start
    start_line = -1
    for i, line in enumerate(lines):
        if line.startswith("BILINGUAL_GK_DATA = {"):
            start_line = i
            break
            
    if start_line == -1:
        print("Could not find BILINGUAL_GK_DATA")
        return

    # Find insertion point (before closing brace of dict)
    insert_index = -1
    for i in range(len(lines) - 1, start_line, -1):
        if lines[i].strip() == '}' and lines[i-1].rstrip().endswith(']'):
             insert_index = i - 1
             print(f"Found insertion point at line {insert_index+1}")
             break

    if insert_index != -1:
        # Insert comma after previous last item if needed
        if not lines[insert_index].rstrip().endswith(','):
            lines[insert_index] = lines[insert_index].rstrip() + ',\n'
        
        lines.insert(insert_index + 1, insertion_block + "\n")
        with open(target_file, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("✓ Updated seed_content.py with Batch 6 data")
        print(f"  Added {sum(len(items) for items in update_data.values())} Q&A pairs across {len(update_data)} categories")
    else:
        print("Insertion point not found.")

if __name__ == "__main__":
    main()
