import re

with open('backend/new_batch_6_data.txt', 'r', encoding='utf-8') as f:
    content = f.read()

blocks = re.split(r'━━━━━━━━━━━━━━━━━━━━━━', content)

with open('backend/debug_blocks.txt', 'w', encoding='utf-8') as out:
    out.write(f"Total blocks: {len(blocks)}\n\n")
    
    for i, block in enumerate(blocks[:10]):  # First 10 blocks
        block = block.strip()
        if not block:
            out.write(f"Block {i}: EMPTY\n\n")
            continue
        
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines:
            out.write(f"Block {i}: NO LINES\n\n")
            continue
        
        header = lines[0]
        out.write(f"Block {i}:\n")
        out.write(f"  Header: {header}\n")
        out.write(f"  Lines: {len(lines)}\n")
        
        # Try regex
        match = re.search(r'([A-Z\s/\-]+)\s*\(([^\)]+)\)', header)
        if match:
            out.write(f"  EN: {match.group(1).strip()}\n")
            out.write(f"  HI: {match.group(2).strip()}\n")
        else:
            out.write(f"  NO MATCH\n")
        
        out.write("\n")

print("Debug output written to backend/debug_blocks.txt")
