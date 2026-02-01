import re
import ast

def main():
    # 1. Read the update data
    with open('backend/batch_3_output.txt', 'r', encoding='utf-8') as f:
        update_code = f.read()
    
    # Evaluate extracting the dict
    # The file contains `BILINGUAL_GK_DATA_UPDATE = { ... }`
    # We strip the variable assignment
    dict_content_str = update_code.replace("BILINGUAL_GK_DATA_UPDATE = ", "").strip()
    update_data = ast.literal_eval(dict_content_str)
    
    # 2. Prepare the content to insert
    # We want to format it as lines indented by 8 spaces
    # Keys like 'animals', 'transport'
    
    insertion_lines = []
    
    for key, items in update_data.items():
        insertion_lines.append(f'        "{key}": [')
        for item in items:
            insertion_lines.append('            {')
            insertion_lines.append(f'                "id": {item["id"]},')
            insertion_lines.append(f'                "hi_q": "{item["hi_q"]}",')
            insertion_lines.append(f'                "en_q": "{item["en_q"]}",')
            insertion_lines.append(f'                "hi_a": "{item["hi_a"]}",')
            insertion_lines.append(f'                "en_a": "{item["en_a"]}"')
            insertion_lines.append('            },')
        insertion_lines.append('        ],')

    # Join with newlines
    insertion_block = "\n".join(insertion_lines)
    
    # 3. Read seed_content.py
    target_file = r"c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\backend\seed_content.py"
    with open(target_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    # 4. Find the insertion point
    # We look for the end of "sets" dict inside BILINGUAL_GK_DATA.
    # It is likely the `    }` before the final `}` of BILINGUAL_GK_DATA.
    # We know BILINGUAL_GK_DATA starts around 2225.
    
    # Heuristic: Find BILINGUAL_GK_DATA, then find the corresponding indented closing brace.
    # We know from recent viewing that around line 5869 there is `    }` followed by `}`.
    # We will search specifically for that pattern near the end of the file.
    
    insert_index = -1
    for i in range(len(lines) - 100, 0, -1): # Search backwards from end
        if lines[i].strip() == '}' and lines[i-1].rstrip() == '    }':
             # Found the `}` closing BILINGUAL_GK_DATA and `    }` closing "sets"
             insert_index = i - 1 
             print(f"Found insertion point at line {insert_index + 1}")
             break
    
    if insert_index == -1:
        print("Could not find insertion point. Aborting.")
        return

    # 5. Insert
    # We append a comma to the previous line if it doesn't have one (it likely does `],`)
    # Line at insert_index is `    }\n`. We want to insert BEFORE it.
    
    lines.insert(insert_index, insertion_block + "\n")
    
    # 6. Write back
    with open(target_file, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("Successfully updated seed_content.py")

if __name__ == "__main__":
    main()
