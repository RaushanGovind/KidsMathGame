import json
import os

def inject_batch_7():
    seed_path = 'backend/seed_content.py'
    parsed_path = 'backend/batch_7_parsed.json'

    with open(parsed_path, 'r', encoding='utf-8') as f:
        new_data = json.load(f)

    with open(seed_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find where 'topics' starts inside BILINGUAL_GK_DATA
    # We look for '"topics": {'
    start_idx = -1
    for i, line in enumerate(lines):
        if '"topics": {' in line:
            start_idx = i
            break
            
    if start_idx == -1:
        print("Could not find 'topics' dictionary in seed_content.py")
        return

    # Find the closing brace of 'topics'
    # It should be indented same as the line after start_idx?
    # standard indentation is 4 spaces. "topics": { is at indentation 4?
    # No, it's inside BILINGUAL_GK_DATA, which is global.
    # checking indentation of start_idx
    indent = len(lines[start_idx]) - len(lines[start_idx].lstrip())
    
    end_idx = -1
    # We look for a line that has just '    }' (matching indentation) or similar
    # But dictionary might be nested. 
    # Let's count braces.
    
    brace_count = 0
    found_start = False
    
    # Actually, simpler: reverse search from bottom?
    # No, BILINGUAL_GK_DATA ends near 10200.
    # Let's search forward from start_idx.
    
    for i in range(start_idx, len(lines)):
        line = lines[i]
        brace_count += line.count('{')
        brace_count -= line.count('}')
        if brace_count == 0:
            end_idx = i
            break
            
    if end_idx == -1:
        print("Could not find closing brace for 'topics'.")
        return

    # We insert BEFORE end_idx
    insertion_point = end_idx
    
    # Prepare formatted strings
    to_insert = []
    for key, items in new_data.items():
        # Check if key already exists to avoid dupes (naive check)
        key_exists = False
        for j in range(start_idx, end_idx):
            if f'"{key}":' in lines[j] or f"'{key}':" in lines[j]:
                key_exists = True
                break
        
        if key_exists:
            print(f"Key '{key}' already exists, skipping.")
            continue
            
        # Format the list of items
        to_insert.append(f"        '{key}': [\n") # Indent 8 spaces?
        for item in items:
            to_insert.append("            {\n")
            to_insert.append(f"                'id': {item['id']},\n")
            to_insert.append(f"                'hi_q': {json.dumps(item['hi_q'], ensure_ascii=False)},\n")
            to_insert.append(f"                'en_q': {json.dumps(item['en_q'], ensure_ascii=False)},\n")
            to_insert.append(f"                'hi_a': {json.dumps(item['hi_a'], ensure_ascii=False)},\n")
            to_insert.append(f"                'en_a': {json.dumps(item['en_a'], ensure_ascii=False)}\n")
            to_insert.append("            },\n")
        to_insert.append("        ],\n")

    # Add comma to the line before insertion point if needed
    prev_line_idx = insertion_point - 1
    while not lines[prev_line_idx].strip() or lines[prev_line_idx].strip().startswith('#'):
        prev_line_idx -= 1
        
    if not lines[prev_line_idx].strip().endswith(',') and not lines[prev_line_idx].strip().endswith('{'):
        # Add comma
        lines[prev_line_idx] = lines[prev_line_idx].rstrip() + ",\n"

    # Insert
    for line in reversed(to_insert):
        lines.insert(insertion_point, line)
        
    with open(seed_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
        
    print(f"Injected {len(to_insert)} lines into seed_content.py")

if __name__ == "__main__":
    inject_batch_7()
