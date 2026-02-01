"""
Quick script to verify what content is in the cloud database
"""
import os
import asyncio
import motor.motor_asyncio
from dotenv import load_dotenv

load_dotenv()

async def check_all_content():
    MONGO_DETAILS = os.getenv("MONGO_DETAILS")
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
    database = client.math_hero_db
    content_collection = database.get_collection("game_content")
    
    print("📊 Checking all game content in cloud database...\n")
    
    # Get all game IDs
    all_games = await content_collection.find({}, {"game_id": 1}).to_list(length=100)
    
    print(f"✅ Total games in database: {len(all_games)}\n")
    
    for game in all_games:
        game_id = game.get("game_id")
        print(f"   - {game_id}")
    
    # Check specific games
    print("\n🔍 Checking specific games:\n")
    
    games_to_check = [
        "hindi_varnamala",
        "hindi_two_letter", 
        "hindi_three_letter",
        "hindi_stories",
        "alphabet",
        "english_nouns",
        "verbs",
        "bilingual_gk"
    ]
    
    for game_id in games_to_check:
        game = await content_collection.find_one({"game_id": game_id})
        if game:
            # Count content
            content = game.get("content", {})
            if isinstance(content, dict):
                count = sum(len(v) if isinstance(v, list) else 1 for v in content.values())
            elif isinstance(content, list):
                count = len(content)
            else:
                count = 0
            
            print(f"✅ {game_id}: {count} items")
        else:
            print(f"❌ {game_id}: MISSING")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_all_content())
