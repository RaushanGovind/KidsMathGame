import re
import json

def main():
    with open('backend/new_batch_6_data.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by separator (28 characters)
    blocks = re.split(r'━━━━━━━━━━━━━━━━━━━━━━━━━━━━', content)
    
    final_data = {}
    
    # Category mappings
    energy_foods = ['CARBOHYDRATES', 'PROTEINS', 'FATS', 'WATER']
    minerals = ['IRON', 'CALCIUM', 'IODINE', 'POTASSIUM', 'ZINC', 'PHOSPHORUS']
    vitamins = ['VITAMIN A', 'VITAMIN C', 'VITAMIN D', 'VITAMIN K', 'VITAMIN E', 'VITAMIN B']
    
    for block in blocks:
        block = block.strip()
        if not block or len(block) < 30: continue
        
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines: continue
        
        # Skip tips/rhymes
        if any(skip in block for skip in ['RHYME', 'WHY', 'MEMORY TRICK', 'MEMORY TIP', 'HEALTH HABIT', 'HEALTH RULE', 'BALANCED PLATE', 'EASY MEMORY']):
            continue
        
        header = lines[0]
        
        # Extract name: 🍚 CARBOHYDRATES (कार्बोहाइड्रेट)
        name_match = re.search(r'([A-Z\s/\-]+)\s*\(([^\)]+)\)', header)
        if not name_match:
            continue
        
        en_name = name_match.group(1).strip()
        hi_name = name_match.group(2).strip()
        
        # Determine category
        category = None
        
        if any(nutrient in en_name for nutrient in energy_foods):
            category = 'energy_foods'
        elif any(mineral in en_name for mineral in minerals):
            category = 'minerals'
        elif any(vitamin in en_name for vitamin in vitamins):
            category = 'vitamins'
        elif any(festival in en_name for festival in ['Independence Day', 'Republic Day', 'Gandhi Jayanti']):
            category = 'national_festivals'
        elif any(symbol in en_name for symbol in ['National Flag', 'National Emblem', 'National Animal', 'National Bird', 'National Flower', 'National Tree']):
            category = 'national_symbols'
        elif 'Inventor:' in block or 'Inventors:' in block:
            category = 'inventions'
        
        if not category:
            continue
        
        if category not in final_data:
            final_data[category] = []
        
        qa = None
        
        # NUTRITION
        if category in ['energy_foods', 'minerals', 'vitamins']:
            func_line = None
            func_hi_line = None
            for i, line in enumerate(lines):
                if line.startswith('Function:'):
                    # Text is on NEXT line
                    if i + 1 < len(lines):
                        func_line = lines[i + 1].strip()
                        # Hindi on line after that
                        if i + 2 < len(lines) and any('\u0900' <= c <= '\u097F' for c in lines[i + 2]):
                            func_hi_line = lines[i + 2].replace('काम:', '').strip()
                    break
            
            if func_line:
                qa = {
                    'en_q': f"What is the main function of {en_name}?",
                    'en_a': func_line,
                    'hi_q': f"{hi_name} का मुख्य काम क्या है?",
                    'hi_a': func_hi_line if func_hi_line else func_line
                }
        
        # INVENTIONS
        elif category == 'inventions':
            inventor = None
            for line in lines:
                if line.startswith('Inventor:') or line.startswith('Inventors:'):
                    inventor = line.split(':', 1)[1].strip()
                    break
            
            if inventor:
                qa = {
                    'en_q': f"Who invented the {en_name}?",
                    'en_a': inventor,
                    'hi_q': f"{hi_name} का आविष्कार किसने किया?",
                    'hi_a': inventor
                }
        
        # FESTIVALS
        elif category == 'national_festivals':
            date_line = next((l for l in lines if l.startswith('Date:')), None)
            if date_line:
                date = date_line.split(':')[1].strip()
                qa = {
                    'en_q': f"When is {en_name} celebrated?",
                    'en_a': date,
                    'hi_q': f"{hi_name} कब मनाया जाता है?",
                    'hi_a': date
                }
        
        # SYMBOLS
        elif category == 'national_symbols':
            fact = None
            fact_hi = None
            for i in range(1, min(len(lines), 5)):
                line = lines[i]
                if line and re.match(r'^[A-Z]', line) and not line.startswith('It '):
                    fact = line
                    if i + 1 < len(lines) and any('\u0900' <= c <= '\u097F' for c in lines[i + 1]):
                        fact_hi = lines[i + 1]
                    break
            
            if fact:
                qa = {
                    'en_q': f"What is India's {en_name}?",
                    'en_a': fact,
                    'hi_q': f"भारत का {hi_name} क्या है?",
                    'hi_a': fact_hi if fact_hi else fact
                }
        
        if qa:
            qa['id'] = len(final_data[category]) + 1
            final_data[category].append(qa)
    
    # Write Output
    with open('backend/batch_6_output.txt', 'w', encoding='utf-8') as out:
        out.write("BILINGUAL_GK_DATA_BATCH_6 = {\n")
        for key, items in final_data.items():
            if not items: continue
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
    
    print(f"Generated {sum(len(items) for items in final_data.values())} Q&A pairs across {len(final_data)} categories")
    for cat, items in final_data.items():
        print(f"   - {cat}: {len(items)} items")

if __name__ == "__main__":
    main()
