
import os

def inject_data_v2_simple():
    seed_path = 'backend/seed_content.py'
    new_data_formatted = 'backend/new_gk_formatted_v2.txt'

    with open(seed_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    with open(new_data_formatted, 'r', encoding='utf-8') as f:
        new_data = f.read()

    # Find definition of seed function
    seed_line_idx = -1
    for i, line in enumerate(lines):
        if line.strip().startswith("async def seed():"):
            seed_line_idx = i
            break
            
    if seed_line_idx == -1:
        print("Error: Could not find async def seed():")
        return

    # Look backwards from seed function to find closing brackets
    # Expected structure:
    # ...
    #     ]
    #     }  <-- Closing topics
    # }      <-- Closing BILINGUAL_GK_DATA
    # 
    # async def seed():

    insertion_idx = -1
    
    # We want to find the closing brace of the 'topics' dictionary.
    # It should be the second '}' we encounter going backwards.
    
    brace_count = 0
    for i in range(seed_line_idx - 1, 0, -1):
        line = lines[i].strip()
        if line == '}':
            brace_count += 1
            if brace_count == 2:
                # This is likely the closing brace of 'topics'
                insertion_idx = i
                break
                
    if insertion_idx != -1:
        # Check if previous line has a comma
        prev_idx = insertion_idx - 1
        while prev_idx > 0 and not lines[prev_idx].strip():
             prev_idx -= 1
             
        if not lines[prev_idx].strip().endswith(','):
            lines[prev_idx] = lines[prev_idx].rstrip() + ",\n"
            
        # Insert new data
        lines.insert(insertion_idx, new_data + "\n")
        
        with open(seed_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Successfully injected batch 2 data.")
    else:
        print("Could not find insertion point (closing brace of topics).")

if __name__ == "__main__":
    inject_data_v2_simple()
