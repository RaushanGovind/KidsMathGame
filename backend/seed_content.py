import os
import asyncio
import motor.motor_asyncio
from dotenv import load_dotenv

# Load env
load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.math_hero_db
content_collection = database.get_collection("game_content")

# --- DATA ---

MENTAL_MATH_DATA = {
    "game_id": "mental_math",
    "title": "Mental Math",
    "level_1": {
        "addition": {
            "title": "Quick Addition (+)",
            "color": "#E74C3C",
            "items": [
                { "q": "5 + 3", "a": "8" },
                { "q": "10 + 6", "a": "16" },
                { "q": "20 + 5", "a": "25" },
                { "q": "7 + 7", "a": "14" },
                { "q": "9 + 4", "a": "13" }
            ]
        },
        "subtraction": {
            "title": "Quick Subtraction (-)",
            "color": "#3498DB",
            "items": [
                { "q": "10 - 2", "a": "8" },
                { "q": "15 - 5", "a": "10" },
                { "q": "20 - 10", "a": "10" },
                { "q": "18 - 3", "a": "15" },
                { "q": "25 - 5", "a": "20" }
            ]
        },
        "multiplication": {
            "title": "Easy Tables (x)",
            "color": "#F1C40F",
            "items": [
                { "q": "2 × 3", "a": "6" },
                { "q": "5 × 2", "a": "10" },
                { "q": "4 × 5", "a": "20" },
                { "q": "10 × 3", "a": "30" },
                { "q": "6 × 2", "a": "12" }
            ]
        },
        "division": {
            "title": "Easy Division (÷)",
            "color": "#9B59B6",
            "items": [
                { "q": "10 ÷ 2", "a": "5" },
                { "q": "20 ÷ 4", "a": "5" },
                { "q": "12 ÷ 3", "a": "4" },
                { "q": "16 ÷ 2", "a": "8" },
                { "q": "15 ÷ 5", "a": "3" }
            ]
        },
        "bonds": {
            "title": "Make 10 (Bonds)",
            "color": "#2ECC71",
            "description": "Pairs that make 10",
            "items": [
                { "q": "1 + 9", "a": "10" },
                { "q": "2 + 8", "a": "10" },
                { "q": "3 + 7", "a": "10" },
                { "q": "4 + 6", "a": "10" },
                { "q": "5 + 5", "a": "10" }
            ]
        },
        "tricks": {
            "title": "Magic Tricks ✨",
            "color": "#8E44AD",
            "type": "html",
            "content": [
                { "title": "Add 9 Trick", "text": "To add 9, add 10 and take away 1.\nExample: 8 + 9 → 8 + 10 = 18, then 18 - 1 = 17" },
                { "title": "Double Trick", "text": "Memorize doubles!\n6 + 6 = 12\n7 + 7 = 14" }
            ]
        }
    },
    "level_2": {
        "add_parts": {
            "title": "Add in Parts",
            "color": "#E67E22",
            "description": "Break the second number!",
            "items": [
                { "q": "27 + 5", "a": "32 (27+3+2)" },
                { "q": "46 + 8", "a": "54 (46+4+4)" }
            ]
        },
        "sub_parts": {
            "title": "Subtract Parts",
            "color": "#16A085",
            "description": "Break to nearest 10",
            "items": [
                { "q": "32 - 6", "a": "26 (32-2-4)" },
                { "q": "50 - 9", "a": "41 (50-10+1)" }
            ]
        },
        "mult_9": {
            "title": "Multiply by 9",
            "color": "#8E44AD",
            "description": "Multiply by 10, then subtract one group",
            "items": [
                { "q": "6 × 9", "a": "54 (60-6)" },
                { "q": "8 × 9", "a": "72 (80-8)" }
            ]
        },
        "halving": {
            "title": "Divide by 4",
            "color": "#2980B9",
            "description": "Half and Half again!",
            "items": [
                { "q": "24 ÷ 4", "a": "6 (Half 12, Half 6)" },
                { "q": "36 ÷ 4", "a": "9 (Half 18, Half 9)" }
            ]
        },
        "bonds_100": {
            "title": "Pairs to 100",
            "color": "#27AE60",
            "description": "Make 100!",
            "items": [
                { "q": "60 + 40", "a": "100" },
                { "q": "70 + 30", "a": "100" },
                { "q": "25 + 75", "a": "100" },
                { "q": "45 + 55", "a": "100" }
            ]
        }
    },
    "level_3": {
        "rounding": {
            "title": "Rounding",
            "color": "#D35400",
            "description": "Round, then adjust!",
            "items": [
                { "q": "48 + 19", "a": "67 (48+20-1)" },
                { "q": "73 - 29", "a": "44 (73-30+1)" }
            ]
        },
        "fives": {
            "title": "Multiples of 5",
            "color": "#27AE60",
            "description": "Ends in 0 or 5",
            "items": [
                { "q": "5 × 7", "a": "35" },
                { "q": "5 × 12", "a": "60" },
                { "q": "5 × 8", "a": "40 (Half of 80)" }
            ]
        },
        "missing": {
            "title": "Missing Number",
            "color": "#8E44AD",
            "description": "Find the mystery number",
            "items": [
                { "q": "__ + 7 = 15", "a": "8 (15 - 7)" },
                { "q": "12 - __ = 5", "a": "7 (12 - 5)" },
                { "q": "__ × 4 = 20", "a": "5 (20 ÷ 4)" }
            ]
        },
        "time": {
            "title": "Time Math",
            "color": "#2980B9",
            "description": "Clock and Calendar",
            "items": [
                { "q": "Mins in 2 hrs?", "a": "120 (60+60)" },
                { "q": "Days in 2 wks?", "a": "14 (7+7)" }
            ]
        },
        "money": {
            "title": "Money Math",
            "color": "#F39C12",
            "description": "Calculating Cost & Change",
            "items": [
                { "q": "4 chocs @ ₹5?", "a": "₹20 (5×4)" },
                { "q": "₹50 - ₹18?", "a": "₹32" }
            ]
        }
    },
    "quizzes": {
        "1": [
            { "question": '30 + 20 = ?', "answer": '50', "options": ['40', '50', '60'] },
            { "question": '50 - 10 = ?', "answer": '40', "options": ['30', '40', '50'] },
            { "question": '5 × 5 = ?', "answer": '25', "options": ['20', '25', '30'] },
            { "question": '40 ÷ 5 = ?', "answer": '8', "options": ['6', '7', '8'] },
            { "question": '19 + 1 = ?', "answer": '20', "options": ['19', '20', '21'] }
        ],
        "2": [
            { "question": '38 + 7 = ?', "answer": '45', "options": ['44', '45', '46'] },
            { "question": '63 - 8 = ?', "answer": '55', "options": ['55', '53', '54'] },
            { "question": '7 × 9 = ?', "answer": '63', "options": ['61', '62', '63'] },
            { "question": '48 ÷ 4 = ?', "answer": '12', "options": ['12', '14', '11'] },
            { "question": '90 + 10 = ?', "answer": '100', "options": ['90', '100', '110'] }
        ],
        "3": [
            { "question": '59 + 21 = ?', "answer": '80', "options": ['79', '80', '81'] },
            { "question": '34 - 19 = ?', "answer": '15', "options": ['14', '15', '16'] },
            { "question": 'Double 7 = ?', "answer": '14', "options": ['12', '14', '16'] },
            { "question": '__ + 9 = 20', "answer": '11', "options": ['10', '11', '12'] },
            { "question": '5 chocs cost ₹25. Price of 1?', "answer": '₹5', "options": ['₹4', '₹5', '₹6'] }
        ]
    }
}

REASONING_DATA = {
    "game_id": "reasoning_basics",
    "title": "Reasoning Basics",
    "content": {
        "patterns": {
            "title": "Number Patterns",
            "description": "Find the missing number!",
            "color": "#3498DB",
            "content": [
                { "text": "2, 4, 6, 8, ?", "answer": "10 (Add 2)", "icon": "🔢" },
                { "text": "5, 10, 15, 20, ?", "answer": "25 (Add 5)", "icon": "🖐️" },
                { "text": "3, 6, 9, 12, ?", "answer": "15 (Add 3)", "icon": "3️⃣" },
                { "text": "2, 5, 4, 7, 6, ?", "answer": "9 (Skip pattern)", "icon": "🔀" },
                { "text": "10, 20, 30, 40, ?", "answer": "50 (Add 10)", "icon": "🔟" }
            ]
        },
        "alphabet": {
            "title": "Alphabet Logic",
            "description": "Find the missing letter!",
            "color": "#E74C3C",
            "content": [
                { "text": "A, C, E, G, ?", "answer": "I (Skip 1)", "icon": "🅰️" },
                { "text": "Z, X, V, T, ?", "answer": "R (Reverse Skip)", "icon": "🔙" },
                { "text": "A, D, G, J, ?", "answer": "M (Skip 2)", "icon": "⏭️" },
                { "text": "A, B, D, E, G, ?", "answer": "H (Pattern)", "icon": "🔠" },
                { "text": "M, O, Q, S, ?", "answer": "U (Skip 1)", "icon": "🤔" }
            ]
        },
        "odd_one": {
            "title": "Odd One Out",
            "description": "Which one is different?",
            "color": "#F1C40F",
            "content": [
                { "text": "Cat – Dog – Cow – Car", "answer": "Car (Not an animal)", "icon": "🚗" },
                { "text": "Square, Circle, Triangle, Apple", "answer": "Apple (Fruit, not shape)", "icon": "🍎" },
                { "text": "January, Monday, March, July", "answer": "Monday (Day, not month)", "icon": "📅" },
                { "text": "Car, Bus, Bike, Plane", "answer": "Plane (Flies in air)", "icon": "✈️" },
                { "text": "Eye, Ear, Nose, Shoe", "answer": "Shoe (Not a body part)", "icon": "👟" }
            ]
        },
        "analogy": {
            "title": "Analogy",
            "description": "Find the relationship!",
            "color": "#9B59B6",
            "content": [
                { "text": "Bird : Fly :: Fish : ?", "answer": "Swim", "icon": "🐟" },
                { "text": "Pen : Write :: Knife : ?", "answer": "Cut", "icon": "🔪" },
                { "text": "Bird : Nest :: Bee : ?", "answer": "Hive", "icon": "🐝" },
                { "text": "Foot : Shoe :: Hand : ?", "answer": "Glove", "icon": "🧤" },
                { "text": "Doctor : Hospital :: Teacher : ?", "answer": "School", "icon": "🏫" }
            ]
        },
        "logic": {
            "title": "Logical Thinking",
            "description": "Think smart!",
            "color": "#2ECC71",
            "content": [
                { "text": "You have 5 candies, give 2, buy 3. Total?", "answer": "6 (5-2+3)", "icon": "🍬" },
                { "text": "A week has 7 days. Days in 3 weeks?", "answer": "21", "icon": "📅" },
                { "text": "Walk 4 steps North, turn right. Face?", "answer": "East", "icon": "🧭" },
                { "text": "Your father’s sister is your...?", "answer": "Aunt", "icon": "👩" },
                { "text": "Which is heaviest: Feather, Book, Stone?", "answer": "Stone", "icon": "🪨" }
            ]
        }
    },
    "quiz": [
        { "question": '3, 6, 9, 12, ?', "answer": '15', "options": ['14', '15', '16'] },
        { "question": 'Z, X, V, T, ?', "answer": 'R', "options": ['R', 'S', 'U'] },
        { "question": 'Odd one: Square, Circle, Triangle, Apple', "answer": 'Apple', "options": ['Circle', 'Apple', 'Square'] },
        { "question": 'Pen : Write :: Knife : ?', "answer": 'Cut', "options": ['Eat', 'Cut', 'Cook'] },
        { "question": '5 candies, give 2, buy 3. How many?', "answer": '6', "options": ['5', '6', '8'] },
        { "question": 'Walk North, turn Right. Face?', "answer": 'East', "options": ['West', 'East', 'South'] },
        { "question": 'Your father’s sister is your?', "answer": 'Aunt', "options": ['Mother', 'Aunt', 'Sister'] },
        { "question": 'Heaviest: Feather, Book, Stone?', "answer": 'Stone', "options": ['Book', 'Stone', 'Feather'] },
        { "question": 'Shape with no corners?', "answer": 'Circle', "options": ['Square', 'Circle', 'Triangle'] },
        { "question": 'Months in half a year?', "answer": '6', "options": ['5', '6', '12'] }
    ]
}

ALPHABET_DATA = {
    "game_id": "alphabet",
    "title": "Alphabet Learning",
    "content": [
        { "letter": 'A', "word": 'Apple', "icon": '🍎' },
        { "letter": 'B', "word": 'Ball', "icon": '⚽' },
        { "letter": 'C', "word": 'Cat', "icon": '🐱' },
        { "letter": 'D', "word": 'Dog', "icon": '🐶' },
        { "letter": 'E', "word": 'Elephant', "icon": '🐘' },
        { "letter": 'F', "word": 'Fish', "icon": '🐠' },
        { "letter": 'G', "word": 'Grapes', "icon": '🍇' },
        { "letter": 'H', "word": 'House', "icon": '🏠' },
        { "letter": 'I', "word": 'Ice Cream', "icon": '🍦' },
        { "letter": 'J', "word": 'Juice', "icon": '🧃' },
        { "letter": 'K', "word": 'Kite', "icon": '🪁' },
        { "letter": 'L', "word": 'Lion', "icon": '🦁' },
        { "letter": 'M', "word": 'Monkey', "icon": '🐵' },
        { "letter": 'N', "word": 'Nest', "icon": '🪺' },
        { "letter": 'O', "word": 'Owl', "icon": '🦉' },
        { "letter": 'P', "word": 'Penguin', "icon": '🐧' },
        { "letter": 'Q', "word": 'Queen', "icon": '👑' },
        { "letter": 'R', "word": 'Rainbow', "icon": '🌈' },
        { "letter": 'S', "word": 'Sun', "icon": '☀️' },
        { "letter": 'T', "word": 'Tiger', "icon": '🐯' },
        { "letter": 'U', "word": 'Umbrella', "icon": '☂️' },
        { "letter": 'V', "word": 'Van', "icon": '🚐' },
        { "letter": 'W', "word": 'Whale', "icon": '🐋' },
        { "letter": 'X', "word": 'Xylophone', "icon": '🎹' },
        { "letter": 'Y', "word": 'Yak', "icon": '🐂' },
        { "letter": 'Z', "word": 'Zebra', "icon": '🦓' }
    ]
}

UNITARY_METHOD_DATA = {
    "game_id": "unitary_method",
    "title": "Unitary Method",
    "item_types": [
        { "name": 'apples', "icon": '🍎' },
        { "name": 'books', "icon": '📚' },
        { "name": 'pencils', "icon": '✏️' },
        { "name": 'candies', "icon": '🍬' },
        { "name": 'toys', "icon": '🧸' },
        { "name": 'oranges', "icon": '🍊' },
        { "name": 'pens', "icon": '🖊️' },
        { "name": 'cookies', "icon": '🍪' },
        { "name": 'flowers', "icon": '🌸' },
        { "name": 'balloons', "icon": '🎈' }
    ]
}

LOGIC_PUZZLE_DATA = {
    "game_id": "logic_puzzles",
    "title": "Logic Puzzles",
    "categories": {
        "visual": {
            "title": "Visual Patterns",
            "color": "#E67E22",
            "icon": "👁️",
            "questions": [
                { "q": "🔺 🟥 🔺 🟥 ... what's next?", "a": "🔺", "options": ["🔺", "🟥", "🔵"] },
                { "q": "➡️ ⬇️ ⬅️ ... what's next?", "a": "⬆️", "options": ["⬆️", "↗️", "⬇️"] },
                { "q": "🌑 🌓 🌕 ... what's next?", "a": "🌗", "options": ["🌑", "🌗", "🌞"] }
            ]
        },
        "deduction": {
            "title": "Word Logic",
            "color": "#8E44AD",
            "icon": "🕵️",
            "questions": [
                { "q": "Tom is taller than Ben. Ben is taller than Roy. Who is shortest?", "a": "Roy", "options": ["Tom", "Ben", "Roy"] },
                { "q": "If yesterday was Friday, what is tomorrow?", "a": "Sunday", "options": ["Monday", "Sunday", "Saturday"] },
                { "q": "It has keys but can't open locks. What is it?", "a": "Piano", "options": ["Piano", "Door", "Book"] }
            ]
        },
        "math_logic": {
            "title": "Math Logic",
            "color": "#27AE60",
            "icon": "🧮",
            "questions": [
                { "q": "Starting from 0, count by 3s: 0, 3, 6, 9...", "a": "12", "options": ["10", "11", "12"] },
                { "q": "I am an odd number. Take away 1 and I become even. Which number am I?", "a": "3", "options": ["2", "3", "4"] },
            ]
        }
    }
}

HINDI_VARNAMALA_DATA = {
    "game_id": "hindi_varnamala",
    "title": "हिंदी वर्णमाला (Varnamala)",
    "content": {
        "swar": [
            { "letter": "अ", "word": "अनार", "icon": "🍎" },
            { "letter": "आ", "word": "आम", "icon": "🥭" },
            { "letter": "इ", "word": "इमली", "icon": "😋" },
            { "letter": "ई", "word": "ईख", "icon": "🎋" },
            { "letter": "उ", "word": "उल्लू", "icon": "🦉" },
            { "letter": "ऊ", "word": "ऊन", "icon": "🧶" },
            { "letter": "ऋ", "word": "ऋषि", "icon": "🧖" },
            { "letter": "ए", "word": "एड़ी", "icon": "🦶" },
            { "letter": "ऐ", "word": "ऐनक", "icon": "👓" },
            { "letter": "ओ", "word": "ओखली", "icon": "🥣" },
            { "letter": "औ", "word": "औरत", "icon": "👩" },
            { "letter": "अं", "word": "अंगूर", "icon": "🍇" },
            { "letter": "अः", "word": "नमः", "icon": "🙏" }
        ],
        "vyanjan": [
            { "letter": "क", "word": "कबूतर (Pigeon)", "icon": "🐦" },
            { "letter": "ख", "word": "खरगोश (Rabbit)", "icon": "🐇" },
            { "letter": "ग", "word": "गमला (Pot)", "icon": "🪴" },
            { "letter": "घ", "word": "घड़ी (Watch)", "icon": "🕰️" },
            { "letter": "ङ", "word": "खाली", "icon": "⭕" },
            { "letter": "च", "word": "चम्मच (Spoon)", "icon": "🥄" },
            { "letter": "छ", "word": "छतरी (Umbrella)", "icon": "☂️" },
            { "letter": "ज", "word": "जहाज (Ship)", "icon": "🚢" },
            { "letter": "झ", "word": "झंडा (Flag)", "icon": "🇮🇳" },
            { "letter": "ञ", "word": "खाली", "icon": "⭕" },
            { "letter": "ट", "word": "टमाटर (Tomato)", "icon": "🍅" },
            { "letter": "ठ", "word": "ठठेरा (Smith)", "icon": "🔨" },
            { "letter": "ड", "word": "डमरू (Drum)", "icon": "🥁" },
            { "letter": "ढ", "word": "ढक्कन (Lid)", "icon": "🥘" },
            { "letter": "ण", "word": "फण (Hood)", "icon": "🐍" },
            { "letter": "त", "word": "तरबूज (Watermelon)", "icon": "🍉" },
            { "letter": "थ", "word": "थर्मस (Thermos)", "icon": "🧴" },
            { "letter": "द", "word": "दवात (Inkpot)", "icon": "✒️" },
            { "letter": "ध", "word": "धनुष (Bow)", "icon": "🏹" },
            { "letter": "न", "word": "नल (Tap)", "icon": "🚰" },
            { "letter": "प", "word": "पतंग (Kite)", "icon": "🪁" },
            { "letter": "फ", "word": "फल (Fruit)", "icon": "🍎" },
            { "letter": "ब", "word": "बतख (Duck)", "icon": "🦆" },
            { "letter": "भ", "word": "भालू (Bear)", "icon": "🐻" },
            { "letter": "म", "word": "मछली (Fish)", "icon": "🐟" },
            { "letter": "य", "word": "यज्ञ (Ritual)", "icon": "🔥" },
            { "letter": "र", "word": "रथ (Chariot)", "icon": "🎠" },
            { "letter": "ल", "word": "लड़का (Boy)", "icon": "👦" },
            { "letter": "व", "word": "वक (Crane)", "icon": "🦩" },
            { "letter": "श", "word": "शलजम (Turnip)", "icon": "🥗" },
            { "letter": "ष", "word": " षट्कोण (Hexagon)", "icon": "🛑" },
            { "letter": "स", "word": "सपेरा (Snake Charmer)", "icon": "🐍" },
            { "letter": "ह", "word": "हल (Plough)", "icon": "🚜" },
            { "letter": "क्ष", "word": "क्षत्रिय (Warrior)", "icon": "⚔️" },
            { "letter": "त्र", "word": "त्रिशूल (Trident)", "icon": "🔱" },
            { "letter": "ज्ञ", "word": "ज्ञानी (Scholar)", "icon": "🎓" }
        ]
    }
}

HINDI_TWO_LETTER_DATA = {
    "game_id": "hindi_two_letter",
    "title": "दो अक्षर वाले शब्द",
    "content": [
        { "text": "बस", "icon": "🚌", "word": "बस (Bus)" },
        { "text": "घर", "icon": "🏠", "word": "घर (Home)" },
        { "text": "फल", "icon": "🍎", "word": "फल (Fruit)" },
        { "text": "नल", "icon": "🚰", "word": "नल (Tap)" },
        { "text": "जल", "icon": "💧", "word": "जल (Water)" },
        { "text": "कल", "icon": "📅", "word": "कल (Tomorrow)" },
        { "text": "चल", "icon": "🚶", "word": "चल (Walk)" },
        { "text": "डर", "icon": "😨", "word": "डर (Fear)" },
        { "text": "छत", "icon": " Roof", "word": "छत (Roof)" },
        { "text": "खत", "icon": "✉️", "word": "खत (Letter)" }
    ]
}

HINDI_THREE_LETTER_DATA = {
    "game_id": "hindi_three_letter",
    "title": "तीन अक्षर वाले शब्द",
    "content": [
        { "text": "कमल", "icon": "🌸", "word": "कमल (Lotus)" },
        { "text": "सड़क", "icon": "🛣️", "word": "सड़क (Road)" },
        { "text": "मटर", "icon": "🟢", "word": "मटर (Peas)" },
        { "text": "बत्तख", "icon": "🦆", "word": "बत्तख (Duck)" },
        { "text": "कलम", "icon": "🖊️", "word": "कलम (Pen)" },
        { "text": "नमक", "icon": "🧂", "word": "नमक (Salt)" },
        { "text": "महल", "icon": "🏰", "word": "महल (Palace)" },
        { "text": "शहद", "icon": "🍯", "word": "शहद (Honey)" },
        { "text": "नगर", "icon": "🏙️", "word": "नगर (City)" },
        { "text": "मगर", "icon": "🐊", "word": "मगर (Crocodile)" }
    ]
}

HINDI_STORIES_DATA = {
    "game_id": "hindi_stories",
    "title": "हिंदी कहानियाँ (Hindi Stories)",
    "content": [
        {
            "id": 1,
            "title": "शेर और चूहा",
            "icon": "🦁",
            "content": "एक शेर सो रहा था। एक चूहा उसके ऊपर दौड़ गया। शेर ने उसे पकड़ लिया। चूहे ने कहा, “मुझे छोड़ दो, मैं कभी काम आऊँगा।” शेर हँसा, पर उसे छोड़ दिया। कुछ दिन बाद शेर जाल में फँस गया। चूहे ने जाल कुतर दिया।",
            "moral": "छोटा दोस्त भी काम आता है।"
        },
        {
            "id": 2,
            "title": "ईमानदार लकड़हारा",
            "icon": "🪓",
            "content": "एक लकड़हारे की कुल्हाड़ी नदी में गिर गई। वह रोने लगा। एक देवता ने सोने और चाँदी की कुल्हाड़ी दिखाई। लकड़हारे ने कहा, “यह मेरी नहीं है।” देवता ने उसकी सच्चाई देखकर उसकी असली कुल्हाड़ी लौटा दी।",
            "moral": "ईमानदारी सबसे बड़ी दौलत है।"
        },
        {
            "id": 3,
            "title": "लालची कुत्ता",
            "icon": "🐕",
            "content": "एक कुत्ते के मुँह में रोटी थी। उसने पानी में अपनी परछाईं देखी। उसे लगा दूसरे कुत्ते के पास बड़ी रोटी है। वह भौंका और उसकी रोटी पानी में गिर गई।",
            "moral": "लालच बुरी बला है।"
        },
        {
            "id": 4,
            "title": "दो बिल्लियाँ और बंदर",
            "icon": "🐱",
            "content": "दो बिल्लियों को रोटी मिली। वे झगड़ने लगीं। एक बंदर बोला, “मैं बाँट देता हूँ।” वह थोड़ा-थोड़ा खाता गया और पूरी रोटी खत्म कर दी।",
            "moral": "झगड़े का फायदा तीसरा उठाता है।"
        },
        {
            "id": 5,
            "title": "समझदार किसान",
            "icon": "👨‍🌾",
            "content": "एक किसान के बेटे हमेशा लड़ते थे। किसान ने लकड़ियों का गट्ठर दिया। कोई नहीं तोड़ पाया। फिर उसने एक-एक लकड़ी दी, सबने तोड़ दी।",
            "moral": "एकता में ताकत है।"
        },
        {
            "id": 6,
            "title": "प्यासा हाथी",
            "icon": "🐘",
            "content": "एक हाथी पानी खोज रहा था। उसे एक छोटा तालाब मिला। वहाँ खरगोश रहते थे। हाथी पानी पीता तो उनका घर टूट जाता। खरगोश ने चाँद की कहानी सुनाकर हाथी को भगा दिया।",
            "moral": "बुद्धि से बड़े को भी हराया जा सकता है।"
        },
        {
            "id": 7,
            "title": "मेहनती बच्चा",
            "icon": "👦",
            "content": "रवि रोज़ पढ़ाई करता था। उसका दोस्त खेलता रहता था। परीक्षा आई तो रवि पास हुआ, दोस्त फेल हो गया।",
            "moral": "मेहनत का फल मीठा होता है।"
        },
        {
            "id": 8,
            "title": "सच्चा दोस्त",
            "icon": "🤝",
            "content": "राम बीमार था। उसका दोस्त श्याम रोज़ उसका होमवर्क लाता। राम ठीक हुआ तो बोला, “तू ही मेरा सच्चा दोस्त है।”",
            "moral": "सच्चा दोस्त मुश्किल में साथ देता है।"
        },
        {
            "id": 9,
            "title": "लोभी राजा",
            "icon": "👑",
            "content": "एक राजा सोना ही चाहता था। एक दिन उसे वरदान मिला — जो छुए वह सोना बने। उसका खाना भी सोना बन गया। वह भूखा रह गया।",
            "moral": "लालच दुख देता है।"
        },
        {
            "id": 10,
            "title": "नन्हा बीज",
            "icon": "🌱",
            "content": "एक बीज मिट्टी में दबा था। उसे अंधेरा लगा। धीरे-धीरे वह पौधा बना और सूरज की रोशनी देखी।",
            "moral": "धैर्य रखने से अच्छी चीजें मिलती हैं।"
        },
        {
            "id": 11,
            "title": "सच्चाई की जीत",
            "icon": "🪟",
            "content": "एक बच्चे ने गलती से खिड़की तोड़ दी। उसने डरते हुए सच बता दिया। पिता ने उसे माफ कर दिया।",
            "moral": "सच बोलने से डर कम होता है।"
        },
        {
            "id": 12,
            "title": "समझदार गाय",
            "icon": "🐄",
            "content": "एक गाय रोज़ घर लौट आती थी। एक दिन रास्ता बदल गया, फिर भी उसने घर ढूँढ लिया।",
            "moral": "समझदारी जानवरों में भी होती है।"
        },
        {
            "id": 13,
            "title": "नकलची बंदर",
            "icon": "🐒",
            "content": "एक बंदर ने टोपी वाले की नकल की। टोपी वाला अपनी टोपी फेंकने का नाटक किया। बंदरों ने भी टोपी फेंक दी।",
            "moral": "समझदारी से समस्या सुलझती है।"
        },
        {
            "id": 14,
            "title": "छोटी मदद",
            "icon": "👧",
            "content": "एक लड़की ने बूढ़ी दादी को सड़क पार कराई। दादी ने उसे आशीर्वाद दिया।",
            "moral": "छोटी मदद भी बड़ी होती है।"
        },
        {
            "id": 15,
            "title": "आलसी बिल्ली",
            "icon": "😴",
            "content": "एक बिल्ली खाना ढूँढने में आलस करती थी। एक दिन उसे कुछ नहीं मिला। तब उसने मेहनत करना सीखा।",
            "moral": "आलस नुकसान देता है।"
        },
        {
            "id": 16,
            "title": "सूरज और हवा",
            "icon": "🌤️",
            "content": "हवा बोली, “मैं ताकतवर हूँ।” सूरज बोला, “मैं ज़्यादा ताकतवर हूँ।” उन्होंने यात्री का कोट उतरवाने की शर्त लगाई। हवा नहीं कर पाई, सूरज की गर्मी से यात्री ने खुद कोट उतार दिया।",
            "moral": "प्यार ताकत से बड़ा है।"
        },
        {
            "id": 17,
            "title": "खुशहाल परिवार",
            "icon": "👨‍👩‍👧‍👦",
            "content": "एक परिवार साथ बैठकर खाना खाता था। वे हँसते-बोलते रहते थे।",
            "moral": "साथ रहने से खुशी बढ़ती है।"
        },
        {
            "id": 18,
            "title": "समय की कीमत",
            "icon": "⏰",
            "content": "एक लड़का हर काम देर से करता था। एक दिन बस छूट गई और परीक्षा भी।",
            "moral": "समय बहुत कीमती है।"
        },
        {
            "id": 19,
            "title": "साफ-सफाई",
            "icon": "🧹",
            "content": "रीना रोज़ अपना कमरा साफ रखती थी। उसे चीजें जल्दी मिल जाती थीं।",
            "moral": "सफाई अच्छी आदत है।"
        },
        {
            "id": 20,
            "title": "पेड़ का महत्व",
            "icon": "🌳",
            "content": "एक लड़का पेड़ काटना चाहता था। पेड़ ने कहा, “मैं छाया, फल और हवा देता हूँ।” लड़के ने पेड़ बचा लिया।",
            "moral": "पेड़ हमारे मित्र हैं।"
        }
    ]
}

ENGLISH_NOUNS_DATA = {
    "game_id": "english_nouns",
    "title": "Nouns (Naming Words)",
    "content": {
        "person": {
            "title": "Person 👨‍⚕️",
            "color": "#E74C3C",
            "items": [
                { "text": "Doctor", "icon": "👨‍⚕️" },
                { "text": "Teacher", "icon": "👩‍🏫" },
                { "text": "Boy", "icon": "👦" },
                { "text": "Girl", "icon": "👧" },
                { "text": "Baby", "icon": "👶" },
                { "text": "Police", "icon": "👮" },
                { "text": "King", "icon": "👑" }
            ]
        },
        "place": {
            "title": "Place 🏠",
            "color": "#3498DB",
            "items": [
                { "text": "School", "icon": "🏫" },
                { "text": "Park", "icon": "🌳" },
                { "text": "Home", "icon": "🏠" },
                { "text": "Hospital", "icon": "🏥" },
                { "text": "Beach", "icon": "🏖️" },
                { "text": "Zoo", "icon": "🦁" },
                { "text": "Shop", "icon": "🏪" }
            ]
        },
        "animal": {
            "title": "Animal 🐶",
            "color": "#F1C40F",
            "items": [
                { "text": "Dog", "icon": "🐶" },
                { "text": "Cat", "icon": "🐱" },
                { "text": "Lion", "icon": "🦁" },
                { "text": "Elephant", "icon": "🐘" },
                { "text": "Monkey", "icon": "🐵" },
                { "text": "Bird", "icon": "🐦" },
                { "text": "Fish", "icon": "🐟" }
            ]
        },
        "thing": {
            "title": "Thing 🚗",
            "color": "#9B59B6",
            "items": [
                { "text": "Car", "icon": "🚗" },
                { "text": "Ball", "icon": "⚽" },
                { "text": "Book", "icon": "📖" },
                { "text": "Pencil", "icon": "✏️" },
                { "text": "Chair", "icon": "🪑" },
                { "text": "Apple", "icon": "🍎" },
                { "text": "Bag", "icon": "🎒" }
            ]
        }
    },
    "quiz": [
        { "question": "Which holds things?", "answer": "Bag", "options": ["Bag", "Dog", "Boy"] },
        { "question": "Where do we learn?", "answer": "School", "options": ["Park", "School", "Shop"] },
        { "question": "Who checks health?", "answer": "Doctor", "options": ["Doctor", "Teacher", "Baby"] },
        { "question": "Which is an animal?", "answer": "Lion", "options": ["Apple", "Car", "Lion"] },
        { "question": "What do we read?", "answer": "Book", "options": ["Ball", "Book", "Chair"] }
    ]
}

PHYSICAL_ACTIONS_DATA = {
    "game_id": "physical_actions",
    "title": "Physical Actions",
    "content": [
        { "word": "KICK", "icon": "🦵", "context": "Kick the ball." },
        { "word": "THROW", "icon": "🥎", "context": "Throw it far." },
        { "word": "CATCH", "icon": "🤲", "context": "Catch the ball." },
        { "word": "PUSH", "icon": "👐", "context": "Push the door." },
        { "word": "PULL", "icon": "🤝", "context": "Pull it open." },
        { "word": "LIFT", "icon": "🏋️", "context": "Lift heavy things." },
        { "word": "BEND", "icon": "🙇", "context": "Bend down low." },
        { "word": "TURN", "icon": "🔄", "context": "Turn around." },
        { "word": "SHAKE", "icon": "🤝", "context": "Shake hands." },
        { "word": "WAVE", "icon": "👋", "context": "Wave hello." }
    ]
}

BASIC_ACTIONS_DATA = {
    "game_id": "basic_actions",
    "title": "Basic Actions",
    "content": [
        { "word": "RUN", "icon": "🏃", "context": "Run fast!" },
        { "word": "JUMP", "icon": "🦘", "context": "Jump high!" },
        { "word": "WALK", "icon": "🚶", "context": "Walk slowly." },
        { "word": "SIT", "icon": "🪑", "context": "Sit down." },
        { "word": "STAND", "icon": "🧍", "context": "Stand up." },
        { "word": "EAT", "icon": "🍽️", "context": "Eat food." },
        { "word": "DRINK", "icon": "🥤", "context": "Drink water." },
        { "word": "SLEEP", "icon": "😴", "context": "Go to sleep." },
        { "word": "READ", "icon": "📖", "context": "Read a book." },
        { "word": "WRITE", "icon": "✍️", "context": "Write a letter." },
        { "word": "TALK", "icon": "🗣️", "context": "Talk to friends." },
        { "word": "LISTEN", "icon": "👂", "context": "Listen carefully." },
        { "word": "LAUGH", "icon": "😂", "context": "Ha ha ha!" },
        { "word": "CRY", "icon": "😢", "context": "Do not cry." },
        { "word": "SMILE", "icon": "😊", "context": "Big smile." },
        { "word": "PLAY", "icon": "🧸", "context": "Play with toys." },
        { "word": "CLAP", "icon": "👏", "context": "Clap your hands." },
        { "word": "DANCE", "icon": "💃", "context": "Dance to music." }
    ]
}

TWO_WORD_SENTENCES_DATA = {
    "game_id": "two_word_sentences",
    "title": "Two Word Sentences",
    "content": [
        { "text": "BIG DOG", "w1": "BIG", "w2": "DOG", "icon": "🐕", "context": "The dog is big." },
        { "text": "RED CAR", "w1": "RED", "w2": "CAR", "icon": "🚗", "context": "Drive the red car." },
        { "text": "HOT TEA", "w1": "HOT", "w2": "TEA", "icon": "☕", "context": "Be careful, hot tea." },
        { "text": "MY BAG", "w1": "MY", "w2": "BAG", "icon": "🎒", "context": "This is my bag." },
        { "text": "RUN FAST", "w1": "RUN", "w2": "FAST", "icon": "🏃", "context": "Run fast to win." },
        { "text": "SIT DOWN", "w1": "SIT", "w2": "DOWN", "icon": "🪑", "context": "Please sit down." },
        { "text": "GO HOME", "w1": "GO", "w2": "HOME", "icon": "🏠", "context": "Let us go home." },
        { "text": "BLUE SKY", "w1": "BLUE", "w2": "SKY", "icon": "☁️", "context": "Look at the blue sky." },
        { "text": "GOOD DAY", "w1": "GOOD", "w2": "DAY", "icon": "☀️", "context": "Have a good day." },
        { "text": "EAT FOOD", "w1": "EAT", "w2": "FOOD", "icon": "🍽️", "context": "Eat your food." },
        { "text": "NEW TOY", "w1": "NEW", "w2": "TOY", "icon": "🧸", "context": "I have a new toy." },
        { "text": "SAD BOY", "w1": "SAD", "w2": "BOY", "icon": "😢", "context": "Why is the boy sad?" },
        { "text": "ONE CAT", "w1": "ONE", "w2": "CAT", "icon": "🐈", "context": "I see one cat." },
        { "text": "OLD MAN", "w1": "OLD", "w2": "MAN", "icon": "👴", "context": "Kind old man." },
        { "text": "COLD ICE", "w1": "COLD", "w2": "ICE", "icon": "🧊", "context": "Ice is very cold." },
        { "text": "WET DOG", "w1": "WET", "w2": "DOG", "icon": "🚿", "context": "The dog is wet." },
        { "text": "BIG BOX", "w1": "BIG", "w2": "BOX", "icon": "📦", "context": "Open the big box." },
        { "text": "SEE YOU", "w1": "SEE", "w2": "YOU", "icon": "👋", "context": "See you later." },
        { "text": "LOVE MOM", "w1": "LOVE", "w2": "MOM", "icon": "👩‍👦", "context": "I love my mom." },
        { "text": "NICE CAR", "w1": "NICE", "w2": "CAR", "icon": "🚔", "context": "That is a nice car." },
        { "text": "TOP HAT", "w1": "TOP", "w2": "HAT", "icon": "🎩", "context": "Wear a top hat." },
        { "text": "BUS STOP", "w1": "BUS", "w2": "STOP", "icon": "🚏", "context": "Wait at the bus stop." },
        { "text": "RED ROSE", "w1": "RED", "w2": "ROSE", "icon": "🌹", "context": "Smell the red rose." },
        { "text": "SUN SET", "w1": "SUN", "w2": "SET", "icon": "🌇", "context": "Watch the sun set." },
        { "text": "BAD DAY", "w1": "BAD", "w2": "DAY", "icon": "🌧️", "context": "It was a bad day." }
    ]
}

THREE_WORD_SENTENCES_DATA = {
    "game_id": "three_word_sentences",
    "title": "Three Word Sentences",
    "content": [
        { "text": "I LOVE YOU", "w1": "I", "w2": "LOVE", "w3": "YOU", "icon": "❤️", "context": "Tell mom I love you." },
        { "text": "THE BIG DOG", "w1": "THE", "w2": "BIG", "w3": "DOG", "icon": "🐕", "context": "Look at the big dog." },
        { "text": "SEE THE CAT", "w1": "SEE", "w2": "THE", "w3": "CAT", "icon": "🐈", "context": "Can you see the cat?" },
        { "text": "I CAN RUN", "w1": "I", "w2": "CAN", "w3": "RUN", "icon": "🏃", "context": "Watch me, I can run!" },
        { "text": "SHE IS NICE", "w1": "SHE", "w2": "IS", "w3": "NICE", "icon": "👧", "context": "My friend, she is nice." },
        { "text": "HE HAS TOYS", "w1": "HE", "w2": "HAS", "w3": "TOYS", "icon": "🧸", "context": "He has many toys." },
        { "text": "SUN IS HOT", "w1": "SUN", "w2": "IS", "w3": "HOT", "icon": "☀️", "context": "The sun is very hot." },
        { "text": "BAT IS BLACK", "w1": "BAT", "w2": "IS", "w3": "BLACK", "icon": "🦇", "context": "The bat is black." },
        { "text": "EAT THE EGG", "w1": "EAT", "w2": "THE", "w3": "EGG", "icon": "🥚", "context": "Please eat the egg." },
        { "text": "GO TO BED", "w1": "GO", "w2": "TO", "w3": "BED", "icon": "🛏️", "context": "Time to go to bed." },
        { "text": "MY RED CAR", "w1": "MY", "w2": "RED", "w3": "CAR", "icon": "🚗", "context": "Drive my red car." },
        { "text": "SEE YOU LATER", "w1": "SEE", "w2": "YOU", "w3": "LATER", "icon": "👋", "context": "Bye, see you later." },
        { "text": "MOM IS HOME", "w1": "MOM", "w2": "IS", "w3": "HOME", "icon": "🏠", "context": "Yay, mom is home!" },
        { "text": "DAD IS TALL", "w1": "DAD", "w2": "IS", "w3": "TALL", "icon": "👨", "context": "My dad is tall." },
        { "text": "SKY IS BLUE", "w1": "SKY", "w2": "IS", "w3": "BLUE", "icon": "☁️", "context": "The sky is blue today." },
        { "text": "ANT IS SMALL", "w1": "ANT", "w2": "IS", "w3": "SMALL", "icon": "🐜", "context": "The ant is very small." },
        { "text": "BOX IS OPEN", "w1": "BOX", "w2": "IS", "w3": "OPEN", "icon": "📦", "context": "The box is open." },
        { "text": "WE ARE HAPPY", "w1": "WE", "w2": "ARE", "w3": "HAPPY", "icon": "😊", "context": "We are happy family." },
        { "text": "IT IS COLD", "w1": "IT", "w2": "IS", "w3": "COLD", "icon": "❄️", "context": "Brrr, it is cold." },
        { "text": "FISH CAN SWIM", "w1": "FISH", "w2": "CAN", "w3": "SWIM", "icon": "🐠", "context": "Fish can swim fast." }
    ]
}

FOUR_WORD_SENTENCES_DATA = {
    "game_id": "four_word_sentences",
    "title": "Four Word Sentences",
    "content": [
        { "text": "THE CAT IS FAT", "w1": "THE", "w2": "CAT", "w3": "IS", "w4": "FAT", "icon": "🐱", "context": "Oh no, the cat is fat." },
        { "text": "I LIKE MY DOG", "w1": "I", "w2": "LIKE", "w3": "MY", "w4": "DOG", "icon": "🐶", "context": "I really like my dog." },
        { "text": "WE GO TO PARK", "w1": "WE", "w2": "GO", "w3": "TO", "w4": "PARK", "icon": "⛲", "context": "Let us go to the park." },
        { "text": "THE SUN IS HOT", "w1": "THE", "w2": "SUN", "w3": "IS", "w4": "HOT", "icon": "☀️", "context": "Wear a hat, the sun is hot." },
        { "text": "HE HAS A BALL", "w1": "HE", "w2": "HAS", "w3": "A", "w4": "BALL", "icon": "⚽", "context": "Look, he has a ball." },
        { "text": "SHE HAS A DOLL", "w1": "SHE", "w2": "HAS", "w3": "A", "w4": "DOLL", "icon": "🎎", "context": "She plays with her doll." },
        { "text": "THE SKY IS BLUE", "w1": "THE", "w2": "SKY", "w3": "IS", "w4": "BLUE", "icon": "☁️", "context": "Look up, the sky is blue." },
        { "text": "I SEE A BIRD", "w1": "I", "w2": "SEE", "w3": "A", "w4": "BIRD", "icon": "🐦", "context": "I see a little bird." },
        { "text": "MY DAD IS TALL", "w1": "MY", "w2": "DAD", "w3": "IS", "w4": "TALL", "icon": "👨", "context": "Wow, my dad is tall." },
        { "text": "GIVE ME THE TOY", "w1": "GIVE", "w2": "ME", "w3": "THE", "w4": "TOY", "icon": "🧸", "context": "Please give me the toy." },
        { "text": "I CAN JUMP HIGH", "w1": "I", "w2": "CAN", "w3": "JUMP", "w4": "HIGH", "icon": "🤸", "context": "Watch me jump high!" },
        { "text": "DO NOT BE SAD", "w1": "DO", "w2": "NOT", "w3": "BE", "w4": "SAD", "icon": "😊", "context": "Smile, do not be sad." },
        { "text": "THE CAR IS RED", "w1": "THE", "w2": "CAR", "w3": "IS", "w4": "RED", "icon": "🚗", "context": "See the red car go." },
        { "text": "LOOK AT THE MOON", "w1": "LOOK", "w2": "AT", "w3": "THE", "w4": "MOON", "icon": "🌙", "context": "Look at the bright moon." },
        { "text": "THIS IS MY HOUSE", "w1": "THIS", "w2": "IS", "w3": "MY", "w4": "HOUSE", "icon": "🏠", "context": "Welcome, this is my house." },
        { "text": "I WANT SOME MILK", "w1": "I", "w2": "WANT", "w3": "SOME", "w4": "MILK", "icon": "🥛", "context": "Can I have some milk?" },
        { "text": "THE PIG IS PINK", "w1": "THE", "w2": "PIG", "w3": "IS", "w4": "PINK", "icon": "🐷", "context": "The little pig is pink." },
        { "text": "A BUG IS HERE", "w1": "A", "w2": "BUG", "w3": "IS", "w4": "HERE", "icon": "🐞", "context": "Eek, a bug is here!" },
        { "text": "LET US GO OUT", "w1": "LET", "w2": "US", "w3": "GO", "w4": "OUT", "icon": "🚪", "context": "Come on, let us go out." },
        { "text": "TIME TO EAT NOW", "w1": "TIME", "w2": "TO", "w3": "EAT", "w4": "NOW", "icon": "🍽️", "context": "Dinner is ready, time to eat." }
    ]
}

THREE_LETTER_WORDS_DATA = {
    "game_id": "three_letter_words",
    "title": "Three Letter Words",
    "content": [
        { "word": "ANT", "p1": "A", "p2": "N", "p3": "T", "icon": "🐜", "sentence": "The ant is tiny." },
        { "word": "BAT", "p1": "B", "p2": "A", "p3": "T", "icon": "🦇", "sentence": "The bat can fly." },
        { "word": "BED", "p1": "B", "p2": "E", "p3": "D", "icon": "🛏️", "sentence": "Sleep in the bed." },
        { "word": "BOX", "p1": "B", "p2": "O", "p3": "X", "icon": "📦", "sentence": "Open the box." },
        { "word": "BOY", "p1": "B", "p2": "O", "p3": "Y", "icon": "👦", "sentence": "He is a boy." },
        { "word": "BUS", "p1": "B", "p2": "U", "p3": "S", "icon": "🚌", "sentence": "Ride the bus." },
        { "word": "CAT", "p1": "C", "p2": "A", "p3": "T", "icon": "🐱", "sentence": "Cute little cat." },
        { "word": "COW", "p1": "C", "p2": "O", "p3": "W", "icon": "🐮", "sentence": "The cow says moo." },
        { "word": "CUP", "p1": "C", "p2": "U", "p3": "P", "icon": "☕", "sentence": "Hot tea in a cup." },
        { "word": "DOG", "p1": "D", "p2": "O", "p3": "G", "icon": "🐶", "sentence": "My pet dog." },
        { "word": "EGG", "p1": "E", "p2": "G", "p3": "G", "icon": "🥚", "sentence": "Eat an egg." },
        { "word": "EYE", "p1": "E", "p2": "Y", "p3": "E", "icon": "👁️", "sentence": "Blink your eye." },
        { "word": "FAN", "p1": "F", "p2": "A", "p3": "N", "icon": "🌀", "sentence": "Turn on the fan." },
        { "word": "FOX", "p1": "F", "p2": "O", "p3": "X", "icon": "🦊", "sentence": "Sly red fox." },
        { "word": "HAT", "p1": "H", "p2": "A", "p3": "T", "icon": "🎩", "sentence": "Wear a hat." },
        { "word": "HEN", "p1": "H", "p2": "E", "p3": "N", "icon": "🐔", "sentence": "The hen lays eggs." },
        { "word": "ICE", "p1": "I", "p2": "C", "p3": "E", "icon": "🧊", "sentence": "Cold ice cubes." },
        { "word": "JAM", "p1": "J", "p2": "A", "p3": "M", "icon": "🍓", "sentence": "Sweet strawberry jam." },
        { "word": "KEY", "p1": "K", "p2": "E", "p3": "Y", "icon": "🔑", "sentence": "Lost my key." },
        { "word": "MAP", "p1": "M", "p2": "A", "p3": "P", "icon": "🗺️", "sentence": "Look at the map." },
        { "word": "MUG", "p1": "M", "p2": "U", "p3": "G", "icon": "🍺", "sentence": "A root beer mug." },
        { "word": "OWL", "p1": "O", "p2": "W", "p3": "L", "icon": "🦉", "sentence": "Night owl." },
        { "word": "PEN", "p1": "P", "p2": "E", "p3": "N", "icon": "🖊️", "sentence": "Blue ink pen." },
        { "word": "PIG", "p1": "P", "p2": "I", "p3": "G", "icon": "🐷", "sentence": "Pink little pig." },
        { "word": "RAT", "p1": "R", "p2": "A", "p3": "T", "icon": "🐀", "sentence": "A squeaky rat." },
        { "word": "RED", "p1": "R", "p2": "E", "p3": "D", "icon": "🔴", "sentence": "The color red." },
        { "word": "RUN", "p1": "R", "p2": "U", "p3": "N", "icon": "🏃", "sentence": "Run very fast." },
        { "word": "SUN", "p1": "S", "p2": "U", "p3": "N", "icon": "☀️", "sentence": "Bright yellow sun." },
        { "word": "TOP", "p1": "T", "p2": "O", "p3": "P", "icon": "🔝", "sentence": "Climb to the top." },
        { "word": "VAN", "p1": "V", "p2": "A", "p3": "N", "icon": "🚐", "sentence": "Big white van." }
    ]
}

FOUR_LETTER_WORDS_DATA = {
    "game_id": "four_letter_words",
    "title": "Four Letter Words",
    "content": [
        { "word": "BALL", "p1": "B", "p2": "A", "p3": "L", "p4": "L", "icon": "⚽", "sentence": "Kick the ball." },
        { "word": "BEAR", "p1": "B", "p2": "E", "p3": "A", "p4": "R", "icon": "🐻", "sentence": "Big brown bear." },
        { "word": "BIRD", "p1": "B", "p2": "I", "p3": "R", "p4": "D", "icon": "🐦", "sentence": "The bird sings." },
        { "word": "BOAT", "p1": "B", "p2": "O", "p3": "A", "p4": "T", "icon": "⛵", "sentence": "Sail the boat." },
        { "word": "BOOK", "p1": "B", "p2": "O", "p3": "O", "p4": "K", "icon": "📖", "sentence": "Read a book." },
        { "word": "CAKE", "p1": "C", "p2": "A", "p3": "K", "p4": "E", "icon": "🎂", "sentence": "Yummy cake." },
        { "word": "CORN", "p1": "C", "p2": "O", "p3": "R", "p4": "N", "icon": "🌽", "sentence": "Sweet yellow corn." },
        { "word": "CRAB", "p1": "C", "p2": "R", "p3": "A", "p4": "B", "icon": "🦀", "sentence": "Crab on the beach." },
        { "word": "DOLL", "p1": "D", "p2": "O", "p3": "L", "p4": "L", "icon": "🎎", "sentence": "Play with a doll." },
        { "word": "DOOR", "p1": "D", "p2": "O", "p3": "O", "p4": "R", "icon": "🚪", "sentence": "Open the door." },
        { "word": "DRUM", "p1": "D", "p2": "R", "p3": "U", "p4": "M", "icon": "🥁", "sentence": "Bang the drum." },
        { "word": "DUCK", "p1": "D", "p2": "U", "p3": "C", "p4": "K", "icon": "🦆", "sentence": "Quack quack duck." },
        { "word": "FISH", "p1": "F", "p2": "I", "p3": "S", "p4": "H", "icon": "🐠", "sentence": "Swim like a fish." },
        { "word": "FROG", "p1": "F", "p2": "R", "p3": "O", "p4": "G", "icon": "🐸", "sentence": "Hop like a frog." },
        { "word": "GIFT", "p1": "G", "p2": "I", "p3": "F", "p4": "T", "icon": "🎁", "sentence": "A surprise gift." },
        { "word": "GOAT", "p1": "G", "p2": "O", "p3": "A", "p4": "T", "icon": "🐐", "sentence": "The goat eats grass." },
        { "word": "HAND", "p1": "H", "p2": "A", "p3": "N", "p4": "D", "icon": "✋", "sentence": "Wave your hand." },
        { "word": "KITE", "p1": "K", "p2": "I", "p3": "T", "p4": "E", "icon": "🪁", "sentence": "Fly a kite." },
        { "word": "LAMB", "p1": "L", "p2": "A", "p3": "M", "p4": "B", "icon": "🐑", "sentence": "Little white lamb." },
        { "word": "LEAF", "p1": "L", "p2": "E", "p3": "A", "p4": "F", "icon": "🍃", "sentence": "Green leaf falls." },
        { "word": "LION", "p1": "L", "p2": "I", "p3": "O", "p4": "N", "icon": "🦁", "sentence": "The lion roars." },
        { "word": "LOVE", "p1": "L", "p2": "O", "p3": "V", "p4": "E", "icon": "❤️", "sentence": "I love you." },
        { "word": "MILK", "p1": "M", "p2": "I", "p3": "L", "p4": "K", "icon": "🥛", "sentence": "Drink your milk." },
        { "word": "MOON", "p1": "M", "p2": "O", "p3": "O", "p4": "N", "icon": "🌙", "sentence": "Goodnight moon." },
        { "word": "NOSE", "p1": "N", "p2": "O", "p3": "S", "p4": "E", "icon": "👃", "sentence": "Touch your nose." },
        { "word": "PARK", "p1": "P", "p2": "A", "p3": "R", "p4": "K", "icon": "⛲", "sentence": "Play in the park." },
        { "word": "RAIN", "p1": "R", "p2": "A", "p3": "I", "p4": "N", "icon": "🌧️", "sentence": "Rain goes away." },
        { "word": "RING", "p1": "R", "p2": "I", "p3": "N", "p4": "G", "icon": "💍", "sentence": "Shiny gold ring." },
        { "word": "ROSE", "p1": "R", "p2": "O", "p3": "S", "p4": "E", "icon": "🌹", "sentence": "Smell the rose." },
        { "word": "SHIP", "p1": "S", "p2": "H", "p3": "I", "p4": "P", "icon": "🚢", "sentence": "Big ship sails." },
        { "word": "SHOE", "p1": "S", "p2": "H", "p3": "O", "p4": "E", "icon": "👟", "sentence": "Tie your shoe." },
        { "word": "SNOW", "p1": "S", "p2": "N", "p3": "O", "p4": "W", "icon": "❄️", "sentence": "Cold white snow." },
        { "word": "SOCK", "p1": "S", "p2": "O", "p3": "C", "p4": "K", "icon": "🧦", "sentence": "Put on a sock." },
        { "word": "STAR", "p1": "S", "p2": "T", "p3": "A", "p4": "R", "icon": "⭐", "sentence": "Twinkle twinkle star." },
        { "word": "TREE", "p1": "T", "p2": "R", "p3": "E", "p4": "E", "icon": "🌳", "sentence": "Climb the tree." },
        { "word": "WOLF", "p1": "W", "p2": "O", "p3": "L", "p4": "F", "icon": "🐺", "sentence": "The wolf howls." }
    ]
}

FIVE_LETTER_WORDS_DATA = {
    "game_id": "five_letter_words",
    "title": "Five Letter Words",
    "content": [
        { "word": "APPLE", "p1": "A", "p2": "P", "p3": "P", "p4": "L", "p5": "E", "icon": "🍎", "sentence": "Eat an apple." },
        { "word": "BEACH", "p1": "B", "p2": "E", "p3": "A", "p4": "C", "p5": "H", "icon": "🏖️", "sentence": "Sand at the beach." },
        { "word": "BREAD", "p1": "B", "p2": "R", "p3": "E", "p4": "A", "p5": "D", "icon": "🍞", "sentence": "Bake the bread." },
        { "word": "BRUSH", "p1": "B", "p2": "R", "p3": "U", "p4": "S", "p5": "H", "icon": "🖌️", "sentence": "Paint with a brush." },
        { "word": "CANDY", "p1": "C", "p2": "A", "p3": "N", "p4": "D", "p5": "Y", "icon": "🍬", "sentence": "Sweet stick candy." },
        { "word": "CHAIR", "p1": "C", "p2": "H", "p3": "A", "p4": "I", "p5": "R", "icon": "🪑", "sentence": "Sit on the chair." },
        { "word": "CLOCK", "p1": "C", "p2": "L", "p3": "O", "p4": "C", "p5": "K", "icon": "⏰", "sentence": "Tick tock clock." },
        { "word": "CLOUD", "p1": "C", "p2": "L", "p3": "O", "p4": "U", "p5": "D", "icon": "☁️", "sentence": "White fluffy cloud." },
        { "word": "DANCE", "p1": "D", "p2": "A", "p3": "N", "p4": "C", "p5": "E", "icon": "💃", "sentence": "Let us dance." },
        { "word": "DRESS", "p1": "D", "p2": "R", "p3": "E", "p4": "S", "p5": "S", "icon": "👗", "sentence": "Wear a nice dress." },
        { "word": "DRINK", "p1": "D", "p2": "R", "p3": "I", "p4": "N", "p5": "K", "icon": "🥤", "sentence": "Drink some water." },
        { "word": "EARTH", "p1": "E", "p2": "A", "p3": "R", "p4": "T", "p5": "H", "icon": "🌍", "sentence": "We live on Earth." },
        { "word": "FRUIT", "p1": "F", "p2": "R", "p3": "U", "p4": "I", "p5": "T", "icon": "🍇", "sentence": "Healthy yummy fruit." },
        { "word": "GHOST", "p1": "G", "p2": "H", "p3": "O", "p4": "S", "p5": "T", "icon": "👻", "sentence": "Spooky little ghost." },
        { "word": "GRAPE", "p1": "G", "p2": "R", "p3": "A", "p4": "P", "p5": "E", "icon": "🍇", "sentence": "Purple juicy grape." },
        { "word": "GRASS", "p1": "G", "p2": "R", "p3": "A", "p4": "S", "p5": "S", "icon": "🌱", "sentence": "Green soft grass." },
        { "word": "HEART", "p1": "H", "p2": "E", "p3": "A", "p4": "R", "p5": "T", "icon": "❤️", "sentence": "Love in my heart." },
        { "word": "HORSE", "p1": "H", "p2": "O", "p3": "R", "p4": "S", "p5": "E", "icon": "🐴", "sentence": "Ride a horse." },
        { "word": "HOUSE", "p1": "H", "p2": "O", "p3": "U", "p4": "S", "p5": "E", "icon": "🏠", "sentence": "My comfortable house." },
        { "word": "JUICE", "p1": "J", "p2": "U", "p3": "I", "p4": "C", "p5": "E", "icon": "🧃", "sentence": "Fresh orange juice." },
        { "word": "LEMON", "p1": "L", "p2": "E", "p3": "M", "p4": "O", "p5": "N", "icon": "🍋", "sentence": "Sour yellow lemon." },
        { "word": "MOUSE", "p1": "M", "p2": "O", "p3": "U", "p4": "S", "p5": "E", "icon": "🐭", "sentence": "Quiet little mouse." },
        { "word": "MUSIC", "p1": "M", "p2": "U", "p3": "S", "p4": "I", "p5": "C", "icon": "🎵", "sentence": "Listen to music." },
        { "word": "NIGHT", "p1": "N", "p2": "I", "p3": "G", "p4": "H", "p5": "T", "icon": "🌃", "sentence": "Sleep at night." },
        { "word": "OCEAN", "p1": "O", "p2": "C", "p3": "E", "p4": "A", "p5": "N", "icon": "🌊", "sentence": "Deep blue ocean." },
        { "word": "PANDA", "p1": "P", "p2": "A", "p3": "N", "p4": "D", "p5": "A", "icon": "🐼", "sentence": "Cute black panda." },
        { "word": "PAPER", "p1": "P", "p2": "A", "p3": "P", "p4": "E", "p5": "R", "icon": "📄", "sentence": "Write on paper." },
        { "word": "PARTY", "p1": "P", "p2": "A", "p3": "R", "p4": "T", "p5": "Y", "icon": "🎉", "sentence": "Birthday party fun." },
        { "word": "PIZZA", "p1": "P", "p2": "I", "p3": "Z", "p4": "Z", "p5": "A", "icon": "🍕", "sentence": "Cheese pepperoni pizza." },
        { "word": "PLANE", "p1": "P", "p2": "L", "p3": "A", "p4": "N", "p5": "E", "icon": "✈️", "sentence": "Fly in a plane." },
        { "word": "PLANT", "p1": "P", "p2": "L", "p3": "A", "p4": "N", "p5": "T", "icon": "🪴", "sentence": "Water the plant." },
        { "word": "QUEEN", "p1": "Q", "p2": "U", "p3": "E", "p4": "E", "p5": "N", "icon": "👑", "sentence": "The royal queen." },
        { "word": "RADIO", "p1": "R", "p2": "A", "p3": "D", "p4": "I", "p5": "O", "icon": "📻", "sentence": "Turn on the radio." },
        { "word": "ROBOT", "p1": "R", "p2": "O", "p3": "B", "p4": "O", "p5": "T", "icon": "🤖", "sentence": "Beep boop robot." },
        { "word": "SHARK", "p1": "S", "p2": "H", "p3": "A", "p4": "R", "p5": "K", "icon": "🦈", "sentence": "Big scary shark." },
        { "word": "SHEEP", "p1": "S", "p2": "H", "p3": "E", "p4": "E", "p5": "P", "icon": "🐑", "sentence": "Soft wool sheep." },
        { "word": "SHOES", "p1": "S", "p2": "H", "p3": "O", "p4": "E", "p5": "S", "icon": "👟", "sentence": "New running shoes." },
        { "word": "SMILE", "p1": "S", "p2": "M", "p3": "I", "p4": "L", "p5": "E", "icon": "😄", "sentence": "Big happy smile." },
        { "word": "SNAKE", "p1": "S", "p2": "N", "p3": "A", "p4": "K", "p5": "E", "icon": "🐍", "sentence": "Hissing green snake." },
        { "word": "SPOON", "p1": "S", "p2": "P", "p3": "O", "p4": "O", "p5": "N", "icon": "🥄", "sentence": "Eat with a spoon." },
        { "word": "TIGER", "p1": "T", "p2": "I", "p3": "G", "p4": "E", "p5": "R", "icon": "🐯", "sentence": "Striped orange tiger." },
        { "word": "TOAST", "p1": "T", "p2": "O", "p3": "A", "p4": "S", "p5": "T", "icon": "🍞", "sentence": "Butter on toast." },
        { "word": "TRAIN", "p1": "T", "p2": "R", "p3": "A", "p4": "I", "p5": "N", "icon": "🚂", "sentence": "Choo choo train." },
        { "word": "TRUCK", "p1": "T", "p2": "R", "p3": "U", "p4": "C", "p5": "K", "icon": "🚚", "sentence": "Big heavy truck." },
        { "word": "WATCH", "p1": "W", "p2": "A", "p3": "T", "p4": "C", "p5": "H", "icon": "⌚", "sentence": "Look at my watch." },
        { "word": "WATER", "p1": "W", "p2": "A", "p3": "T", "p4": "E", "p5": "R", "icon": "💧", "sentence": "Drink cool water." },
        { "word": "WHALE", "p1": "W", "p2": "H", "p3": "A", "p4": "L", "p5": "E", "icon": "🐋", "sentence": "Huge blue whale." },
        { "word": "ZEBRA", "p1": "Z", "p2": "E", "p3": "B", "p4": "R", "p5": "A", "icon": "🦓", "sentence": "Striped black zebra." }
    ]
}

SIX_LETTER_WORDS_DATA = {
    "game_id": "six_letter_words",
    "title": "Six Letter Words",
    "content": [
        { "word": "ANIMAL", "p1": "A", "p2": "N", "p3": "I", "p4": "M", "p5": "A", "p6": "L", "icon": "🐘", "sentence": "The elephant is a big animal." },
        { "word": "BANANA", "p1": "B", "p2": "A", "p3": "N", "p4": "A", "p5": "N", "p6": "A", "icon": "🍌", "sentence": "Yellow sweet banana." },
        { "word": "BOTTLE", "p1": "B", "p2": "O", "p3": "T", "p4": "T", "p5": "L", "p6": "E", "icon": "🍾", "sentence": "Water in a bottle." },
        { "word": "BRIDGE", "p1": "B", "p2": "R", "p3": "I", "p4": "D", "p5": "G", "p6": "E", "icon": "🌉", "sentence": "Cross the bridge." },
        { "word": "BUTTON", "p1": "B", "p2": "U", "p3": "T", "p4": "T", "p5": "O", "p6": "N", "icon": "🔘", "sentence": "Push the button." },
        { "word": "CAMERA", "p1": "C", "p2": "A", "p3": "M", "p4": "E", "p5": "R", "p6": "A", "icon": "📷", "sentence": "Smile for the camera." },
        { "word": "CARROT", "p1": "C", "p2": "A", "p3": "R", "p4": "R", "p5": "O", "p6": "T", "icon": "🥕", "sentence": "Crunchy orange carrot." },
        { "word": "CASTLE", "p1": "C", "p2": "A", "p3": "S", "p4": "T", "p5": "L", "p6": "E", "icon": "🏰", "sentence": "A big stone castle." },
        { "word": "CHEESE", "p1": "C", "p2": "H", "p3": "E", "p4": "E", "p5": "S", "p6": "E", "icon": "🧀", "sentence": "I like cheese." },
        { "word": "CIRCLE", "p1": "C", "p2": "I", "p3": "R", "p4": "C", "p5": "L", "p6": "E", "icon": "🔴", "sentence": "Round like a circle." },
        { "word": "COOKIE", "p1": "C", "p2": "O", "p3": "O", "p4": "K", "p5": "I", "p6": "E", "icon": "🍪", "sentence": "Yummy chocolate cookie." },
        { "word": "DOCTOR", "p1": "D", "p2": "O", "p3": "C", "p4": "T", "p5": "O", "p6": "R", "icon": "👨‍⚕️", "sentence": "The doctor helps us." },
        { "word": "DONKEY", "p1": "D", "p2": "O", "p3": "N", "p4": "K", "p5": "E", "p6": "Y", "icon": "🫏", "sentence": "The donkey says hee-haw." },
        { "word": "DRAGON", "p1": "D", "p2": "R", "p3": "A", "p4": "G", "p5": "O", "p6": "N", "icon": "🐉", "sentence": "Fire breathing dragon." },
        { "word": "FAMILY", "p1": "F", "p2": "A", "p3": "M", "p4": "I", "p5": "L", "p6": "Y", "icon": "👨‍👩‍👧‍👦", "sentence": "I love my family." },
        { "word": "FINGER", "p1": "F", "p2": "I", "p3": "N", "p4": "G", "p5": "E", "p6": "R", "icon": "☝️", "sentence": "Point with your finger." },
        { "word": "FLOWER", "p1": "F", "p2": "L", "p3": "O", "p4": "W", "p5": "E", "p6": "R", "icon": "🌸", "sentence": "Beautiful pink flower." },
        { "word": "FOREST", "p1": "F", "p2": "O", "p3": "R", "p4": "E", "p5": "S", "p6": "T", "icon": "🌲", "sentence": "Trees in the forest." },
        { "word": "FRIEND", "p1": "F", "p2": "R", "p3": "I", "p4": "E", "p5": "N", "p6": "D", "icon": "🤝", "sentence": "Playing with a friend." },
        { "word": "GARDEN", "p1": "G", "p2": "A", "p3": "R", "p4": "D", "p5": "E", "p6": "N", "icon": "🏡", "sentence": "Flowers in the garden." },
        { "word": "GUITAR", "p1": "G", "p2": "U", "p3": "I", "p4": "T", "p5": "A", "p6": "R", "icon": "🎸", "sentence": "Play the guitar." },
        { "word": "JUNGLE", "p1": "J", "p2": "U", "p3": "N", "p4": "G", "p5": "L", "p6": "E", "icon": "🌴", "sentence": "Wild jungle animals." },
        { "word": "KITTEN", "p1": "K", "p2": "I", "p3": "T", "p4": "T", "p5": "E", "p6": "N", "icon": "🐱", "sentence": "Cute baby kitten." },
        { "word": "LADDER", "p1": "L", "p2": "A", "p3": "D", "p4": "D", "p5": "E", "p6": "R", "icon": "🪜", "sentence": "Climb the ladder." },
        { "word": "LAPTOP", "p1": "L", "p2": "A", "p3": "P", "p4": "T", "p5": "O", "p6": "P", "icon": "💻", "sentence": "Work on the laptop." },
        { "word": "MARKER", "p1": "M", "p2": "A", "p3": "R", "p4": "K", "p5": "E", "p6": "R", "icon": "🖍️", "sentence": "Color with a marker." },
        { "word": "MONKEY", "p1": "M", "p2": "O", "p3": "N", "p4": "K", "p5": "E", "p6": "Y", "icon": "🐒", "sentence": "Monkey likes bananas." },
        { "word": "NUMBER", "p1": "N", "p2": "U", "p3": "M", "p4": "B", "p5": "E", "p6": "R", "icon": "🔢", "sentence": "Count the numbers." },
        { "word": "ORANGE", "p1": "O", "p2": "R", "p3": "A", "p4": "N", "p5": "G", "p6": "E", "icon": "🍊", "sentence": "Juicy orange." },
        { "word": "PENCIL", "p1": "P", "p2": "E", "p3": "N", "p4": "C", "p5": "I", "p6": "L", "icon": "✏️", "sentence": "Write with a pencil." },
        { "word": "PEPPER", "p1": "P", "p2": "E", "p3": "P", "p4": "P", "p5": "E", "p6": "R", "icon": "🌶️", "sentence": "Spicy red pepper." },
        { "word": "PILLOW", "p1": "P", "p2": "I", "p3": "L", "p4": "L", "p5": "O", "p6": "W", "icon": "🛌", "sentence": "Soft fluffy pillow." },
        { "word": "PLANET", "p1": "P", "p2": "L", "p3": "A", "p4": "N", "p5": "E", "p6": "T", "icon": "🪐", "sentence": "Earth is a planet." },
        { "word": "POCKET", "p1": "P", "p2": "O", "p3": "C", "p4": "K", "p5": "E", "p6": "T", "icon": "👖", "sentence": "Put it in your pocket." },
        { "word": "POTATO", "p1": "P", "p2": "O", "p3": "T", "p4": "A", "p5": "T", "p6": "O", "icon": "🥔", "sentence": "Baked potato." },
        { "word": "PURPLE", "p1": "P", "p2": "U", "p3": "R", "p4": "P", "p5": "L", "p6": "E", "icon": "🟣", "sentence": "Color purple." },
        { "word": "RABBIT", "p1": "R", "p2": "A", "p3": "B", "p4": "B", "p5": "I", "p6": "T", "icon": "🐰", "sentence": "Hop little rabbit." },
        { "word": "ROCKET", "p1": "R", "p2": "O", "p3": "C", "p4": "K", "p5": "E", "p6": "T", "icon": "🚀", "sentence": "Rocket to the moon." },
        { "word": "SCHOOL", "p1": "S", "p2": "C", "p3": "H", "p4": "O", "p5": "O", "p6": "L", "icon": "🏫", "sentence": "Learn at school." },
        { "word": "SHORTS", "p1": "S", "p2": "H", "p3": "O", "p4": "R", "p5": "T", "p6": "S", "icon": "🩳", "sentence": "Wear your shorts." },
        { "word": "SISTER", "p1": "S", "p2": "I", "p3": "S", "p4": "T", "p5": "E", "p6": "R", "icon": "👧", "sentence": "Play with sister." },
        { "word": "SOCCER", "p1": "S", "p2": "O", "p3": "C", "p4": "C", "p5": "E", "p6": "R", "icon": "⚽", "sentence": "Play soccer." },
        { "word": "SPIDER", "p1": "S", "p2": "P", "p3": "I", "p4": "D", "p5": "E", "p6": "R", "icon": "🕷️", "sentence": "Eight-legged spider." },
        { "word": "SUMMER", "p1": "S", "p2": "U", "p3": "M", "p4": "M", "p5": "E", "p6": "R", "icon": "☀️", "sentence": "Hot summer day." },
        { "word": "TOMATO", "p1": "T", "p2": "O", "p3": "M", "p4": "A", "p5": "T", "p6": "O", "icon": "🍅", "sentence": "Red ripe tomato." },
        { "word": "TURTLE", "p1": "T", "p2": "U", "p3": "R", "p4": "T", "p5": "L", "p6": "E", "icon": "🐢", "sentence": "Slow green turtle." },
        { "word": "WINDOW", "p1": "W", "p2": "I", "p3": "N", "p4": "D", "p5": "O", "p6": "W", "icon": "🪟", "sentence": "Look out the window." },
        { "word": "WINTER", "p1": "W", "p2": "I", "p3": "N", "p4": "T", "p5": "E", "p6": "R", "icon": "🌨️", "sentence": "Cold snowy winter." },
        { "word": "YELLOW", "p1": "Y", "p2": "E", "p3": "L", "p4": "L", "p5": "O", "p6": "W", "icon": "🟡", "sentence": "Bright yellow sun." }
    ]
}

SEVEN_LETTER_WORDS_DATA = {
    "game_id": "seven_letter_words",
    "title": "Seven Letter Words",
    "content": [
        { "word": "AIRPORT", "p1": "A", "p2": "I", "p3": "R", "p4": "P", "p5": "O", "p6": "R", "p7": "T", "icon": "🛫", "sentence": "Fly from the airport." },
        { "word": "BALLOON", "p1": "B", "p2": "A", "p3": "L", "p4": "L", "p5": "O", "p6": "O", "p7": "N", "icon": "🎈", "sentence": "Red floating balloon." },
        { "word": "BEDROOM", "p1": "B", "p2": "E", "p3": "D", "p4": "R", "p5": "O", "p6": "O", "p7": "M", "icon": "🛌", "sentence": "Sleep in your bedroom." },
        { "word": "BICYCLE", "p1": "B", "p2": "I", "p3": "C", "p4": "Y", "p5": "C", "p6": "L", "p7": "E", "icon": "🚲", "sentence": "Ride your bicycle." },
        { "word": "BLANKET", "p1": "B", "p2": "L", "p3": "A", "p4": "N", "p5": "K", "p6": "E", "p7": "T", "icon": "🛌", "sentence": "Warm soft blanket." },
        { "word": "BROTHER", "p1": "B", "p2": "R", "p3": "O", "p4": "T", "p5": "H", "p6": "E", "p7": "R", "icon": "👦", "sentence": "Play with brother." },
        { "word": "CHICKEN", "p1": "C", "p2": "H", "p3": "I", "p4": "C", "p5": "K", "p6": "E", "p7": "N", "icon": "🐔", "sentence": "Cluck cluck chicken." },
        { "word": "CUPCAKE", "p1": "C", "p2": "U", "p3": "P", "p4": "C", "p5": "A", "p6": "K", "p7": "E", "icon": "🧁", "sentence": "Sweet frosting cupcake." },
        { "word": "DOLPHIN", "p1": "D", "p2": "O", "p3": "L", "p4": "P", "p5": "H", "p6": "I", "p7": "N", "icon": "🐬", "sentence": "Jumping blue dolphin." },
        { "word": "EVENING", "p1": "E", "p2": "V", "p3": "E", "p4": "N", "p5": "I", "p6": "N", "p7": "G", "icon": "🌇", "sentence": "Sun sets in the evening." },
        { "word": "FARMING", "p1": "F", "p2": "A", "p3": "R", "p4": "M", "p5": "I", "p6": "N", "p7": "G", "icon": "🚜", "sentence": "Tractor farming field." },
        { "word": "FEATHER", "p1": "F", "p2": "E", "p3": "A", "p4": "T", "p5": "H", "p6": "E", "p7": "R", "icon": "🪶", "sentence": "Light bird feather." },
        { "word": "GIRAFFE", "p1": "G", "p2": "I", "p3": "R", "p4": "A", "p5": "F", "p6": "F", "p7": "E", "icon": "🦒", "sentence": "Tall neck giraffe." },
        { "word": "HAMSTER", "p1": "H", "p2": "A", "p3": "M", "p4": "S", "p5": "T", "p6": "E", "p7": "R", "icon": "🐹", "sentence": "Cute little hamster." },
        { "word": "HOLIDAY", "p1": "H", "p2": "O", "p3": "L", "p4": "I", "p5": "D", "p6": "A", "p7": "Y", "icon": "🎉", "sentence": "Happy holiday fun." },
        { "word": "KITCHEN", "p1": "K", "p2": "I", "p3": "T", "p4": "C", "p5": "H", "p6": "E", "p7": "N", "icon": "🍳", "sentence": "Cook in the kitchen." },
        { "word": "LIBRARY", "p1": "L", "p2": "I", "p3": "B", "p4": "R", "p5": "A", "p6": "R", "p7": "Y", "icon": "📚", "sentence": "Quiet reading library." },
        { "word": "LOBSTER", "p1": "L", "p2": "O", "p3": "B", "p4": "S", "p5": "T", "p6": "E", "p7": "R", "icon": "🦞", "sentence": "Red ocean lobster." },
        { "word": "MESSAGE", "p1": "M", "p2": "E", "p3": "S", "p4": "S", "p5": "A", "p6": "G", "p7": "E", "icon": "💬", "sentence": "Send a message." },
        { "word": "MORNING", "p1": "M", "p2": "O", "p3": "R", "p4": "N", "p5": "I", "p6": "N", "p7": "G", "icon": "🌅", "sentence": "Good morning sun." },
        { "word": "OCTOPUS", "p1": "O", "p2": "C", "p3": "T", "p4": "O", "p5": "P", "p6": "U", "p7": "S", "icon": "🐙", "sentence": "Eight-legged octopus." },
        { "word": "OUTSIDE", "p1": "O", "p2": "U", "p3": "T", "p4": "S", "p5": "I", "p6": "D", "p7": "E", "icon": "🌳", "sentence": "Play outside today." },
        { "word": "PAINTER", "p1": "P", "p2": "A", "p3": "I", "p4": "N", "p5": "T", "p6": "E", "p7": "R", "icon": "🎨", "sentence": "Colorful art painter." },
        { "word": "PAJAMAS", "p1": "P", "p2": "A", "p3": "J", "p4": "A", "p5": "M", "p6": "A", "p7": "S", "icon": "👚", "sentence": "Wear cozy pajamas." },
        { "word": "PENGUIN", "p1": "P", "p2": "E", "p3": "N", "p4": "G", "p5": "U", "p6": "I", "p7": "N", "icon": "🐧", "sentence": "Waddle little penguin." },
        { "word": "PICTURE", "p1": "P", "p2": "I", "p3": "C", "p4": "T", "p5": "U", "p6": "R", "p7": "E", "icon": "🖼️", "sentence": "Draw a nice picture." },
        { "word": "POPCORN", "p1": "P", "p2": "O", "p3": "P", "p4": "C", "p5": "O", "p6": "R", "p7": "N", "icon": "🍿", "sentence": "Crunchy movie popcorn." },
        { "word": "PUMPKIN", "p1": "P", "p2": "U", "p3": "M", "p4": "P", "p5": "K", "p6": "I", "p7": "N", "icon": "🎃", "sentence": "Orange halloween pumpkin." },
        { "word": "RAINBOW", "p1": "R", "p2": "A", "p3": "I", "p4": "N", "p5": "B", "p6": "O", "p7": "W", "icon": "🌈", "sentence": "Colorful sky rainbow." },
        { "word": "SCOOTER", "p1": "S", "p2": "C", "p3": "O", "p4": "O", "p5": "T", "p6": "E", "p7": "R", "icon": "🛴", "sentence": "Ride my scooter." },
        { "word": "SNOWMAN", "p1": "S", "p2": "N", "p3": "O", "p4": "W", "p5": "M", "p6": "A", "p7": "N", "icon": "⛄", "sentence": "Frosty the snowman." },
        { "word": "STADIUM", "p1": "S", "p2": "T", "p3": "A", "p4": "D", "p5": "I", "p6": "U", "p7": "M", "icon": "🏟️", "sentence": "Big sports stadium." },
        { "word": "TEACHER", "p1": "T", "p2": "E", "p3": "A", "p4": "C", "p5": "H", "p6": "E", "p7": "R", "icon": "👩‍🏫", "sentence": "Listen to the teacher." },
        { "word": "THEATER", "p1": "T", "p2": "H", "p3": "E", "p4": "A", "p5": "T", "p6": "E", "p7": "R", "icon": "🎭", "sentence": "Movie theater fun." },
        { "word": "TORNADO", "p1": "T", "p2": "O", "p3": "R", "p4": "N", "p5": "A", "p6": "D", "p7": "O", "icon": "🌪️", "sentence": "Spinning wind tornado." },
        { "word": "TRACTOR", "p1": "T", "p2": "R", "p3": "A", "p4": "C", "p5": "T", "p6": "O", "p7": "R", "icon": "🚜", "sentence": "Drive the tractor." },
        { "word": "TRUMPET", "p1": "T", "p2": "R", "p3": "U", "p4": "M", "p5": "P", "p6": "E", "p7": "T", "icon": "🎺", "sentence": "Blow the trumpet." },
        { "word": "UNICORN", "p1": "U", "p2": "N", "p3": "I", "p4": "C", "p5": "O", "p6": "R", "p7": "N", "icon": "🦄", "sentence": "Magical pretty unicorn." },
        { "word": "VOLCANO", "p1": "V", "p2": "O", "p3": "L", "p4": "C", "p5": "A", "p6": "N", "p7": "O", "icon": "🌋", "sentence": "Hot lava volcano." },
        { "word": "WEATHER", "p1": "W", "p2": "E", "p3": "A", "p4": "T", "p5": "H", "p6": "E", "p7": "R", "icon": "🌦️", "sentence": "Check the weather." },
        { "word": "WHISTLE", "p1": "W", "p2": "H", "p3": "I", "p4": "S", "p5": "T", "p6": "L", "p7": "E", "icon": "😗", "sentence": "Blow the whistle." }
    ]
}

COMMANDS_ACTIONS_DATA = {
    "game_id": "commands_actions",
    "title": "Commands Actions",
    "content": [
        { "word": "START", "icon": "▶️", "context": "Start the game." },
        { "word": "STOP", "icon": "🛑", "context": "Stop right there." },
        { "word": "GO", "icon": "🟢", "context": "Ready, set, go!" },
        { "word": "WAIT", "icon": "✋", "context": "Wait for me." },
        { "word": "CHOOSE", "icon": "👆", "context": "Choose one." },
        { "word": "PICK", "icon": "🤏", "context": "Pick a color." },
        { "word": "MATCH", "icon": "🧩", "context": "Match the shapes." },
        { "word": "FIND", "icon": "🔍", "context": "Find the hidden toy." },
        { "word": "TAP", "icon": "👇", "context": "Tap the screen." },
        { "word": "CLICK", "icon": "🖱️", "context": "Click the button." },
        { "word": "MOVE", "icon": "↔️", "context": "Move it here." },
        { "word": "DRAG", "icon": "✊", "context": "Drag and drop." },
        { "word": "DROP", "icon": "⬇️", "context": "Drop it down." }
    ]
}

ENCOURAGEMENT_DATA = {
    "game_id": "encouragement",
    "title": "Encouragement",
    "content": [
        { "word": "TRY!", "icon": "💪", "context": "You can do it, try!" },
        { "word": "GREAT!", "icon": "🌟", "context": "That is great work!" },
        { "word": "WOW!", "icon": "😲", "context": "Wow! Amazing!" },
        { "word": "GOOD JOB!", "icon": "👍", "context": "Good job holding that." },
        { "word": "WELL DONE!", "icon": "🏆", "context": "Well done, winner!" },
        { "word": "KEEP GOING!", "icon": "🏃", "context": "Do not stop, keep going!" },
        { "word": "YOU CAN DO IT!", "icon": "🦸", "context": "Believe in yourself!" },
        { "word": "RESPECT", "icon": "🤝", "context": "Respect others." },
        { "word": "LISTEN", "icon": "👂", "context": "Listen carefully." },
        { "word": "CARE", "icon": "❤️", "context": "Care for friends." },
        { "word": "SUPPORT", "icon": "🤗", "context": "Support your team." },
        { "word": "NICE!", "icon": "👌", "context": "That is very nice." },
        { "word": "SUPER!", "icon": "🦸‍♀️", "context": "You are super!" },
        { "word": "COOL!", "icon": "😎", "context": "That is so cool." },
        { "word": "BRAVO!", "icon": "👏", "context": "Bravo! Bravo!" }
    ]
}

# --- New English Games Data ---

ADVERBS_DATA = {
    "game_id": "adverbs",
    "title": "Adverbs",
    "categories": {
        "manner": {
            "title": "How? (Manner)",
            "description": "Tells us HOW something happens.",
            "color": "#E67E22",
            "items": [
                { "word": "Slowly", "sentence": "The turtle walks **slowly**.", "icon": "🐢" },
                { "word": "Quickly", "sentence": "The rabbit runs **quickly**.", "icon": "🐇" },
                { "word": "Neatly", "sentence": "She writes **neatly**.", "icon": "✍️" },
                { "word": "Loudly", "sentence": "The lion roars **loudly**.", "icon": "🦁" },
                { "word": "Softly", "sentence": "Speak **softly**.", "icon": "🤫" },
                { "word": "Happy", "sentence": "He plays **happily**.", "icon": "😊" }
            ]
        },
        "time": {
            "title": "When? (Time)",
            "description": "Tells us WHEN something happens.",
            "color": "#2ECC71",
            "items": [
                { "word": "Today", "sentence": "We play **today**.", "icon": "📅" },
                { "word": "Soon", "sentence": "See you **soon**.", "icon": "👋" },
                { "word": "Yesterday", "sentence": "It rained **yesterday**.", "icon": "🌧️" },
                { "word": "Now", "sentence": "Do it **now**.", "icon": "⏱️" },
                { "word": "Early", "sentence": "Wake up **early**.", "icon": "🌅" },
                { "word": "Late", "sentence": "Don't be **late**.", "icon": "🏃" }
            ]
        },
        "place": {
            "title": "Where? (Place)",
            "description": "Tells us WHERE something is.",
            "color": "#3498DB",
            "items": [
                { "word": "Here", "sentence": "Come **here**.", "icon": "👇" },
                { "word": "There", "sentence": "Go **there**.", "icon": "👉" },
                { "word": "Inside", "sentence": "Stay **inside**.", "icon": "🏠" },
                { "word": "Outside", "sentence": "Play **outside**.", "icon": "🌳" },
                { "word": "Up", "sentence": "Look **up**.", "icon": "👆" },
                { "word": "Down", "sentence": "Sit **down**.", "icon": "🪑" }
            ]
        },
        "frequency": {
            "title": "How Often? (Frequency)",
            "description": "Tells us HOW OFTEN we do things.",
            "color": "#9B59B6",
            "items": [
                { "word": "Always", "sentence": "I **always** brush my teeth.", "icon": "🪥" },
                { "word": "Never", "sentence": "I **never** tell lies.", "icon": "❌" },
                { "word": "Daily", "sentence": "I read **daily**.", "icon": "📖" },
                { "word": "Sometimes", "sentence": "**Sometimes** I eat ice cream.", "icon": "🍦" }
            ]
        }
    },
    "dialogues": [
        {
            "id": 1,
            "title": "At School",
            "icon": "🏫",
            "lines": [
                { "speaker": "Teacher", "text": "Riya, you read the poem **beautifully**." },
                { "speaker": "Riya", "text": "Thank you, ma’am. I practiced **carefully**." },
                { "speaker": "Teacher", "text": "Good students always work **hard**." },
                { "speaker": "Riya", "text": "I will try again **tomorrow**." }
            ]
        },
        {
            "id": 2,
            "title": "At Home",
            "icon": "🏠",
            "lines": [
                { "speaker": "Mother", "text": "Rahul, you cleaned your room **nicely**." },
                { "speaker": "Rahul", "text": "Yes, Mom. I worked **quickly**." },
                { "speaker": "Mother", "text": "The house looks **very** neat now." },
                { "speaker": "Rahul", "text": "I will help you **again** later." }
            ]
        },
        {
            "id": 3,
            "title": "Playing Outside",
            "icon": "⚽",
            "lines": [
                { "speaker": "Aman", "text": "The boys are running **fast**." },
                { "speaker": "Riya", "text": "Yes, they play football **every day**." },
                { "speaker": "Aman", "text": "Rahul kicked the ball **strongly**." },
                { "speaker": "Riya", "text": "It went **far** across the field!" }
            ]
        },
        {
            "id": 4,
            "title": "At Dinner",
            "icon": "🍽️",
            "lines": [
                { "speaker": "Father", "text": "The food smells **really** good." },
                { "speaker": "Mother", "text": "I cooked the rice **slowly**." },
                { "speaker": "Child", "text": "I am eating **happily**." },
                { "speaker": "Father", "text": "Everyone is sitting **together**." }
            ]
        }
    ],
    "quiz": [
        { "question": "The turtle walks ___.", "answer": "slowly", "options": ["slowly", "quickly", "loudly"] },
        { "question": "Did you finish your work ___?", "answer": "today", "options": ["today", "outside", "neatly"] },
        { "question": "Keep your shoes ___.", "answer": "outside", "options": ["outside", "yesterday", "slowly"] },
        { "question": "I ___ tell lies.", "answer": "never", "options": ["never", "outside", "fast"] },
        { "question": "The lion roars ___.", "answer": "loudly", "options": ["loudly", "neatly", "kindly"] },
        { "question": "Come ___!", "answer": "here", "options": ["here", "happy", "slow"] }
    ]
}

FEELING_THINKING_DATA = {
    "game_id": "feeling_thinking",
    "title": "Feeling and Thinking",
    "content": [
        { "word": "LIKE", "icon": "👍", "context": "I like ice cream." },
        { "word": "LOVE", "icon": "❤️", "context": "I love my family." },
        { "word": "WANT", "icon": "🤲", "context": "I want a toy." },
        { "word": "NEED", "icon": "💧", "context": "I need water." },
        { "word": "KNOW", "icon": "💡", "context": "I know the answer." },
        { "word": "REMEMBER", "icon": "🧠", "context": "I remember you." },
        { "word": "FORGET", "icon": "🤷", "context": "I forget my hat." },
        { "word": "TRY", "icon": "💪", "context": "I try my best." },
        { "word": "HELP", "icon": "🤝", "context": "I help my friend." },
        { "word": "THINK", "icon": "🤔", "context": "I think hard." },
        { "word": "HOPE", "icon": "🙏", "context": "I hope it rains." },
        { "word": "HAPPY", "icon": "😊", "context": "I feel happy." },
        { "word": "SAD", "icon": "😢", "context": "I feel sad." },
        { "word": "ANGRY", "icon": "😠", "context": "I feel angry." },
        { "word": "SCARED", "icon": "😨", "context": "I feel scared." }
    ]
}

GUEST_MANNERS_DATA = {
    "game_id": "guest_manners",
    "title": "Guest Manners",
    "sections": [
        {
            "id": "welcome",
            "title": "Welcoming",
            "icon": "🚪",
            "phrases": [
                "Welcome to our home!",
                "Hello, uncle/auntie!",
                "Nice to see you!",
                "Please come in.",
                "We are happy you came.",
                "How are you?"
            ]
        },
        {
            "id": "seat",
            "title": "Offering Seat",
            "icon": "🪑",
            "phrases": [
                "Please sit here.",
                "Have a seat.",
                "Sit comfortably.",
                "This chair is for you."
            ]
        },
        {
            "id": "food",
            "title": "Food & Drinks",
            "icon": "🍹",
            "phrases": [
                "Would you like some water?",
                "Please have some water.",
                "Would you like tea or juice?",
                "I will bring snacks.",
                "Please have some food.",
                "Take some more, please.",
                "Do you like it?"
            ]
        },
        {
            "id": "chat",
            "title": "Polite Talk",
            "icon": "😊",
            "phrases": [
                "How was your day?",
                "Did you have a good trip?",
                "Please tell us about your family.",
                "I am happy to see you.",
                "That is very nice!"
            ]
        }
    ]
}


HOME_ACTIONS_DATA = {
    "game_id": "home_actions",
    "title": "Home Actions",
    "content": [
        { "text": "I BRUSH TEETH", "verb": "BRUSH", "parts": ["I", "BRUSH", "TEETH"], "icon": "🪥", "context": "Clean and white!" },
        { "text": "I WASH FACE", "verb": "WASH", "parts": ["I", "WASH", "FACE"], "icon": "🧼", "context": "Fresh and clean." },
        { "text": "I COMB HAIR", "verb": "COMB", "parts": ["I", "COMB", "HAIR"], "icon": "💇", "context": "Look good." },
        { "text": "MOM COOKS FOOD", "verb": "COOKS", "parts": ["MOM", "COOKS", "FOOD"], "icon": "🍳", "context": "Yummy smell." },
        { "text": "DAD WASHES CAR", "verb": "WASHES", "parts": ["DAD", "WASHES", "CAR"], "icon": "🚗", "context": "Shiny car." },
        { "text": "WE WATCH TV", "verb": "WATCH", "parts": ["WE", "WATCH", "TV"], "icon": "📺", "context": "Fun cartoon." },
        { "text": "I READ BOOK", "verb": "READ", "parts": ["I", "READ", "BOOK"], "icon": "📖", "context": "Quiet time." },
        { "text": "I SLEEP IN BED", "verb": "SLEEP", "parts": ["I", "SLEEP", "IN", "BED"], "icon": "🛌", "context": "Goodnight." },
        { "text": "I EAT LUNCH", "verb": "EAT", "parts": ["I", "EAT", "LUNCH"], "icon": "🍽️", "context": "Full tummy." },
        { "text": "I DRINK WATER", "verb": "DRINK", "parts": ["I", "DRINK", "WATER"], "icon": "🥤", "context": "Thirsty." },
        { "text": "I CLEAN ROOM", "verb": "CLEAN", "parts": ["I", "CLEAN", "ROOM"], "icon": "🧹", "context": "Tidy up." },
        { "text": "I PLAY TOYS", "verb": "PLAY", "parts": ["I", "PLAY", "TOYS"], "icon": "🧸", "context": "Have fun." },
        { "text": "SHE BAKES CAKE", "verb": "BAKES", "parts": ["SHE", "BAKES", "CAKE"], "icon": "🎂", "context": "Sweet treat." },
        { "text": "HE WATERS PLANT", "verb": "WATERS", "parts": ["HE", "WATERS", "PLANT"], "icon": "🪴", "context": "Grow green." },
        { "text": "WE SIT ON SOFA", "verb": "SIT", "parts": ["WE", "SIT", "ON", "SOFA"], "icon": "🛋️", "context": "Comfy." },
        { "text": "I OPEN DOOR", "verb": "OPEN", "parts": ["I", "OPEN", "DOOR"], "icon": "🚪", "context": "Welcome home." },
        { "text": "I CLOSE WINDOW", "verb": "CLOSE", "parts": ["I", "CLOSE", "WINDOW"], "icon": "🪟", "context": "Keep warm." },
        { "text": "I PUT ON SHOES", "verb": "PUT ON", "parts": ["I", "PUT ON", "SHOES"], "icon": "👟", "context": "Ready to go." },
        { "text": "SHE SETS TABLE", "verb": "SETS", "parts": ["SHE", "SETS", "TABLE"], "icon": "🍽️", "context": "Dinner time." },
        { "text": "HE SWEEPS FLOOR", "verb": "SWEEPS", "parts": ["HE", "SWEEPS", "FLOOR"], "icon": "🧹", "context": "No dust." }
    ]
}

HOME_APPLIANCES_DATA = {
    "game_id": "home_appliances",
    "title": "Home Appliances",
    "content": [
        { "word": "FRIDGE", "icon": "❄️", "desc": "Keeps food cold." },
        { "word": "OVEN", "icon": "🍳", "desc": "Cooks our food." },
        { "word": "TV", "icon": "📺", "desc": "Watch cartoons." },
        { "word": "FAN", "icon": "🌬️", "desc": "Blows cool air." },
        { "word": "LAMP", "icon": "🛋️", "desc": "Gives us light." },
        { "word": "IRON", "icon": "👔", "desc": "Smooths clothes." },
        { "word": "RADIO", "icon": "📻", "desc": "Plays music." },
        { "word": "TOASTER", "icon": "🍞", "desc": "Makes bread hot." },
        { "word": "BLENDER", "icon": "🥤", "desc": "Makes juice." },
        { "word": "WASHER", "icon": "🧺", "desc": "Washes clothes." },
        { "word": "AC", "icon": "🥶", "desc": "Makes room cold." },
        { "word": "HEATER", "icon": "🔥", "desc": "Makes room warm." },
        { "word": "PHONE", "icon": "📞", "desc": "Call friends." },
        { "word": "COMPUTER", "icon": "💻", "desc": "Work and play." },
        { "word": "CLOCK", "icon": "⏰", "desc": "Tells the time." },
        { "word": "CAMERA", "icon": "📷", "desc": "Takes photos." },
        { "word": "VACUUM", "icon": "🧹", "desc": "Cleans the floor." },
        { "word": "HAIRDRYER", "icon": "💇", "desc": "Dries wet hair." },
        { "word": "MICROWAVE", "icon": "🍲", "desc": "Heats food fast." },
        { "word": "SPEAKER", "icon": "🔊", "desc": "Loud sound." }
    ]
}

POLITE_PHRASES_DATA = {
    "game_id": "polite_phrases",
    "title": "Polite Phrases",
    "content": [
        { "text": "THANK YOU", "icon": "🙏", "context": "When someone helps you." },
        { "text": "THANK YOU VERY MUCH", "icon": "🙏❤️", "context": "Big thanks!" },
        { "text": "YOU ARE WELCOME", "icon": "🤲", "context": "After someone says thanks." },
        { "text": "PLEASE WAIT A MOMENT", "icon": "✋", "context": "Just a little time." },
        { "text": "EXCUSE ME", "icon": "🙋", "context": "Polite attention." },
        { "text": "SORRY FOR THE WAIT", "icon": "🙇", "context": "Apologize for delay." },
        { "text": "HAVE A NICE DAY", "icon": "👋☀️", "context": "Friendly goodbye." },
        { "text": "MAY I HELP YOU?", "icon": "💁", "context": "Offering help." },
        { "text": "NICE TO MEET YOU", "icon": "🤝", "context": "Meeting a new friend." },
        { "text": "GOOD MORNING", "icon": "🌅", "context": "Start of the day." },
        { "text": "GOOD NIGHT", "icon": "🌙", "context": "End of the day." },
        { "text": "GOODBYE", "icon": "👋", "context": "Saying farewell." },
        { "text": "HAVE A SAFE TRIP", "icon": "✈️", "context": "Travel safely." },
        { "text": "PLEASE VISIT AGAIN", "icon": "🏠", "context": "Come back soon." },
        { "text": "SEE YOU SOON", "icon": "🔜", "context": "We will meet again." }
    ]
}

PREPOSITIONS_DATA = {
    "game_id": "prepositions",
    "title": "Prepositions",
    "basics": {
        "title": "Basic Positions",
        "description": "Where is it?",
        "color": "#8E44AD",
        "items": [
            { "word": "In", "sentence": "The cat is **in** the box.", "icon": "📦" },
            { "word": "On", "sentence": "The apple is **on** the table.", "icon": "🍎" },
            { "word": "Under", "sentence": "The dog is **under** the chair.", "icon": "🐕" },
            { "word": "Over", "sentence": "The bird flies **over** the tree.", "icon": "🐦" },
            { "word": "Behind", "sentence": "The sun is **behind** the cloud.", "icon": "☁️" },
            { "word": "In Front Of", "sentence": "The boy is **in front of** the door.", "icon": "🚪" }
        ]
    },
    "action_sentences": [
        { "noun": "The dog", "verb": "runs", "adverb": "quickly", "prep": "**in**", "object": "the park.", "icon": "🏞️" },
        { "noun": "She", "verb": "sits", "adverb": "quietly", "prep": "**on**", "object": "the chair.", "icon": "🪑" },
        { "noun": "The bird", "verb": "sings", "adverb": "loudly", "prep": "**on**", "object": "the branch.", "icon": "🌳" },
        { "noun": "He", "verb": "walks", "adverb": "slowly", "prep": "**to**", "object": "school.", "icon": "🎒" }
    ],
    "quiz": [
        { "question": "The cat is ___ the box. (Inside)", "answer": "in", "options": ["in", "on", "under"] },
        { "question": "The bird flies ___ the tree. (Above)", "answer": "over", "options": ["over", "in", "behind"] },
        { "question": "The apple is ___ the table. (Top)", "answer": "on", "options": ["on", "in", "under"] },
        { "question": "The dog sleeps ___ the bed. (Below)", "answer": "under", "options": ["under", "on", "over"] }
    ]
}


PRONOUNS_DATA = {
    "game_id": "pronouns",
    "title": "Pronouns",
    "personal": {
        "title": "Subject Pronouns",
        "description": "Subject pronouns do the action.",
        "color": "#3498DB",
        "content": [
            { "left": "I", "right": "We", "icon": "🙋" },
            { "left": "You", "right": "You", "icon": "👉" },
            { "left": "He", "right": "They", "icon": "👦" },
            { "left": "She", "right": "They", "icon": "👧" },
            { "left": "It", "right": "They", "icon": "📦" }
        ],
        "examples": [
            "Riya is my friend. **She** is kind.",
            "Aman and I play cricket. **We** are friends.",
            "**She** is singing.",
            "**They** are playing."
        ]
    },
    "object": {
        "title": "Object Pronouns",
        "description": "Object pronouns receive the action.",
        "color": "#E74C3C",
        "content": [
            { "left": "I", "right": "me", "icon": "🙋" },
            { "left": "You", "right": "you", "icon": "👉" },
            { "left": "He", "right": "him", "icon": "👦" },
            { "left": "She", "right": "her", "icon": "👧" },
            { "left": "It", "right": "it", "icon": "📦" },
            { "left": "We", "right": "us", "icon": "👨‍👩‍👧‍👦" },
            { "left": "They", "right": "them", "icon": "👥" }
        ],
        "examples": [
            "Mother called **me**.",
            "I gave the book to **him**.",
            "Teacher helped **us**."
        ]
    },
    "possessive": {
        "title": "Possessive",
        "description": "Shows ownership (Belongs to someone).",
        "color": "#9B59B6",
        "items": [
            { "word": "mine", "sentence": "This bag is **mine**.", "icon": "🎒" },
            { "word": "yours", "sentence": "The pen is **yours**.", "icon": "🖊️" },
            { "word": "his", "sentence": "The book is **his**.", "icon": "📘" },
            { "word": "hers", "sentence": "The doll is **hers**.", "icon": "🎎" },
            { "word": "ours", "sentence": "The house is **ours**.", "icon": "🏡" },
            { "word": "theirs", "sentence": "The toys are **theirs**.", "icon": "🧸" }
        ]
    },
    "demonstrative": {
        "title": "Pointing Words",
        "description": "Demonstrative Pronouns point at things.",
        "color": "#27AE60",
        "items": [
            { "word": "this", "sentence": "**This** is my pencil.", "icon": "✏️" },
            { "word": "that", "sentence": "**That** is a star.", "icon": "⭐" },
            { "word": "these", "sentence": "**These** are my shoes.", "icon": "👞" },
            { "word": "those", "sentence": "**Those** are birds.", "icon": "🐦" }
        ]
    },
    "dialogues": [
        {
            "id": 1,
            "title": "Talking About a Friend",
            "icon": "👧",
            "lines": [
                { "speaker": "Riya", "text": "This is my friend Amit." },
                { "speaker": "Sara", "text": "Is **he** in your class?" },
                { "speaker": "Riya", "text": "Yes, **he** sits next to **me**." },
                { "speaker": "Sara", "text": "Is **he** good at studies?" },
                { "speaker": "Riya", "text": "Yes, **he** helps **me** in math." }
            ]
        },
        {
            "id": 2,
            "title": "Family Talk",
            "icon": "👨‍👩‍👧",
            "lines": [
                { "speaker": "Mother", "text": "Where is your brother?" },
                { "speaker": "Child", "text": "**He** is in his room." },
                { "speaker": "Mother", "text": "Call **him**, please." },
                { "speaker": "Child", "text": "Okay, I will call **him**." }
            ]
        },
        {
            "id": 3,
            "title": "At School",
            "icon": "🎒",
            "lines": [
                { "speaker": "Teacher", "text": "Rohan, where is your notebook?" },
                { "speaker": "Rohan", "text": "Ma’am, **it** is in my bag." },
                { "speaker": "Teacher", "text": "Show **it** to **me**." },
                { "speaker": "Rohan", "text": "Yes, ma’am. Here **it** is." }
            ]
        }
    ],
    "quiz": [
        { "question": "Riya is my friend. ___ is kind.", "answer": "She", "options": ["He", "She", "They"] },
        { "question": "I saw Rahul and gave ___ the ball.", "answer": "him", "options": ["he", "him", "his"] },
        { "question": "This book is ___. (belonging to me)", "answer": "mine", "options": ["me", "my", "mine"] },
        { "question": "___ are my parents. (pointing to many)", "answer": "They", "options": ["They", "He", "She"] },
        { "question": "The teacher called ___ (me).", "answer": "me", "options": ["I", "me", "my"] }
    ]
}

SCHOOL_ACTIONS_DATA = {
    "game_id": "school_actions",
    "title": "School Actions",
    "content": [
        { "word": "LEARN", "icon": "🧠", "context": "Learn new things." },
        { "word": "STUDY", "icon": "📚", "context": "Study for test." },
        { "word": "ANSWER", "icon": "🙋", "context": "Answer the question." },
        { "word": "ASK", "icon": "❓", "context": "Ask for help." },
        { "word": "DRAW", "icon": "🎨", "context": "Draw a picture." },
        { "word": "COLOR", "icon": "🖍️", "context": "Color with crayons." },
        { "word": "COUNT", "icon": "🔢", "context": "Count to ten." },
        { "word": "SPELL", "icon": "🔡", "context": "Spell your name." },
        { "word": "THINK", "icon": "🤔", "context": "Think hard." },
        { "word": "SOLVE", "icon": "🧩", "context": "Solve the puzzle." },
        { "word": "SHARE", "icon": "🤝", "context": "Share with friends." }
    ]
}

SINGULAR_PLURAL_DATA = {
    "game_id": "singular_plural",
    "title": "Singular and Plural",
    "rules": [
        {
            "id": "s",
            "title": "Add -S",
            "description": "Just add \"s\" to most words.",
            "examples": [
                { "singular": "Cat", "plural": "Cats", "icon": "🐱" },
                { "singular": "Book", "plural": "Books", "icon": "📚" },
                { "singular": "Pen", "plural": "Pens", "icon": "🖊️" },
                { "singular": "Boy", "plural": "Boys", "icon": "👦" }
            ],
            "sentence": "I have one book. I have two books.",
            "color": "#3498DB"
        },
        {
            "id": "es",
            "title": "Add -ES",
            "description": "For words ending in s, sh, ch, x, o.",
            "examples": [
                { "singular": "Bus", "plural": "Buses", "icon": "🚌" },
                { "singular": "Box", "plural": "Boxes", "icon": "📦" },
                { "singular": "Dish", "plural": "Dishes", "icon": "🍽️" },
                { "singular": "Watch", "plural": "Watches", "icon": "⌚" },
                { "singular": "Mango", "plural": "Mangoes", "icon": "🥭" }
            ],
            "sentence": "The bus is big. Many buses are on the road.",
            "color": "#E74C3C"
        },
        {
            "id": "ies",
            "title": "Y → IES",
            "description": "If a consonant is before Y, change Y to IES.",
            "examples": [
                { "singular": "Baby", "plural": "Babies", "icon": "👶" },
                { "singular": "City", "plural": "Cities", "icon": "🏙️" },
                { "singular": "Story", "plural": "Stories", "icon": "📖" },
                { "singular": "Fly", "plural": "Flies", "icon": "🪰" }
            ],
            "note": "But if a vowel comes before Y, just add S (Boy → Boys)",
            "sentence": "The baby is crying. The babies are crying.",
            "color": "#9B59B6"
        }
    ],
    "quiz": [
        { "question": "cat", "answer": "cats", "options": ["cat", "cates", "cats"] },
        { "question": "baby", "answer": "babies", "options": ["babys", "babies", "babyies"] },
        { "question": "box", "answer": "boxes", "options": ["boxs", "boxies", "boxes"] },
        { "question": "leaf", "answer": "leaves", "options": ["leafs", "leaves", "leafes"] },
        { "question": "child", "answer": "children", "options": ["childs", "children", "childies"] },
        { "question": "bus", "answer": "buses", "options": ["buss", "buses", "busez"] }
    ]
}

MORNING_ROUTINE_DATA = {
    "game_id": "morning_routine",
    "title": "Morning Routine",
    "sections": [
        {
            "id": "wake",
            "title": "Waking Up",
            "icon": "🌅",
            "phrases": [
                "I wake up early.",
                "I wake up at 6 o’clock.",
                "I get out of bed.",
                "I make my bed.",
                "I stretch my body."
            ]
        },
        {
            "id": "bathroom",
            "title": "Bathroom",
            "icon": "🪥",
            "phrases": [
                "I go to the bathroom.",
                "I brush my teeth.",
                "I wash my face.",
                "I take a bath.",
                "I comb my hair."
            ]
        },
        {
            "id": "ready",
            "title": "Getting Ready",
            "icon": "👕",
            "phrases": [
                "I wear my clothes.",
                "I put on my school uniform.",
                "I tie my shoes.",
                "I get ready for school."
            ]
        },
        {
            "id": "breakfast",
            "title": "Breakfast",
            "icon": "🍳",
            "phrases": [
                "I eat my breakfast.",
                "I drink milk.",
                "I eat fruits.",
                "Breakfast gives me energy."
            ]
        },
        {
            "id": "leaving",
            "title": "Leaving Home",
            "icon": "🎒",
            "phrases": [
                "I pack my school bag.",
                "I check my homework.",
                "I say goodbye to my parents.",
                "I leave for school."
            ]
        },
        {
            "id": "habits",
            "title": "Good Habits",
            "icon": "😊",
            "phrases": [
                "I wake up early every day.",
                "I keep myself clean.",
                "I eat healthy food.",
                "I am ready for the day!"
            ]
        }
    ],
    "stories": [
        {
            "title": "Early Bird (Riya)",
            "icon": "🌞",
            "text": "Riya wakes up at six in the morning. She stretches her arms and gets out of bed. She brushes her teeth and washes her face. After taking a bath, she wears her school uniform. She eats breakfast with her family. Then she packs her bag and goes to school with a smile."
        },
        {
            "title": "Healthy Start (Arjun)",
            "icon": "🌤️",
            "text": "Arjun wakes up early every day. He makes his bed and drinks a glass of water. He brushes his teeth and takes a shower. His mother gives him eggs and toast for breakfast. He checks his homework and wears his shoes. He is ready for school on time."
        },
        {
            "title": "Happy Morning (Meena)",
            "icon": "🌈",
            "text": "Meena wakes up when the sun rises. She folds her blanket and cleans her room. She brushes her teeth and combs her hair. After breakfast, she helps her mother for a few minutes. Then she gets ready and leaves for school happily."
        },
        {
            "title": "Busy Morning (Rahul)",
            "icon": "🚌",
            "text": "Rahul wakes up early but moves a little slow. His mother calls him to get ready. He brushes his teeth, washes his face, and takes a quick bath. He eats breakfast and drinks milk. He packs his bag quickly and runs to catch the school bus."
        },
        {
            "title": "Good Habits (Anaya)",
            "icon": "🌻",
            "text": "Anaya wakes up early every morning. She thanks God for a new day. She brushes her teeth and takes a bath. She wears neat clothes and eats healthy food. She packs her school bag and leaves home with a happy heart."
        }
    ],
    "dialogues": [
        {
            "title": "Morning at Home",
            "icon": "🌅",
            "lines": [
                { "speaker": "Mother", "text": "Good morning!" },
                { "speaker": "Child", "text": "Good morning, Mom." },
                { "speaker": "Mother", "text": "Did you sleep well?" },
                { "speaker": "Child", "text": "Yes, I did." },
                { "speaker": "Mother", "text": "Go brush your teeth." },
                { "speaker": "Child", "text": "Okay, Mom!" }
            ]
        },
        {
            "title": "Getting Ready",
            "icon": "🪥",
            "lines": [
                { "speaker": "Father", "text": "Are you ready for school?" },
                { "speaker": "Child", "text": "Not yet." },
                { "speaker": "Father", "text": "What are you doing?" },
                { "speaker": "Child", "text": "I am combing my hair." },
                { "speaker": "Father", "text": "Good! Hurry up." },
                { "speaker": "Child", "text": "Yes, Dad." }
            ]
        },
        {
            "title": "Breakfast Time",
            "icon": "🍳",
            "lines": [
                { "speaker": "Mother", "text": "Come and eat breakfast." },
                { "speaker": "Child", "text": "What is for breakfast?" },
                { "speaker": "Mother", "text": "Milk and bread." },
                { "speaker": "Child", "text": "Yum! I like it." },
                { "speaker": "Mother", "text": "Eat well and be strong." },
                { "speaker": "Child", "text": "Okay, Mom!" }
            ]
        }
    ],
    "practice_lines": {
        "simple": [
            "I wake up early in the morning.",
            "I get out of bed with a smile.",
            "I brush my teeth every day.",
            "I wash my face with clean water.",
            "I take a bath and feel fresh.",
            "I wear neat and clean clothes.",
            "I comb my hair carefully.",
            "I eat a healthy breakfast.",
            "I drink a glass of milk.",
            "I pack my school bag.",
            "I check my homework before leaving.",
            "I say goodbye to my parents.",
            "I go to school happily."
        ],
        "longer": [
            "I wake up early and start my day with a smile.",
            "After brushing my teeth, I wash my face.",
            "I take a bath and wear my school uniform.",
            "My breakfast gives me energy for the day.",
            "I pack my bag and get ready for school.",
            "I always try to be on time.",
            "I feel happy when I am ready for school."
        ],
        "expressive": [
            { "text": "I am ready for a new day!", "icon": "😊" },
            { "text": "Good morning, everyone!", "icon": "😄" },
            { "text": "Today will be a great day!", "icon": "💪" },
            { "text": "I am excited to go to school!", "icon": "🎒" }
        ]
    }
}

ADJECTIVES_DATA = {
    "game_id": "adjectives",
    "title": "Adjectives",
    "categories": [
        {
            "id": "descriptive",
            "title": "People & Things",
            "color": "#3498DB",
            "items": [
                { "word": "BEAUTIFUL", "sentence": "She is a beautiful girl.", "icon": "👸" },
                { "word": "STRONG", "sentence": "He is a strong boy.", "icon": "💪" },
                { "word": "KIND", "sentence": "Be kind to animals.", "icon": "🤝" },
                { "word": "BRAVE", "sentence": "The brave lion.", "icon": "🦁" },
                { "word": "HAPPY", "sentence": "A happy family.", "icon": "😊" }
            ]
        },
        {
            "id": "size",
            "title": "Size Words",
            "color": "#E67E22",
            "items": [
                { "word": "BIG", "sentence": "An elephant is big.", "icon": "🐘" },
                { "word": "SMALL", "sentence": "A mouse is small.", "icon": "🐭" },
                { "word": "TALL", "sentence": "A giraffe is tall.", "icon": "🦒" },
                { "word": "SHORT", "sentence": "The grass is short.", "icon": "🌱" },
                { "word": "THIN", "sentence": "A thin pencil.", "icon": "✏️" }
            ]
        }
    ],
    "quiz": [
        { "question": "An elephant is ___.", "answer": "BIG", "options": ["BIG", "SMALL", "THIN"] },
        { "question": "Be ___ to animals.", "answer": "KIND", "options": ["KIND", "ANGRY", "SAD"] },
        { "question": "A giraffe is ___.", "answer": "TALL", "options": ["TALL", "SHORT", "FAT"] }
    ]
}

ACTION_SENTENCES_DATA = {
    "game_id": "action_sentences",
    "title": "Action Sentences",
    "content": [
        { "sentence": "The bird flies high.", "action": "FLIES", "subject": "BIRD", "icon": "🐦" },
        { "sentence": "The fish swims fast.", "action": "SWIMS", "subject": "FISH", "icon": "🐟" },
        { "sentence": "The dog barks loudly.", "action": "BARKS", "subject": "DOG", "icon": "🐕" },
        { "sentence": "The baby cries often.", "action": "CRIES", "subject": "BABY", "icon": "👶" },
        { "sentence": "The sun shines bright.", "action": "SHINES", "subject": "SUN", "icon": "☀️" },
        { "sentence": "The rain falls down.", "action": "FALLS", "subject": "RAIN", "icon": "🌧️" }
    ],
    "quiz": [
        { "question": "The bird ___ high.", "answer": "flies", "options": ["flies", "swims", "barks"] },
        { "question": "The fish ___ fast.", "answer": "swims", "options": ["swims", "flies", "shines"] },
        { "question": "The sun ___ bright.", "answer": "shines", "options": ["shines", "falls", "cries"] }
    ]
}


VERBS_DATA = {
    "game_id": "verbs",
    "title": "Action Words (Verbs)",
    "categories": {
        "movement": [
            { "word": "Walk", "sentence": "I WALK to the park.", "icon": "🚶" },
            { "word": "Run", "sentence": "I RUN fast.", "icon": "🏃" },
            { "word": "Jump", "sentence": "The frog can JUMP.", "icon": "🐸" },
            { "word": "Hop", "sentence": "Bunnies HOP around.", "icon": "🐇" },
            { "word": "Skip", "sentence": "We SKIP together.", "icon": "👭" },
            { "word": "Climb", "sentence": "I CLIMB the stairs.", "icon": "🧗" },
            { "word": "Crawl", "sentence": "Babies CRAWL on the floor.", "icon": "👶" },
            { "word": "Slide", "sentence": "I go down the SLIDE.", "icon": "🛝" },
            { "word": "Roll", "sentence": "The ball ROLLS away.", "icon": "⚽" },
            { "word": "Swim", "sentence": "I SWIM in the pool.", "icon": "🏊" },
            { "word": "Fly", "sentence": "Birds FLY in the sky.", "icon": "🕊️" }
        ],
        "hands": [
            { "word": "Hold", "sentence": "HOLD my hand.", "icon": "🤝" },
            { "word": "Throw", "sentence": "She THROWS the ball.", "icon": "🥎" },
            { "word": "Catch", "sentence": "Can you CATCH it?", "icon": "🤲" },
            { "word": "Push", "sentence": "PUSH the door open.", "icon": "🚪" },
            { "word": "Pull", "sentence": "PULL the rope.", "icon": "🪢" },
            { "word": "Lift", "sentence": "He LIFTS the box.", "icon": "📦" },
            { "word": "Drop", "sentence": "Don’t DROP the glass.", "icon": "🥛" },
            { "word": "Open", "sentence": "Please OPEN the book.", "icon": "📖" },
            { "word": "Close", "sentence": "CLOSE the window.", "icon": "🪟" },
            { "word": "Cut", "sentence": "CUT the paper.", "icon": "✂️" },
            { "word": "Draw", "sentence": "She DRAWS a picture.", "icon": "🎨" }
        ],
        "home": [
            { "word": "Sweep", "sentence": "I SWEEP the floor.", "icon": "🧹" },
            { "word": "Mop", "sentence": "Dad MOPS the kitchen.", "icon": "🪣" },
            { "word": "Wash", "sentence": "I WASH my hands.", "icon": "🧼" },
            { "word": "Cook", "sentence": "Mom COOKS dinner.", "icon": "🍳" },
            { "word": "Bake", "sentence": "We BAKE a cake.", "icon": "🍰" },
            { "word": "Clean", "sentence": "Let’s CLEAN the room.", "icon": "✨" },
            { "word": "Fold", "sentence": "I FOLD my clothes.", "icon": "👕" },
            { "word": "Dust", "sentence": "Planning to DUST the shelf.", "icon": "🪶" },
            { "word": "Water", "sentence": "I WATER the plants.", "icon": "🌱" }
        ],
        "learning": [
            { "word": "Learn", "sentence": "I LEARN new things.", "icon": "💡" },
            { "word": "Study", "sentence": "I STUDY English.", "icon": "📚" },
            { "word": "Practice", "sentence": "We PRACTICE math.", "icon": "➕" },
            { "word": "Teach", "sentence": "She TEACHES the class.", "icon": "👩‍🏫" },
            { "word": "Explain", "sentence": "The teacher EXPLAINS the lesson.", "icon": "🗣️" },
            { "word": "Ask", "sentence": "I ASK a question.", "icon": "❓" },
            { "word": "Answer", "sentence": "He ANSWERS correctly.", "icon": "✅" },
            { "word": "Solve", "sentence": "I can SOLVE the puzzle.", "icon": "🧩" }
        ],
        "feelings": [
            { "word": "Smile", "sentence": "She SMILES at me.", "icon": "😊" },
            { "word": "Laugh", "sentence": "We LAUGH together.", "icon": "😂" },
            { "word": "Cry", "sentence": "The baby CRIES when hungry.", "icon": "😭" },
            { "word": "Worry", "sentence": "Don’t WORRY be happy.", "icon": "😟" },
            { "word": "Hope", "sentence": "I HOPE it rains.", "icon": "🤞" },
            { "word": "Wish", "sentence": "Make a WISH.", "icon": "🌠" },
            { "word": "Enjoy", "sentence": "We ENJOY the game.", "icon": "🎉" }
        ],
        "communication": [
            { "word": "Talk", "sentence": "We TALK everyday.", "icon": "💬" },
            { "word": "Speak", "sentence": "I SPEAK English.", "icon": "🗣️" },
            { "word": "Say", "sentence": "SAY hello!", "icon": "👋" },
            { "word": "Tell", "sentence": "TELL me a story.", "icon": "📖" },
            { "word": "Shout", "sentence": "Don’t SHOUT inside.", "icon": "📢" },
            { "word": "Whisper", "sentence": "He WHISPERS softly.", "icon": "🤫" },
            { "word": "Call", "sentence": "CALL your friend.", "icon": "📞" }
        ]
    },
    "quiz": [
        { "text": "Birds ___ in the sky.", "answer": "fly", "options": ["fly", "swim", "crawl"] },
        { "text": "I ___ my homework every day.", "answer": "do", "options": ["do", "eat", "jump"] },
        { "text": "She ___ the ball to me.", "answer": "throws", "options": ["throws", "eats", "sleeps"] },
        { "text": "We ___ our hands before eating.", "answer": "wash", "options": ["wash", "break", "run"] },
        { "text": "The baby ___ when she is hungry.", "answer": "cries", "options": ["cries", "laughs", "dances"] },
        { "text": "Please ___ the door.", "answer": "open", "options": ["open", "fly", "cook"] },
        { "text": "Mom ___ dinner.", "answer": "cooks", "options": ["cooks", "jumps", "draws"] },
        { "text": "I ___ English.", "answer": "study", "options": ["study", "throw", "dust"] },
        { "text": "She ___ at me.", "answer": "smiles", "options": ["smiles", "runs", "climbs"] },
        { "text": "He ___ softly.", "answer": "whispers", "options": ["whispers", "shouts", "falls"] }
    ]
}


TWO_LETTER_WORDS_DATA = {
    "game_id": "two_letter_words",
    "title": "Two Letter Words",
    "content": [
        { "word": "AM", "p1": "A", "p2": "M", "icon": "🙋‍♂️", "sentence": "I am happy." },
        { "word": "AN", "p1": "A", "p2": "N", "icon": "🍎", "sentence": "I saw an apple." },
        { "word": "AS", "p1": "A", "p2": "S", "icon": "⚡", "sentence": "As fast as I can." },
        { "word": "AT", "p1": "A", "p2": "T", "icon": "📍", "sentence": "Look at the cat." },
        { "word": "BE", "p1": "B", "p2": "E", "icon": "🐝", "sentence": "Be kind." },
        { "word": "BY", "p1": "B", "p2": "Y", "icon": "🌊", "sentence": "By the sea." },
        { "word": "DO", "p1": "D", "p2": "O", "icon": "✅", "sentence": "Do your best." },
        { "word": "GO", "p1": "G", "p2": "O", "icon": "🚦", "sentence": "Ready, set, go!" },
        { "word": "HE", "p1": "H", "p2": "E", "icon": "👦", "sentence": "He is my friend." },
        { "word": "HI", "p1": "H", "p2": "I", "icon": "👋", "sentence": "Hi there!" },
        { "word": "IF", "p1": "I", "p2": "F", "icon": "☔", "sentence": "If it rains." },
        { "word": "IN", "p1": "I", "p2": "N", "icon": "📦", "sentence": "It is in the box." },
        { "word": "IS", "p1": "I", "p2": "S", "icon": "🌞", "sentence": "It is sunny." },
        { "word": "IT", "p1": "I", "p2": "T", "icon": "🎈", "sentence": "It is fun." },
        { "word": "ME", "p1": "M", "p2": "E", "icon": "🧒", "sentence": "Play with me." },
        { "word": "MY", "p1": "M", "p2": "Y", "icon": "🧸", "sentence": "This is my toy." },
        { "word": "NO", "p1": "N", "p2": "O", "icon": "🚫", "sentence": "Say no." },
        { "word": "OF", "p1": "O", "p2": "F", "icon": "☕", "sentence": "Cup of tea." },
        { "word": "ON", "p1": "O", "p2": "N", "icon": "🔛", "sentence": "On the table." },
        { "word": "OR", "p1": "O", "p2": "R", "icon": "🤷", "sentence": "This or that?" },
        { "word": "SO", "p1": "S", "p2": "O", "icon": "😊", "sentence": "I am so happy." },
        { "word": "TO", "p1": "T", "p2": "O", "icon": "👉", "sentence": "Go to sleep." },
        { "word": "UP", "p1": "U", "p2": "P", "icon": "⬆️", "sentence": "Look up!" },
        { "word": "US", "p1": "U", "p2": "S", "icon": "👥", "sentence": "Play with us." },
        { "word": "WE", "p1": "W", "p2": "E", "icon": "👨‍👩‍👧‍👦", "sentence": "We are family." }
    ]
}


SPELLING_DATA = {
    "game_id": "spelling",
    "title": "Spelling Bee",
    "levels": {
        "easy": ["cat", "dog", "sun", "box", "hat", "run", "pen", "cup"],
        "medium": ["apple", "happy", "green", "tiger", "sunny", "pizza", "robot", "cloud"],
        "hard": ["elephant", "butterfly", "dinosaur", "rainbow", "adventure", "chocolate", "computer"]
    }
}

SENTENCE_BUILDER_DATA = {
    "game_id": "sentence_builder",
    "content": [
        { "id": 1, "words": ["Birds", "fly"], "correct": "Birds fly", "icon": "🐦" },
        { "id": 2, "words": ["The", "boy", "runs", "fast"], "correct": "The boy runs fast", "icon": "🏃" },
        { "id": 3, "words": ["The", "girl", "sings", "beautifully"], "correct": "The girl sings beautifully", "icon": "🎤" },
        { "id": 4, "words": ["The", "cat", "is", "happy"], "correct": "The cat is happy", "icon": "😺" },
        { "id": 5, "words": ["I", "play", "football"], "correct": "I play football", "icon": "⚽" },
        { "id": 6, "words": ["The", "dog", "sits", "on", "the", "mat"], "correct": "The dog sits on the mat", "icon": "🐕" },
        { "id": 7, "words": ["She", "reads", "a", "book"], "correct": "She reads a book", "icon": "📖" },
        { "id": 8, "words": ["We", "are", "friends"], "correct": "We are friends", "icon": "👫" }
    ]
}

CONVERSATION_DATA = {
    "game_id": "conversation",
    "scenarios": {
        "school": {
            "title": "At School",
            "theme": "#3498DB",
            "bg": "#E3F2FD",
            "dialogue": [
                { "speaker": "Teacher", "text": "Good morning, class!", "icon": "👩‍🏫", "side": "left" },
                { "speaker": "You", "text": "Good morning, teacher!", "icon": "🧒", "side": "right" },
                { "speaker": "Teacher", "text": "How are you today?", "icon": "👩‍🏫", "side": "left" },
                { "speaker": "You", "text": "I am happy, thank you!", "icon": "🧒", "side": "right" },
                { "speaker": "Teacher", "text": "Great! Let's learn math.", "icon": "👩‍🏫", "side": "left" },
                { "speaker": "You", "text": "Yes, I like math.", "icon": "🧒", "side": "right" },
                { "speaker": "Teacher", "text": "What is 1 + 1?", "icon": "👩‍🏫", "side": "left" },
                { "speaker": "You", "text": "It is 2!", "icon": "🧒", "side": "right" },
                { "speaker": "Teacher", "text": "Very good job!", "icon": "👩‍🏫", "side": "left" }
            ]
        },
        "mom": {
            "title": "With Mom",
            "theme": "#E91E63",
            "bg": "#FCE4EC",
            "dialogue": [
                { "speaker": "Mom", "text": "Good morning, sweetie.", "icon": "👩", "side": "left" },
                { "speaker": "You", "text": "Good morning, Mom.", "icon": "🧒", "side": "right" },
                { "speaker": "Mom", "text": "Are you hungry?", "icon": "👩", "side": "left" },
                { "speaker": "You", "text": "Yes, I want breakfast.", "icon": "🧒", "side": "right" },
                { "speaker": "Mom", "text": "Here is some milk and toast.", "icon": "👩", "side": "left" },
                { "speaker": "You", "text": "Thank you, Mom!", "icon": "🧒", "side": "right" },
                { "speaker": "Mom", "text": "Have a good day at school.", "icon": "👩", "side": "left" },
                { "speaker": "You", "text": "I love you, Mom.", "icon": "🧒", "side": "right" },
                { "speaker": "Mom", "text": "I love you too.", "icon": "👩", "side": "left" }
            ]
        },
        "sister": {
            "title": "With Sister",
            "theme": "#9B59B6",
            "bg": "#F3E5F5",
            "dialogue": [
                { "speaker": "Sister", "text": "Hi! What are you doing?", "icon": "👧", "side": "left" },
                { "speaker": "You", "text": "I am playing with blocks.", "icon": "🧒", "side": "right" },
                { "speaker": "Sister", "text": "Can I play too?", "icon": "👧", "side": "left" },
                { "speaker": "You", "text": "Yes, come sit here.", "icon": "🧒", "side": "right" },
                { "speaker": "Sister", "text": "Let's build a castle!", "icon": "👧", "side": "left" },
                { "speaker": "You", "text": "That is a great idea.", "icon": "🧒", "side": "right" },
                { "speaker": "Sister", "text": "Pass me the blue block.", "icon": "👧", "side": "left" },
                { "speaker": "You", "text": "Here you go.", "icon": "🧒", "side": "right" },
                { "speaker": "Sister", "text": "This is fun!", "icon": "👧", "side": "left" }
            ]
        },
        "friend": {
            "title": "With Friend",
            "theme": "#F39C12",
            "bg": "#FFF3E0",
            "dialogue": [
                { "speaker": "Friend", "text": "Hello! What is your name?", "icon": "👦", "side": "left" },
                { "speaker": "You", "text": "Hi! My name is Alex.", "icon": "🧒", "side": "right" },
                { "speaker": "Friend", "text": "My name is Sam.", "icon": "👦", "side": "left" },
                { "speaker": "You", "text": "Nice to meet you, Sam.", "icon": "🧒", "side": "right" },
                { "speaker": "Friend", "text": "Do you like soccer?", "icon": "👦", "side": "left" },
                { "speaker": "You", "text": "Yes, I like soccer!", "icon": "🧒", "side": "right" },
                { "speaker": "Friend", "text": "Let's play together.", "icon": "👦", "side": "left" },
                { "speaker": "You", "text": "Okay, let's go!", "icon": "🧒", "side": "right" },
                { "speaker": "Friend", "text": "Kick the ball!", "icon": "👦", "side": "left" }
            ]
        }
    }
}

YES_NO_QUESTIONS_DATA = {
    "game_id": "yes_no_questions",
    "categories": {
        "is_am_are": {
            "title": "Is / Am / Are",
            "description": "Helping words for NOW.",
            "color": "#3498DB",
            "content": [
                { "stmt": "She is happy.", "quest": "Is she happy?", "ans": "Yes, she is. / No, she isn’t." },
                { "stmt": "They are playing.", "quest": "Are they playing?", "ans": "Yes, they are." },
                { "stmt": "I am late.", "quest": "Am I late?", "ans": "No, you aren’t." }
            ]
        },
        "do_does": {
            "title": "Do / Does",
            "description": "For habits and facts.",
            "color": "#2ECC71",
            "content": [
                { "stmt": "You like milk.", "quest": "Do you like milk?", "ans": "Yes, I do." },
                { "stmt": "She plays football.", "quest": "Does she play football?", "ans": "No, she doesn’t." },
                { "stmt": "They go to school.", "quest": "Do they go to school?", "ans": "Yes, they do." }
            ]
        },
        "did": {
            "title": "Did (Past)",
            "description": "For things that happened BEFORE.",
            "color": "#E67E22",
            "content": [
                { "stmt": "You finished homework.", "quest": "Did you finish homework?", "ans": "Yes, I did." },
                { "stmt": "He went to school.", "quest": "Did he go to school?", "ans": "No, he didn’t." }
            ]
        },
        "can": {
            "title": "Can (Ability)",
            "description": "Ask if someone helps or does something.",
            "color": "#9B59B6",
            "content": [
                { "stmt": "She can swim.", "quest": "Can she swim?", "ans": "Yes, she can." },
                { "stmt": "You can help me.", "quest": "Can you help me?", "ans": "Yes, I can." }
            ]
        },
        "will": {
            "title": "Will (Future)",
            "description": "Ask about TOMORROW or LATER.",
            "color": "#E74C3C",
            "content": [
                { "stmt": "You will come.", "quest": "Will you come?", "ans": "Yes, I will." },
                { "stmt": "They will play.", "quest": "Will they play?", "ans": "No, they won’t." }
            ]
        }
    },
    "dialogues": [
        {
            "speaker": "Mother",
            "text": "Are you ready?",
            "replySpeaker": "Child",
            "replyText": "Yes, I am."
        },
        {
            "speaker": "Teacher",
            "text": "Did you do your homework?",
            "replySpeaker": "Student",
            "replyText": "Yes, I did."
        },
        {
            "speaker": "Friend",
            "text": "Can you play today?",
            "replySpeaker": "Child",
            "replyText": "No, I can’t."
        }
    ],
    "quiz": [
        { "question": "She is your sister.", "answer": "Is she your sister?", "options": ["Is she your sister?", "Does she your sister?", "Can she your sister?"] },
        { "question": "They like mangoes.", "answer": "Do they like mangoes?", "options": ["Are they like mangoes?", "Do they like mangoes?", "Did they like mangoes?"] },
        { "question": "He can run fast.", "answer": "Can he run fast?", "options": ["Is he run fast?", "Does he run fast?", "Can he run fast?"] },
        { "question": "You finished your work.", "answer": "Did you finish your work?", "options": ["Do you finish your work?", "Did you finish your work?", "Will you finish your work?"] },
        { "question": "We will go tomorrow.", "answer": "Will we go tomorrow?", "options": ["Will we go tomorrow?", "Do we go tomorrow?", "Are we go tomorrow?"] }
    ]
}

async def seed():
    print("Seeding database...")
    
    # 1. Mental Math
    await content_collection.replace_one(
        {"game_id": "mental_math"},
        MENTAL_MATH_DATA,
        upsert=True
    )
    print("Seeded Mental Math")

    # 2. Reasoning
    await content_collection.replace_one(
        {"game_id": "reasoning_basics"},
        REASONING_DATA,
        upsert=True
    )
    print("Seeded Reasoning Basics")

    # 3. Alphabet
    await content_collection.replace_one(
        {"game_id": "alphabet"},
        ALPHABET_DATA,
        upsert=True
    )
    print("Seeded Alphabet")

    # 4. Unitary Method
    await content_collection.replace_one(
        {"game_id": "unitary_method"},
        UNITARY_METHOD_DATA,
        upsert=True
    )
    print("Seeded Unitary Method")

    # 5. Logic Puzzles
    await content_collection.replace_one(
        {"game_id": "logic_puzzles"},
        LOGIC_PUZZLE_DATA,
        upsert=True
    )
    print("Seeded Logic Puzzles")

    # 6. Hindi Varnamala
    await content_collection.replace_one(
        {"game_id": "hindi_varnamala"},
        HINDI_VARNAMALA_DATA,
        upsert=True
    )
    print("Seeded Hindi Varnamala")

    # 7. Hindi Two Letter
    await content_collection.replace_one(
        {"game_id": "hindi_two_letter"},
        HINDI_TWO_LETTER_DATA,
        upsert=True
    )
    print("Seeded Hindi Two Letter")

    # 8. Hindi Three Letter
    await content_collection.replace_one(
        {"game_id": "hindi_three_letter"},
        HINDI_THREE_LETTER_DATA,
        upsert=True
    )
    print("Seeded Hindi Three Letter")

    # 9. English Nouns
    await content_collection.replace_one(
        {"game_id": "english_nouns"},
        ENGLISH_NOUNS_DATA,
        upsert=True
    )
    print("Seeded English Nouns")

    # 10. Physical Actions
    await content_collection.replace_one(
        {"game_id": "physical_actions"},
        PHYSICAL_ACTIONS_DATA,
        upsert=True
    )
    print("Seeded Physical Actions")

    # 11. Basic Actions
    await content_collection.replace_one(
        {"game_id": "basic_actions"},
        BASIC_ACTIONS_DATA,
        upsert=True
    )
    print("Seeded Basic Actions")

    # 12. Two Word Sentences
    await content_collection.replace_one(
        {"game_id": "two_word_sentences"},
        TWO_WORD_SENTENCES_DATA,
        upsert=True
    )
    print("Seeded Two Word Sentences")

    # 13. Three Word Sentences
    await content_collection.replace_one(
        {"game_id": "three_word_sentences"},
        THREE_WORD_SENTENCES_DATA,
        upsert=True
    )
    print("Seeded Three Word Sentences")

    # 14. Four Word Sentences
    await content_collection.replace_one(
        {"game_id": "four_word_sentences"},
        FOUR_WORD_SENTENCES_DATA,
        upsert=True
    )
    print("Seeded Four Word Sentences")

    # 15. Three Letter Words
    await content_collection.replace_one(
        {"game_id": "three_letter_words"},
        THREE_LETTER_WORDS_DATA,
        upsert=True
    )
    print("Seeded Three Letter Words")

    # 16. Four Letter Words
    await content_collection.replace_one(
        {"game_id": "four_letter_words"},
        FOUR_LETTER_WORDS_DATA,
        upsert=True
    )
    print("Seeded Four Letter Words")

    # 17. Five Letter Words
    await content_collection.replace_one(
        {"game_id": "five_letter_words"},
        FIVE_LETTER_WORDS_DATA,
        upsert=True
    )
    print("Seeded Five Letter Words")

    # 18. Six Letter Words
    await content_collection.replace_one(
        {"game_id": "six_letter_words"},
        SIX_LETTER_WORDS_DATA,
        upsert=True
    )
    print("Seeded Six Letter Words")

    # 19. Seven Letter Words
    await content_collection.replace_one(
        {"game_id": "seven_letter_words"},
        SEVEN_LETTER_WORDS_DATA,
        upsert=True
    )
    print("Seeded Seven Letter Words")


    # 20. Commands Actions
    await content_collection.replace_one(
        {"game_id": "commands_actions"},
        COMMANDS_ACTIONS_DATA,
        upsert=True
    )
    print("Seeded Commands Actions")

    # 21. Adverbs
    await content_collection.replace_one(
        {"game_id": "adverbs"},
        ADVERBS_DATA,
        upsert=True
    )
    print("Seeded Adverbs")

    # 22. Feeling and Thinking
    await content_collection.replace_one(
        {"game_id": "feeling_thinking"},
        FEELING_THINKING_DATA,
        upsert=True
    )
    print("Seeded Feeling Thinking")

    # 23. Guest Manners
    await content_collection.replace_one(
        {"game_id": "guest_manners"},
        GUEST_MANNERS_DATA,
        upsert=True
    )
    print("Seeded Guest Manners")

    # 24. Home Actions
    await content_collection.replace_one(
        {"game_id": "home_actions"},
        HOME_ACTIONS_DATA,
        upsert=True
    )
    print("Seeded Home Actions")

    # 25. Home Appliances
    await content_collection.replace_one(
        {"game_id": "home_appliances"},
        HOME_APPLIANCES_DATA,
        upsert=True
    )
    print("Seeded Home Appliances")

    # 26. Polite Phrases
    await content_collection.replace_one(
        {"game_id": "polite_phrases"},
        POLITE_PHRASES_DATA,
        upsert=True
    )
    print("Seeded Polite Phrases")

    # 27. Prepositions
    await content_collection.replace_one(
        {"game_id": "prepositions"},
        PREPOSITIONS_DATA,
        upsert=True
    )
    print("Seeded Prepositions")

    # 28. Pronouns
    await content_collection.replace_one(
        {"game_id": "pronouns"},
        PRONOUNS_DATA,
        upsert=True
    )
    print("Seeded Pronouns")

    # 29. School Actions
    await content_collection.replace_one(
        {"game_id": "school_actions"},
        SCHOOL_ACTIONS_DATA,
        upsert=True
    )
    print("Seeded School Actions")

    # 30. Singular Plural
    await content_collection.replace_one(
        {"game_id": "singular_plural"},
        SINGULAR_PLURAL_DATA,
        upsert=True
    )
    print("Seeded Singular Plural")

    # 31. Morning Routine
    await content_collection.replace_one(
        {"game_id": "morning_routine"},
        MORNING_ROUTINE_DATA,
        upsert=True
    )
    print("Seeded Morning Routine")

    # 32. Adjectives
    await content_collection.replace_one(
        {"game_id": "adjectives"},
        ADJECTIVES_DATA,
        upsert=True
    )
    print("Seeded Adjectives")

    # 33. Action Sentences
    await content_collection.replace_one(
        {"game_id": "action_sentences"},
        ACTION_SENTENCES_DATA,
        upsert=True
    )
    print("Seeded Action Sentences")

    # 34. Verbs
    await content_collection.replace_one(
        {"game_id": "verbs"},
        VERBS_DATA,
        upsert=True
    )
    print("Seeded Verbs")

    # 35. Two Letter Words
    await content_collection.replace_one(
        {"game_id": "two_letter_words"},
        TWO_LETTER_WORDS_DATA,
        upsert=True
    )
    print("Seeded Two Letter Words")

    # 36. Spelling
    await content_collection.replace_one(
        {"game_id": "spelling"},
        SPELLING_DATA,
        upsert=True
    )
    print("Seeded Spelling")

    # 37. Encouragement
    await content_collection.replace_one(
        {"game_id": "encouragement"},
        ENCOURAGEMENT_DATA,
        upsert=True
    )
    print("Seeded Encouragement")

    # 38. Yes/No Questions
    await content_collection.replace_one(
        {"game_id": "yes_no_questions"},
        YES_NO_QUESTIONS_DATA,
        upsert=True
    )
    print("Seeded Yes/No Questions")

    # 39. Sentence Builder
    await content_collection.replace_one(
        {"game_id": "sentence_builder"},
        SENTENCE_BUILDER_DATA,
        upsert=True
    )
    print("Seeded Sentence Builder")

    # 40. Conversation
    await content_collection.replace_one(
        {"game_id": "conversation"},
        CONVERSATION_DATA,
        upsert=True
    )
    print("Seeded Conversation")

    # 41. Hindi Stories
    await content_collection.replace_one(
        {"game_id": "hindi_stories"},
        HINDI_STORIES_DATA,
        upsert=True
    )
    print("Seeded Hindi Stories")

    print("Done!")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed())
