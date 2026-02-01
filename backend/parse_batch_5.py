import re
import json

def generate_script_question(category, facts):
    # Convert list of facts into a few solid questions
    questions = []
    
    # Heuristic: combine 2-3 facts into one Q/A
    # OR create one Q for each distinct fact if it's substantial
    
    # We will try to map common patterns
    for fact in facts:
        fact = fact.strip()
        if not fact: continue
        
        # English / Hindi split?
        # The script provided is mostly English but has headers like "(English + Hindi)" for some.
        # But the animation scripts are mostly English.
        # "Hello! I am the Sun... I am a star..."
        # -> Q: "Who am I? I am a star..." A: "Sun"
        
        # Let's try key-value extraction
        pass

    return []

def main():
    with open('backend/new_batch_5_data.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by major headers (EMOJI TITLE)
    # They often have "FOR KIDS" or "ANIMATION SCRIPT"
    
    # Regex for section start
    # "📚 CLASSROOM RULES..."
    # "🌟 GOOD MANNERS..."
    # "🌾 FARMING WORKS..."
    # "🌞 SOLAR SYSTEM..."
    
    sections = re.split(r'\n(?=[^\n]*[A-Z\s]+–|[^\n]*FOR KIDS)', content)
    # The split regex is tricky. Let's iterate lines again, it's safer.
    
    data = {}
    lines = content.splitlines()
    
    current_category = None
    current_sub_item = None # For standard lists
    buffer_items = []
    
    # For Animation Scripts, we want to collect "Scenes" or "Narrator" lines
    is_script = False
    script_facts = [] 
    
    # Mappings for category keys
    def clean_key(header):
        # Remove emojis
        text = re.sub(r'[^\w\s]', '', header)
        # Remove "FOR KIDS", "ANIMATION SCRIPT"
        text = text.replace("FOR KIDS", "").replace("ANIMATION SCRIPT", "").replace("Rules", "").replace("Vocabulary", "").strip()
        return text.lower().replace(" ", "_")

    for line in lines:
        line = line.strip()
        if not line or line.startswith('---'): continue
        
        # Detect Header
        if ("FOR KIDS" in line or "ANIMATION SCRIPT" in line) and len(line) < 100:
             # New Section
             current_category = clean_key(line)
             is_script = "SCRIPT" in line
             # Reset buffers
             current_sub_item = None
             script_facts = []
             if current_category not in data: data[current_category] = []
             continue

        if not current_category: continue

        # Strategy 1: Standard List
        if not is_script:
            # Check for Item Header
            match = re.search(r'[\U00010000-\U0010ffff].+?\(.+?\)', line) or \
                    re.search(r'^[A-Z\s]+$|^[A-Z\s]+\(.+\)$', line) 
            
            # Simple check: Emoji at start?
            emoji_start = re.match(r'^[\U00010000-\U0010ffff]', line)
            
            if emoji_start or (line.isupper() and len(line) < 50):
                # Likely a new item
                parts = re.split(r'[\(\)]', line)
                en_title = parts[0].strip()
                en_title = re.sub(r'[\U00010000-\U0010ffff]', '', en_title).strip()
                
                hi_title = ""
                if len(parts) > 1: hi_title = parts[1].strip()
                
                current_sub_item = {
                    'en_title': en_title,
                    'hi_title': hi_title,
                    'en_desc': '',
                    'hi_desc': ''
                }
                data[current_category].append(current_sub_item)
            else:
                # Description lines
                if current_sub_item:
                    # Clean noise
                    if "━━" in line: continue
                    
                    if any('\u0900' <= char <= '\u097F' for char in line):
                        current_sub_item['hi_desc'] += line + " "
                    else:
                        current_sub_item['en_desc'] += line + " "

        # Strategy 2: Animation Script
        else:
            if ":" in line:
                speaker, text = line.split(":", 1)
                text = text.replace('"', '').strip() # Remove quotes
                if "SCENE" in speaker: continue # Skip headers
                if not text: continue
                
                # Check for stage directions (Scene descriptions often have no speaker but might be captured here if line had ":")
                # But here we split by colon.
                
                # Skip Narrator for now unless we can parse facts
                # Skip "Text on screen"
                skip_speakers = ["Narrator", "Text on screen", "Text", "Kids", "Mother", "everyone", "Child", "All vehicles"]
                
                # Heuristic: If Speaker is a cool object (Sun, Moon, Globe, Traffic Light, Doctor, Teacher)
                # Keep it as "Who am I?"
                
                valid_speakers = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", 
                                  "Globe", "Traffic Light", "Doctor", "Teacher", "Earth"]
                
                # Loose match
                matched_speaker = next((s for s in valid_speakers if s.lower() in speaker.lower()), None)
                
                if matched_speaker:
                    # Filter out short/empty
                    if len(text) < 5: continue
                    
                    # Create "Who am I?"
                    q_text = text
                    
                    # English Only usually in scripts provided
                    # We can try to provide a generic Hindi Q or skip Hindi
                    
                    qa = {
                         "en_q": f"I say: '{text}' - Who am I?",
                         "en_a": matched_speaker,
                         "hi_q": f"कथन: '{text}' - मैं कौन हूँ?", # Placeholder Hindi
                         "hi_a": matched_speaker 
                    }
                    
                    item = {
                        'id': len(data[current_category]) + 1,
                        'hi_q': qa['hi_q'],
                        'en_q': qa['en_q'],
                        'hi_a': qa['hi_a'],
                        'en_a': qa['en_a']
                    }
                    data[current_category].append(item)

    # Post-Process Standard Lists to Q&A
    final_data = {}
    
    for cat, items in data.items():
        if not items: continue
        final_data[cat] = []
        
        for i, item in enumerate(items):
            if 'en_q' in item:
                final_data[cat].append(item)
                continue
                
            q_text = item['en_desc'].strip().replace('━━━━━━━━━━━━━━━━━━━━━━', '')
            a_text = item['en_title']
            
            hi_q_text = item['hi_desc'].strip().replace('━━━━━━━━━━━━━━━━━━━━━━', '')
            hi_a_text = item['hi_title']
            
            if not q_text and not hi_q_text: continue # Skip empty items
            
            # Formatting
            if "farming" in cat:
                qa = {
                    "en_q": f"Who/What is: {q_text}?",
                    "en_a": a_text,
                    "hi_q": f"कौन/क्या है: {hi_q_text}?",
                    "hi_a": hi_a_text
                }
            elif "rules" in cat or "manners" in cat:
                qa = {
                    "en_q": f"Rule: {q_text}",
                    "en_a": a_text,
                    "hi_q": f"नियम: {hi_q_text}",
                    "hi_a": hi_a_text
                }
            else:
                 qa = {
                    "en_q": f"What is {a_text}?",
                    "en_a": q_text,
                    "hi_q": f"{hi_a_text} क्या है?",
                    "hi_a": hi_q_text
                 }

            qa['id'] = i + 1
            final_data[cat].append(qa)

    # Write Output
    with open('backend/batch_5_output.txt', 'w', encoding='utf-8') as out:
        out.write("BILINGUAL_GK_DATA_BATCH_5 = {\n")
        for key, items in final_data.items():
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

if __name__ == "__main__":
    main()
