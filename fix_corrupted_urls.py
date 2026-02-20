
import os

components_dir = r'c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\src\components'

for filename in os.listdir(components_dir):
    if filename.endswith('.jsx'):
        filepath = os.path.join(components_dir, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if "\\'http://localhost:8000\\'" in content:
            new_content = content.replace("\\'http://localhost:8000\\'", "'http://localhost:8000'")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed: {filename}")

print("Done!")
