
import json
import re

def parse_new_gk_data(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    sections = re.split(r'\[BILINGUAL_GK_TOPIC_(.*?)\]', content)
    
    topics_data = {}
    
    for i in range(1, len(sections), 2):
        topic_key = sections[i].lower()
        topic_content = sections[i+1].strip()
        
        questions = []
        lines = topic_content.split('\n')
        current_q = {}
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if line.startswith('Q') and line[1:].isdigit():
                if current_q.get('hi_q') and current_q.get('en_a'):
                     questions.append(current_q)
                current_q = {'id': len(questions) + 1}
            elif line.startswith('HI_Q:'):
                current_q['hi_q'] = line.replace('HI_Q:', '').strip()
            elif line.startswith('EN_Q:'):
                current_q['en_q'] = line.replace('EN_Q:', '').strip()
            elif line.startswith('HI_A:'):
                current_q['hi_a'] = line.replace('HI_A:', '').strip()
            elif line.startswith('EN_A:'):
                current_q['en_a'] = line.replace('EN_A:', '').strip()

        if current_q.get('hi_q') and current_q.get('en_a'):
            questions.append(current_q)
            
        if questions:
            topics_data[topic_key] = questions

    return topics_data

if __name__ == "__main__":
    new_topics = parse_new_gk_data("backend/new_raw_gk_2.txt")
    
    print("Parsed topics:", list(new_topics.keys()))
    
    python_code = ""
    for topic, questions in new_topics.items():
        python_code += f"    '{topic}': {json.dumps(questions, ensure_ascii=False, indent=8)},\n"

    with open('backend/new_gk_formatted_v2.txt', 'w', encoding='utf-8') as f:
        f.write(python_code)
