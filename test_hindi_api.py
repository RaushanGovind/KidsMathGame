"""
Test if live backend is serving Hindi Varnamala correctly
"""
import requests
import json

BACKEND_URL = "https://kids-math-game-api.onrender.com"

print("🧪 Testing Hindi Varnamala API...\n")

try:
    print("📡 Fetching: /api/content/hindi_varnamala")
    response = requests.get(f"{BACKEND_URL}/api/content/hindi_varnamala", timeout=60)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Success! Got response")
        
        # Check structure
        print(f"\n📊 Data structure:")
        for key in data.keys():
            print(f"   - {key}: {type(data[key])}")
        
        # Check content specifically
        if 'content' in data:
            content = data['content']
            print(f"\n📝 Content structure:")
            if isinstance(content, dict):
                for key, value in content.items():
                    if isinstance(value, list):
                        print(f"   - {key}: {len(value)} items")
                    else:
                        print(f"   - {key}: {type(value)}")
                
                # Show sample item
                if 'swar' in content and len(content['swar']) > 0:
                    print(f"\n🔍 Sample Swar item:")
                    print(json.dumps(content['swar'][0], indent=2, ensure_ascii=False))
            elif isinstance(content, list):
                print(f"   - Array with {len(content)} items")
        else:
            print("\n⚠️ No 'content' key found!")
            print(f"Available keys: {list(data.keys())}")
            
    else:
        print(f"\n❌ Error: {response.status_code}")
        print(response.text[:500])
        
except requests.exceptions.Timeout:
    print("⏱️ Request timed out! The backend might be sleeping.")
    print("   This is normal for Render free tier on first request.")
    print("   Try again in 30 seconds.")
except Exception as e:
    print(f"❌ Error: {str(e)}")
