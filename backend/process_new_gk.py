
import json
import re

def parse_new_gk_data(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by topics using the [BILINGUAL_GK_TOPIC_...] tag
    # The regex will capture the topic name and the content following it
    sections = re.split(r'\[BILINGUAL_GK_TOPIC_(.*?)\]', content)
    
    # sections[0] is usually empty or preamble
    # sections[1] is topic name, sections[2] is content, sections[3] is topic name, etc.
    
    topics_data = {}
    
    for i in range(1, len(sections), 2):
        topic_key = sections[i].lower()
        topic_content = sections[i+1].strip()
        
        # Parse questions in this topic
        # Split by "Q<number>" pattern
        questions = []
        q_blocks = re.split(r'\nQ\d+\n', '\n' + topic_content) # Hack to catch first Q1
        
        # If the split didn't work beautifully due to various formats, try line-by-line state machine
        if len(q_blocks) < 2:
             # Fallback: Regex for Q blocks
             pass

        # Let's use a robust line loop for each topic content
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

        # Add the last one
        if current_q.get('hi_q') and current_q.get('en_a'):
            questions.append(current_q)
            
        if questions:
            topics_data[topic_key] = questions

    return topics_data

if __name__ == "__main__":
    new_topics = parse_new_gk_data("backend/new_raw_gk.txt")
    
    # Print keys to verify
    print("Parsed topics:", list(new_topics.keys()))
    
    # Generate Python code to append this to the existing dictionary
    # accessing BILINGUAL_GK_DATA['topics']
    
    python_code = ""
    for topic, questions in new_topics.items():
        # Ensure we don't have broken questions (like the School Life Q8)
        # The parser logic above naturally skips incomplete questions at the end if EN_A is missing
        python_code += f"    '{topic}': {json.dumps(questions, ensure_ascii=False, indent=8)},\n"

    with open('backend/new_gk_formatted.txt', 'w', encoding='utf-8') as f:
        f.write(python_code)
