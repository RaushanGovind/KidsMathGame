import re
import json

def generate_question(category, en_name, hi_name, en_desc, hi_desc):
    category = category.lower()
    en_desc_lower = en_desc.lower()
    
    # 1. Opposites
    if category == 'opposites':
        parts = en_name.split('–')
        if len(parts) < 2: parts = en_name.split('-')
        if len(parts) == 2:
            word1 = parts[0].strip()
            word2 = parts[1].strip()
            return {
                "hi_q": f"'{word1}' का उल्टा (opposite) क्या है?",
                "en_q": f"What is the opposite of '{word1}'?",
                "hi_a": word2, # Need hindi word2? hi_name likely has "Bada - Chota"
                "en_a": word2
            }
            # Actually hi_name might be "बड़ा – छोटा". I can parse that too if needed.
            # Let's simple return generic
            
    # 2. National Symbols
    if "national" in en_desc_lower:
        return {
            "hi_q": f"भारत का राष्ट्रीय {category[:-1] if category.endswith('s') else category} कौन सा है?", # approximate
            "en_q": f"Which is the national {category[:-1] if category.endswith('s') else category}?",
            "hi_a": hi_name,
            "en_a": en_name
        }
        
    # 3. "Used for/to"
    if "used" in en_desc_lower:
        # "Used to cut fruits" -> "What is used to cut fruits?"
        # "Used for writing" -> "What is used for writing?"
        
        # Extract the usage part?
        # "It is used for decoration" -> "What is used for decoration?"
        q_text = en_desc.replace("It is ", "").replace("They are ", "").strip()
        if q_text.lower().startswith("used"):
            return {
                "hi_q": f"{hi_desc.replace(hi_name, 'क्या').replace('यह ', '').replace('ये ', '')}?", # Rough heuristic
                "en_q": f"What is {q_text}?",
                "hi_a": hi_name,
                "en_a": en_name
            }

    # 4. "Gives us"
    if "gives us" in en_desc_lower or "give us" in en_desc_lower:
        return {
            "hi_q": f"हमें {hi_desc.replace(hi_name, '').replace('देता है', '').replace('देती है', '').strip()} कौन देता है?",
            "en_q": f"What gives us {en_desc.replace('Gives us', '').replace('Give us', '').strip()}?",
            "hi_a": hi_name,
            "en_a": en_name
        }

    # 5. Generic "Which {cat} {verb}..."
    # "Lion ... King of jungle" -> "Which animal is King of Jungle?"
    # "Rose ... beautiful flower" -> "Which is a beautiful flower?"
    
    # Clean desc
    clean_desc = en_desc
    if clean_desc.lower().startswith("a "): clean_desc = clean_desc[2:]
    if clean_desc.lower().startswith("an "): clean_desc = clean_desc[3:]
    if clean_desc.lower().startswith("the "): clean_desc = clean_desc[4:]
    
    # If desc is just definition "Is a place..." -> "What is a place...?"
    
    q_start = "What is" # Default to What is
    clean_desc = en_desc
    
    # Remove "Name is" pattern
    # "House is where..." -> "where..."
    # "A house is where..." -> "where..."
    
    check_name = en_name.lower()
    check_desc = clean_desc.lower()
    
    if check_desc.startswith(check_name):
        clean_desc = clean_desc[len(check_name):].strip()
    elif check_desc.startswith("a " + check_name):
        clean_desc = clean_desc[len(check_name)+2:].strip()
    elif check_desc.startswith("an " + check_name):
        clean_desc = clean_desc[len(check_name)+3:].strip()
    elif check_desc.startswith("the " + check_name):
        clean_desc = clean_desc[len(check_name)+4:].strip()
        
    if clean_desc.lower().startswith("is "):
        clean_desc = clean_desc[3:].strip()
    elif clean_desc.lower().startswith("are "):
        clean_desc = clean_desc[4:].strip()
        
    # Now clean_desc is like "where a family lives" or "structures where..."
    
    if category in ['animals', 'wild animals', 'water animals', 'insects', 'birds']:
        q_start = "Which animal"
        if category == 'birds': q_start = "Which bird"
        if category == 'insects': q_start = "Which insect"
        en_q = f"{q_start} {clean_desc}?"
    else:
        # Default fallback
        en_q = f"What {clean_desc}?"
        # "What where a family lives?" -> Bad.
        # "What is a place where...?" -> Good.
        
        if clean_desc.startswith("where") or clean_desc.startswith("is where"):
             en_q = f"Which place {clean_desc}?"
        elif clean_desc.startswith("structure"):
             en_q = f"What structure {clean_desc}?"
        else:
             en_q = f"What is {clean_desc}?"

    if "is called" in en_desc_lower:
         en_q = f"What {clean_desc}?"
         
    # Hindi Q: Use hi_desc as base
    # "शेर जंगल का राजा है" -> "जंगल का राजा कौन है?"
    hi_q = hi_desc
    if hi_name in hi_q:
        hi_q = hi_q.replace(hi_name, "कौन").replace("  ", " ") + "?"
    else:
        # Append Kaun
        hi_q = hi_q + " (कौन?)"

    return {
        "hi_q": hi_q,
        "en_q": en_q,
        "hi_a": hi_name,
        "en_a": en_name
    }

def main():
    with open('backend/new_batch_4_data.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    sections = re.split(r'\n(?=[^\n]*– Kids Learning)', content) # Split by Header lines like "🏢 BUILDINGS – Kids Learning"
    if len(sections) < 2:
        # Try splitting by just headers if they don't have "-- Kids Learning" all the time?
        # The user input has " – Kids Learning" for all major sections.
        pass

    data = {}
    
    # Regex for Header: Emoji TITLE – Kids Learning
    # But split might leave the header in the NEXT chunk or PREVIOUS?
    # re.split keeps the delimiter if capturing group? No.
    # Let's iterate lines.
    
    lines = content.splitlines()
    current_category = None
    buffer_items = []
    
    # Helper to flush buffer
    def flush(cat, items):
        if not cat or not items: return
        cat_key = cat.split('–')[0].strip().split(' ', 1)[-1].lower().replace(' ', '_') # "🏢 BUILDINGS" -> "buildings"
        if cat_key not in data: data[cat_key] = []
        
        for item in items:
            # Process item to Q&A
            qa = generate_question(cat_key.replace('_', ' '), item['en'], item['hi'], item['en_desc'], item['hi_desc'])
            qa['id'] = len(data[cat_key]) + 1
            data[cat_key].append(qa)

    current_item = None # {'en':, 'hi':, 'en_desc':, 'hi_desc':}
    
    for line in lines:
        line = line.strip()
        if not line: continue
        if line.startswith('----'): continue
        if "RHYME" in line: continue # Skip rhymes
        
        # New Section Header
        if "– Kids Learning" in line:
            # flush previous
            if current_category:
                if current_item: buffer_items.append(current_item)
                flush(current_category, buffer_items)
            
            # Start new
            current_category = line
            buffer_items = []
            current_item = None
            continue
            
        if not current_category: continue
        
        # Detect Item Header
        # Format 1: "1. Rose (Gulab)"
        # Format 2: "🏠 House (Ghar)"
        # Format 3: "Left (Baayan)" (No emoji sometimes?)
        
        # Regex for Item Header: (Emoji or Number or None) Name (Hindi)
        # We look for parens `(...)` containing hindi text.
        
        # Sub-header detection (e.g. "TYPES OF CLOTHES") -> Ignore or treat as part of flow?
        # If line allows, treat as decoration.
        if line.upper() == line and len(line) > 10 and "(" in line:
             # Likely a sub-header like "TYPES OF CLOTHES (Kapdo ke prakar)"
             # We can ignore it effectively? Or use it?
             # User wants questions about items.
             continue 

        # Item detection
        match = re.search(r'(?:[\d\.]+\s+|[\U00010000-\U0010ffff]\s+)?([A-Za-z\s/]+)\s*\((.+?)\)', line)
        if match:
            # Found a new item!
            if current_item:
                buffer_items.append(current_item)
            
            en_name = match.group(1).strip()
            hi_name = match.group(2).strip()
            
            # Edge case: "Name (Hindi) – Desc" on one line?
            # Check for dash
            rest_of_line = ""
            if "–" in line:
                parts = line.split("–")
                if len(parts) > 1:
                     # Desc is here
                     # "Dog (Kutta) – Guards house"
                     # match group 1 is "Dog", group 2 is "Kutta".
                     # Actually match might capture "Dog (Kutta) "
                     # Let's rely on split for one-liners
                     pass
            
            # Special logic for one-liners with dash
            if "–" in line and "(" in line:
                 # "Dog (Kutta) – Guards house"
                 # Extract names from left of dash
                 left = line.split("–")[0].strip()
                 desc = line.split("–")[1].strip()
                 
                 m2 = re.search(r'(?:[\d\.]+\s+|[\U00010000-\U0010ffff]\s+)?([A-Za-z\s/]+)\s*\((.+?)\)', left)
                 if m2:
                     en_name = m2.group(1).strip()
                     hi_name = m2.group(2).strip()
                     
                     # Check if next line is hindi desc
                     # We will set current_item and wait for next lines
                     current_item = {
                         'en': en_name,
                         'hi': hi_name,
                         'en_desc': desc, # Pre-fill desc
                         'hi_desc': '' # Will fill from next line
                     }
                     continue

            # Standard multi-line item
            # "1. Rose (Gulab)"
            current_item = {
                'en': en_name,
                'hi': hi_name,
                'en_desc': '',
                'hi_desc': ''
            }
        else:
            # It's a description line
            # Assume alternating En / Hi ? 
            # Or formatted?
            # "Rose is red."
            # "Gulab lal hai."
            if current_item:
                # Naive: Append to En if ascii, Hi if not?
                # Hindi chars range: \u0900-\u097F
                if any('\u0900' <= char <= '\u097F' for char in line):
                    current_item['hi_desc'] += line + " "
                else:
                    current_item['en_desc'] += line + " "

    # Flush last
    if current_category:
        if current_item: buffer_items.append(current_item)
        flush(current_category, buffer_items)
        
    # Write output
    with open('backend/batch_4_output.txt', 'w', encoding='utf-8') as out:
        out.write("BILINGUAL_GK_DATA_BATCH_4 = {\n")
        for key, items in data.items():
            out.write(f"    '{key}': [\n")
            for item in items:
                out.write(f"        {{\n")
                out.write(f"            'id': {item['id']},\n")
                out.write(f"            'hi_q': {json.dumps(item['hi_q'], ensure_ascii=False)},\n")
                out.write(f"            'en_q': {json.dumps(item['en_q'], ensure_ascii=False)},\n")
                out.write(f"            'hi_a': {json.dumps(item['hi_a'], ensure_ascii=False)},\n")
                out.write(f"            'en_a': {json.dumps(item['en_a'], ensure_ascii=False)}\n")
                out.write(f"        }},\n")
            out.write("    ],\n")
        out.write("}\n")
    print("Done. Output written to backend/batch_4_output.txt")

if __name__ == "__main__":
    main()
