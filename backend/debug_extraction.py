import re

with open('backend/new_batch_6_data.txt', 'r', encoding='utf-8') as f:
    content = f.read()

blocks = re.split(r'━━━━━━━━━━━━━━━━━━━━━━━━━━━━', content)

with open('backend/debug_extraction.txt', 'w', encoding='utf-8') as out:
    for i, block in enumerate(blocks[:10]):
        block = block.strip()
        if not block or len(block) < 30: continue
        
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines: continue
        
        # Skip tips
        if any(skip in block for skip in ['RHYME', 'WHY', 'MEMORY TRICK']):
            continue
        
        header = lines[0]
        match = re.search(r'([A-Z\s/\-]+)\s*\(([^\)]+)\)', header)
        if not match:
            continue
        
        en_name = match.group(1).strip()
        hi_name = match.group(2).strip()
        
        out.write(f"Block {i}: {en_name}\n")
        out.write(f"  Total lines: {len(lines)}\n")
        
        # Check for Function
        func_found = False
        for j, line in enumerate(lines):
            if line.startswith('Function:'):
                func_found = True
                out.write(f"  Function found at line {j}: {line}\n")
                if j + 1 < len(lines):
                    out.write(f"  Next line: {lines[j+1]}\n")
                break
        
        if not func_found:
            out.write(f"  NO FUNCTION LINE FOUND\n")
            out.write(f"  First 5 lines:\n")
            for j, line in enumerate(lines[:5]):
                out.write(f"    {j}: {line}\n")
        
        out.write("\n")

print("Extraction debug written")
