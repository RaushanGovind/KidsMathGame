from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, BeforeValidator
from typing import List, Optional, Annotated
import random
import os
import motor.motor_asyncio
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Kids Hero API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.math_hero_db
score_collection = database.get_collection("scores_collection")
content_collection = database.get_collection("game_content")

# --- Models ---
# Helper to handle ObjectId convert to string
PyObjectId = Annotated[str, BeforeValidator(str)]

class MathProblem(BaseModel):
    id: int
    question: str
    answer: int
    options: List[int]
    type: str

class ScoreSubmission(BaseModel):
    username: str
    score: int
    game_type: str
    
class ScoreModel(ScoreSubmission):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

# --- Routes ---

@app.get("/")
async def root():
    return {"message": "Welcome to Kids Math Game API", "status": "online", "db": "connected"}

@app.get("/api/problems/{game_type}")
async def get_problems(game_type: str, count: int = 10, difficulty: int = 1):
    problems = []
    for i in range(count):
        if game_type == "addition":
            a = random.randint(1, 10 * difficulty)
            b = random.randint(1, 10 * difficulty)
            ans = a + b
            question = f"{a} + {b}"
        elif game_type == "subtraction":
            a = random.randint(5 * difficulty, 20 * difficulty)
            b = random.randint(1, a)
            ans = a - b
            question = f"{a} - {b}"
        elif game_type == "multiplication":
            a = random.randint(1, 5 + difficulty)
            b = random.randint(1, 10)
            ans = a * b
            question = f"{a} × {b}"
        elif game_type == "division":
            b = random.randint(1, 10) # Divisor
            ans = random.randint(1, 10) # Quoteint
            a = b * ans
            question = f"{a} ÷ {b}"
        else:
            # Default
            a, b = random.randint(1, 10), random.randint(1, 10)
            ans = a + b
            question = f"{a} + {b}"
            game_type = "addition"

        # Generate options
        options = {ans}
        while len(options) < 4:
            if difficulty == 1:
                wrong = ans + random.randint(-5, 5)
            else:
                wrong = ans + random.randint(-10, 10)
            
            if wrong >= 0 and wrong != ans:
                options.add(wrong)
        
        opts_list = list(options)
        random.shuffle(opts_list)

        problems.append({
            "id": i,
            "question": question,
            "answer": ans,
            "options": opts_list,
            "type": game_type
        })
    
    return problems

@app.post("/api/scores")
async def save_score(submission: ScoreSubmission):
    score_data = submission.dict()
    new_score = await score_collection.insert_one(score_data)
    created_score = await score_collection.find_one({"_id": new_score.inserted_id})
    return {"status": "success", "message": f"Score saved for {submission.username}", "id": str(created_score["_id"])}

@app.get("/api/leaderboard")
async def get_leaderboard():
    scores = []
    cursor = score_collection.find().sort("score", -1).limit(10)
    async for score in cursor:
        score["id"] = str(score["_id"])
        del score["_id"]
        scores.append(score)
    return scores

@app.get("/api/content/{game_id}")
async def get_game_content(game_id: str):
    content = await content_collection.find_one({"game_id": game_id})
    if content:
        content["_id"] = str(content["_id"])
        return content
    else:
        # Fallback for now if not seeded
        raise HTTPException(status_code=404, detail="Game content not found")

if __name__ == "__main__":
    import uvicorn
    # Clean up port usage if necessary or just run
    uvicorn.run(app, host="0.0.0.0", port=8001)
