import re
import json

def parse_qa_section(text):
    questions = []
    # Pattern to match Q block
    # Q1\nHI_Q: ...\nEN_Q: ...\nHI_A: ...\nEN_A: ...
    
    # Split by "Q" followed by digits
    blocks = re.split(r'\nQ\d+\n', '\n' + text)
    
    count = 1
    for block in blocks:
        if not block.strip(): continue
        
        item = {"id": count}
        
        hiq_match = re.search(r'HI_Q:\s*(.*)', block)
        enq_match = re.search(r'EN_Q:\s*(.*)', block)
        hia_match = re.search(r'HI_A:\s*(.*)', block)
        ena_match = re.search(r'EN_A:\s*(.*)', block)
        
        if hiq_match and enq_match and hia_match and ena_match:
            item['hi_q'] = hiq_match.group(1).strip()
            item['en_q'] = enq_match.group(1).strip()
            item['hi_a'] = hia_match.group(1).strip()
            item['en_a'] = ena_match.group(1).strip()
            questions.append(item)
            count += 1
            
    return questions

def parse_fact_section(text, topic_type="animal"):
    questions = []
    lines = text.split('\n')
    count = 1
    
    current_category = "General"
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line: continue
        if line.startswith('----'): continue
        if line.startswith('['): continue # Section headers
        
        # Check for category header (Emoji + Text)
        if any(char in line for char in ['🏠', '🌳', '🚜', '🌊', '🦜', '🛣️', '🚢', '✈️', '🚦']):
            # It's likely a header
            # remove emoji and parens for category key if needed, or just ignore
            continue
            
        if "RHYME" in line:
            break # Stop at rhyme
            
        # Match "Name (HindiName) – EnglishDesc"
        # Dog (कुत्ता) – Guards the house
        match = re.match(r'(.+?)\s*\((.+?)\)\s*–\s*(.+)', line)
        if match:
            en_name = match.group(1).strip()
            hi_name = match.group(2).strip()
            en_desc = match.group(3).strip()
            
            # Look ahead for Hindi desc
            hi_desc = ""
            if i + 1 < len(lines):
                 hi_desc = lines[i+1].strip()
            
            # Construct Question
            # Simple heuristic
            
            # English Q
            if topic_type == "traffic":
                # Red light – Stop
                # Q: What does Red light mean?
                en_q = f"What does {en_name} mean?"
                if "light" not in en_name.lower():
                     en_q = f"What dictates {en_name}?" # Fallback
                
                # Hindi Q
                # लाल बत्ती – रुकें
                # Q: लाल बत्ती का क्या मतलब है?
                hi_q = f"{hi_name} का क्या मतलब है?"
                
                en_a = en_desc
                hi_a = hi_desc
                
            else:
                # Animals / Transport
                # Q: Who guards the house?
                # A: Dog
                
                # EN Q Gen
                q_start = "Which animal"
                if topic_type == "transport":
                    q_start = "Which vehicle"
                
                # Check for "Used for/by"
                lower_desc = en_desc.lower()
                
                # Special cases based on description start
                if lower_desc.startswith("guards") or lower_desc.startswith("catches") or lower_desc.startswith("gives") or lower_desc.startswith("loves") or lower_desc.startswith("swims") or lower_desc.startswith("runs") or lower_desc.startswith("carries"):
                     # Verb start -> Who helps...?
                     # "Guards the house" -> "Who guards the house?"
                     # But we want "Which animal..." to be specific? "Who" is fine for kids.
                     # Actually user wants "Which animal guards the house?"
                     verb_part = en_desc
                     # Lowercase first letter if strictly abiding grammar, but CamelCase is fine for headers
                     # Let's just prepend "Who " or "Which animal "
                     
                     en_q = f"Who {lower_desc}?"
                     if topic_type == "animal":
                         en_q = f"Which animal {lower_desc}?"
                     
                else:
                    # Noun start "King of jungle", "The largest..."
                    # "Which animal is the King of the jungle?"
                    en_q = f"Which is {lower_desc}?"
                    if topic_type == "animal":
                         en_q = f"Which animal is {lower_desc}?"
                    elif topic_type == "transport":
                        if "used" in lower_desc:
                            # Used by families -> What is used by families?
                            en_q = f"What is {lower_desc}?"
                        else:
                            en_q = f"Which vehicle is {lower_desc}?"

                # Hindi Q Gen
                # "कुत्ता घर की रखवाली करता है" (Dog guards house) -> "घर की रखवाली कौन करता है?"
                # Strategy: Take the hindi sentence. Remove the Name (Subject). Add "कौन" (Who).
                # But matching the name in the sentence is hard without exact string match.
                # "कुत्ता" vs "कुत्ता घर..." -> easy.
                
                hi_q_gen = hi_desc
                if hi_name in hi_desc:
                    # Remove name
                    temp = hi_desc.replace(hi_name, "").strip()
                    # Add Kaun/Kya
                    # If animal -> Kaun (Who)
                    # "घर की रखवाली करता है" -> "घर की रखवाली कौन करता है?"
                    if topic_type == "animal":
                        # Post-processing to make it grammatically okay
                        # "घर की रखवाली करता है" -> Prepend "कौन" ?? -> "कौन घर की रखवाली करता है?" (Understandable)
                        # Or better: Replace name with "कौन सा जानवर"
                        hi_q_gen = hi_desc.replace(hi_name, "कौन सा जानवर") + "?"
                    elif topic_type == "transport":
                         hi_q_gen = hi_desc.replace(hi_name, "कौन सा वाहन") + "?"
                         
                else:
                    # Fallback if name not in desc exactly
                    hi_q_gen = f"{hi_desc} (कौन?)"
                
                en_a = en_name
                hi_a = hi_name

            item = {
                "id": count,
                "hi_q": hi_q_gen,
                "en_q": en_q,
                "hi_a": hi_a,
                "en_a": en_a
            }
            questions.append(item)
            count += 1
            
    return questions

def main():
    with open('backend/new_batch_3_data.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    # Split sections
    sections = re.split(r'\[(.*?)_SECTION\]', content)
    
    data = {}
    
    current_key = None
    for i in range(1, len(sections), 2):
        key = sections[i]
        text = sections[i+1]
        
        print(f"Processing {key}...")
        
        if key == 'ANIMALS':
            data['animals'] = parse_fact_section(text, "animal")
        elif key == 'TRANSPORT':
            data['transport'] = parse_fact_section(text, "transport")
        elif key == 'LANDFORMS':
            data['landforms'] = parse_qa_section(text)
        elif key == 'WATER_ANIMALS':
            data['water_animals'] = parse_qa_section(text)

    # Write output to file
    with open('backend/batch_3_output.txt', 'w', encoding='utf-8') as out:
        out.write("BILINGUAL_GK_DATA_UPDATE = {\n")
        for key, items in data.items():
            out.write(f"    '{key.lower()}': [\n")
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
    print("Done. Output written to backend/batch_3_output.txt")

if __name__ == "__main__":
    main()
