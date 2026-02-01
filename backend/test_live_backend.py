"""
Test if backend is serving data correctly
"""
import requests

BACKEND_URL = "https://kids-math-game-api.onrender.com"

print("🧪 Testing Backend API...\n")

# Test endpoints
endpoints = [
    "/api/content/hindi_varnamala",
    "/api/content/alphabet",
    "/api/content/bilingual_gk"
]

for endpoint in endpoints:
    try:
        print(f"📡 Testing: {endpoint}")
        response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Status: {response.status_code}")
            
            # Check what data we got
            if 'content' in data:
                if isinstance(data['content'], dict):
                    print(f"   ✅ Content keys: {len(data['content'])} categories")
                elif isinstance(data['content'], list):
                    print(f"   ✅ Content: {len(data['content'])} items")
            elif 'topics' in data:
                print(f"   ✅ Topics: {len(data['topics'])} topics")
            elif 'sets' in data:
                print(f"   ✅ Sets: {len(data['sets'])} sets")
            else:
                print(f"   ⚠️ Unexpected structure: {list(data.keys())}")
        else:
            print(f"   ❌ Status: {response.status_code}")
            print(f"   Error: {response.text[:100]}")
            
    except requests.exceptions.Timeout:
        print(f"   ⏱️ Timeout (backend sleeping, try again)")
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
    
    print()

print("\n💡 If all tests pass, the backend is working!")
print("   Problem is likely Vercel environment variable.")
