import re
import json
import os

def parse_multi_topic_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by topic markers
    topic_blocks = re.split(r'(\[BILINGUAL_GK_TOPIC_.*?\])', content)
    
    results = {}
    current_topic_key = None
    
    for block in topic_blocks:
        block = block.strip()
        if not block:
            continue
            
        # Check if this block is a header
        header_match = re.match(r'\[BILINGUAL_GK_TOPIC_(.*?)\]', block)
        if header_match:
            current_topic_key = header_match.group(1).lower()
            results[current_topic_key] = []
            continue
            
        if not current_topic_key:
            continue
            
        # Parse Q&A in this block
        questions = re.split(r'\nQ\d+\n', block)
        item_id = 1
        
        for q_block in questions:
            q_block = q_block.strip()
            if not q_block or 'HI_Q' not in q_block:
                continue
                
            hi_q = re.search(r'HI_Q: (.*)', q_block)
            en_q = re.search(r'EN_Q: (.*)', q_block)
            hi_a = re.search(r'HI_A: (.*)', q_block)
            en_a = re.search(r'EN_A: (.*)', q_block)
            
            if hi_q and en_q and hi_a and en_a:
                results[current_topic_key].append({
                    "id": item_id,
                    "hi_q": hi_q.group(1).strip(),
                    "en_q": en_q.group(1).strip(),
                    "hi_a": hi_a.group(1).strip(),
                    "en_a": en_a.group(1).strip()
                })
                item_id += 1
                
    return results

# Process new_raw_gk.txt
raw_file = r'c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\backend\new_raw_gk.txt'
if os.path.exists(raw_file):
    final_results = parse_multi_topic_file(raw_file)
    
    # Save results
    output_path = r'c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\backend\gk_data\temp_formatted_qa.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_results, f, ensure_ascii=False, indent=4)
    
    print(f"Successfully parsed {len(final_results)} topics: {', '.join(final_results.keys())}")
    print(f"Output saved to {output_path}")
else:
    print(f"Error: Raw file not found at {raw_file}")
