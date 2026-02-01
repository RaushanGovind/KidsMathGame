import re

# Test the regex
test_header = "🍚 CARBOHYDRATES (कार्बोहाइड्रेट)"
print(f"Testing header: {test_header}")

match = re.search(r'([A-Z\s/\-]+)\s*\(([^\)]+)\)', test_header)
if match:
    print(f"Match found!")
    print(f"EN: '{match.group(1).strip()}'")
    print(f"HI: '{match.group(2).strip()}'")
else:
    print("No match")

# Try without emoji
test_header2 = "CARBOHYDRATES (कार्बोहाइड्रेट)"
print(f"\nTesting without emoji: {test_header2}")
match2 = re.search(r'([A-Z\s/\-]+)\s*\(([^\)]+)\)', test_header2)
if match2:
    print(f"Match found!")
    print(f"EN: '{match2.group(1).strip()}'")
    print(f"HI: '{match2.group(2).strip()}'")
else:
    print("No match")
