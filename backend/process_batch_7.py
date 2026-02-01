import re
import json

def generate_question(category, en_name, hi_name, en_desc, hi_desc):
    category = category.lower()
    en_desc_lower = en_desc.lower()
    
    # Defaults
    hi_q = hi_desc
    en_q = en_desc

    # Physics Basics - Force, Motion, etc.
    if category.replace('_', ' ') in ['physics basics', 'electricity', 'energy', 'magnets', 'sound', 'heat', 'gravity', 'simple machines', 'water cycle', 'air wind', 'weather', 'earth globe', 'continents', 'countries']:
        # If item name is "Force", and desc is "Force means a push or pull."
        # Q: What is Force? A: A push or pull.
        
        # Clean desc
        clean_en_desc = en_desc.replace(en_name, '').strip()
        if clean_en_desc.lower().startswith('is '): clean_en_desc = clean_en_desc[3:].strip()
        if clean_en_desc.lower().startswith('means '): clean_en_desc = clean_en_desc[6:].strip()

        clean_hi_desc = hi_desc.replace(hi_name, '').strip()

        # Construct Question
        en_q = f"What is {en_name}?"
        hi_q = f"{hi_name} क्या है?"
        
        # If desc is empty, usage logic might apply. But mostly definitions here.
        if "help" in en_desc_lower:
             en_q = f"What does {en_name} do?"
             hi_q = f"{hi_name} क्या करता है?"

    # Specific overrides based on content analysis
    if "force" in en_name.lower():
        en_q = "What is Force?"
        hi_q = "बल किसे कहते हैं?"
        en_desc = "A push or a pull" # simplification from desc
        hi_desc = "धक्का या खींचना"

    return {
        "hi_q": hi_q,
        "en_q": en_q,
        "hi_a": hi_desc if len(hi_desc) < 50 else hi_name, # Use desc as answer if short, else name? 
        # Actually for GK, usually Q is the desc and A is the name.
        # "What is a push or pull?" -> "Force"
        "en_a": en_desc if len(en_desc) < 50 else en_name
    }

def process_item_to_qa(category, en_name, hi_name, en_desc, hi_desc):
    # Strategy: 
    # Q: Description (without the name)
    # A: Name
    
    # Example: 
    # Item: Force
    # Desc: Force means a push or a pull.
    # Q: What means a push or a pull? -> Force.
    
    clean_en_desc = en_desc
    if clean_en_desc.lower().startswith(en_name.lower()):
        clean_en_desc = clean_en_desc[len(en_name):].strip()
    
    if clean_en_desc.lower().startswith("is "): clean_en_desc = clean_en_desc[3:].strip()
    if clean_en_desc.lower().startswith("means "): clean_en_desc = clean_en_desc[6:].strip()
    
    # Remove leading articles
    if clean_en_desc.lower().startswith("a "): clean_en_desc = clean_en_desc[2:].strip()
    if clean_en_desc.lower().startswith("an "): clean_en_desc = clean_en_desc[3:].strip()
    if clean_en_desc.lower().startswith("the "): clean_en_desc = clean_en_desc[4:].strip()

    en_q = f"What is {clean_en_desc}?"
    if "how" in clean_en_desc.lower(): en_q = f"{clean_en_desc}?"
    
    hi_q = hi_desc
    # Remove name from hi_desc if present?
    # "बल का मतलब धक्का है" -> "धक्का या खींचना क्या है?"
    
    return {
        "hi_q": hi_desc + "?", # Placeholder logic
        "en_q": en_q,
        "hi_a": hi_name,
        "en_a": en_name
    }

def parse_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    data = {}
    current_category = None
    current_items = []
    
    # State machine
    current_item = None

    for line in lines:
        line = line.strip()
        if not line: continue
        if line.startswith('----'): continue
        if "RHYME" in line: continue

        # Header: Emoji NAME – Kids Learning
        if "– Kids Learning" in line:
            if current_category:
                if current_item: current_items.append(current_item)
                cat_key = current_category.split('–')[0].strip().split(' ', 1)[-1].lower().replace(' ', '_').replace('&', '').replace('__', '_')
                data[cat_key] = current_items
            
            current_category = line
            current_items = []
            current_item = None
            continue

        if not current_category: continue

        # Item detection: "1. Name (Hindi)" or "Emoji Name (Hindi)"
        # Regex to find (Hindi)
        match = re.search(r'(?:[\d\.]+\s+|[\U00010000-\U0010ffff]\s+)?([A-Za-z\s/-]+)\s*\((.+?)\)', line)
        if match and len(line) < 60: # Limit length to avoid matching long sentences with parens
            if current_item:
                current_items.append(current_item)
            
            en_name = match.group(1).strip()
            hi_name = match.group(2).strip()
            
            current_item = {
                'en': en_name,
                'hi': hi_name,
                'en_desc': '',
                'hi_desc': ''
            }
        else:
            # Body text
            if current_item:
                # Naive lang detection
                if any('\u0900' <= char <= '\u097F' for char in line):
                    current_item['hi_desc'] += line + " "
                else:
                    current_item['en_desc'] += line + " "

    # Flush last
    if current_category:
        if current_item: current_items.append(current_item)
        cat_key = current_category.split('–')[0].strip().split(' ', 1)[-1].lower().replace(' ', '_').replace('&', '').replace('__', '_')
        data[cat_key] = current_items

    return data

def convert_to_qa(raw_data):
    final_data = {}
    for cat, items in raw_data.items():
        qa_list = []
        for i, item in enumerate(items):
            # Smart logic to create Q/A
            # Default: Q = "What is [Desc]?" A = [Name]
            # If visual/simple: Q = "What is [Name]?" A = [Desc] (Definitional)
            
            # For GK, usually "Which planet is red?" -> "Mars".
            # Item: Mars. Desc: It is known as Red Planet.
            
            en_desc = item['en_desc'].strip().strip('.')
            hi_desc = item['hi_desc'].strip().strip('।')
            
            en_name = item['en']
            hi_name = item['hi']
            
            # Custom Heuristics
            en_q = f"What is {en_name}?"
            hi_q = f"{hi_name} क्या है?"
            en_a = en_desc if en_desc else en_name
            hi_a = hi_desc if hi_desc else hi_name
            
            # Switch Q/A if desc is better as question
            if len(en_desc) > 5 and len(en_desc) < 80:
                # Check if desc has "is" or "means"
                clean_desc = en_desc
                if clean_desc.lower().startswith(en_name.lower()):
                     clean_desc = clean_desc[len(en_name):].strip()
                
                if clean_desc.lower().startswith("is "): clean_desc = clean_desc[3:].strip()
                if clean_desc.lower().startswith("means "): clean_desc = clean_desc[6:].strip()
                
                en_q = f"What {clean_desc}?"
                if "known as" in en_desc:
                    en_q = f"What is {clean_desc}?" # "What is known as Red Planet?"
                
                # Hindi Q
                hi_q = f"{hi_desc}?"
                
                en_a = en_name
                hi_a = hi_name

            qa_list.append({
                "id": i + 1,
                "hi_q": hi_q,
                "en_q": en_q,
                "hi_a": hi_a,
                "en_a": en_a
            })
        final_data[cat] = qa_list
    return final_data

if __name__ == "__main__":
    raw = parse_file('backend/new_batch_7_data.txt')
    final = convert_to_qa(raw)
    
    with open('backend/batch_7_parsed.json', 'w', encoding='utf-8') as f:
        json.dump(final, f, indent=4, ensure_ascii=False)
    
    print("Parsed Batch 7 Data.")
