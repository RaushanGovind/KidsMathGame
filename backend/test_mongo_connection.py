import os
import asyncio
import motor.motor_asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_connection():
    """Test MongoDB Atlas connection"""
    MONGO_DETAILS = os.getenv("MONGO_DETAILS")
    
    if not MONGO_DETAILS:
        print("❌ ERROR: MONGO_DETAILS not found in .env file")
        return
    
    print("🔄 Testing MongoDB Atlas connection...")
    print(f"📍 Connection string: {MONGO_DETAILS[:50]}...")
    
    try:
        # Create client
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        
        # Get database info
        database = client.math_hero_db
        
        # List collections
        collections = await database.list_collection_names()
        print(f"\n📊 Database: math_hero_db")
        print(f"📁 Collections found: {len(collections)}")
        for col in collections:
            count = await database[col].count_documents({})
            print(f"   - {col}: {count} documents")
        
        # Check game_content specifically
        content_collection = database.get_collection("game_content")
        
        # Check for bilingual_gk
        bilingual_gk = await content_collection.find_one({"game_id": "bilingual_gk"})
        if bilingual_gk:
            topics_count = len(bilingual_gk.get("topics", {}))
            sets_count = len(bilingual_gk.get("sets", {}))
            print(f"\n🎮 Bilingual GK Content:")
            print(f"   - Topics: {topics_count}")
            print(f"   - Sets: {sets_count}")
            
            # Check for physics topics
            topics = bilingual_gk.get("topics", {})
            physics_topics = ['physics_basics', 'electricity', 'energy', 'magnets', 
                             'sound', 'heat', 'gravity', 'simple_machines']
            
            found_physics = [t for t in physics_topics if t in topics]
            print(f"\n⚛️ Physics Topics Found: {len(found_physics)}/{len(physics_topics)}")
            for topic in found_physics:
                items = topics[topic]
                print(f"   - {topic}: {len(items)} questions")
            
            if len(found_physics) < len(physics_topics):
                missing = [t for t in physics_topics if t not in topics]
                print(f"\n⚠️ Missing Physics Topics: {missing}")
        else:
            print("\n⚠️ No 'bilingual_gk' content found in database!")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print("\n💡 Troubleshooting:")
        print("   1. Check your MongoDB Atlas cluster is running")
        print("   2. Verify username and password are correct")
        print("   3. Ensure IP whitelist includes your IP (or use 0.0.0.0/0)")
        

if __name__ == "__main__":
    asyncio.run(test_connection())
