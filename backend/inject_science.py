import json
import os

seed_file = r'c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\backend\seed_content.py'
science_json = r'c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\backend\science_data.json'

with open(science_json, 'r', encoding='utf-8') as f:
    science_data = json.load(f)

with open(seed_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find BILINGUAL_GK_DATA
start_line = -1
for i, line in enumerate(lines):
    if 'BILINGUAL_GK_DATA = {' in line:
        start_line = i
        break

if start_line == -1:
    print("Could not find BILINGUAL_GK_DATA")
    exit(1)

# Find the sets dictionary inside BILINGUAL_GK_DATA
sets_line = -1
for i in range(start_line, len(lines)):
    if '"sets": {' in lines[i] or "'sets': {" in lines[i]:
        sets_line = i
        break

if sets_line == -1:
    print("Could not find 'sets' in BILINGUAL_GK_DATA")
    exit(1)

# Insertion point: right after '"sets": {'
insertion_point = sets_line + 1

# Format science data as python dict entries
formatted_lines = []
for topic, qas in science_data.items():
    formatted_lines.append(f'        "{topic}": [\n')
    for qa in qas:
        formatted_lines.append(f'            {{\n')
        formatted_lines.append(f'                "id": {qa["id"]},\n')
        formatted_lines.append(f'                "hi_q": {json.dumps(qa["hi_q"], ensure_ascii=False)},\n')
        formatted_lines.append(f'                "en_q": {json.dumps(qa["en_q"], ensure_ascii=False)},\n')
        formatted_lines.append(f'                "hi_a": {json.dumps(qa["hi_a"], ensure_ascii=False)},\n')
        formatted_lines.append(f'                "en_a": {json.dumps(qa["en_a"], ensure_ascii=False)}\n')
        formatted_lines.append(f'            }},\n')
    formatted_lines.append(f'        ],\n')

# Insert into lines
new_lines = lines[:insertion_point] + formatted_lines + lines[insertion_point:]

with open(seed_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Injected science data into seed_content.py")
