with open('backend/new_batch_6_data.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the first separator
import re
match = re.search(r'(━+)', content)
if match:
    sep = match.group(1)
    with open('backend/separator_info.txt', 'w', encoding='utf-8') as out:
        out.write(f"Separator length: {len(sep)}\n")
        out.write(f"Separator: {repr(sep)}\n")
        
print("Separator info written")
