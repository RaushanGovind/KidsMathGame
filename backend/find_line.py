with open(r"c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\backend\seed_content.py", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "BILINGUAL_GK_DATA = {" in line:
            print(f"Found at line: {i}")
            break
