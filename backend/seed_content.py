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

WORD_SCRAMBLE_DATA = {
    "game_id": "word_scramble",
    "content": [
        { "word": "CAT", "icon": "🐱", "hint": "Meows and likes milk" },
        { "word": "DOG", "icon": "🐶", "hint": "Barks and guards home" },
        { "word": "SUN", "icon": "☀️", "hint": "Shines in the sky" },
        { "word": "BALL", "icon": "⚽", "hint": "You kick this" },
        { "word": "BOOK", "icon": "📖", "hint": "You read this" },
        { "word": "FISH", "icon": "🐠", "hint": "Swims in water" },
        { "word": "TREE", "icon": "🌳", "hint": "Has leaves and gives shade" },
        { "word": "BIRD", "icon": "🐦", "hint": "Flies in the sky" },
        { "word": "CAKE", "icon": "🎂", "hint": "Yummy birthday treat" },
        { "word": "MILK", "icon": "🥛", "hint": "White and healthy drink" },
        { "word": "STAR", "icon": "⭐", "hint": "Twinkles at night" },
        { "word": "MOON", "icon": "🌙", "hint": "Shines at night" },
        { "word": "APPLE", "icon": "🍎", "hint": "Red healthy fruit" },
        { "word": "HOUSE", "icon": "🏠", "hint": "Where you live" },
        { "word": "CHAIR", "icon": "🪑", "hint": "You sit on this" },
        { "word": "TABLE", "icon": "🧱", "hint": "Put things on this" },
        { "word": "SPOON", "icon": "🥄", "hint": "Use this to eat soup" },
        { "word": "HAPPY", "icon": "😊", "hint": "Smile!" },
        { "word": "WATER", "icon": "💧", "hint": "Drink this when thirsty" },
        { "word": "TIGER", "icon": "🐅", "hint": "Big wild cat" }
    ]
}

ENGLISH_STORIES_DATA = {
    "game_id": "english_stories",
    "content": [
        {
            "id": 1, "title": "The Lion and the Mouse", "icon": "🦁",
            "content": "A small Mouse accidentally woke up a sleeping Lion. The Lion was angry, but the Mouse begged for mercy, promising to help him one day. The Lion laughed but let him go. Later, the Lion was caught in a hunter's net. The Mouse heard him roar and gnawed the ropes to set him free. The Lion realized even a small friend can be a great help.",
            "moral": "No act of kindness, no matter how small, is ever wasted."
        },
        {
            "id": 2, "title": "The Thirsty Crow", "icon": "🐦",
            "content": "A thirsty Crow found a pitcher with very little water at the bottom. He couldn't reach it. He thought of a plan and began dropping pebbles into the pitcher one by one. As the pebbles rose, so did the water level. Finally, the Crow could drink the water and fly away happily.",
            "moral": "Where there is a will, there is a way."
        },
        {
            "id": 3, "title": "The Boy Who Cried Wolf", "icon": "🐺",
            "content": "A shepherd boy was bored and cried 'Wolf! Wolf!' to trick the villagers. They ran to help him but found no wolf. He did this twice. When a real wolf finally came, nobody believed his cries. The wolf ate the sheep because nobody came to help the boy who lied.",
            "moral": "A liar will not be believed, even when he speaks the truth."
        },
        {
            "id": 4, "title": "The Ant and the Grasshopper", "icon": "🐜",
            "content": "A Grasshopper sang all summer while the Ants worked hard to store food. When winter came, the Grasshopper had nothing to eat and was starving. He went to the Ants for help, but they told him, 'You sang all summer, now dance the winter away.' The Grasshopper realized his mistake too late.",
            "moral": "Work hard today to enjoy tomorrow."
        },
        {
            "id": 5, "title": "The Tortoise and the Hare", "icon": "🐢",
            "content": "The Hare bragged about his speed and challenged the slow Tortoise to a race. The Hare ran fast and took a nap, confident he would win. The Tortoise kept walking slowly but steadily. When the Hare woke up, the Tortoise had already crossed the finish line.",
            "moral": "Slow and steady wins the race."
        },
        {
            "id": 6, "title": "The Fox and the Grapes", "icon": "🦊",
            "content": "A hungry Fox saw a bunch of juicy grapes hanging high on a vine. He jumped and jumped but couldn't reach them. Walking away, he said, 'They were probably sour anyway!' He made an excuse because he couldn't get what he wanted.",
            "moral": "It is easy to despise what you cannot get."
        },
        {
            "id": 7, "title": "The Honest Woodcutter", "icon": "🪓",
            "content": "A woodcutter dropped his iron axe into a river. A Divine Being appeared and offered him a golden axe, then a silver one. The woodcutter refused both, saying only the iron one was his. Pleased by his honesty, the Being gave him all three axes.",
            "moral": "Honesty is the best policy."
        },
        {
            "id": 8, "title": "The Goose That Laid Golden Eggs", "icon": "🪺",
            "content": "A farmer had a Goose that laid one golden egg every day. Greedily, he thought the Goose must be full of gold inside. He killed it to get all the gold at once, but found nothing. He lost his daily golden egg forever.",
            "moral": "Greed leads to great loss."
        },
        {
            "id": 9, "title": "The Dog and the Shadow", "icon": "🐕",
            "content": "A Dog carrying a piece of meat saw his reflection in a river. He thought it was another dog with a bigger piece of meat. He barked at the reflection, and his own meat fell into the water. He ended up with nothing because he was greedy.",
            "moral": "Be content with what you have."
        },
        {
            "id": 10, "title": "The Fox and the Crow", "icon": "🧀",
            "content": "A Crow was sitting on a branch with a piece of cheese. A Fox wanted the cheese and began praising the Crow's voice. The Crow, feeling flattered, opened her beak to sing, and the cheese fell down. The Fox grabbed it and ran away.",
            "moral": "Do not trust flatterers."
        },
        {
            "id": 11, "title": "The Two Friends and the Bear", "icon": "🐻",
            "content": "Two friends were walking when a Bear appeared. One climbed a tree, leaving the other on the ground. The friend on the ground pretended to be dead. The Bear sniffed his ear and left. The tree-climbing friend asked, 'What did the bear say?' He replied, 'Don't trust friends who leave you in danger.'",
            "moral": "A friend in need is a friend indeed."
        },
        {
            "id": 12, "title": "The Milkmaid and Her Pail", "icon": "🥛",
            "content": "A milkmaid was carrying a pail of milk on her head. She started dreaming of selling it to buy eggs, then chickens, then a fine dress. In her excitement, she tossed her head and the milk spilled. All her dreams vanished with the milk.",
            "moral": "Don't count your chickens before they are hatched."
        },
        {
            "id": 13, "title": "The Bundle of Sticks", "icon": "🪵",
            "content": "A father gave his quarreling sons a bundle of sticks and asked them to break it. None could. Then he untied it and they broke the sticks easily. He said, 'If you stay together like the bundle, no one can hurt you. If you are divided, you will be broken.'",
            "moral": "Unity is strength."
        },
        {
            "id": 14, "title": "The Lion and the Rabbit", "icon": "🐰",
            "content": "A cruel Lion ate animals every day. A clever Rabbit, whose turn it was to be eaten, told the Lion there was another lion in a deep well. The Lion looked into the well, saw his reflection, and jumped in to fight it. He drowned, and the animals were safe.",
            "moral": "Wisdom is stronger than physical force."
        },
        {
            "id": 15, "title": "The Peacock and the Crane", "icon": "🦚",
            "content": "A Peacock laughed at a Crane's dull feathers, bragging about his own colorful tail. The Crane said, 'I can fly high into the sky and see the world, while you can only walk on the ground like a rooster.' The Peacock was silenced.",
            "moral": "Fine feathers do not make fine birds."
        },
        {
            "id": 16, "title": "The Golden Touch", "icon": "👑",
            "content": "King Midas wished that everything he touched would turn into gold. His wish was granted. He was happy until he touched his food and his daughter, turning them into cold gold. He realized that gold isn't everything and begged to have his wish taken back.",
            "moral": "Be careful what you wish for."
        },
        {
            "id": 17, "title": "The Wind and the Sun", "icon": "☀️",
            "content": "The Wind and the Sun argued over who was stronger. They saw a traveler and agreed that whoever could make him remove his coat was the winner. The Wind blew hard, but the traveler held his coat tighter. The Sun shone warmly, and the traveler gladly took off his coat.",
            "moral": "GENTLENESS and kind persuasion win where force fails."
        },
        {
            "id": 18, "title": "The Mouse and the Camel", "icon": "🐫",
            "content": "A Mouse thought he was very strong and tried to lead a Camel by a rope. The Camel followed quietly to teach him a lesson. When they reached a deep river, the Mouse stopped. The Camel walked through easily and said, 'Why stop? Follow me!' The Mouse realized his size and pride were small.",
            "moral": "Do not let pride blind you to your true abilities."
        },
        {
            "id": 19, "title": "The Elephant and the Tailor", "icon": "🐘",
            "content": "An Elephant and a Tailor were friends. One day, the Tailor pricked the Elephant's trunk with a needle. The next day, the Elephant filled his trunk with muddy water and sprayed it all over the Tailor's shop, ruining the new clothes. The Tailor learned his lesson.",
            "moral": "As you sow, so shall you reap."
        },
        {
            "id": 20, "title": "The Shepherd and the Lion", "icon": "🐾",
            "content": "A shepherd found a Lion in pain because of a thorn in its paw. He kindly pulled it out. Years later, the shepherd was thrown to the lions as a punishment. The Lion recognized him and instead of attacking, licked his hand. The King was amazed and set both free.",
            "moral": "Gratitude is the sign of a noble soul."
        }
    ]
}


BILINGUAL_GK_DATA = {
    "game_id": "bilingual_gk",
    "title": "Bilingual GK",
    "sets": {
        "physics_basics": [
            {
                "id": 1,
                "hi_q": "पदार्थ, ऊर्जा और बल के अध्ययन को क्या कहते हैं?",
                "en_q": "What is the study of matter, energy, and force?",
                "hi_a": "भौतिकी",
                "en_a": "Physics"
            },
            {
                "id": 2,
                "hi_q": "किसी वस्तु को धकेलने या खींचने को क्या कहते हैं?",
                "en_q": "What pushes or pulls an object?",
                "hi_a": "बल",
                "en_a": "Force"
            },
            {
                "id": 3,
                "hi_q": "हमारे आसपास की हर चीज़ जिसका वजन होता है, उसे क्या कहते हैं?",
                "en_q": "Everything around us that has weight is called?",
                "hi_a": "पदार्थ",
                "en_a": "Matter"
            },
        ],
        "electricity": [
            {
                "id": 1,
                "hi_q": "पंखा, टीवी और कंप्यूटर किससे चलते हैं?",
                "en_q": "What runs fans, TVs, and computers?",
                "hi_a": "बिजली",
                "en_a": "Electricity"
            },
            {
                "id": 2,
                "hi_q": "क्या हमें गीले हाथों से स्विच छूना चाहिए?",
                "en_q": "Can we touch switches with wet hands?",
                "hi_a": "नहीं",
                "en_a": "No"
            },
            {
                "id": 3,
                "hi_q": "उस रास्ते को क्या कहते हैं जिससे बिजली बहती है?",
                "en_q": "What is the path through which electricity flows?",
                "hi_a": "परिपथ",
                "en_a": "Circuit"
            },
        ],
        "energy": [
            {
                "id": 1,
                "hi_q": "काम करने की क्षमता को क्या कहते हैं?",
                "en_q": "What is the ability to do work?",
                "hi_a": "ऊर्जा",
                "en_a": "Energy"
            },
            {
                "id": 2,
                "hi_q": "पृथ्वी के लिए ऊर्जा का मुख्य स्रोत क्या है?",
                "en_q": "What is the main source of energy for Earth?",
                "hi_a": "सूरज",
                "en_a": "Sun"
            },
            {
                "id": 3,
                "hi_q": "बैटरी से हमें कौन सी ऊर्जा मिलती है?",
                "en_q": "Which energy do we get from a battery?",
                "hi_a": "रासायनिक ऊर्जा",
                "en_a": "Chemical Energy"
            },
        ],
        "magnets": [
            {
                "id": 1,
                "hi_q": "चुंबक किसे अपनी ओर खींचता है?",
                "en_q": "What does a magnet attract?",
                "hi_a": "लोहा",
                "en_a": "Iron"
            },
            {
                "id": 2,
                "hi_q": "एक चुंबक के कितने ध्रुव (poles) होते हैं?",
                "en_q": "How many poles does a magnet have?",
                "hi_a": "दो",
                "en_a": "Two"
            },
            {
                "id": 3,
                "hi_q": "चुंबक के समान ध्रुव एक-दूसरे को ____ करते हैं।",
                "en_q": "Same poles of magnets ____ each other.",
                "hi_a": "प्रतिकर्षित",
                "en_a": "Repel"
            },
        ],
        "sound": [
            {
                "id": 1,
                "hi_q": "ध्वनि (आवाज़) कैसे उत्पन्न होती है?",
                "en_q": "How is sound produced?",
                "hi_a": "कंपन",
                "en_a": "Vibrations"
            },
            {
                "id": 2,
                "hi_q": "क्या आवाज़ पानी के अंदर चल सकती है?",
                "en_q": "Can sound travel through water?",
                "hi_a": "हाँ",
                "en_a": "Yes"
            },
            {
                "id": 3,
                "hi_q": "हम आवाज़ सुनने के लिए क्या उपयोग करते हैं?",
                "en_q": "What do we use to hear sound?",
                "hi_a": "कान",
                "en_a": "Ears"
            },
        ],
        "heat": [
            {
                "id": 1,
                "hi_q": "गर्मी का मुख्य प्राकृतिक स्रोत क्या है?",
                "en_q": "What is the main natural source of heat?",
                "hi_a": "सूरज",
                "en_a": "Sun"
            },
            {
                "id": 2,
                "hi_q": "तापमान मापने के लिए किस उपकरण का उपयोग किया जाता है?",
                "en_q": "Which tool measures temperature?",
                "hi_a": "थर्मामीटर",
                "en_a": "Thermometer"
            },
            {
                "id": 3,
                "hi_q": "गर्मी गर्म से ठंडी की ओर बहती है या ठंडी से गर्म की ओर?",
                "en_q": "Does heat flow from hot to cold or cold to hot?",
                "hi_a": "गर्म से ठंडी",
                "en_a": "Hot to Cold"
            },
        ],
        "gravity": [
            {
                "id": 1,
                "hi_q": "वह क्या है जो हर चीज़ को पृथ्वी की ओर खींचता है?",
                "en_q": "What pulls everything towards the Earth?",
                "hi_a": "गुरुत्वाकर्षण",
                "en_a": "Gravity"
            },
            {
                "id": 2,
                "hi_q": "गुरुत्वाकर्षण की खोज किसने की थी?",
                "en_q": "Who discovered gravity?",
                "hi_a": "आइजैक न्यूटन",
                "en_a": "Isaac Newton"
            },
            {
                "id": 3,
                "hi_q": "क्या अंतरिक्ष में गुरुत्वाकर्षण होता है?",
                "en_q": "Is there gravity in space?",
                "hi_a": "बहुत कम",
                "en_a": "Very little"
            },
        ],
        "simple_machines": [
            {
                "id": 1,
                "hi_q": "कम बल में काम आसान बनाने वाली चीज़ को क्या कहते हैं?",
                "en_q": "What makes our work easier with less force?",
                "hi_a": "सरल मशीन",
                "en_a": "Simple Machine"
            },
            {
                "id": 2,
                "hi_q": "पुली भारी चीज़ों को ____ में मदद करती है।",
                "en_q": "A pulley helps to ____ heavy things.",
                "hi_a": "उठाने",
                "en_a": "Lift"
            },
            {
                "id": 3,
                "hi_q": "क्या कैंची एक सरल मशीन है?",
                "en_q": "Is a scissor a simple machine?",
                "hi_a": "हाँ",
                "en_a": "Yes"
            },
        ],
        "light": [
            {
                "id": 1,
                "hi_q": "हमें चीज़ें देखने में क्या मदद करता है?",
                "en_q": "What helps us see things?",
                "hi_a": "प्रकाश",
                "en_a": "Light"
            },
            {
                "id": 2,
                "hi_q": "जब रोशनी रुकती है, तो क्या बनता है?",
                "en_q": "When light is blocked, what is formed?",
                "hi_a": "छाया",
                "en_a": "Shadow"
            },
            {
                "id": 3,
                "hi_q": "प्रकाश सीधी रेखा में चलता है या घुमावदार?",
                "en_q": "Does light travel in straight lines or curves?",
                "hi_a": "सीधी रेखा",
                "en_a": "Straight lines"
            },
        ],
        "atoms": [
            {
                "id": 1,
                "hi_q": "पदार्थ के सबसे छोटे कण क्या कहलाते हैं?",
                "en_q": "What are the smallest building blocks of matter?",
                "hi_a": "परमाणु",
                "en_a": "Atoms"
            },
            {
                "id": 2,
                "hi_q": "परमाणु के बीच में क्या होता है?",
                "en_q": "What is at the center of an atom?",
                "hi_a": "केंद्रक",
                "en_a": "Nucleus"
            },
            {
                "id": 3,
                "hi_q": "केंद्रक के चारों ओर कौन से कण घूमते हैं?",
                "en_q": "Which particles move around the nucleus?",
                "hi_a": "इलेक्ट्रॉन",
                "en_a": "Electrons"
            },
        ],
        "elements": [
            {
                "id": 1,
                "hi_q": "जो केवल एक ही प्रकार के परमाणुओं से बना हो उसे क्या कहते हैं?",
                "en_q": "What consists of only one kind of atom?",
                "hi_a": "तत्व",
                "en_a": "Element"
            },
            {
                "id": 2,
                "hi_q": "'O' किस तत्व का चिन्ह है?",
                "en_q": "Symbol 'O' stands for which element?",
                "hi_a": "ऑक्सीजन",
                "en_a": "Oxygen"
            },
            {
                "id": 3,
                "hi_q": "पानी में ऑक्सीजन के साथ कौन सा तत्व पाया जाता है?",
                "en_q": "Which element is found in water along with oxygen?",
                "hi_a": "हाइड्रोजन",
                "en_a": "Hydrogen"
            },
        ],
        "acids_bases": [
            {
                "id": 1,
                "hi_q": "कौन से पदार्थ खट्टे होते हैं?",
                "en_q": "Which substances taste sour?",
                "hi_a": "अम्ल",
                "en_a": "Acids"
            },
            {
                "id": 2,
                "hi_q": "कौन से पदार्थ साबुन जैसे चिकने होते हैं?",
                "en_q": "Which substances feel slippery like soap?",
                "hi_a": "क्षार",
                "en_a": "Bases"
            },
            {
                "id": 3,
                "hi_q": "अम्ल नीले लिटमस पेपर को किस रंग में बदल देते हैं?",
                "en_q": "Acids turn Blue Litmus paper into which color?",
                "hi_a": "लाल",
                "en_a": "Red"
            },
        ],
        "chemistry_basics": [
            {
                "id": 1,
                "hi_q": "पदार्थ की तीन अवस्थाएँ कौन सी हैं?",
                "en_q": "What are the three states of matter?",
                "hi_a": "ठोस, द्रव, गैस",
                "en_a": "Solid, Liquid, Gas"
            },
            {
                "id": 2,
                "hi_q": "बर्फ ठोस है, द्रव है या गैस?",
                "en_q": "Is ice a solid, liquid, or gas?",
                "hi_a": "ठोस",
                "en_a": "Solid"
            },
            {
                "id": 3,
                "hi_q": "जब कागज जलकर राख बन जाता है, तो उसे क्या कहते हैं?",
                "en_q": "What do we call it when paper turns into ash?",
                "hi_a": "रासायनिक परिवर्तन",
                "en_a": "Chemical Change"
            },
        ],
        "biology_basics": [
            {
                "id": 1,
                "hi_q": "जीवित चीज़ों के अध्ययन को क्या कहते हैं?",
                "en_q": "What is the study of living things?",
                "hi_a": "जीव विज्ञान",
                "en_a": "Biology"
            },
            {
                "id": 2,
                "hi_q": "क्या पौधे अपना भोजन खुद बनाते हैं?",
                "en_q": "Do plants make their own food?",
                "hi_a": "हाँ",
                "en_a": "Yes"
            },
            {
                "id": 3,
                "hi_q": "किसी जीव के प्राकृतिक घर को क्या कहते हैं?",
                "en_q": "What is the natural home of a living thing called?",
                "hi_a": "आवास",
                "en_a": "Habitat"
            },
        ],
        "plants_parts": [
            {
                "id": 1,
                "hi_q": "पौधे का कौन सा भाग मिट्टी के नीचे उगता है?",
                "en_q": "Which part of the plant grows under the soil?",
                "hi_a": "जड़ें",
                "en_a": "Roots"
            },
            {
                "id": 2,
                "hi_q": "पौधे का कौन सा भाग धूप का उपयोग करके भोजन बनाता है?",
                "en_q": "Which part makes food for the plant using sunlight?",
                "hi_a": "पत्तियाँ",
                "en_a": "Leaves"
            },
            {
                "id": 3,
                "hi_q": "पौधे का कौन सा हिस्सा उसे सहारा देता है और पानी पहुँचाता है?",
                "en_q": "Which part supports the plant and carries water?",
                "hi_a": "तना",
                "en_a": "Stem"
            },
        ],
        "human_body_organs": [
            {
                "id": 1,
                "hi_q": "कौन सा अंग खून पंप करता है?",
                "en_q": "Which organ pumps blood?",
                "hi_a": "हृदय",
                "en_a": "Heart"
            },
            {
                "id": 2,
                "hi_q": "कौन सा अंग हमें सोचने में मदद करता है?",
                "en_q": "Which organ helps us think?",
                "hi_a": "मस्तिष्क",
                "en_a": "Brain"
            },
            {
                "id": 3,
                "hi_q": "कौन सा अंग हमें सांस लेने में मदद करता है?",
                "en_q": "Which organ helps us breathe?",
                "hi_a": "फेफड़े",
                "en_a": "Lungs"
            },
        ],
        "plants_need": [
            {
                "id": 1,
                "hi_q": "पौधों को बढ़ने के लिए आसमान से क्या चाहिए?",
                "en_q": "What do plants need from the sky to grow?",
                "hi_a": "धूप",
                "en_a": "Sunlight"
            },
            {
                "id": 2,
                "hi_q": "पौधे मिट्टी से क्या लेते हैं?",
                "en_q": "What do plants take from soil?",
                "hi_a": "पोषक तत्व और पानी",
                "en_a": "Nutrients & Water"
            },
            {
                "id": 3,
                "hi_q": "क्या पौधों को हवा की ज़रूरत होती है?",
                "en_q": "Do plants need air?",
                "hi_a": "हाँ",
                "en_a": "Yes"
            },
        ],
        "living_nonliving": [
            {
                "id": 1,
                "hi_q": "क्या बिल्ली एक जीवित चीज़ है?",
                "en_q": "Is a cat a living thing?",
                "hi_a": "हाँ",
                "en_a": "Yes"
            },
            {
                "id": 2,
                "hi_q": "क्या निर्जीव चीज़ें सांस लेती हैं?",
                "en_q": "Do non-living things breathe?",
                "hi_a": "नहीं",
                "en_a": "No"
            },
            {
                "id": 3,
                "hi_q": "क्या जीवित चीज़ें बढ़ सकती हैं?",
                "en_q": "Can living things grow?",
                "hi_a": "हाँ",
                "en_a": "Yes"
            },
        ],
        "occupations": [
            {
                "id": 1,
                "hi_q": "डॉक्टर क्या करते हैं?",
                "en_q": "What does a doctor do?",
                "hi_a": "बीमार लोगों का इलाज करते हैं",
                "en_a": "Treat sick people"
            },
            {
                "id": 2,
                "hi_q": "शिक्षक का काम क्या है?",
                "en_q": "What is the job of a teacher?",
                "hi_a": "बच्चों को पढ़ाना",
                "en_a": "Teaching children"
            },
            {
                "id": 3,
                "hi_q": "किसान क्या उगाता है?",
                "en_q": "What does a farmer grow?",
                "hi_a": "फसल",
                "en_a": "Crops"
            },
            {
                "id": 4,
                "hi_q": "पुलिस अधिकारी क्या करते हैं?",
                "en_q": "What does a police officer do?",
                "hi_a": "कानून और व्यवस्था बनाए रखते हैं",
                "en_a": "Maintain law and order"
            },
            {
                "id": 5,
                "hi_q": "फायरमैन क्या करते हैं?",
                "en_q": "What does a firefighter do?",
                "hi_a": "आग बुझाते हैं",
                "en_a": "Puts out fires"
            },
            {
                "id": 6,
                "hi_q": "नर्स किसकी मदद करती है?",
                "en_q": "Who does a nurse help?",
                "hi_a": "डॉक्टर और मरीजों की",
                "en_a": "Doctors and patients"
            },
            {
                "id": 7,
                "hi_q": "ड्राइवर क्या करता है?",
                "en_q": "What does a driver do?",
                "hi_a": "वाहन चलाता है",
                "en_a": "Drives vehicles"
            },
            {
                "id": 8,
                "hi_q": "पायलट क्या उड़ाता है?",
                "en_q": "What does a pilot fly?",
                "hi_a": "हवाई जहाज",
                "en_a": "Airplane"
            },
            {
                "id": 9,
                "hi_q": "रसोइया क्या करता है?",
                "en_q": "What does a cook do?",
                "hi_a": "खाना बनाता है",
                "en_a": "Cooks food"
            },
            {
                "id": 10,
                "hi_q": "बढ़ई क्या बनाता है?",
                "en_q": "What does a carpenter make?",
                "hi_a": "लकड़ी का फर्नीचर",
                "en_a": "Wooden furniture"
            },
            {
                "id": 11,
                "hi_q": "दर्जी क्या करता है?",
                "en_q": "What does a tailor do?",
                "hi_a": "कपड़े सिलता है",
                "en_a": "Stitches clothes"
            },
            {
                "id": 12,
                "hi_q": "नाई क्या करता है?",
                "en_q": "What does a barber do?",
                "hi_a": "बाल काटता है",
                "en_a": "Cuts hair"
            },
            {
                "id": 13,
                "hi_q": "इंजीनियर क्या बनाता है?",
                "en_q": "What does an engineer build?",
                "hi_a": "मशीनें और इमारतें",
                "en_a": "Machines and buildings"
            },
            {
                "id": 14,
                "hi_q": "वैज्ञानिक क्या करते हैं?",
                "en_q": "What does a scientist do?",
                "hi_a": "खोज और अनुसंधान",
                "en_a": "Research and discoveries"
            },
            {
                "id": 15,
                "hi_q": "डाकिया क्या देता है?",
                "en_q": "What does a postman deliver?",
                "hi_a": "चिट्ठियाँ और पार्सल",
                "en_a": "Letters and parcels"
            },
            {
                "id": 16,
                "hi_q": "दुकानदार क्या करता है?",
                "en_q": "What does a shopkeeper do?",
                "hi_a": "सामान बेचता है",
                "en_a": "Sells goods"
            },
            {
                "id": 17,
                "hi_q": "सैनिक का काम क्या है?",
                "en_q": "What does a soldier do?",
                "hi_a": "देश की रक्षा",
                "en_a": "Protects the country"
            },
            {
                "id": 18,
                "hi_q": "माली क्या करता है?",
                "en_q": "What does a gardener do?",
                "hi_a": "पौधे उगाता और देखभाल करता है",
                "en_a": "Grows and cares for plants"
            },
            {
                "id": 19,
                "hi_q": "पत्रकार क्या करता है?",
                "en_q": "What does a journalist do?",
                "hi_a": "समाचार लिखता और बताता है",
                "en_a": "Reports and writes news"
            },
            {
                "id": 20,
                "hi_q": "कलाकार क्या करता है?",
                "en_q": "What does an artist do?",
                "hi_a": "चित्र बनाता या कला रचता है",
                "en_a": "Creates art and paintings"
            },
            {
                "id": 21,
                "hi_q": "बस कंडक्टर क्या करता है?",
                "en_q": "What does a bus conductor do?",
                "hi_a": "टिकट देता है",
                "en_a": "Gives tickets"
            },
            {
                "id": 22,
                "hi_q": "मैकेनिक क्या ठीक करता है?",
                "en_q": "What does a mechanic repair?",
                "hi_a": "वाहन और मशीनें",
                "en_a": "Vehicles and machines"
            },
            {
                "id": 23,
                "hi_q": "वकील क्या करते हैं?",
                "en_q": "What does a lawyer do?",
                "hi_a": "अदालत में केस लड़ते हैं",
                "en_a": "Fights cases in court"
            },
            {
                "id": 24,
                "hi_q": "बैंक कर्मचारी क्या करते हैं?",
                "en_q": "What does a bank employee do?",
                "hi_a": "पैसों का लेन-देन संभालता है",
                "en_a": "Handles money transactions"
            },
            {
                "id": 25,
                "hi_q": "हमें सभी पेशों का सम्मान क्यों करना चाहिए?",
                "en_q": "Why should we respect all occupations?",
                "hi_a": "क्योंकि हर काम समाज के लिए जरूरी है",
                "en_a": "Because every job is important for society"
            }
        ],
        "birds": [
            {
                "id": 1,
                "hi_q": "पक्षियों के शरीर पर क्या होता है?",
                "en_q": "What covers the body of birds?",
                "hi_a": "पंख",
                "en_a": "Feathers"
            },
            {
                "id": 2,
                "hi_q": "पक्षी किसकी मदद से उड़ते हैं?",
                "en_q": "Birds fly with the help of what?",
                "hi_a": "पंख",
                "en_a": "Wings"
            },
            {
                "id": 3,
                "hi_q": "पक्षियों का घर क्या कहलाता है?",
                "en_q": "What is a bird's home called?",
                "hi_a": "घोंसला",
                "en_a": "Nest"
            },
            {
                "id": 4,
                "hi_q": "पक्षी क्या देते हैं जिससे बच्चे पैदा होते हैं?",
                "en_q": "What do birds lay to have babies?",
                "hi_a": "अंडे",
                "en_a": "Eggs"
            },
            {
                "id": 5,
                "hi_q": "भारत का राष्ट्रीय पक्षी कौन है?",
                "en_q": "What is the national bird of India?",
                "hi_a": "मोर",
                "en_a": "Peacock"
            },
            {
                "id": 6,
                "hi_q": "तोता किस रंग का होता है?",
                "en_q": "What is the color of a parrot?",
                "hi_a": "हरा",
                "en_a": "Green"
            },
            {
                "id": 7,
                "hi_q": "कौन सा पक्षी बोलना सीख सकता है?",
                "en_q": "Which bird can learn to talk?",
                "hi_a": "तोता",
                "en_a": "Parrot"
            },
            {
                "id": 8,
                "hi_q": "कौन सा पक्षी उड़ नहीं सकता?",
                "en_q": "Which bird cannot fly?",
                "hi_a": "शुतुरमुर्ग",
                "en_a": "Ostrich"
            },
            {
                "id": 9,
                "hi_q": "कौन सा पक्षी रात में जागता है?",
                "en_q": "Which bird stays awake at night?",
                "hi_a": "उल्लू",
                "en_a": "Owl"
            },
            {
                "id": 10,
                "hi_q": "कबूतर किस लिए जाना जाता है?",
                "en_q": "What is a pigeon known for?",
                "hi_a": "संदेश ले जाने के लिए (पुराने समय में)",
                "en_a": "Carrying messages (in old times)"
            },
            {
                "id": 11,
                "hi_q": "मुर्गी क्या देती है?",
                "en_q": "What does a hen give us?",
                "hi_a": "अंडे",
                "en_a": "Eggs"
            },
            {
                "id": 12,
                "hi_q": "चील किस प्रकार का पक्षी है?",
                "en_q": "What type of bird is an eagle?",
                "hi_a": "शिकारी पक्षी",
                "en_a": "Bird of prey"
            },
            {
                "id": 13,
                "hi_q": "हंस किस पानी में तैरता है?",
                "en_q": "In what does a swan swim?",
                "hi_a": "पानी में",
                "en_a": "In water"
            },
            {
                "id": 14,
                "hi_q": "कौन सा पक्षी अपने घोंसले में अंडे नहीं देता?",
                "en_q": "Which bird does not lay eggs in its own nest?",
                "hi_a": "कोयल",
                "en_a": "Cuckoo"
            },
            {
                "id": 15,
                "hi_q": "कौआ किस रंग का होता है?",
                "en_q": "What is the color of a crow?",
                "hi_a": "काला",
                "en_a": "Black"
            },
            {
                "id": 16,
                "hi_q": "मोर किस मौसम में नाचता है?",
                "en_q": "In which season does a peacock dance?",
                "hi_a": "बारिश के मौसम में",
                "en_a": "During the rainy season"
            },
            {
                "id": 17,
                "hi_q": "बत्तख कहाँ रहती है?",
                "en_q": "Where does a duck live?",
                "hi_a": "पानी और जमीन दोनों पर",
                "en_a": "Both in water and on land"
            },
            {
                "id": 18,
                "hi_q": "कौन सा छोटा पक्षी फूलों का रस पीता है?",
                "en_q": "Which small bird drinks nectar from flowers?",
                "hi_a": "हमिंग बर्ड",
                "en_a": "Hummingbird"
            },
            {
                "id": 19,
                "hi_q": "पक्षियों की चोंच किस काम आती है?",
                "en_q": "What is a bird's beak used for?",
                "hi_a": "खाना खाने के लिए",
                "en_a": "For eating food"
            },
            {
                "id": 20,
                "hi_q": "पक्षियों के पैर किस काम आते हैं?",
                "en_q": "What are birds' legs used for?",
                "hi_a": "चलने और पकड़ने के लिए",
                "en_a": "For walking and holding"
            },
            {
                "id": 21,
                "hi_q": "प्रवासी पक्षी क्या करते हैं?",
                "en_q": "What do migratory birds do?",
                "hi_a": "मौसम के अनुसार स्थान बदलते हैं",
                "en_a": "Move from one place to another with seasons"
            },
            {
                "id": 22,
                "hi_q": "कौन सा पक्षी बहुत ऊँचा उड़ सकता है?",
                "en_q": "Which bird can fly very high?",
                "hi_a": "गिद्ध",
                "en_a": "Vulture"
            },
            {
                "id": 23,
                "hi_q": "चिड़िया आमतौर पर कहाँ घोंसला बनाती है?",
                "en_q": "Where do small birds usually build nests?",
                "hi_a": "पेड़ों पर",
                "en_a": "On trees"
            },
            {
                "id": 24,
                "hi_q": "पक्षी पर्यावरण के लिए क्यों जरूरी हैं?",
                "en_q": "Why are birds important for the environment?",
                "hi_a": "बीज फैलाने और कीड़े खाने के लिए",
                "en_a": "For spreading seeds and eating insects"
            },
            {
                "id": 25,
                "hi_q": "हमें पक्षियों के साथ कैसा व्यवहार करना चाहिए?",
                "en_q": "How should we behave with birds?",
                "hi_a": "दया और सुरक्षा के साथ",
                "en_a": "With kindness and protection"
            }
        ],
        "time": [
            {
                "id": 1,
                "hi_q": "समय मापने के लिए किस यंत्र का उपयोग होता है?",
                "en_q": "Which device is used to measure time?",
                "hi_a": "घड़ी",
                "en_a": "Clock"
            },
            {
                "id": 2,
                "hi_q": "एक दिन में कितने घंटे होते हैं?",
                "en_q": "How many hours are there in a day?",
                "hi_a": "24",
                "en_a": "24"
            },
            {
                "id": 3,
                "hi_q": "एक घंटे में कितने मिनट होते हैं?",
                "en_q": "How many minutes are there in one hour?",
                "hi_a": "60",
                "en_a": "60"
            },
            {
                "id": 4,
                "hi_q": "एक मिनट में कितने सेकंड होते हैं?",
                "en_q": "How many seconds are there in one minute?",
                "hi_a": "60",
                "en_a": "60"
            },
            {
                "id": 5,
                "hi_q": "दिन और रात मिलकर क्या बनाते हैं?",
                "en_q": "What do day and night together make?",
                "hi_a": "एक दिन",
                "en_a": "One day"
            },
            {
                "id": 6,
                "hi_q": "सुबह का समय कब होता है?",
                "en_q": "When is morning time?",
                "hi_a": "सूर्योदय के बाद",
                "en_a": "After sunrise"
            },
            {
                "id": 7,
                "hi_q": "दोपहर कब होती है?",
                "en_q": "When is afternoon?",
                "hi_a": "दिन के बीच का समय",
                "en_a": "Middle of the day"
            },
            {
                "id": 8,
                "hi_q": "शाम का समय कब होता है?",
                "en_q": "When is evening?",
                "hi_a": "सूरज ढलने का समय",
                "en_a": "When the sun sets"
            },
            {
                "id": 9,
                "hi_q": "रात कब होती है?",
                "en_q": "When is night?",
                "hi_a": "सूरज डूबने के बाद",
                "en_a": "After sunset"
            },
            {
                "id": 10,
                "hi_q": "सप्ताह में कितने दिन होते हैं?",
                "en_q": "How many days are there in a week?",
                "hi_a": "7",
                "en_a": "7"
            },
            {
                "id": 11,
                "hi_q": "सप्ताह का पहला दिन कौन सा है?",
                "en_q": "Which is the first day of the week?",
                "hi_a": "सोमवार",
                "en_a": "Monday"
            },
            {
                "id": 12,
                "hi_q": "सप्ताह का आखिरी दिन कौन सा है?",
                "en_q": "Which is the last day of the week?",
                "hi_a": "रविवार",
                "en_a": "Sunday"
            },
            {
                "id": 13,
                "hi_q": "एक महीने में लगभग कितने दिन होते हैं?",
                "en_q": "About how many days are there in a month?",
                "hi_a": "30 या 31",
                "en_a": "30 or 31"
            },
            {
                "id": 14,
                "hi_q": "साल में कितने महीने होते हैं?",
                "en_q": "How many months are there in a year?",
                "hi_a": "12",
                "en_a": "12"
            },
            {
                "id": 15,
                "hi_q": "एक साल में कितने दिन होते हैं?",
                "en_q": "How many days are there in a year?",
                "hi_a": "365",
                "en_a": "365"
            },
            {
                "id": 16,
                "hi_q": "लीप वर्ष में कितने दिन होते हैं?",
                "en_q": "How many days are there in a leap year?",
                "hi_a": "366",
                "en_a": "366"
            },
            {
                "id": 17,
                "hi_q": "घड़ी की छोटी सुई क्या दिखाती है?",
                "en_q": "What does the short hand of a clock show?",
                "hi_a": "घंटे",
                "en_a": "Hours"
            },
            {
                "id": 18,
                "hi_q": "घड़ी की लंबी सुई क्या दिखाती है?",
                "en_q": "What does the long hand of a clock show?",
                "hi_a": "मिनट",
                "en_a": "Minutes"
            },
            {
                "id": 19,
                "hi_q": "अलार्म घड़ी किस काम आती है?",
                "en_q": "What is an alarm clock used for?",
                "hi_a": "समय पर जगाने के लिए",
                "en_a": "To wake us up on time"
            },
            {
                "id": 20,
                "hi_q": "कैलेंडर किस काम आता है?",
                "en_q": "What is a calendar used for?",
                "hi_a": "तारीख और दिन देखने के लिए",
                "en_a": "To see dates and days"
            },
            {
                "id": 21,
                "hi_q": "सुबह स्कूल जाने का समय किस भाग में आता है?",
                "en_q": "School time in the morning comes under which part of the day?",
                "hi_a": "सुबह",
                "en_a": "Morning"
            },
            {
                "id": 22,
                "hi_q": "रात को सोने का समय किस भाग में आता है?",
                "en_q": "Sleeping time at night comes under which part of the day?",
                "hi_a": "रात",
                "en_a": "Night"
            },
            {
                "id": 23,
                "hi_q": "\"कल\" शब्द किस समय को दर्शाता है?",
                "en_q": "What time does the word \"tomorrow/yesterday\" refer to?",
                "hi_a": "आज से पहले या बाद का दिन (संदर्भ पर निर्भर)",
                "en_a": "The day before or after today (depending on context)"
            },
            {
                "id": 24,
                "hi_q": "समय पर काम करने की आदत को क्या कहते हैं?",
                "en_q": "What do we call the habit of doing things on time?",
                "hi_a": "समय की पाबंदी",
                "en_a": "Punctuality"
            },
            {
                "id": 25,
                "hi_q": "समय की कद्र करना क्यों जरूरी है?",
                "en_q": "Why is valuing time important?",
                "hi_a": "सफलता और अनुशासन के लिए",
                "en_a": "For success and discipline"
            }
        ],
        "human_body": [
            {
                "id": 1,
                "hi_q": "हमारे शरीर में खून कौन पंप करता है?",
                "en_q": "Which organ pumps blood in our body?",
                "hi_a": "हृदय",
                "en_a": "Heart"
            },
            {
                "id": 2,
                "hi_q": "हम किस अंग से सांस लेते हैं?",
                "en_q": "Which organ helps us breathe?",
                "hi_a": "फेफड़े",
                "en_a": "Lungs"
            },
            {
                "id": 3,
                "hi_q": "हम किस अंग से सोचते हैं?",
                "en_q": "Which organ helps us think?",
                "hi_a": "मस्तिष्क",
                "en_a": "Brain"
            },
            {
                "id": 4,
                "hi_q": "हम किस अंग से देखते हैं?",
                "en_q": "Which organ do we use to see?",
                "hi_a": "आँखें",
                "en_a": "Eyes"
            },
            {
                "id": 5,
                "hi_q": "हम किस अंग से सुनते हैं?",
                "en_q": "Which organ do we use to hear?",
                "hi_a": "कान",
                "en_a": "Ears"
            },
            {
                "id": 6,
                "hi_q": "हम किस अंग से स्वाद लेते हैं?",
                "en_q": "Which organ helps us taste?",
                "hi_a": "जीभ",
                "en_a": "Tongue"
            },
            {
                "id": 7,
                "hi_q": "हम किस अंग से सूंघते हैं?",
                "en_q": "Which organ helps us smell?",
                "hi_a": "नाक",
                "en_a": "Nose"
            },
            {
                "id": 8,
                "hi_q": "हमारे शरीर की सबसे कठोर चीज क्या है?",
                "en_q": "What is the hardest substance in our body?",
                "hi_a": "दाँत",
                "en_a": "Teeth"
            },
            {
                "id": 9,
                "hi_q": "एक वयस्क इंसान के कितने दाँत होते हैं?",
                "en_q": "How many teeth does an adult human have?",
                "hi_a": "32",
                "en_a": "32"
            },
            {
                "id": 10,
                "hi_q": "हमारे शरीर में कितनी हड्डियाँ होती हैं?",
                "en_q": "How many bones are there in the human body?",
                "hi_a": "206",
                "en_a": "206"
            },
            {
                "id": 11,
                "hi_q": "शरीर का सबसे बड़ा अंग कौन सा है?",
                "en_q": "What is the largest organ of the human body?",
                "hi_a": "त्वचा",
                "en_a": "Skin"
            },
            {
                "id": 12,
                "hi_q": "खून का रंग लाल क्यों होता है?",
                "en_q": "Why is blood red?",
                "hi_a": "हीमोग्लोबिन के कारण",
                "en_a": "Because of hemoglobin"
            },
            {
                "id": 13,
                "hi_q": "मांसपेशियाँ किस काम आती हैं?",
                "en_q": "What do muscles help us do?",
                "hi_a": "शरीर को हिलाने में",
                "en_a": "To move the body"
            },
            {
                "id": 14,
                "hi_q": "हड्डियाँ किस काम आती हैं?",
                "en_q": "What do bones do?",
                "hi_a": "शरीर को आकार और सहारा देती हैं",
                "en_a": "Give shape and support to the body"
            },
            {
                "id": 15,
                "hi_q": "हमारी उंगलियों में हड्डियाँ होती हैं क्या?",
                "en_q": "Do our fingers have bones?",
                "hi_a": "हाँ",
                "en_a": "Yes"
            },
            {
                "id": 16,
                "hi_q": "हमें रोज दाँत क्यों साफ करने चाहिए?",
                "en_q": "Why should we brush our teeth daily?",
                "hi_a": "दाँतों को साफ और स्वस्थ रखने के लिए",
                "en_a": "To keep teeth clean and healthy"
            },
            {
                "id": 17,
                "hi_q": "हमें रोज नहाना क्यों चाहिए?",
                "en_q": "Why should we bathe daily?",
                "hi_a": "शरीर को साफ रखने के लिए",
                "en_a": "To keep the body clean"
            },
            {
                "id": 18,
                "hi_q": "साफ हाथ क्यों जरूरी हैं?",
                "en_q": "Why are clean hands important?",
                "hi_a": "कीटाणुओं से बचने के लिए",
                "en_a": "To avoid germs"
            },
            {
                "id": 19,
                "hi_q": "स्वस्थ रहने के लिए हमें क्या खाना चाहिए?",
                "en_q": "What should we eat to stay healthy?",
                "hi_a": "संतुलित आहार",
                "en_a": "Balanced diet"
            },
            {
                "id": 20,
                "hi_q": "दूध पीने से कौन सा अंग मजबूत होता है?",
                "en_q": "Drinking milk makes which part strong?",
                "hi_a": "हड्डियाँ",
                "en_a": "Bones"
            },
            {
                "id": 21,
                "hi_q": "गाजर खाने से कौन सा अंग फायदा पाता है?",
                "en_q": "Eating carrots is good for which organ?",
                "hi_a": "आँखें",
                "en_a": "Eyes"
            },
            {
                "id": 22,
                "hi_q": "व्यायाम करने से क्या फायदा होता है?",
                "en_q": "What is the benefit of exercise?",
                "hi_a": "शरीर मजबूत और स्वस्थ रहता है",
                "en_a": "Body becomes strong and healthy"
            },
            {
                "id": 23,
                "hi_q": "हमें कितनी बार हाथ धोने चाहिए?",
                "en_q": "How many times should we wash our hands?",
                "hi_a": "खाने से पहले और शौच के बाद",
                "en_a": "Before eating and after using the toilet"
            },
            {
                "id": 24,
                "hi_q": "नींद क्यों जरूरी है?",
                "en_q": "Why is sleep important?",
                "hi_a": "शरीर और दिमाग को आराम देने के लिए",
                "en_a": "To give rest to body and brain"
            },
            {
                "id": 25,
                "hi_q": "हमारा दिल कहाँ स्थित होता है?",
                "en_q": "Where is the heart located in the body?",
                "hi_a": "छाती के अंदर",
                "en_a": "Inside the chest"
            }
        ],
        "weather": [
            {
                "id": 1,
                "hi_q": "मौसम क्या होता है?",
                "en_q": "What is weather?",
                "hi_a": "किसी स्थान की दिन-प्रतिदिन की हवा, तापमान और बारिश की स्थिति",
                "en_a": "The day-to-day condition of air, temperature, and rain at a place"
            },
            {
                "id": 2,
                "hi_q": "बारिश किससे होती है?",
                "en_q": "What causes rain?",
                "hi_a": "बादलों से",
                "en_a": "From clouds"
            },
            {
                "id": 3,
                "hi_q": "बादल किससे बने होते हैं?",
                "en_q": "What are clouds made of?",
                "hi_a": "पानी की बूंदों और बर्फ के कणों से",
                "en_a": "Tiny water droplets and ice particles"
            },
            {
                "id": 4,
                "hi_q": "गरज के साथ आसमान में चमक को क्या कहते हैं?",
                "en_q": "What do we call the bright flash in the sky during thunder?",
                "hi_a": "बिजली (तड़ित)",
                "en_a": "Lightning"
            },
            {
                "id": 5,
                "hi_q": "तेज हवा को क्या कहते हैं?",
                "en_q": "What is strong moving air called?",
                "hi_a": "तूफान",
                "en_a": "Storm"
            },
            {
                "id": 6,
                "hi_q": "बहुत ठंडा मौसम किस ऋतु में होता है?",
                "en_q": "In which season is the weather very cold?",
                "hi_a": "सर्दी (शीत ऋतु)",
                "en_a": "Winter"
            },
            {
                "id": 7,
                "hi_q": "बहुत गर्म मौसम किस ऋतु में होता है?",
                "en_q": "In which season is the weather very hot?",
                "hi_a": "गर्मी (ग्रीष्म ऋतु)",
                "en_a": "Summer"
            },
            {
                "id": 8,
                "hi_q": "फूल खिलने का मौसम कौन सा है?",
                "en_q": "Which season is known for blooming flowers?",
                "hi_a": "वसंत ऋतु",
                "en_a": "Spring season"
            },
            {
                "id": 9,
                "hi_q": "फसल काटने का मौसम कौन सा होता है?",
                "en_q": "Which season is known for harvesting crops?",
                "hi_a": "शरद ऋतु",
                "en_a": "Autumn"
            },
            {
                "id": 10,
                "hi_q": "इंद्रधनुष कब दिखाई देता है?",
                "en_q": "When can we see a rainbow?",
                "hi_a": "बारिश के बाद जब सूरज निकलता है",
                "en_a": "After rain when the sun shines"
            },
            {
                "id": 11,
                "hi_q": "थर्मामीटर किसे मापता है?",
                "en_q": "What does a thermometer measure?",
                "hi_a": "तापमान",
                "en_a": "Temperature"
            },
            {
                "id": 12,
                "hi_q": "बहुत तेज बारिश को क्या कहते हैं?",
                "en_q": "What do we call very heavy rain?",
                "hi_a": "मूसलाधार बारिश",
                "en_a": "Heavy rainfall"
            },
            {
                "id": 13,
                "hi_q": "बर्फ गिरने को क्या कहते हैं?",
                "en_q": "What is falling snow called?",
                "hi_a": "हिमपात",
                "en_a": "Snowfall"
            },
            {
                "id": 14,
                "hi_q": "ओले क्या होते हैं?",
                "en_q": "What are hailstones?",
                "hi_a": "बर्फ के छोटे-छोटे गोले",
                "en_a": "Small balls of ice"
            },
            {
                "id": 15,
                "hi_q": "मौसम की जानकारी देने वाले को क्या कहते हैं?",
                "en_q": "What do we call a person who studies weather?",
                "hi_a": "मौसम वैज्ञानिक",
                "en_a": "Meteorologist"
            },
            {
                "id": 16,
                "hi_q": "मौसम की भविष्यवाणी को क्या कहते हैं?",
                "en_q": "What is predicting the weather called?",
                "hi_a": "मौसम पूर्वानुमान",
                "en_a": "Weather forecast"
            },
            {
                "id": 17,
                "hi_q": "बहुत तेज हवा और बारिश वाले तूफान को क्या कहते हैं?",
                "en_q": "What is a storm with very strong winds and rain called?",
                "hi_a": "चक्रवात",
                "en_a": "Cyclone"
            },
            {
                "id": 18,
                "hi_q": "सूखा क्या होता है?",
                "en_q": "What is a drought?",
                "hi_a": "लंबे समय तक बारिश न होना",
                "en_a": "No rain for a long time"
            },
            {
                "id": 19,
                "hi_q": "कोहरा कब बनता है?",
                "en_q": "When does fog form?",
                "hi_a": "ठंडी हवा में जलवाष्प के कारण",
                "en_a": "When water vapor condenses in cold air"
            },
            {
                "id": 20,
                "hi_q": "धूप वाले दिन को क्या कहते हैं?",
                "en_q": "What do we call a day full of sunshine?",
                "hi_a": "धूप वाला दिन",
                "en_a": "Sunny day"
            },
            {
                "id": 21,
                "hi_q": "बादल छाए रहने वाले दिन को क्या कहते हैं?",
                "en_q": "What do we call a day full of clouds?",
                "hi_a": "बादलों वाला दिन",
                "en_a": "Cloudy day"
            },
            {
                "id": 22,
                "hi_q": "हवा किस दिशा से किस दिशा में चलती है?",
                "en_q": "In which direction does wind move?",
                "hi_a": "अधिक दबाव से कम दबाव की ओर",
                "en_a": "From high pressure to low pressure"
            },
            {
                "id": 23,
                "hi_q": "मानसून क्या होता है?",
                "en_q": "What is monsoon?",
                "hi_a": "मौसम की वह हवा जो बहुत बारिश लाती है",
                "en_a": "Seasonal winds that bring heavy rain"
            },
            {
                "id": 24,
                "hi_q": "भारत में मानसून कब आता है?",
                "en_q": "When does monsoon usually arrive in India?",
                "hi_a": "जून से सितंबर",
                "en_a": "June to September"
            },
            {
                "id": 25,
                "hi_q": "मौसम बदलने का मुख्य कारण क्या है?",
                "en_q": "What is the main reason for change in weather?",
                "hi_a": "सूर्य की गर्मी और हवा की चाल",
                "en_a": "Sun’s heat and movement of air"
            }
        ],
        "community_helpers": [
            {
                "id": 1,
                "hi_q": "डॉक्टर का काम क्या होता है?",
                "en_q": "What does a doctor do?",
                "hi_a": "बीमार लोगों का इलाज करता है",
                "en_a": "Treats sick people"
            },
            {
                "id": 2,
                "hi_q": "नर्स किसकी मदद करती है?",
                "en_q": "Who does a nurse help?",
                "hi_a": "डॉक्टर और मरीजों की",
                "en_a": "Doctors and patients"
            },
            {
                "id": 3,
                "hi_q": "शिक्षक क्या करते हैं?",
                "en_q": "What does a teacher do?",
                "hi_a": "बच्चों को पढ़ाते हैं",
                "en_a": "Teaches children"
            },
            {
                "id": 4,
                "hi_q": "पुलिस का काम क्या है?",
                "en_q": "What is the job of the police?",
                "hi_a": "कानून और व्यवस्था बनाए रखना",
                "en_a": "Maintain law and order"
            },
            {
                "id": 5,
                "hi_q": "फायरमैन (अग्निशामक) क्या करता है?",
                "en_q": "What does a firefighter do?",
                "hi_a": "आग बुझाता है",
                "en_a": "Puts out fires"
            },
            {
                "id": 6,
                "hi_q": "डाकिया क्या लाता है?",
                "en_q": "What does a postman deliver?",
                "hi_a": "चिट्ठियाँ और पार्सल",
                "en_a": "Letters and parcels"
            },
            {
                "id": 7,
                "hi_q": "किसान क्या उगाता है?",
                "en_q": "What does a farmer grow?",
                "hi_a": "अनाज, फल और सब्जियाँ",
                "en_a": "Grains, fruits, and vegetables"
            },
            {
                "id": 8,
                "hi_q": "चालक (ड्राइवर) क्या करता है?",
                "en_q": "What does a driver do?",
                "hi_a": "वाहन चलाता है",
                "en_a": "Drives vehicles"
            },
            {
                "id": 9,
                "hi_q": "सफाई कर्मचारी क्या काम करता है?",
                "en_q": "What does a sanitation worker do?",
                "hi_a": "सफाई रखता है",
                "en_a": "Keeps the surroundings clean"
            },
            {
                "id": 10,
                "hi_q": "सैनिक का काम क्या है?",
                "en_q": "What does a soldier do?",
                "hi_a": "देश की रक्षा करता है",
                "en_a": "Protecting the country"
            },
            {
                "id": 11,
                "hi_q": "इंजीनियर क्या बनाता है?",
                "en_q": "What does an engineer build?",
                "hi_a": "मशीनें, पुल, इमारतें",
                "en_a": "Machines, bridges, buildings"
            },
            {
                "id": 12,
                "hi_q": "बढ़ई क्या बनाता है?",
                "en_q": "What does a carpenter make?",
                "hi_a": "लकड़ी का फर्नीचर",
                "en_a": "Wooden furniture"
            },
            {
                "id": 13,
                "hi_q": "दर्जी क्या करता है?",
                "en_q": "What does a tailor do?",
                "hi_a": "कपड़े सिलता है",
                "en_a": "Stitches clothes"
            },
            {
                "id": 14,
                "hi_q": "नाई क्या करता है?",
                "en_q": "What does a barber do?",
                "hi_a": "बाल काटता है",
                "en_a": "Cuts hair"
            },
            {
                "id": 15,
                "hi_q": "रसोइया क्या करता है?",
                "en_q": "What does a cook do?",
                "hi_a": "खाना बनाता है",
                "en_a": "Cooks food"
            },
            {
                "id": 16,
                "hi_q": "माली क्या करता है?",
                "en_q": "What does a gardener do?",
                "hi_a": "पौधे लगाता और उनकी देखभाल करता है",
                "en_a": "Plants and takes care of plants"
            },
            {
                "id": 17,
                "hi_q": "पायलट क्या उड़ाता है?",
                "en_q": "What does a pilot fly?",
                "hi_a": "हवाई जहाज",
                "en_a": "Airplane"
            },
            {
                "id": 18,
                "hi_q": "बस कंडक्टर क्या करता है?",
                "en_q": "What does a bus conductor do?",
                "hi_a": "टिकट देता है",
                "en_a": "Gives tickets"
            },
            {
                "id": 19,
                "hi_q": "दुकानदार क्या करता है?",
                "en_q": "What does a shopkeeper do?",
                "hi_a": "सामान बेचता है",
                "en_a": "Sells goods"
            },
            {
                "id": 20,
                "hi_q": "डॉक्टर कहाँ काम करता है?",
                "en_q": "Where does a doctor work?",
                "hi_a": "अस्पताल या क्लिनिक में",
                "en_a": "In a hospital or clinic"
            },
            {
                "id": 21,
                "hi_q": "शिक्षक कहाँ पढ़ाते हैं?",
                "en_q": "Where do teachers teach?",
                "hi_a": "स्कूल में",
                "en_a": "In a school"
            },
            {
                "id": 22,
                "hi_q": "पुलिस कहाँ काम करती है?",
                "en_q": "Where do police officers work?",
                "hi_a": "पुलिस स्टेशन में",
                "en_a": "At a police station"
            },
            {
                "id": 23,
                "hi_q": "फायर स्टेशन में कौन काम करता है?",
                "en_q": "Who works at a fire station?",
                "hi_a": "फायरमैन",
                "en_a": "Firefighters"
            },
            {
                "id": 24,
                "hi_q": "अस्पताल में मरीजों की देखभाल कौन करता है?",
                "en_q": "Who takes care of patients in a hospital?",
                "hi_a": "नर्स",
                "en_a": "Nurse"
            },
            {
                "id": 25,
                "hi_q": "हमें इन सामुदायिक सहायकों का सम्मान क्यों करना चाहिए?",
                "en_q": "Why should we respect community helpers?",
                "hi_a": "क्योंकि वे हमारी मदद करते हैं",
                "en_a": "Because they help us"
            }
        ],
        "school_life": [
            {
                "id": 1,
                "hi_q": "हम स्कूल क्यों जाते हैं?",
                "en_q": "Why do we go to school?",
                "hi_a": "पढ़ने और सीखने के लिए",
                "en_a": "To study and learn"
            },
            {
                "id": 2,
                "hi_q": "स्कूल में पढ़ाने वाले को क्या कहते हैं?",
                "en_q": "What do we call a person who teaches in school?",
                "hi_a": "शिक्षक / अध्यापक",
                "en_a": "Teacher"
            },
            {
                "id": 3,
                "hi_q": "स्कूल में पढ़ने वाले बच्चों को क्या कहते हैं?",
                "en_q": "What do we call children who study in school?",
                "hi_a": "विद्यार्थी / छात्र",
                "en_a": "Students"
            },
            {
                "id": 4,
                "hi_q": "स्कूल में पढ़ाई कहाँ होती है?",
                "en_q": "Where does learning take place in school?",
                "hi_a": "कक्षा में",
                "en_a": "In the classroom"
            },
            {
                "id": 5,
                "hi_q": "किताबों को रखने के लिए क्या उपयोग करते हैं?",
                "en_q": "What do we use to keep our books?",
                "hi_a": "स्कूल बैग",
                "en_a": "School bag"
            },
            {
                "id": 6,
                "hi_q": "लिखने के लिए हम क्या उपयोग करते हैं?",
                "en_q": "What do we use for writing?",
                "hi_a": "पेन या पेंसिल",
                "en_a": "Pen or pencil"
            },
            {
                "id": 7,
                "hi_q": "ब्लैकबोर्ड/व्हाइटबोर्ड पर कौन लिखता है?",
                "en_q": "Who writes on the blackboard/whiteboard?",
                "hi_a": "शिक्षक",
                "en_a": "Teacher"
            }
        ],
        "food_nutrition": [
            {
                "id": 1,
                "hi_q": "हमें भोजन क्यों करना चाहिए?",
                "en_q": "Why do we need to eat food?",
                "hi_a": "ऊर्जा पाने के लिए",
                "en_a": "To get energy"
            },
            {
                "id": 2,
                "hi_q": "स्वस्थ रहने के लिए हमें कैसा भोजन करना चाहिए?",
                "en_q": "What kind of food should we eat to stay healthy?",
                "hi_a": "संतुलित आहार",
                "en_a": "Balanced diet"
            },
            {
                "id": 3,
                "hi_q": "चावल और रोटी हमें क्या देते हैं?",
                "en_q": "What do rice and chapati give us?",
                "hi_a": "ऊर्जा",
                "en_a": "Energy"
            },
            {
                "id": 4,
                "hi_q": "दाल और बीन्स किसके अच्छे स्रोत हैं?",
                "en_q": "Pulses and beans are good sources of what?",
                "hi_a": "प्रोटीन",
                "en_a": "Protein"
            },
            {
                "id": 5,
                "hi_q": "दूध में कौन सा पोषक तत्व अधिक होता है?",
                "en_q": "Which nutrient is rich in milk?",
                "hi_a": "कैल्शियम",
                "en_a": "Calcium"
            },
            {
                "id": 6,
                "hi_q": "फल और सब्जियाँ हमें क्या देती हैं?",
                "en_q": "What do fruits and vegetables give us?",
                "hi_a": "विटामिन और खनिज",
                "en_a": "Vitamins and minerals"
            },
            {
                "id": 7,
                "hi_q": "गाजर किस विटामिन के लिए जानी जाती है?",
                "en_q": "Carrot is rich in which vitamin?",
                "hi_a": "विटामिन A",
                "en_a": "Vitamin A"
            },
            {
                "id": 8,
                "hi_q": "नींबू किस विटामिन का अच्छा स्रोत है?",
                "en_q": "Lemon is a good source of which vitamin?",
                "hi_a": "विटामिन C",
                "en_a": "Vitamin C"
            },
            {
                "id": 9,
                "hi_q": "पानी पीना क्यों जरूरी है?",
                "en_q": "Why is drinking water important?",
                "hi_a": "शरीर को हाइड्रेट रखने के लिए",
                "en_a": "To keep the body hydrated"
            },
            {
                "id": 10,
                "hi_q": "हमें रोज कितने समय पर खाना खाना चाहिए?",
                "en_q": "How often should we eat meals daily?",
                "hi_a": "नियमित समय पर",
                "en_a": "At regular times"
            },
            {
                "id": 11,
                "hi_q": "सुबह का नाश्ता क्यों जरूरी है?",
                "en_q": "Why is breakfast important?",
                "hi_a": "दिन की शुरुआत के लिए ऊर्जा देता है",
                "en_a": "Gives energy to start the day"
            },
            {
                "id": 12,
                "hi_q": "जंक फूड ज्यादा खाने से क्या होता है?",
                "en_q": "What happens if we eat too much junk food?",
                "hi_a": "स्वास्थ्य खराब हो सकता है",
                "en_a": "It can harm our health"
            },
            {
                "id": 13,
                "hi_q": "हरी पत्तेदार सब्जियाँ क्यों खानी चाहिए?",
                "en_q": "Why should we eat green leafy vegetables?",
                "hi_a": "शरीर को ताकत और खून बढ़ाने के लिए",
                "en_a": "To build strength and improve blood"
            },
            {
                "id": 14,
                "hi_q": "अंडा किसका अच्छा स्रोत है?",
                "en_q": "Egg is a good source of what?",
                "hi_a": "प्रोटीन",
                "en_a": "Protein"
            },
            {
                "id": 15,
                "hi_q": "दही खाने से क्या फायदा होता है?",
                "en_q": "What is the benefit of eating curd?",
                "hi_a": "पाचन अच्छा रहता है",
                "en_a": "Helps in digestion"
            },
            {
                "id": 16,
                "hi_q": "मेवे (Dry fruits) हमें क्या देते हैं?",
                "en_q": "What do dry fruits give us?",
                "hi_a": "ऊर्जा और पोषक तत्व",
                "en_a": "Energy and nutrients"
            },
            {
                "id": 17,
                "hi_q": "ज्यादा मीठा खाने से क्या हो सकता है?",
                "en_q": "What can happen if we eat too many sweets?",
                "hi_a": "दाँत खराब हो सकते हैं",
                "en_a": "Teeth can get damaged"
            },
            {
                "id": 18,
                "hi_q": "साफ भोजन क्यों जरूरी है?",
                "en_q": "Why is clean food important?",
                "hi_a": "बीमारियों से बचने के लिए",
                "en_a": "To avoid diseases"
            },
            {
                "id": 19,
                "hi_q": "खाने से पहले हाथ क्यों धोने चाहिए?",
                "en_q": "Why should we wash hands before eating?",
                "hi_a": "कीटाणुओं से बचने के लिए",
                "en_a": "To avoid germs"
            },
            {
                "id": 20,
                "hi_q": "फल खाने का सबसे अच्छा समय कौन सा है?",
                "en_q": "What is the best time to eat fruits?",
                "hi_a": "सुबह या दिन में",
                "en_a": "Morning or daytime"
            },
            {
                "id": 21,
                "hi_q": "शरीर को बढ़ने के लिए किसकी जरूरत होती है?",
                "en_q": "What does the body need for growth?",
                "hi_a": "प्रोटीन",
                "en_a": "Protein"
            },
            {
                "id": 22,
                "hi_q": "कौन सा पेय हमें ताजगी देता है और शरीर के लिए जरूरी है?",
                "en_q": "Which drink refreshes us and is essential for the body?",
                "hi_a": "पानी",
                "en_a": "Water"
            },
            {
                "id": 23,
                "hi_q": "ज्यादा तला हुआ भोजन क्यों नहीं खाना चाहिए?",
                "en_q": "Why should we avoid eating too much fried food?",
                "hi_a": "स्वास्थ्य के लिए हानिकारक है",
                "en_a": "It is harmful to health"
            },
            {
                "id": 24,
                "hi_q": "हमें रोज कितनी बार फल और सब्जियाँ खानी चाहिए?",
                "en_q": "How often should we eat fruits and vegetables?",
                "hi_a": "रोजाना",
                "en_a": "Every day"
            },
            {
                "id": 25,
                "hi_q": "स्वस्थ भोजन करने से क्या फायदा होता है?",
                "en_q": "What is the benefit of eating healthy food?",
                "hi_a": "शरीर मजबूत और स्वस्थ रहता है",
                "en_a": "The body stays strong and healthy"
            }
        ],

        "set_1": [
            {
                "id": 1,
                "hi_q": "भारत की राजधानी क्या है?",
                "en_q": "What is the capital of India?",
                "hi_a": "नई दिल्ली",
                "en_a": "New Delhi"
            },
            {
                "id": 2,
                "hi_q": "सूरज किस दिशा से निकलता है?",
                "en_q": "From which direction does the Sun rise?",
                "hi_a": "पूर्व दिशा",
                "en_a": "East"
            },
            {
                "id": 3,
                "hi_q": "एक हफ्ते में कितने दिन होते हैं?",
                "en_q": "How many days are there in a week?",
                "hi_a": "7 दिन",
                "en_a": "7 days"
            },
            {
                "id": 4,
                "hi_q": "पेड़ हमें क्या देते हैं?",
                "en_q": "What do trees give us?",
                "hi_a": "ऑक्सीजन",
                "en_a": "Oxygen"
            },
            {
                "id": 5,
                "hi_q": "पानी का रंग क्या होता है?",
                "en_q": "What is the color of water?",
                "hi_a": "बेरंग",
                "en_a": "Colorless"
            },
            {
                "id": 6,
                "hi_q": "कंप्यूटर का दिमाग किसे कहते हैं?",
                "en_q": "What is called the brain of a computer?",
                "hi_a": "सीपीयू",
                "en_a": "CPU"
            },
            {
                "id": 7,
                "hi_q": "भारत का राष्ट्रीय पक्षी कौन है?",
                "en_q": "What is the national bird of India?",
                "hi_a": "मोर",
                "en_a": "Peacock"
            },
            {
                "id": 8,
                "hi_q": "दुनिया का सबसे बड़ा जानवर कौन सा है?",
                "en_q": "Which is the largest animal in the world?",
                "hi_a": "नीली व्हेल",
                "en_a": "Blue Whale"
            },
            {
                "id": 9,
                "hi_q": "बर्फ किससे बनती है?",
                "en_q": "Ice is made from what?",
                "hi_a": "पानी से",
                "en_a": "From water"
            },
            {
                "id": 10,
                "hi_q": "इंसान के कितनी इंद्रियाँ होती हैं?",
                "en_q": "How many senses do humans have?",
                "hi_a": "पाँच",
                "en_a": "Five"
            },
            {
                "id": 11,
                "hi_q": "सबसे तेज दौड़ने वाला जानवर कौन है?",
                "en_q": "Which is the fastest land animal?",
                "hi_a": "चीता",
                "en_a": "Cheetah"
            },
            {
                "id": 12,
                "hi_q": "कौन सा पक्षी उड़ नहीं सकता?",
                "en_q": "Which bird cannot fly?",
                "hi_a": "शुतुरमुर्ग",
                "en_a": "Ostrich"
            },
            {
                "id": 13,
                "hi_q": "दुनिया का सबसे बड़ा देश कौन सा है?",
                "en_q": "Which is the largest country in the world?",
                "hi_a": "रूस",
                "en_a": "Russia"
            },
            {
                "id": 14,
                "hi_q": "दुनिया का सबसे बड़ा महासागर कौन सा है?",
                "en_q": "Which is the largest ocean in the world?",
                "hi_a": "प्रशांत महासागर",
                "en_a": "Pacific Ocean"
            },
            {
                "id": 15,
                "hi_q": "ताज महल किस शहर में है?",
                "en_q": "In which city is the Taj Mahal located?",
                "hi_a": "आगरा",
                "en_a": "Agra"
            },
            {
                "id": 16,
                "hi_q": "पौधे अपना खाना कैसे बनाते हैं?",
                "en_q": "How do plants make their food?",
                "hi_a": "प्रकाश संश्लेषण से",
                "en_a": "By photosynthesis"
            },
            {
                "id": 17,
                "hi_q": "धरती का उपग्रह कौन है?",
                "en_q": "What is the natural satellite of Earth?",
                "hi_a": "चंद्रमा",
                "en_a": "Moon"
            },
            {
                "id": 18,
                "hi_q": "इंद्रधनुष में कितने रंग होते हैं?",
                "en_q": "How many colors are there in a rainbow?",
                "hi_a": "सात",
                "en_a": "Seven"
            },
            {
                "id": 19,
                "hi_q": "सबसे लंबा जानवर कौन है?",
                "en_q": "Which is the tallest animal?",
                "hi_a": "जिराफ",
                "en_a": "Giraffe"
            },
            {
                "id": 20,
                "hi_q": "कौन सा फल डॉक्टर को दूर रखता है?",
                "en_q": "Which fruit keeps the doctor away?",
                "hi_a": "सेब",
                "en_a": "Apple"
            }
        ],
        "set_2": [
            {
                "id": 1,
                "hi_q": "भारत का राष्ट्रीय पशु कौन है?",
                "en_q": "What is the national animal of India?",
                "hi_a": "बाघ",
                "en_a": "Tiger"
            },
            {
                "id": 2,
                "hi_q": "भारत का राष्ट्रीय फल कौन सा है?",
                "en_q": "What is the national fruit of India?",
                "hi_a": "आम",
                "en_a": "Mango"
            },
            {
                "id": 3,
                "hi_q": "भारत का राष्ट्रीय वृक्ष कौन सा है?",
                "en_q": "What is the national tree of India?",
                "hi_a": "बरगद का पेड़",
                "en_a": "Banyan Tree"
            },
            {
                "id": 4,
                "hi_q": "भारत का राष्ट्रीय खेल क्या माना जाता है?",
                "en_q": "What is considered the national game of India?",
                "hi_a": "हॉकी",
                "en_a": "Hockey"
            },
            {
                "id": 5,
                "hi_q": "हमारे सौरमंडल में कितने ग्रह हैं?",
                "en_q": "How many planets are there in our solar system?",
                "hi_a": "आठ",
                "en_a": "Eight"
            },
            {
                "id": 6,
                "hi_q": "पृथ्वी किस ग्रह पर रहती है?",
                "en_q": "Earth is which number planet from the Sun?",
                "hi_a": "तीसरा",
                "en_a": "Third"
            },
            {
                "id": 7,
                "hi_q": "चंद्रमा पर पहला इंसान कौन गया?",
                "en_q": "Who was the first person to walk on the Moon?",
                "hi_a": "नील आर्मस्ट्रांग",
                "en_a": "Neil Armstrong"
            },
            {
                "id": 8,
                "hi_q": "दिन में आकाश का रंग कैसा दिखता है?",
                "en_q": "What is the color of the sky during the day?",
                "hi_a": "नीला",
                "en_a": "Blue"
            },
            {
                "id": 9,
                "hi_q": "गाय का बच्चा क्या कहलाता है?",
                "en_q": "What is a baby cow called?",
                "hi_a": "बछड़ा",
                "en_a": "Calf"
            },
            {
                "id": 10,
                "hi_q": "मेंढक कहाँ रहता है?",
                "en_q": "Where does a frog live?",
                "hi_a": "पानी और जमीन दोनों पर",
                "en_a": "Both in water and on land"
            },
            {
                "id": 11,
                "hi_q": "दुनिया का सबसे ऊँचा पर्वत कौन सा है?",
                "en_q": "Which is the highest mountain in the world?",
                "hi_a": "माउंट एवरेस्ट",
                "en_a": "Mount Everest"
            },
            {
                "id": 12,
                "hi_q": "दुनिया की सबसे लंबी नदी कौन सी है?",
                "en_q": "Which is the longest river in the world?",
                "hi_a": "नील नदी",
                "en_a": "Nile River"
            },
            {
                "id": 13,
                "hi_q": "हमारे शरीर में खून का रंग कैसा होता है?",
                "en_q": "What is the color of blood in our body?",
                "hi_a": "लाल",
                "en_a": "Red"
            },
            {
                "id": 14,
                "hi_q": "इंसान कितने दाँतों के साथ बड़ा होता है?",
                "en_q": "How many teeth does an adult human have?",
                "hi_a": "32",
                "en_a": "32"
            },
            {
                "id": 15,
                "hi_q": "मधुमक्खी क्या बनाती है?",
                "en_q": "What do bees make?",
                "hi_a": "शहद",
                "en_a": "Honey"
            },
            {
                "id": 16,
                "hi_q": "भारत का राष्ट्रीय गान कौन सा है?",
                "en_q": "What is the national anthem of India?",
                "hi_a": "जन गण मन",
                "en_a": "Jana Gana Mana"
            },
            {
                "id": 17,
                "hi_q": "साइकिल में कितने पहिये होते हैं?",
                "en_q": "How many wheels does a bicycle have?",
                "hi_a": "दो",
                "en_a": "Two"
            },
            {
                "id": 18,
                "hi_q": "त्रिकोण में कितनी भुजाएँ होती हैं?",
                "en_q": "How many sides does a triangle have?",
                "hi_a": "तीन",
                "en_a": "Three"
            },
            {
                "id": 19,
                "hi_q": "वर्ग (Square) में कितनी भुजाएँ होती हैं?",
                "en_q": "How many sides does a square have?",
                "hi_a": "चार",
                "en_a": "Four"
            },
            {
                "id": 20,
                "hi_q": "इंद्रधनुष कब दिखाई देता है?",
                "en_q": "When can we see a rainbow?",
                "hi_a": "बारिश के बाद",
                "en_a": "After rain"
            },
            {
                "id": 21,
                "hi_q": "पानी उबालने पर क्या बनता है?",
                "en_q": "What is formed when water boils?",
                "hi_a": "भाप",
                "en_a": "Steam"
            },
            {
                "id": 22,
                "hi_q": "बर्फ पिघलकर क्या बनती है?",
                "en_q": "What does ice become when it melts?",
                "hi_a": "पानी",
                "en_a": "Water"
            },
            {
                "id": 23,
                "hi_q": "सूरज एक क्या है?",
                "en_q": "The Sun is a what?",
                "hi_a": "तारा",
                "en_a": "Star"
            },
            {
                "id": 24,
                "hi_q": "रात में कौन सा तारा सबसे चमकीला दिखता है?",
                "en_q": "Which star appears brightest at night?",
                "hi_a": "ध्रुव तारा",
                "en_a": "Pole Star"
            },
            {
                "id": 25,
                "hi_q": "पृथ्वी का आकार कैसा है?",
                "en_q": "What is the shape of the Earth?",
                "hi_a": "गोल",
                "en_a": "Round"
            },
            {
                "id": 26,
                "hi_q": "कुत्ता किस जानवर की आवाज निकालता है?",
                "en_q": "What sound does a dog make?",
                "hi_a": "भौं-भौं",
                "en_a": "Bark"
            },
            {
                "id": 27,
                "hi_q": "बिल्ली की आवाज क्या होती है?",
                "en_q": "What sound does a cat make?",
                "hi_a": "म्याऊँ",
                "en_a": "Meow"
            },
            {
                "id": 28,
                "hi_q": "हाथी की सूँड़ किस काम आती है?",
                "en_q": "What is an elephant’s trunk used for?",
                "hi_a": "खाना उठाने और पानी पीने के लिए",
                "en_a": "For picking food and drinking water"
            },
            {
                "id": 29,
                "hi_q": "पक्षी किससे उड़ते हैं?",
                "en_q": "Birds fly with the help of what?",
                "hi_a": "पंख",
                "en_a": "Wings"
            },
            {
                "id": 30,
                "hi_q": "मछली कहाँ रहती है?",
                "en_q": "Where do fish live?",
                "hi_a": "पानी में",
                "en_a": "In water"
            },
            {
                "id": 31,
                "hi_q": "पौधों का हरा भाग क्या कहलाता है?",
                "en_q": "What is the green part of a plant called?",
                "hi_a": "पत्ता",
                "en_a": "Leaf"
            },
            {
                "id": 32,
                "hi_q": "फूल किसका हिस्सा होता है?",
                "en_q": "A flower is part of what?",
                "hi_a": "पौधे का",
                "en_a": "A plant"
            },
            {
                "id": 33,
                "hi_q": "दूध का रंग कैसा होता है?",
                "en_q": "What is the color of milk?",
                "hi_a": "सफेद",
                "en_a": "White"
            },
            {
                "id": 34,
                "hi_q": "कोयला किस रंग का होता है?",
                "en_q": "What is the color of coal?",
                "hi_a": "काला",
                "en_a": "Black"
            },
            {
                "id": 35,
                "hi_q": "हरी सब्जियाँ खाने से क्या मिलता है?",
                "en_q": "What do we get from eating green vegetables?",
                "hi_a": "ताकत और विटामिन",
                "en_a": "Strength and vitamins"
            },
            {
                "id": 36,
                "hi_q": "डॉक्टर किसकी मदद करते हैं?",
                "en_q": "Who do doctors help?",
                "hi_a": "बीमार लोगों की",
                "en_a": "Sick people"
            },
            {
                "id": 37,
                "hi_q": "शिक्षक हमें क्या सिखाते हैं?",
                "en_q": "What do teachers teach us?",
                "hi_a": "पढ़ाई",
                "en_a": "Studies"
            },
            {
                "id": 38,
                "hi_q": "पुलिस क्या काम करती है?",
                "en_q": "What does the police do?",
                "hi_a": "सुरक्षा",
                "en_a": "Protection"
            },
            {
                "id": 39,
                "hi_q": "किसान क्या उगाता है?",
                "en_q": "What does a farmer grow?",
                "hi_a": "फसल",
                "en_a": "Crops"
            },
            {
                "id": 40,
                "hi_q": "डाकिया क्या लाता है?",
                "en_q": "What does a postman deliver?",
                "hi_a": "चिट्ठी",
                "en_a": "Letters"
            },
            {
                "id": 41,
                "hi_q": "घड़ी किस काम आती है?",
                "en_q": "What is a clock used for?",
                "hi_a": "समय देखने के लिए",
                "en_a": "To see time"
            },
            {
                "id": 42,
                "hi_q": "पेन किस काम आता है?",
                "en_q": "What is a pen used for?",
                "hi_a": "लिखने के लिए",
                "en_a": "For writing"
            },
            {
                "id": 43,
                "hi_q": "किताब से क्या मिलता है?",
                "en_q": "What do we get from books?",
                "hi_a": "ज्ञान",
                "en_a": "Knowledge"
            },
            {
                "id": 44,
                "hi_q": "सूरज हमें क्या देता है?",
                "en_q": "What does the Sun give us?",
                "hi_a": "रोशनी और गर्मी",
                "en_a": "Light and heat"
            },
            {
                "id": 45,
                "hi_q": "हवा हमें क्या देती है?",
                "en_q": "What does air give us?",
                "hi_a": "सांस लेने के लिए ऑक्सीजन",
                "en_a": "Oxygen to breathe"
            },
            {
                "id": 46,
                "hi_q": "बारिश कहाँ से आती है?",
                "en_q": "Where does rain come from?",
                "hi_a": "बादलों से",
                "en_a": "From clouds"
            },
            {
                "id": 47,
                "hi_q": "सर्दियों में हमें क्या पहनना चाहिए?",
                "en_q": "What should we wear in winter?",
                "hi_a": "गरम कपड़े",
                "en_a": "Warm clothes"
            },
            {
                "id": 48,
                "hi_q": "गर्मियों में हमें क्या पहनना चाहिए?",
                "en_q": "What should we wear in summer?",
                "hi_a": "हल्के कपड़े",
                "en_a": "Light clothes"
            },
            {
                "id": 49,
                "hi_q": "कंप्यूटर किससे चलता है?",
                "en_q": "What runs a computer?",
                "hi_a": "बिजली",
                "en_a": "Electricity"
            },
            {
                "id": 50,
                "hi_q": "मोबाइल किस काम आता है?",
                "en_q": "What is a mobile phone used for?",
                "hi_a": "बात करने के लिए",
                "en_a": "For talking"
            },
            {
                "id": 51,
                "hi_q": "टीवी किस काम आता है?",
                "en_q": "What is a TV used for?",
                "hi_a": "कार्यक्रम देखने के लिए",
                "en_a": "For watching shows"
            },
            {
                "id": 52,
                "hi_q": "ट्रेन किस पर चलती है?",
                "en_q": "On what does a train run?",
                "hi_a": "पटरियों पर",
                "en_a": "On tracks"
            },
            {
                "id": 53,
                "hi_q": "हवाई जहाज कहाँ उड़ता है?",
                "en_q": "Where does an airplane fly?",
                "hi_a": "आसमान में",
                "en_a": "In the sky"
            },
            {
                "id": 54,
                "hi_q": "नाव कहाँ चलती है?",
                "en_q": "Where does a boat move?",
                "hi_a": "पानी में",
                "en_a": "In water"
            },
            {
                "id": 55,
                "hi_q": "कार किस पर चलती है?",
                "en_q": "On what does a car run?",
                "hi_a": "सड़क पर",
                "en_a": "On the road"
            },
            {
                "id": 56,
                "hi_q": "लाल बत्ती का क्या मतलब है?",
                "en_q": "What does a red traffic light mean?",
                "hi_a": "रुकना",
                "en_a": "Stop"
            },
            {
                "id": 57,
                "hi_q": "हरी बत्ती का क्या मतलब है?",
                "en_q": "What does a green traffic light mean?",
                "hi_a": "चलना",
                "en_a": "Go"
            },
            {
                "id": 58,
                "hi_q": "पीली बत्ती का क्या मतलब है?",
                "en_q": "What does a yellow traffic light mean?",
                "hi_a": "तैयार रहना",
                "en_a": "Get ready"
            },
            {
                "id": 59,
                "hi_q": "हमें सड़क पार करते समय क्या देखना चाहिए?",
                "en_q": "What should we do before crossing the road?",
                "hi_a": "दाएं-बाएं देखना",
                "en_a": "Look left and right"
            },
            {
                "id": 60,
                "hi_q": "साफ पानी पीना क्यों जरूरी है?",
                "en_q": "Why is it important to drink clean water?",
                "hi_a": "स्वस्थ रहने के लिए",
                "en_a": "To stay healthy"
            },
            {
                "id": 61,
                "hi_q": "हमें रोज कितनी बार दाँत साफ करने चाहिए?",
                "en_q": "How many times should we brush our teeth daily?",
                "hi_a": "दो बार",
                "en_a": "Twice"
            },
            {
                "id": 62,
                "hi_q": "खाना खाने से पहले क्या करना चाहिए?",
                "en_q": "What should we do before eating food?",
                "hi_a": "हाथ धोना",
                "en_a": "Wash hands"
            },
            {
                "id": 63,
                "hi_q": "कूड़ा कहाँ डालना चाहिए?",
                "en_q": "Where should we throw garbage?",
                "hi_a": "डस्टबिन में",
                "en_a": "In the dustbin"
            },
            {
                "id": 64,
                "hi_q": "पेड़ लगाना क्यों जरूरी है?",
                "en_q": "Why is planting trees important?",
                "hi_a": "पर्यावरण बचाने के लिए",
                "en_a": "To save the environment"
            },
            {
                "id": 65,
                "hi_q": "हमें पानी क्यों बचाना चाहिए?",
                "en_q": "Why should we save water?",
                "hi_a": "भविष्य के लिए",
                "en_a": "For the future"
            },
            {
                "id": 66,
                "hi_q": "हमें बिजली क्यों बचानी चाहिए?",
                "en_q": "Why should we save electricity?",
                "hi_a": "ऊर्जा बचाने के लिए",
                "en_a": "To save energy"
            },
            {
                "id": 67,
                "hi_q": "दोस्ती का मतलब क्या होता है?",
                "en_q": "What does friendship mean?",
                "hi_a": "एक-दूसरे की मदद करना",
                "en_a": "Helping each other"
            },
            {
                "id": 68,
                "hi_q": "हमें बड़ों से कैसे बात करनी चाहिए?",
                "en_q": "How should we talk to elders?",
                "hi_a": "सम्मान से",
                "en_a": "Respectfully"
            },
            {
                "id": 69,
                "hi_q": "सच बोलना क्यों अच्छा है?",
                "en_q": "Why is telling the truth good?",
                "hi_a": "क्योंकि यह सही आदत है",
                "en_a": "Because it is a good habit"
            },
            {
                "id": 70,
                "hi_q": "हमें दूसरों की मदद क्यों करनी चाहिए?",
                "en_q": "Why should we help others?",
                "hi_a": "अच्छा इंसान बनने के लिए",
                "en_a": "To be a good person"
            },
            {
                "id": 71,
                "hi_q": "भारत का स्वतंत्रता दिवस कब मनाया जाता है?",
                "en_q": "When is India’s Independence Day celebrated?",
                "hi_a": "15 अगस्त",
                "en_a": "15 August"
            },
            {
                "id": 72,
                "hi_q": "गणतंत्र दिवस कब मनाया जाता है?",
                "en_q": "When is Republic Day celebrated in India?",
                "hi_a": "26 जनवरी",
                "en_a": "26 January"
            },
            {
                "id": 73,
                "hi_q": "बच्चों का दिवस कब मनाया जाता है?",
                "en_q": "When is Children’s Day celebrated in India?",
                "hi_a": "14 नवंबर",
                "en_a": "14 November"
            },
            {
                "id": 74,
                "hi_q": "पृथ्वी दिवस कब मनाया जाता है?",
                "en_q": "When is Earth Day celebrated?",
                "hi_a": "22 अप्रैल",
                "en_a": "22 April"
            },
            {
                "id": 75,
                "hi_q": "योग दिवस कब मनाया जाता है?",
                "en_q": "When is International Yoga Day celebrated?",
                "hi_a": "21 जून",
                "en_a": "21 June"
            },
            {
                "id": 76,
                "hi_q": "कंप्यूटर का पूरा नाम क्या है?",
                "en_q": "What is the full form of COMPUTER?",
                "hi_a": "कॉमन ऑपरेटिंग मशीन विशेष रूप से तकनीकी और शैक्षणिक अनुसंधान के लिए उपयोगी",
                "en_a": "Common Operating Machine Purposely Used for Technological and Educational Research"
            },
            {
                "id": 77,
                "hi_q": "एटीएम का पूरा नाम क्या है?",
                "en_q": "What is the full form of ATM?",
                "hi_a": "ऑटोमेटेड टेलर मशीन",
                "en_a": "Automated Teller Machine"
            },
            {
                "id": 78,
                "hi_q": "डॉक्टर मरीज का इलाज किस जगह करते हैं?",
                "en_q": "Where do doctors treat patients?",
                "hi_a": "अस्पताल में",
                "en_a": "In a hospital"
            },
            {
                "id": 79,
                "hi_q": "हमें रोज क्या पीना चाहिए?",
                "en_q": "What should we drink daily?",
                "hi_a": "पर्याप्त पानी",
                "en_a": "Plenty of water"
            },
            {
                "id": 80,
                "hi_q": "पढ़ाई करना क्यों जरूरी है?",
                "en_q": "Why is studying important?",
                "hi_a": "अच्छा भविष्य बनाने के लिए",
                "en_a": "To build a good future"
            },
            {
                "id": 81,
                "hi_q": "खेलना क्यों जरूरी है?",
                "en_q": "Why is playing important?",
                "hi_a": "स्वस्थ और खुश रहने के लिए",
                "en_a": "To stay healthy and happy"
            },
            {
                "id": 82,
                "hi_q": "मुस्कुराने से क्या होता है?",
                "en_q": "What happens when we smile?",
                "hi_a": "हम खुश रहते हैं",
                "en_a": "We feel happy"
            },
            {
                "id": 83,
                "hi_q": "हमें जानवरों के साथ कैसा व्यवहार करना चाहिए?",
                "en_q": "How should we behave with animals?",
                "hi_a": "दयालुता से",
                "en_a": "With kindness"
            },
            {
                "id": 84,
                "hi_q": "हमें प्रकृति से क्या सीखना चाहिए?",
                "en_q": "What should we learn from nature?",
                "hi_a": "संतुलन और सुंदरता",
                "en_a": "Balance and beauty"
            },
            {
                "id": 85,
                "hi_q": "सुबह जल्दी उठना क्यों अच्छा है?",
                "en_q": "Why is waking up early good?",
                "hi_a": "दिन की अच्छी शुरुआत के लिए",
                "en_a": "For a good start to the day"
            },
            {
                "id": 86,
                "hi_q": "हमें रोज व्यायाम क्यों करना चाहिए?",
                "en_q": "Why should we exercise daily?",
                "hi_a": "स्वस्थ रहने के लिए",
                "en_a": "To stay fit"
            },
            {
                "id": 87,
                "hi_q": "साफ-सफाई क्यों जरूरी है?",
                "en_q": "Why is cleanliness important?",
                "hi_a": "बीमारियों से बचने के लिए",
                "en_a": "To avoid diseases"
            },
            {
                "id": 88,
                "hi_q": "हमें मिलजुलकर क्यों रहना चाहिए?",
                "en_q": "Why should we live together happily?",
                "hi_a": "शांति और खुशी के लिए",
                "en_a": "For peace and happiness"
            },
            {
                "id": 89,
                "hi_q": "समय पर काम करना क्यों जरूरी है?",
                "en_q": "Why is it important to do work on time?",
                "hi_a": "सफलता के लिए",
                "en_a": "For success"
            },
            {
                "id": 90,
                "hi_q": "सपने देखना क्यों जरूरी है?",
                "en_q": "Why is it important to have dreams?",
                "hi_a": "जीवन में आगे बढ़ने के लिए",
                "en_a": "To move forward in life"
            }
        ],
        "set_3": [
            {
                "id": 1,
                "hi_q": "हमारे शरीर का सबसे बड़ा अंग कौन सा है?",
                "en_q": "What is the largest organ in the human body?",
                "hi_a": "त्वचा",
                "en_a": "Skin"
            },
            {
                "id": 2,
                "hi_q": "दिल क्या करता है?",
                "en_q": "What does the heart do?",
                "hi_a": "खून पंप करता है",
                "en_a": "Pumps blood"
            },
            {
                "id": 3,
                "hi_q": "हम किस गैस से सांस लेते हैं?",
                "en_q": "Which gas do we breathe in?",
                "hi_a": "ऑक्सीजन",
                "en_a": "Oxygen"
            },
            {
                "id": 4,
                "hi_q": "पौधे किस गैस को लेते हैं?",
                "en_q": "Which gas do plants take in?",
                "hi_a": "कार्बन डाइऑक्साइड",
                "en_a": "Carbon dioxide"
            },
            {
                "id": 5,
                "hi_q": "सूरज कब डूबता है?",
                "en_q": "When does the Sun set?",
                "hi_a": "शाम को",
                "en_a": "In the evening"
            },
            {
                "id": 6,
                "hi_q": "सुबह का समय किसके लिए अच्छा होता है?",
                "en_q": "Morning time is good for what?",
                "hi_a": "पढ़ाई और व्यायाम",
                "en_a": "Study and exercise"
            },
            {
                "id": 7,
                "hi_q": "कंप्यूटर में जानकारी कहाँ सेव होती है?",
                "en_q": "Where is information stored in a computer?",
                "hi_a": "मेमोरी में",
                "en_a": "In memory"
            },
            {
                "id": 8,
                "hi_q": "कीबोर्ड किस काम आता है?",
                "en_q": "What is a keyboard used for?",
                "hi_a": "टाइप करने के लिए",
                "en_a": "For typing"
            },
            {
                "id": 9,
                "hi_q": "माउस किस काम आता है?",
                "en_q": "What is a mouse used for?",
                "hi_a": "स्क्रीन पर चीज़ें चुनने के लिए",
                "en_a": "To select items on screen"
            },
            {
                "id": 10,
                "hi_q": "पृथ्वी अपने अक्ष पर क्या करती है?",
                "en_q": "What does the Earth do on its axis?",
                "hi_a": "घूमती है",
                "en_a": "Rotates"
            },
            {
                "id": 11,
                "hi_q": "पृथ्वी के घूमने से क्या होता है?",
                "en_q": "What happens because of Earth’s rotation?",
                "hi_a": "दिन और रात",
                "en_a": "Day and night"
            },
            {
                "id": 12,
                "hi_q": "वर्ष में कितने महीने होते हैं?",
                "en_q": "How many months are there in a year?",
                "hi_a": "12",
                "en_a": "12"
            },
            {
                "id": 13,
                "hi_q": "फरवरी में सामान्यतः कितने दिन होते हैं?",
                "en_q": "How many days are there in February usually?",
                "hi_a": "28",
                "en_a": "28"
            },
            {
                "id": 14,
                "hi_q": "लीप वर्ष में फरवरी में कितने दिन होते हैं?",
                "en_q": "How many days are there in February in a leap year?",
                "hi_a": "29",
                "en_a": "29"
            },
            {
                "id": 15,
                "hi_q": "सप्ताह का पहला दिन कौन सा माना जाता है?",
                "en_q": "Which is considered the first day of the week?",
                "hi_a": "सोमवार",
                "en_a": "Monday"
            },
            {
                "id": 16,
                "hi_q": "भारत का ध्वज किसने डिजाइन किया था?",
                "en_q": "Who designed the Indian national flag?",
                "hi_a": "पिंगली वेंकैया",
                "en_a": "Pingali Venkayya"
            },
            {
                "id": 17,
                "hi_q": "अशोक चक्र में कितनी तीलियाँ होती हैं?",
                "en_q": "How many spokes are there in the Ashoka Chakra?",
                "hi_a": "24",
                "en_a": "24"
            },
            {
                "id": 18,
                "hi_q": "स्कूल में पढ़ाई कहाँ होती है?",
                "en_q": "Where does study take place in a school?",
                "hi_a": "कक्षा में",
                "en_a": "In the classroom"
            },
            {
                "id": 19,
                "hi_q": "पुस्तकालय में क्या रखा होता है?",
                "en_q": "What is kept in a library?",
                "hi_a": "किताबें",
                "en_a": "Books"
            },
            {
                "id": 20,
                "hi_q": "अस्पताल में कौन काम करता है?",
                "en_q": "Who works in a hospital?",
                "hi_a": "डॉक्टर और नर्स",
                "en_a": "Doctors and nurses"
            },
            {
                "id": 21,
                "hi_q": "आग बुझाने के लिए किसका उपयोग होता है?",
                "en_q": "What is used to put out fire?",
                "hi_a": "अग्निशामक यंत्र",
                "en_a": "Fire extinguisher"
            },
            {
                "id": 22,
                "hi_q": "सूरज हमें कौन सा विटामिन देता है?",
                "en_q": "Which vitamin do we get from sunlight?",
                "hi_a": "विटामिन D",
                "en_a": "Vitamin D"
            },
            {
                "id": 23,
                "hi_q": "हड्डियों को मजबूत बनाने के लिए क्या जरूरी है?",
                "en_q": "What is important for strong bones?",
                "hi_a": "कैल्शियम",
                "en_a": "Calcium"
            },
            {
                "id": 24,
                "hi_q": "आँखों से हम क्या करते हैं?",
                "en_q": "What do we do with our eyes?",
                "hi_a": "देखते हैं",
                "en_a": "See"
            },
            {
                "id": 25,
                "hi_q": "कानों से हम क्या करते हैं?",
                "en_q": "What do we do with our ears?",
                "hi_a": "सुनते हैं",
                "en_a": "Hear"
            },
            {
                "id": 26,
                "hi_q": "जीभ से हम क्या करते हैं?",
                "en_q": "What do we do with our tongue?",
                "hi_a": "स्वाद लेते हैं",
                "en_a": "Taste"
            },
            {
                "id": 27,
                "hi_q": "नाक से हम क्या करते हैं?",
                "en_q": "What do we do with our nose?",
                "hi_a": "सूंघते हैं",
                "en_a": "Smell"
            },
            {
                "id": 28,
                "hi_q": "हाथों से हम क्या करते हैं?",
                "en_q": "What do we do with our hands?",
                "hi_a": "काम करते हैं",
                "en_a": "Work"
            },
            {
                "id": 29,
                "hi_q": "पैरों से हम क्या करते हैं?",
                "en_q": "What do we do with our legs?",
                "hi_a": "चलते हैं",
                "en_a": "Walk"
            },
            {
                "id": 30,
                "hi_q": "स्वस्थ रहने के लिए हमें क्या खाना चाहिए?",
                "en_q": "What should we eat to stay healthy?",
                "hi_a": "संतुलित आहार",
                "en_a": "Balanced diet"
            },
            {
                "id": 31,
                "hi_q": "दूध में कौन सा पोषक तत्व अधिक होता है?",
                "en_q": "Which nutrient is rich in milk?",
                "hi_a": "कैल्शियम",
                "en_a": "Calcium"
            },
            {
                "id": 32,
                "hi_q": "गाजर खाने से कौन सा अंग मजबूत होता है?",
                "en_q": "Eating carrots is good for which organ?",
                "hi_a": "आँखें",
                "en_a": "Eyes"
            },
            {
                "id": 33,
                "hi_q": "पृथ्वी पर जीवन के लिए सबसे जरूरी चीज क्या है?",
                "en_q": "What is most necessary for life on Earth?",
                "hi_a": "पानी",
                "en_a": "Water"
            },
            {
                "id": 34,
                "hi_q": "हवा में सबसे ज्यादा कौन सी गैस होती है?",
                "en_q": "Which gas is most abundant in the air?",
                "hi_a": "नाइट्रोजन",
                "en_a": "Nitrogen"
            },
            {
                "id": 35,
                "hi_q": "बिजली कड़कने के साथ क्या दिखाई देता है?",
                "en_q": "What do we see with thunder?",
                "hi_a": "चमक (बिजली की)",
                "en_a": "Lightning"
            },
            {
                "id": 36,
                "hi_q": "इंद्रधनुष में पहला रंग कौन सा होता है?",
                "en_q": "What is the first color in a rainbow?",
                "hi_a": "लाल",
                "en_a": "Red"
            },
            {
                "id": 37,
                "hi_q": "इंद्रधनुष में आखिरी रंग कौन सा होता है?",
                "en_q": "What is the last color in a rainbow?",
                "hi_a": "बैंगनी",
                "en_a": "Violet"
            },
            {
                "id": 38,
                "hi_q": "चींटी किस समूह में आती है?",
                "en_q": "Ant belongs to which group?",
                "hi_a": "कीट",
                "en_a": "Insect"
            },
            {
                "id": 39,
                "hi_q": "मकड़ी के कितने पैर होते हैं?",
                "en_q": "How many legs does a spider have?",
                "hi_a": "आठ",
                "en_a": "Eight"
            },
            {
                "id": 40,
                "hi_q": "तितली पहले किस रूप में होती है?",
                "en_q": "What is a butterfly before it becomes a butterfly?",
                "hi_a": "इल्ली (कैटरपिलर)",
                "en_a": "Caterpillar"
            },
            {
                "id": 41,
                "hi_q": "कछुआ कहाँ रहता है?",
                "en_q": "Where does a turtle live?",
                "hi_a": "पानी और जमीन दोनों पर",
                "en_a": "Both in water and on land"
            },
            {
                "id": 42,
                "hi_q": "साँप के पैर होते हैं क्या?",
                "en_q": "Do snakes have legs?",
                "hi_a": "नहीं",
                "en_a": "No"
            },
            {
                "id": 43,
                "hi_q": "शेर किस प्रकार का जानवर है?",
                "en_q": "What type of animal is a lion?",
                "hi_a": "मांसाहारी",
                "en_a": "Carnivore"
            },
            {
                "id": 44,
                "hi_q": "गाय किस प्रकार का जानवर है?",
                "en_q": "What type of animal is a cow?",
                "hi_a": "शाकाहारी",
                "en_a": "Herbivore"
            },
            {
                "id": 45,
                "hi_q": "भालू क्या खाता है?",
                "en_q": "What does a bear eat?",
                "hi_a": "मांस और फल दोनों",
                "en_a": "Both meat and fruits"
            },
            {
                "id": 46,
                "hi_q": "पक्षियों का घर क्या कहलाता है?",
                "en_q": "What is a bird’s home called?",
                "hi_a": "घोंसला",
                "en_a": "Nest"
            },
            {
                "id": 47,
                "hi_q": "मधुमक्खी का घर क्या कहलाता है?",
                "en_q": "What is a bee’s home called?",
                "hi_a": "छत्ता",
                "en_a": "Hive"
            },
            {
                "id": 48,
                "hi_q": "गाय कहाँ रहती है?",
                "en_q": "Where does a cow live?",
                "hi_a": "गौशाला या खेत में",
                "en_a": "In a cowshed or farm"
            },
            {
                "id": 49,
                "hi_q": "ऊँट को किस नाम से जाना जाता है?",
                "en_q": "What is the camel known as?",
                "hi_a": "रेगिस्तान का जहाज",
                "en_a": "Ship of the desert"
            },
            {
                "id": 50,
                "hi_q": "ध्रुवीय भालू कहाँ रहता है?",
                "en_q": "Where does a polar bear live?",
                "hi_a": "बर्फीले क्षेत्रों में",
                "en_a": "In icy regions"
            },
            {
                "id": 51,
                "hi_q": "स्कूल जाने के लिए हम क्या पहनते हैं?",
                "en_q": "What do we wear to go to school?",
                "hi_a": "यूनिफॉर्म",
                "en_a": "Uniform"
            },
            {
                "id": 52,
                "hi_q": "छुट्टी के दिन को क्या कहते हैं?",
                "en_q": "What do we call a day off from school?",
                "hi_a": "अवकाश",
                "en_a": "Holiday"
            },
            {
                "id": 53,
                "hi_q": "स्कूल में घंटी किसलिए बजती है?",
                "en_q": "Why does the school bell ring?",
                "hi_a": "पीरियड बदलने के लिए",
                "en_a": "To change periods"
            },
            {
                "id": 54,
                "hi_q": "परीक्षा किसलिए होती है?",
                "en_q": "Why are exams conducted?",
                "hi_a": "ज्ञान जांचने के लिए",
                "en_a": "To test knowledge"
            },
            {
                "id": 55,
                "hi_q": "हमें होमवर्क क्यों करना चाहिए?",
                "en_q": "Why should we do homework?",
                "hi_a": "अभ्यास के लिए",
                "en_a": "For practice"
            },
            {
                "id": 56,
                "hi_q": "सुबह का नाश्ता क्यों जरूरी है?",
                "en_q": "Why is breakfast important?",
                "hi_a": "ऊर्जा देने के लिए",
                "en_a": "To give energy"
            },
            {
                "id": 57,
                "hi_q": "पानी पीने से क्या फायदा होता है?",
                "en_q": "What is the benefit of drinking water?",
                "hi_a": "शरीर स्वस्थ रहता है",
                "en_a": "Keeps the body healthy"
            },
            {
                "id": 58,
                "hi_q": "साफ कपड़े पहनने से क्या होता है?",
                "en_q": "What happens when we wear clean clothes?",
                "hi_a": "हम स्वस्थ और अच्छे लगते हैं",
                "en_a": "We stay healthy and look neat"
            },
            {
                "id": 59,
                "hi_q": "कूड़ा जलाने से क्या नुकसान होता है?",
                "en_q": "What harm is caused by burning garbage?",
                "hi_a": "हवा प्रदूषित होती है",
                "en_a": "Air gets polluted"
            },
            {
                "id": 60,
                "hi_q": "प्लास्टिक का कम उपयोग क्यों करना चाहिए?",
                "en_q": "Why should we use less plastic?",
                "hi_a": "पर्यावरण बचाने के लिए",
                "en_a": "To protect the environment"
            },
            {
                "id": 61,
                "hi_q": "पेड़ों से हमें क्या मिलता है?",
                "en_q": "What do we get from trees?",
                "hi_a": "फल, लकड़ी और ऑक्सीजन",
                "en_a": "Fruits, wood and oxygen"
            },
            {
                "id": 62,
                "hi_q": "वर्षा जल को जमा करने को क्या कहते हैं?",
                "en_q": "What is collecting rainwater called?",
                "hi_a": "वर्षा जल संचयन",
                "en_a": "Rainwater harvesting"
            },
            {
                "id": 63,
                "hi_q": "हमें जानवरों को क्यों नहीं सताना चाहिए?",
                "en_q": "Why should we not hurt animals?",
                "hi_a": "वे भी जीवित प्राणी हैं",
                "en_a": "They are living beings too"
            },
            {
                "id": 64,
                "hi_q": "मिल बाँटकर खाने से क्या सीख मिलती है?",
                "en_q": "What do we learn by sharing food?",
                "hi_a": "सहयोग और प्रेम",
                "en_a": "Cooperation and love"
            },
            {
                "id": 65,
                "hi_q": "समय की पाबंदी क्यों जरूरी है?",
                "en_q": "Why is punctuality important?",
                "hi_a": "अनुशासन के लिए",
                "en_a": "For discipline"
            },
            {
                "id": 66,
                "hi_q": "हमें रोज नहाना क्यों चाहिए?",
                "en_q": "Why should we bathe daily?",
                "hi_a": "साफ और स्वस्थ रहने के लिए",
                "en_a": "To stay clean and healthy"
            },
            {
                "id": 67,
                "hi_q": "नाखून क्यों काटने चाहिए?",
                "en_q": "Why should we trim our nails?",
                "hi_a": "गंदगी और कीटाणु हटाने के लिए",
                "en_a": "To remove dirt and germs"
            },
            {
                "id": 68,
                "hi_q": "जोर से चिल्लाना क्यों गलत है?",
                "en_q": "Why is shouting loudly bad?",
                "hi_a": "दूसरों को परेशानी होती है",
                "en_a": "It disturbs others"
            },
            {
                "id": 69,
                "hi_q": "लाइन में खड़े होने से क्या सीखते हैं?",
                "en_q": "What do we learn by standing in a queue?",
                "hi_a": "धैर्य और अनुशासन",
                "en_a": "Patience and discipline"
            },
            {
                "id": 70,
                "hi_q": "ट्रैफिक नियमों का पालन क्यों जरूरी है?",
                "en_q": "Why is it important to follow traffic rules?",
                "hi_a": "सुरक्षा के लिए",
                "en_a": "For safety"
            },
            {
                "id": 71,
                "hi_q": "सीट बेल्ट क्यों लगानी चाहिए?",
                "en_q": "Why should we wear a seat belt?",
                "hi_a": "दुर्घटना से बचाव के लिए",
                "en_a": "For protection in accidents"
            },
            {
                "id": 72,
                "hi_q": "हेलमेट क्यों पहनना चाहिए?",
                "en_q": "Why should we wear a helmet?",
                "hi_a": "सिर की सुरक्षा के लिए",
                "en_a": "To protect the head"
            },
            {
                "id": 73,
                "hi_q": "खेलकूद से क्या फायदा होता है?",
                "en_q": "What is the benefit of sports?",
                "hi_a": "शरीर मजबूत होता है",
                "en_a": "Makes the body strong"
            },
            {
                "id": 74,
                "hi_q": "योग करने से क्या फायदा है?",
                "en_q": "What is the benefit of doing yoga?",
                "hi_a": "शरीर और मन स्वस्थ रहता है",
                "en_a": "Keeps body and mind healthy"
            },
            {
                "id": 75,
                "hi_q": "ध्यान (मेडिटेशन) से क्या होता है?",
                "en_q": "What happens when we meditate?",
                "hi_a": "मन शांत होता है",
                "en_a": "Mind becomes calm"
            },
            {
                "id": 76,
                "hi_q": "पढ़ते समय सही रोशनी क्यों जरूरी है?",
                "en_q": "Why is proper light important while studying?",
                "hi_a": "आँखों की सुरक्षा के लिए",
                "en_a": "To protect eyes"
            },
            {
                "id": 77,
                "hi_q": "ज्यादा टीवी देखने से क्या नुकसान है?",
                "en_q": "What is a harm of watching too much TV?",
                "hi_a": "आँखें कमजोर हो सकती हैं",
                "en_a": "Eyes can become weak"
            },
            {
                "id": 78,
                "hi_q": "मोबाइल का अधिक उपयोग क्यों गलत है?",
                "en_q": "Why is excessive mobile use bad?",
                "hi_a": "स्वास्थ्य पर बुरा असर पड़ता है",
                "en_a": "It affects health"
            },
            {
                "id": 79,
                "hi_q": "हमें जल्दी सोना क्यों चाहिए?",
                "en_q": "Why should we sleep early?",
                "hi_a": "शरीर को आराम देने के लिए",
                "en_a": "To give rest to the body"
            },
            {
                "id": 80,
                "hi_q": "अच्छी नींद क्यों जरूरी है?",
                "en_q": "Why is good sleep important?",
                "hi_a": "दिमाग और शरीर के लिए",
                "en_a": "For brain and body"
            },
            {
                "id": 81,
                "hi_q": "सूरजमुखी का फूल किस दिशा की ओर घूमता है?",
                "en_q": "Sunflower turns towards which direction?",
                "hi_a": "सूरज की ओर",
                "en_a": "Towards the Sun"
            },
            {
                "id": 82,
                "hi_q": "कमल का फूल कहाँ खिलता है?",
                "en_q": "Where does a lotus flower bloom?",
                "hi_a": "पानी में",
                "en_a": "In water"
            },
            {
                "id": 83,
                "hi_q": "पेड़ की जड़ किस काम आती है?",
                "en_q": "What is the function of roots in a plant?",
                "hi_a": "पौधे को पकड़कर रखने और पानी लेने के लिए",
                "en_a": "To hold the plant and absorb water"
            },
            {
                "id": 84,
                "hi_q": "तना किस काम आता है?",
                "en_q": "What is the function of the stem?",
                "hi_a": "पौधे को सीधा रखने के लिए",
                "en_a": "To keep the plant upright"
            },
            {
                "id": 85,
                "hi_q": "पत्तियाँ क्या बनाती हैं?",
                "en_q": "What do leaves make?",
                "hi_a": "भोजन",
                "en_a": "Food"
            },
            {
                "id": 86,
                "hi_q": "फूल से क्या बनता है?",
                "en_q": "What develops from a flower?",
                "hi_a": "फल",
                "en_a": "Fruit"
            },
            {
                "id": 87,
                "hi_q": "बीज से क्या उगता है?",
                "en_q": "What grows from a seed?",
                "hi_a": "नया पौधा",
                "en_a": "A new plant"
            },
            {
                "id": 88,
                "hi_q": "किसान खेत में क्या बोता है?",
                "en_q": "What does a farmer sow in the field?",
                "hi_a": "बीज",
                "en_a": "Seeds"
            },
            {
                "id": 89,
                "hi_q": "फसल काटने को क्या कहते हैं?",
                "en_q": "What is harvesting crops called?",
                "hi_a": "कटाई",
                "en_a": "Harvesting"
            },
            {
                "id": 90,
                "hi_q": "हमें भोजन क्यों करना चाहिए?",
                "en_q": "Why do we need to eat food?",
                "hi_a": "ऊर्जा पाने के लिए",
                "en_a": "To get energy"
            },
            {
                "id": 91,
                "hi_q": "हमें रोज पानी क्यों पीना चाहिए?",
                "en_q": "Why should we drink water daily?",
                "hi_a": "शरीर को ठीक रखने के लिए",
                "en_a": "To keep the body functioning well"
            },
            {
                "id": 92,
                "hi_q": "हँसने से क्या फायदा है?",
                "en_q": "What is a benefit of laughing?",
                "hi_a": "तनाव कम होता है",
                "en_a": "Reduces stress"
            },
            {
                "id": 93,
                "hi_q": "अच्छे दोस्त की क्या पहचान है?",
                "en_q": "What is a sign of a good friend?",
                "hi_a": "जो मदद करे",
                "en_a": "One who helps"
            },
            {
                "id": 94,
                "hi_q": "हमें झगड़ा क्यों नहीं करना चाहिए?",
                "en_q": "Why should we not fight?",
                "hi_a": "शांति बनाए रखने के लिए",
                "en_a": "To maintain peace"
            },
            {
                "id": 95,
                "hi_q": "माफ करना क्यों अच्छा है?",
                "en_q": "Why is forgiving good?",
                "hi_a": "मन हल्का रहता है",
                "en_a": "It keeps the heart light"
            },
            {
                "id": 96,
                "hi_q": "धन्यवाद कहना क्यों जरूरी है?",
                "en_q": "Why is saying thank you important?",
                "hi_a": "कृतज्ञता दिखाने के लिए",
                "en_a": "To show gratitude"
            },
            {
                "id": 97,
                "hi_q": "कृपया शब्द का उपयोग कब करते हैं?",
                "en_q": "When do we use the word “please”?",
                "hi_a": "विनम्रता से कुछ मांगते समय",
                "en_a": "When asking politely"
            },
            {
                "id": 98,
                "hi_q": "हमें प्रकृति से प्यार क्यों करना चाहिए?",
                "en_q": "Why should we love nature?",
                "hi_a": "जीवन के लिए जरूरी है",
                "en_a": "It is essential for life"
            },
            {
                "id": 99,
                "hi_q": "पेड़ काटने से क्या नुकसान है?",
                "en_q": "What is a harm of cutting trees?",
                "hi_a": "पर्यावरण को नुकसान",
                "en_a": "Environmental damage"
            },
            {
                "id": 100,
                "hi_q": "हमें पृथ्वी की रक्षा क्यों करनी चाहिए?",
                "en_q": "Why should we protect the Earth?",
                "hi_a": "क्योंकि यही हमारा घर है",
                "en_a": "Because it is our home"
            }
        ]
    },
    "topics": {
        "traffic_rules": [
            {
                "id": 1,
                "hi_q": "सड़क पर चलने के नियमों को क्या कहते हैं?",
                "en_q": "What do we call the rules followed on the road?",
                "hi_a": "यातायात नियम",
                "en_a": "Traffic rules"
            },
            {
                "id": 2,
                "hi_q": "लाल ट्रैफिक लाइट का क्या मतलब है?",
                "en_q": "What does a red traffic light mean?",
                "hi_a": "रुकना",
                "en_a": "Stop"
            },
            {
                "id": 3,
                "hi_q": "हरी ट्रैफिक लाइट का क्या मतलब है?",
                "en_q": "What does a green traffic light mean?",
                "hi_a": "चलना",
                "en_a": "Go"
            },
            {
                "id": 4,
                "hi_q": "पीली ट्रैफिक लाइट का क्या मतलब है?",
                "en_q": "What does a yellow traffic light mean?",
                "hi_a": "तैयार रहना",
                "en_a": "Get ready / Slow down"
            },
            {
                "id": 5,
                "hi_q": "सड़क पार करने से पहले हमें क्या करना चाहिए?",
                "en_q": "What should we do before crossing the road?",
                "hi_a": "दाएं-बाएं देखकर चलना",
                "en_a": "Look left and right"
            },
            {
                "id": 6,
                "hi_q": "ज़ेब्रा क्रॉसिंग किसलिए होती है?",
                "en_q": "What is a zebra crossing used for?",
                "hi_a": "पैदल चलने वालों के सड़क पार करने के लिए",
                "en_a": "For pedestrians to cross the road"
            },
            {
                "id": 7,
                "hi_q": "बाइक चलाते समय क्या पहनना जरूरी है?",
                "en_q": "What should we wear while riding a bike?",
                "hi_a": "हेलमेट",
                "en_a": "Helmet"
            },
            {
                "id": 8,
                "hi_q": "कार में बैठते समय क्या लगाना चाहिए?",
                "en_q": "What should we wear while sitting in a car?",
                "hi_a": "सीट बेल्ट",
                "en_a": "Seat belt"
            },
            {
                "id": 9,
                "hi_q": "फुटपाथ किसके लिए बना होता है?",
                "en_q": "Who is the footpath made for?",
                "hi_a": "पैदल चलने वालों के लिए",
                "en_a": "For pedestrians"
            },
            {
                "id": 10,
                "hi_q": "सड़क पर खेलना क्यों खतरनाक है?",
                "en_q": "Why is it dangerous to play on the road?",
                "hi_a": "दुर्घटना हो सकती है",
                "en_a": "It can cause accidents"
            },
            {
                "id": 11,
                "hi_q": "ट्रैफिक पुलिस का काम क्या है?",
                "en_q": "What is the job of traffic police?",
                "hi_a": "यातायात को नियंत्रित करना",
                "en_a": "To control traffic"
            },
            {
                "id": 12,
                "hi_q": "बस स्टॉप पर हमें कहाँ खड़ा होना चाहिए?",
                "en_q": "Where should we stand at a bus stop?",
                "hi_a": "लाइन में",
                "en_a": "In a queue"
            },
            {
                "id": 13,
                "hi_q": "सड़क पार करते समय मोबाइल का उपयोग करना चाहिए क्या?",
                "en_q": "Should we use a mobile phone while crossing the road?",
                "hi_a": "नहीं",
                "en_a": "No"
            },
            {
                "id": 14,
                "hi_q": "ओवरस्पीडिंग क्यों खतरनाक है?",
                "en_q": "Why is overspeeding dangerous?",
                "hi_a": "दुर्घटना का खतरा बढ़ता है",
                "en_a": "It increases the risk of accidents"
            },
            {
                "id": 15,
                "hi_q": "हॉर्न कब बजाना चाहिए?",
                "en_q": "When should we use the horn?",
                "hi_a": "जरूरत पड़ने पर",
                "en_a": "Only when necessary"
            },
            {
                "id": 16,
                "hi_q": "एंबुलेंस को रास्ता क्यों देना चाहिए?",
                "en_q": "Why should we give way to an ambulance?",
                "hi_a": "क्योंकि उसमें मरीज होता है",
                "en_a": "Because it carries patients"
            },
            {
                "id": 17,
                "hi_q": "स्कूल बस के पास वाहन क्यों धीमा करना चाहिए?",
                "en_q": "Why should vehicles slow down near a school bus?",
                "hi_a": "बच्चों की सुरक्षा के लिए",
                "en_a": "For children’s safety"
            },
            {
                "id": 18,
                "hi_q": "सड़क के किस तरफ चलना चाहिए?",
                "en_q": "On which side of the road should we walk (in India)?",
                "hi_a": "बाईं तरफ",
                "en_a": "Left side"
            },
            {
                "id": 19,
                "hi_q": "ट्रैफिक संकेत (Signs) किसलिए होते हैं?",
                "en_q": "What are traffic signs used for?",
                "hi_a": "दिशा और नियम बताने के लिए",
                "en_a": "To give directions and rules"
            },
            {
                "id": 20,
                "hi_q": "\"नो पार्किंग\" का क्या मतलब है?",
                "en_q": "What does “No Parking” mean?",
                "hi_a": "यहाँ गाड़ी खड़ी नहीं करनी",
                "en_a": "Do not park here"
            },
            {
                "id": 21,
                "hi_q": "\"स्कूल अहेड\" संकेत का क्या मतलब है?",
                "en_q": "What does the “School Ahead” sign mean?",
                "hi_a": "आगे स्कूल है, सावधानी से चलें",
                "en_a": "School ahead, drive carefully"
            },
            {
                "id": 22,
                "hi_q": "पैदल यात्री को अंग्रेज़ी में क्या कहते हैं?",
                "en_q": "What do we call a person walking on the road?",
                "hi_a": "पैदल यात्री",
                "en_a": "Pedestrian"
            },
            {
                "id": 23,
                "hi_q": "साइकिल चलाते समय हमें कहाँ चलना चाहिए?",
                "en_q": "Where should we ride a bicycle?",
                "hi_a": "साइकिल लेन या सड़क के किनारे",
                "en_a": "In the cycle lane or side of the road"
            },
            {
                "id": 24,
                "hi_q": "सड़क सुरक्षा का मुख्य उद्देश्य क्या है?",
                "en_q": "What is the main aim of road safety?",
                "hi_a": "दुर्घटनाओं से बचाव",
                "en_a": "To prevent accidents"
            },
            {
                "id": 25,
                "hi_q": "ट्रैफिक नियमों का पालन क्यों जरूरी है?",
                "en_q": "Why is it important to follow traffic rules?",
                "hi_a": "अपनी और दूसरों की सुरक्षा के लिए",
                "en_a": "For our safety and others’ safety"
            }
        ],
        "solar_system": [
            {
                "id": 1,
                "hi_q": "सौर मंडल क्या है?",
                "en_q": "What is the Solar System?",
                "hi_a": "सूर्य और उसके चारों ओर घूमने वाले ग्रहों का समूह",
                "en_a": "The Sun and the group of planets that revolve around it"
            },
            {
                "id": 2,
                "hi_q": "सौर मंडल का केंद्र कौन है?",
                "en_q": "Who is at the center of the Solar System?",
                "hi_a": "सूर्य",
                "en_a": "The Sun"
            },
            {
                "id": 3,
                "hi_q": "सूर्य क्या है?",
                "en_q": "What is the Sun?",
                "hi_a": "एक तारा",
                "en_a": "A star"
            },
            {
                "id": 4,
                "hi_q": "सौर मंडल में कितने ग्रह हैं?",
                "en_q": "How many planets are there in the Solar System?",
                "hi_a": "आठ",
                "en_a": "Eight"
            },
            {
                "id": 5,
                "hi_q": "सूर्य के सबसे पास कौन सा ग्रह है?",
                "en_q": "Which planet is closest to the Sun?",
                "hi_a": "बुध",
                "en_a": "Mercury"
            },
            {
                "id": 6,
                "hi_q": "सौर मंडल का सबसे बड़ा ग्रह कौन सा है?",
                "en_q": "Which is the largest planet in the Solar System?",
                "hi_a": "बृहस्पति",
                "en_a": "Jupiter"
            },
            {
                "id": 7,
                "hi_q": "लाल ग्रह किसे कहा जाता है?",
                "en_q": "Which planet is known as the Red Planet?",
                "hi_a": "मंगल",
                "en_a": "Mars"
            },
            {
                "id": 8,
                "hi_q": "पृथ्वी किस नंबर का ग्रह है?",
                "en_q": "What number planet is Earth from the Sun?",
                "hi_a": "तीसरा",
                "en_a": "Third"
            },
            {
                "id": 9,
                "hi_q": "पृथ्वी का प्राकृतिक उपग्रह कौन है?",
                "en_q": "What is Earth’s natural satellite?",
                "hi_a": "चंद्रमा",
                "en_a": "The Moon"
            },
            {
                "id": 10,
                "hi_q": "चंद्रमा किसके चारों ओर घूमता है?",
                "en_q": "The Moon revolves around which planet?",
                "hi_a": "पृथ्वी",
                "en_a": "Earth"
            },
            {
                "id": 11,
                "hi_q": "पृथ्वी किसके चारों ओर घूमती है?",
                "en_q": "Earth revolves around what?",
                "hi_a": "सूर्य",
                "en_a": "The Sun"
            },
            {
                "id": 12,
                "hi_q": "पृथ्वी को सूर्य का एक चक्कर लगाने में कितना समय लगता है?",
                "en_q": "How long does Earth take to complete one orbit around the Sun?",
                "hi_a": "365 दिन (एक वर्ष)",
                "en_a": "365 days (one year)"
            },
            {
                "id": 13,
                "hi_q": "पृथ्वी अपने अक्ष पर घूमने से क्या होता है?",
                "en_q": "What happens because Earth rotates on its axis?",
                "hi_a": "दिन और रात",
                "en_a": "Day and night"
            },
            {
                "id": 14,
                "hi_q": "सबसे ठंडा ग्रह कौन सा माना जाता है?",
                "en_q": "Which planet is considered the coldest?",
                "hi_a": "यूरेनस",
                "en_a": "Uranus"
            },
            {
                "id": 15,
                "hi_q": "किस ग्रह के चारों ओर सुंदर छल्ले (rings) हैं?",
                "en_q": "Which planet has beautiful rings around it?",
                "hi_a": "शनि",
                "en_a": "Saturn"
            },
            {
                "id": 16,
                "hi_q": "सौर मंडल का सबसे गर्म ग्रह कौन सा है?",
                "en_q": "Which is the hottest planet in the Solar System?",
                "hi_a": "शुक्र",
                "en_a": "Venus"
            },
            {
                "id": 17,
                "hi_q": "किस ग्रह को सुबह और शाम का तारा भी कहते हैं?",
                "en_q": "Which planet is also called the Morning and Evening Star?",
                "hi_a": "शुक्र",
                "en_a": "Venus"
            },
            {
                "id": 18,
                "hi_q": "बृहस्पति किस प्रकार का ग्रह है?",
                "en_q": "What type of planet is Jupiter?",
                "hi_a": "गैस दानव (Gas Giant)",
                "en_a": "Gas giant"
            },
            {
                "id": 19,
                "hi_q": "सौर मंडल में सबसे छोटा ग्रह कौन सा है?",
                "en_q": "Which is the smallest planet in the Solar System?",
                "hi_a": "बुध",
                "en_a": "Mercury"
            },
            {
                "id": 20,
                "hi_q": "अंतरिक्ष में जाने वाले व्यक्ति को क्या कहते हैं?",
                "en_q": "What is a person who travels into space called?",
                "hi_a": "अंतरिक्ष यात्री",
                "en_a": "Astronaut"
            },
            {
                "id": 21,
                "hi_q": "उल्का पिंड क्या होते हैं?",
                "en_q": "What are meteoroids?",
                "hi_a": "अंतरिक्ष में घूमने वाले पत्थर या धातु के टुकड़े",
                "en_a": "Small rocks or metal pieces moving in space"
            },
            {
                "id": 22,
                "hi_q": "धूमकेतु किससे बने होते हैं?",
                "en_q": "What are comets made of?",
                "hi_a": "बर्फ, धूल और गैस",
                "en_a": "Ice, dust, and gas"
            },
            {
                "id": 23,
                "hi_q": "आकाशगंगा (Milky Way) क्या है?",
                "en_q": "What is the Milky Way?",
                "hi_a": "तारों का विशाल समूह",
                "en_a": "A huge group of stars"
            },
            {
                "id": 24,
                "hi_q": "ग्रह और तारे में क्या अंतर है?",
                "en_q": "What is the difference between a planet and a star?",
                "hi_a": "तारे अपनी रोशनी देते हैं, ग्रह नहीं",
                "en_a": "Stars produce their own light, planets do not"
            }
        ],
'human_body': [
        {
                "id": 1,
                "hi_q": "हमारे शरीर में खून कौन पंप करता है?",
                "en_q": "Which organ pumps blood in our body?",
                "hi_a": "हृदय",
                "en_a": "Heart"
        },
        {
                "id": 2,
                "hi_q": "हम किस अंग से सांस लेते हैं?",
                "en_q": "Which organ helps us breathe?",
                "hi_a": "फेफड़े",
                "en_a": "Lungs"
        },
        {
                "id": 3,
                "hi_q": "हम किस अंग से सोचते हैं?",
                "en_q": "Which organ helps us think?",
                "hi_a": "मस्तिष्क",
                "en_a": "Brain"
        },
        {
                "id": 4,
                "hi_q": "हम किस अंग से देखते हैं?",
                "en_q": "Which organ do we use to see?",
                "hi_a": "आँखें",
                "en_a": "Eyes"
        },
        {
                "id": 5,
                "hi_q": "हम किस अंग से सुनते हैं?",
                "en_q": "Which organ do we use to hear?",
                "hi_a": "कान",
                "en_a": "Ears"
        },
        {
                "id": 6,
                "hi_q": "हम किस अंग से स्वाद लेते हैं?",
                "en_q": "Which organ helps us taste?",
                "hi_a": "जीभ",
                "en_a": "Tongue"
        },
        {
                "id": 7,
                "hi_q": "हम किस अंग से सूंघते हैं?",
                "en_q": "Which organ helps us smell?",
                "hi_a": "नाक",
                "en_a": "Nose"
        },
        {
                "id": 8,
                "hi_q": "हमारे शरीर की सबसे कठोर चीज क्या है?",
                "en_q": "What is the hardest substance in our body?",
                "hi_a": "दाँत",
                "en_a": "Teeth"
        },
        {
                "id": 9,
                "hi_q": "एक वयस्क इंसान के कितने दाँत होते हैं?",
                "en_q": "How many teeth does an adult human have?",
                "hi_a": "32",
                "en_a": "32"
        },
        {
                "id": 10,
                "hi_q": "हमारे शरीर में कितनी हड्डियाँ होती हैं?",
                "en_q": "How many bones are there in the human body?",
                "hi_a": "206",
                "en_a": "206"
        },
        {
                "id": 11,
                "hi_q": "शरीर का सबसे बड़ा अंग कौन सा है?",
                "en_q": "What is the largest organ of the human body?",
                "hi_a": "त्वचा",
                "en_a": "Skin"
        },
        {
                "id": 12,
                "hi_q": "खून का रंग लाल क्यों होता है?",
                "en_q": "Why is blood red?",
                "hi_a": "हीमोग्लोबिन के कारण",
                "en_a": "Because of hemoglobin"
        },
        {
                "id": 13,
                "hi_q": "मांसपेशियाँ किस काम आती हैं?",
                "en_q": "What do muscles help us do?",
                "hi_a": "शरीर को हिलाने में",
                "en_a": "To move the body"
        },
        {
                "id": 14,
                "hi_q": "हड्डियाँ किस काम आती हैं?",
                "en_q": "What do bones do?",
                "hi_a": "शरीर को आकार और सहारा देती हैं",
                "en_a": "Give shape and support to the body"
        },
        {
                "id": 15,
                "hi_q": "हमारी उंगलियों में हड्डियाँ होती हैं क्या?",
                "en_q": "Do our fingers have bones?",
                "hi_a": "हाँ",
                "en_a": "Yes"
        },
        {
                "id": 16,
                "hi_q": "हमें रोज दाँत क्यों साफ करने चाहिए?",
                "en_q": "Why should we brush our teeth daily?",
                "hi_a": "दाँतों को साफ और स्वस्थ रखने के लिए",
                "en_a": "To keep teeth clean and healthy"
        },
        {
                "id": 17,
                "hi_q": "हमें रोज नहाना क्यों चाहिए?",
                "en_q": "Why should we bathe daily?",
                "hi_a": "शरीर को साफ रखने के लिए",
                "en_a": "To keep the body clean"
        },
        {
                "id": 18,
                "hi_q": "साफ हाथ क्यों जरूरी हैं?",
                "en_q": "Why are clean hands important?",
                "hi_a": "कीटाणुओं से बचने के लिए",
                "en_a": "To avoid germs"
        },
        {
                "id": 19,
                "hi_q": "स्वस्थ रहने के लिए हमें क्या खाना चाहिए?",
                "en_q": "What should we eat to stay healthy?",
                "hi_a": "संतुलित आहार",
                "en_a": "Balanced diet"
        },
        {
                "id": 20,
                "hi_q": "दूध पीने से कौन सा अंग मजबूत होता है?",
                "en_q": "Drinking milk makes which part strong?",
                "hi_a": "हड्डियाँ",
                "en_a": "Bones"
        },
        {
                "id": 21,
                "hi_q": "गाजर खाने से कौन सा अंग फायदा पाता है?",
                "en_q": "Eating carrots is good for which organ?",
                "hi_a": "आँखें",
                "en_a": "Eyes"
        },
        {
                "id": 22,
                "hi_q": "व्यायाम करने से क्या फायदा होता है?",
                "en_q": "What is the benefit of exercise?",
                "hi_a": "शरीर मजबूत और स्वस्थ रहता है",
                "en_a": "Body becomes strong and healthy"
        },
        {
                "id": 23,
                "hi_q": "हमें कितनी बार हाथ धोने चाहिए?",
                "en_q": "How many times should we wash our hands?",
                "hi_a": "खाने से पहले और शौच के बाद",
                "en_a": "Before eating and after using the toilet"
        },
        {
                "id": 24,
                "hi_q": "नींद क्यों जरूरी है?",
                "en_q": "Why is sleep important?",
                "hi_a": "शरीर और दिमाग को आराम देने के लिए",
                "en_a": "To give rest to body and brain"
        },
        {
                "id": 25,
                "hi_q": "हमारा दिल कहाँ स्थित होता है?",
                "en_q": "Where is the heart located in the body?",
                "hi_a": "छाती के अंदर",
                "en_a": "Inside the chest"
        }
],
    'weather': [
        {
                "id": 1,
                "hi_q": "मौसम क्या होता है?",
                "en_q": "What is weather?",
                "hi_a": "किसी स्थान की दिन-प्रतिदिन की हवा, तापमान और बारिश की स्थिति",
                "en_a": "The day-to-day condition of air, temperature, and rain at a place"
        },
        {
                "id": 2,
                "hi_q": "बारिश किससे होती है?",
                "en_q": "What causes rain?",
                "hi_a": "बादलों से",
                "en_a": "From clouds"
        },
        {
                "id": 3,
                "hi_q": "बादल किससे बने होते हैं?",
                "en_q": "What are clouds made of?",
                "hi_a": "पानी की बूंदों और बर्फ के कणों से",
                "en_a": "Tiny water droplets and ice particles"
        },
        {
                "id": 4,
                "hi_q": "गरज के साथ आसमान में चमक को क्या कहते हैं?",
                "en_q": "What do we call the bright flash in the sky during thunder?",
                "hi_a": "बिजली (तड़ित)",
                "en_a": "Lightning"
        },
        {
                "id": 5,
                "hi_q": "तेज हवा को क्या कहते हैं?",
                "en_q": "What is strong moving air called?",
                "hi_a": "तूफान",
                "en_a": "Storm"
        },
        {
                "id": 6,
                "hi_q": "बहुत ठंडा मौसम किस ऋतु में होता है?",
                "en_q": "In which season is the weather very cold?",
                "hi_a": "सर्दी (शीत ऋतु)",
                "en_a": "Winter"
        },
        {
                "id": 7,
                "hi_q": "बहुत गर्म मौसम किस ऋतु में होता है?",
                "en_q": "In which season is the weather very hot?",
                "hi_a": "गर्मी (ग्रीष्म ऋतु)",
                "en_a": "Summer"
        },
        {
                "id": 8,
                "hi_q": "फूल खिलने का मौसम कौन सा है?",
                "en_q": "Which season is known for blooming flowers?",
                "hi_a": "वसंत ऋतु",
                "en_a": "Spring season"
        },
        {
                "id": 9,
                "hi_q": "फसल काटने का मौसम कौन सा होता है?",
                "en_q": "Which season is known for harvesting crops?",
                "hi_a": "शरद ऋतु",
                "en_a": "Autumn"
        },
        {
                "id": 10,
                "hi_q": "इंद्रधनुष कब दिखाई देता है?",
                "en_q": "When can we see a rainbow?",
                "hi_a": "बारिश के बाद जब सूरज निकलता है",
                "en_a": "After rain when the sun shines"
        },
        {
                "id": 11,
                "hi_q": "थर्मामीटर किसे मापता है?",
                "en_q": "What does a thermometer measure?",
                "hi_a": "तापमान",
                "en_a": "Temperature"
        },
        {
                "id": 12,
                "hi_q": "बहुत तेज बारिश को क्या कहते हैं?",
                "en_q": "What do we call very heavy rain?",
                "hi_a": "मूसलाधार बारिश",
                "en_a": "Heavy rainfall"
        },
        {
                "id": 13,
                "hi_q": "बर्फ गिरने को क्या कहते हैं?",
                "en_q": "What is falling snow called?",
                "hi_a": "हिमपात",
                "en_a": "Snowfall"
        },
        {
                "id": 14,
                "hi_q": "ओले क्या होते हैं?",
                "en_q": "What are hailstones?",
                "hi_a": "बर्फ के छोटे-छोटे गोले",
                "en_a": "Small balls of ice"
        },
        {
                "id": 15,
                "hi_q": "मौसम की जानकारी देने वाले को क्या कहते हैं?",
                "en_q": "What do we call a person who studies weather?",
                "hi_a": "मौसम वैज्ञानिक",
                "en_a": "Meteorologist"
        },
        {
                "id": 16,
                "hi_q": "मौसम की भविष्यवाणी को क्या कहते हैं?",
                "en_q": "What is predicting the weather called?",
                "hi_a": "मौसम पूर्वानुमान",
                "en_a": "Weather forecast"
        },
        {
                "id": 17,
                "hi_q": "बहुत तेज हवा और बारिश वाले तूफान को क्या कहते हैं?",
                "en_q": "What is a storm with very strong winds and rain called?",
                "hi_a": "चक्रवात",
                "en_a": "Cyclone"
        },
        {
                "id": 18,
                "hi_q": "सूखा क्या होता है?",
                "en_q": "What is a drought?",
                "hi_a": "लंबे समय तक बारिश न होना",
                "en_a": "No rain for a long time"
        },
        {
                "id": 19,
                "hi_q": "कोहरा कब बनता है?",
                "en_q": "When does fog form?",
                "hi_a": "ठंडी हवा में जलवाष्प के कारण",
                "en_a": "When water vapor condenses in cold air"
        },
        {
                "id": 20,
                "hi_q": "धूप वाले दिन को क्या कहते हैं?",
                "en_q": "What do we call a day full of sunshine?",
                "hi_a": "धूप वाला दिन",
                "en_a": "Sunny day"
        },
        {
                "id": 21,
                "hi_q": "बादल छाए रहने वाले दिन को क्या कहते हैं?",
                "en_q": "What do we call a day full of clouds?",
                "hi_a": "बादलों वाला दिन",
                "en_a": "Cloudy day"
        },
        {
                "id": 22,
                "hi_q": "हवा किस दिशा से किस दिशा में चलती है?",
                "en_q": "In which direction does wind move?",
                "hi_a": "अधिक दबाव से कम दबाव की ओर",
                "en_a": "From high pressure to low pressure"
        },
        {
                "id": 23,
                "hi_q": "मानसून क्या होता है?",
                "en_q": "What is monsoon?",
                "hi_a": "मौसम की वह हवा जो बहुत बारिश लाती है",
                "en_a": "Seasonal winds that bring heavy rain"
        },
        {
                "id": 24,
                "hi_q": "भारत में मानसून कब आता है?",
                "en_q": "When does monsoon usually arrive in India?",
                "hi_a": "जून से सितंबर",
                "en_a": "June to September"
        },
        {
                "id": 25,
                "hi_q": "मौसम बदलने का मुख्य कारण क्या है?",
                "en_q": "What is the main reason for change in weather?",
                "hi_a": "सूर्य की गर्मी और हवा की चाल",
                "en_a": "Sun’s heat and movement of air"
        }
],
    'community_helpers': [
        {
                "id": 1,
                "hi_q": "डॉक्टर का काम क्या होता है?",
                "en_q": "What does a doctor do?",
                "hi_a": "बीमार लोगों का इलाज करता है",
                "en_a": "Treats sick people"
        },
        {
                "id": 2,
                "hi_q": "नर्स किसकी मदद करती है?",
                "en_q": "Who does a nurse help?",
                "hi_a": "डॉक्टर और मरीजों की",
                "en_a": "Doctors and patients"
        },
        {
                "id": 3,
                "hi_q": "शिक्षक क्या करते हैं?",
                "en_q": "What does a teacher do?",
                "hi_a": "बच्चों को पढ़ाते हैं",
                "en_a": "Teaches children"
        },
        {
                "id": 4,
                "hi_q": "पुलिस का काम क्या है?",
                "en_q": "What is the job of the police?",
                "hi_a": "कानून और व्यवस्था बनाए रखना",
                "en_a": "Maintain law and order"
        },
        {
                "id": 5,
                "hi_q": "फायरमैन (अग्निशामक) क्या करता है?",
                "en_q": "What does a firefighter do?",
                "hi_a": "आग बुझाता है",
                "en_a": "Puts out fires"
        },
        {
                "id": 6,
                "hi_q": "डाकिया क्या लाता है?",
                "en_q": "What does a postman deliver?",
                "hi_a": "चिट्ठियाँ और पार्सल",
                "en_a": "Letters and parcels"
        },
        {
                "id": 7,
                "hi_q": "किसान क्या उगाता है?",
                "en_q": "What does a farmer grow?",
                "hi_a": "अनाज, फल और सब्जियाँ",
                "en_a": "Grains, fruits, and vegetables"
        },
        {
                "id": 8,
                "hi_q": "चालक (ड्राइवर) क्या करता है?",
                "en_q": "What does a driver do?",
                "hi_a": "वाहन चलाता है",
                "en_a": "Drives vehicles"
        },
        {
                "id": 9,
                "hi_q": "सफाई कर्मचारी क्या काम करता है?",
                "en_q": "What does a sanitation worker do?",
                "hi_a": "सफाई रखता है",
                "en_a": "Keeps the surroundings clean"
        },
        {
                "id": 10,
                "hi_q": "सैनिक का काम क्या है?",
                "en_q": "What does a soldier do?",
                "hi_a": "देश की रक्षा करता है",
                "en_a": "Protects the country"
        },
        {
                "id": 11,
                "hi_q": "इंजीनियर क्या बनाता है?",
                "en_q": "What does an engineer build?",
                "hi_a": "मशीनें, पुल, इमारतें",
                "en_a": "Machines, bridges, buildings"
        },
        {
                "id": 12,
                "hi_q": "बढ़ई क्या बनाता है?",
                "en_q": "What does a carpenter make?",
                "hi_a": "लकड़ी का फर्नीचर",
                "en_a": "Wooden furniture"
        },
        {
                "id": 13,
                "hi_q": "दर्जी क्या करता है?",
                "en_q": "What does a tailor do?",
                "hi_a": "कपड़े सिलता है",
                "en_a": "Stitches clothes"
        },
        {
                "id": 14,
                "hi_q": "नाई क्या करता है?",
                "en_q": "What does a barber do?",
                "hi_a": "बाल काटता है",
                "en_a": "Cuts hair"
        },
        {
                "id": 15,
                "hi_q": "रसोइया क्या करता है?",
                "en_q": "What does a cook do?",
                "hi_a": "खाना बनाता है",
                "en_a": "Cooks food"
        },
        {
                "id": 16,
                "hi_q": "माली क्या करता है?",
                "en_q": "What does a gardener do?",
                "hi_a": "पौधे लगाता और उनकी देखभाल करता है",
                "en_a": "Plants and takes care of plants"
        },
        {
                "id": 17,
                "hi_q": "पायलट क्या उड़ाता है?",
                "en_q": "What does a pilot fly?",
                "hi_a": "हवाई जहाज",
                "en_a": "Airplane"
        },
        {
                "id": 18,
                "hi_q": "बस कंडक्टर क्या करता है?",
                "en_q": "What does a bus conductor do?",
                "hi_a": "टिकट देता है",
                "en_a": "Gives tickets"
        },
        {
                "id": 19,
                "hi_q": "दुकानदार क्या करता है?",
                "en_q": "What does a shopkeeper do?",
                "hi_a": "सामान बेचता है",
                "en_a": "Sells goods"
        },
        {
                "id": 20,
                "hi_q": "डॉक्टर कहाँ काम करता है?",
                "en_q": "Where does a doctor work?",
                "hi_a": "अस्पताल या क्लिनिक में",
                "en_a": "In a hospital or clinic"
        },
        {
                "id": 21,
                "hi_q": "शिक्षक कहाँ पढ़ाते हैं?",
                "en_q": "Where do teachers teach?",
                "hi_a": "स्कूल में",
                "en_a": "In a school"
        },
        {
                "id": 22,
                "hi_q": "पुलिस कहाँ काम करती है?",
                "en_q": "Where do police officers work?",
                "hi_a": "पुलिस स्टेशन में",
                "en_a": "At a police station"
        },
        {
                "id": 23,
                "hi_q": "फायर स्टेशन में कौन काम करता है?",
                "en_q": "Who works at a fire station?",
                "hi_a": "फायरमैन",
                "en_a": "Firefighters"
        },
        {
                "id": 24,
                "hi_q": "अस्पताल में मरीजों की देखभाल कौन करता है?",
                "en_q": "Who takes care of patients in a hospital?",
                "hi_a": "नर्स",
                "en_a": "Nurse"
        },
        {
                "id": 25,
                "hi_q": "हमें इन सामुदायिक सहायकों का सम्मान क्यों करना चाहिए?",
                "en_q": "Why should we respect community helpers?",
                "hi_a": "क्योंकि वे हमारी मदद करते हैं",
                "en_a": "Because they help us"
        }
],
    'school_life': [
        {
                "id": 1,
                "hi_q": "हम स्कूल क्यों जाते हैं?",
                "en_q": "Why do we go to school?",
                "hi_a": "पढ़ने और सीखने के लिए",
                "en_a": "To study and learn"
        },
        {
                "id": 2,
                "hi_q": "स्कूल में पढ़ाने वाले को क्या कहते हैं?",
                "en_q": "What do we call a person who teaches in school?",
                "hi_a": "शिक्षक / अध्यापक",
                "en_a": "Teacher"
        },
        {
                "id": 3,
                "hi_q": "स्कूल में पढ़ने वाले बच्चों को क्या कहते हैं?",
                "en_q": "What do we call children who study in school?",
                "hi_a": "विद्यार्थी / छात्र",
                "en_a": "Students"
        },
        {
                "id": 4,
                "hi_q": "स्कूल में पढ़ाई कहाँ होती है?",
                "en_q": "Where does learning take place in school?",
                "hi_a": "कक्षा में",
                "en_a": "In the classroom"
        },
        {
                "id": 5,
                "hi_q": "किताबों को रखने के लिए क्या उपयोग करते हैं?",
                "en_q": "What do we use to keep our books?",
                "hi_a": "स्कूल बैग",
                "en_a": "School bag"
        },
        {
                "id": 6,
                "hi_q": "लिखने के लिए हम क्या उपयोग करते हैं?",
                "en_q": "What do we use for writing?",
                "hi_a": "पेन या पेंसिल",
                "en_a": "Pen or pencil"
        },
        {
                "id": 7,
                "hi_q": "ब्लैकबोर्ड/व्हाइटबोर्ड पर कौन लिखता है?",
                "en_q": "Who writes on the blackboard/whiteboard?",
                "hi_a": "शिक्षक",
                "en_a": "Teacher"
        }
],
    'food_nutrition': [
        {
                "id": 1,
                "hi_q": "हमें भोजन क्यों करना चाहिए?",
                "en_q": "Why do we need to eat food?",
                "hi_a": "ऊर्जा पाने के लिए",
                "en_a": "To get energy"
        },
        {
                "id": 2,
                "hi_q": "स्वस्थ रहने के लिए हमें कैसा भोजन करना चाहिए?",
                "en_q": "What kind of food should we eat to stay healthy?",
                "hi_a": "संतुलित आहार",
                "en_a": "Balanced diet"
        },
        {
                "id": 3,
                "hi_q": "चावल और रोटी हमें क्या देते हैं?",
                "en_q": "What do rice and chapati give us?",
                "hi_a": "ऊर्जा",
                "en_a": "Energy"
        },
        {
                "id": 4,
                "hi_q": "दाल और बीन्स किसके अच्छे स्रोत हैं?",
                "en_q": "Pulses and beans are good sources of what?",
                "hi_a": "प्रोटीन",
                "en_a": "Protein"
        },
        {
                "id": 5,
                "hi_q": "दूध में कौन सा पोषक तत्व अधिक होता है?",
                "en_q": "Which nutrient is rich in milk?",
                "hi_a": "कैल्शियम",
                "en_a": "Calcium"
        },
        {
                "id": 6,
                "hi_q": "फल और सब्जियाँ हमें क्या देती हैं?",
                "en_q": "What do fruits and vegetables give us?",
                "hi_a": "विटामिन और खनिज",
                "en_a": "Vitamins and minerals"
        },
        {
                "id": 7,
                "hi_q": "गाजर किस विटामिन के लिए जानी जाती है?",
                "en_q": "Carrot is rich in which vitamin?",
                "hi_a": "विटामिन A",
                "en_a": "Vitamin A"
        },
        {
                "id": 8,
                "hi_q": "नींबू किस विटामिन का अच्छा स्रोत है?",
                "en_q": "Lemon is a good source of which vitamin?",
                "hi_a": "विटामिन C",
                "en_a": "Vitamin C"
        },
        {
                "id": 9,
                "hi_q": "पानी पीना क्यों जरूरी है?",
                "en_q": "Why is drinking water important?",
                "hi_a": "शरीर को हाइड्रेट रखने के लिए",
                "en_a": "To keep the body hydrated"
        },
        {
                "id": 10,
                "hi_q": "हमें रोज कितने समय पर खाना खाना चाहिए?",
                "en_q": "How often should we eat meals daily?",
                "hi_a": "नियमित समय पर",
                "en_a": "At regular times"
        },
        {
                "id": 11,
                "hi_q": "सुबह का नाश्ता क्यों जरूरी है?",
                "en_q": "Why is breakfast important?",
                "hi_a": "दिन की शुरुआत के लिए ऊर्जा देता है",
                "en_a": "Gives energy to start the day"
        },
        {
                "id": 12,
                "hi_q": "जंक फूड ज्यादा खाने से क्या होता है?",
                "en_q": "What happens if we eat too much junk food?",
                "hi_a": "स्वास्थ्य खराब हो सकता है",
                "en_a": "It can harm our health"
        },
        {
                "id": 13,
                "hi_q": "हरी पत्तेदार सब्जियाँ क्यों खानी चाहिए?",
                "en_q": "Why should we eat green leafy vegetables?",
                "hi_a": "शरीर को ताकत और खून बढ़ाने के लिए",
                "en_a": "To build strength and improve blood"
        },
        {
                "id": 14,
                "hi_q": "अंडा किसका अच्छा स्रोत है?",
                "en_q": "Egg is a good source of what?",
                "hi_a": "प्रोटीन",
                "en_a": "Protein"
        },
        {
                "id": 15,
                "hi_q": "दही खाने से क्या फायदा होता है?",
                "en_q": "What is the benefit of eating curd?",
                "hi_a": "पाचन अच्छा रहता है",
                "en_a": "Helps in digestion"
        },
        {
                "id": 16,
                "hi_q": "मेवे (Dry fruits) हमें क्या देते हैं?",
                "en_q": "What do dry fruits give us?",
                "hi_a": "ऊर्जा और पोषक तत्व",
                "en_a": "Energy and nutrients"
        },
        {
                "id": 17,
                "hi_q": "ज्यादा मीठा खाने से क्या हो सकता है?",
                "en_q": "What can happen if we eat too many sweets?",
                "hi_a": "दाँत खराब हो सकते हैं",
                "en_a": "Teeth can get damaged"
        },
        {
                "id": 18,
                "hi_q": "साफ भोजन क्यों जरूरी है?",
                "en_q": "Why is clean food important?",
                "hi_a": "बीमारियों से बचने के लिए",
                "en_a": "To avoid diseases"
        },
        {
                "id": 19,
                "hi_q": "खाने से पहले हाथ क्यों धोने चाहिए?",
                "en_q": "Why should we wash hands before eating?",
                "hi_a": "कीटाणुओं से बचने के लिए",
                "en_a": "To avoid germs"
        },
        {
                "id": 20,
                "hi_q": "फल खाने का सबसे अच्छा समय कौन सा है?",
                "en_q": "What is the best time to eat fruits?",
                "hi_a": "सुबह या दिन में",
                "en_a": "Morning or daytime"
        },
        {
                "id": 21,
                "hi_q": "शरीर को बढ़ने के लिए किसकी जरूरत होती है?",
                "en_q": "What does the body need for growth?",
                "hi_a": "प्रोटीन",
                "en_a": "Protein"
        },
        {
                "id": 22,
                "hi_q": "कौन सा पेय हमें ताजगी देता है और शरीर के लिए जरूरी है?",
                "en_q": "Which drink refreshes us and is essential for the body?",
                "hi_a": "पानी",
                "en_a": "Water"
        },
        {
                "id": 23,
                "hi_q": "ज्यादा तला हुआ भोजन क्यों नहीं खाना चाहिए?",
                "en_q": "Why should we avoid eating too much fried food?",
                "hi_a": "स्वास्थ्य के लिए हानिकारक है",
                "en_a": "It is harmful to health"
        },
        {
                "id": 24,
                "hi_q": "हमें रोज कितनी बार फल और सब्जियाँ खानी चाहिए?",
                "en_q": "How often should we eat fruits and vegetables?",
                "hi_a": "रोजाना",
                "en_a": "Every day"
        },
        {
                "id": 25,
                "hi_q": "स्वस्थ भोजन करने से क्या फायदा होता है?",
                "en_q": "What is the benefit of eating healthy food?",
                "hi_a": "शरीर मजबूत और स्वस्थ रहता है",
                "en_a": "The body stays strong and healthy"
        }
],
    'good_habits': [
        {
                "id": 1,
                "hi_q": "सुबह जल्दी उठना क्यों अच्छी आदत है?",
                "en_q": "Why is waking up early a good habit?",
                "hi_a": "दिन की अच्छी शुरुआत के लिए",
                "en_a": "For a good start to the day"
        },
        {
                "id": 2,
                "hi_q": "हमें रोज दाँत कितनी बार साफ करने चाहिए?",
                "en_q": "How many times should we brush our teeth daily?",
                "hi_a": "दो बार",
                "en_a": "Twice"
        },
        {
                "id": 3,
                "hi_q": "खाना खाने से पहले क्या करना चाहिए?",
                "en_q": "What should we do before eating food?",
                "hi_a": "हाथ धोना",
                "en_a": "Wash hands"
        },
        {
                "id": 4,
                "hi_q": "साफ कपड़े पहनना क्यों जरूरी है?",
                "en_q": "Why is it important to wear clean clothes?",
                "hi_a": "साफ और स्वस्थ रहने के लिए",
                "en_a": "To stay clean and healthy"
        },
        {
                "id": 5,
                "hi_q": "हमें रोज नहाना क्यों चाहिए?",
                "en_q": "Why should we bathe daily?",
                "hi_a": "शरीर की सफाई के लिए",
                "en_a": "To keep the body clean"
        },
        {
                "id": 6,
                "hi_q": "बड़ों से कैसे बात करनी चाहिए?",
                "en_q": "How should we talk to elders?",
                "hi_a": "सम्मान से",
                "en_a": "Respectfully"
        },
        {
                "id": 7,
                "hi_q": "“कृपया” और “धन्यवाद” कब कहना चाहिए?",
                "en_q": "When should we say “please” and “thank you”?",
                "hi_a": "विनम्रता दिखाने के लिए",
                "en_a": "To show politeness"
        },
        {
                "id": 8,
                "hi_q": "सच बोलना क्यों अच्छी आदत है?",
                "en_q": "Why is telling the truth a good habit?",
                "hi_a": "विश्वास बनाने के लिए",
                "en_a": "To build trust"
        },
        {
                "id": 9,
                "hi_q": "समय पर स्कूल पहुँचना क्यों जरूरी है?",
                "en_q": "Why is reaching school on time important?",
                "hi_a": "अनुशासन के लिए",
                "en_a": "For discipline"
        },
        {
                "id": 10,
                "hi_q": "होमवर्क समय पर क्यों करना चाहिए?",
                "en_q": "Why should we complete homework on time?",
                "hi_a": "अच्छी पढ़ाई के लिए",
                "en_a": "For better learning"
        },
        {
                "id": 11,
                "hi_q": "हमें रोज व्यायाम क्यों करना चाहिए?",
                "en_q": "Why should we exercise daily?",
                "hi_a": "स्वस्थ रहने के लिए",
                "en_a": "To stay healthy"
        },
        {
                "id": 12,
                "hi_q": "कूड़ा कहाँ डालना चाहिए?",
                "en_q": "Where should we throw garbage?",
                "hi_a": "डस्टबिन में",
                "en_a": "In the dustbin"
        },
        {
                "id": 13,
                "hi_q": "हमें पेड़-पौधों की देखभाल क्यों करनी चाहिए?",
                "en_q": "Why should we take care of plants?",
                "hi_a": "पर्यावरण की रक्षा के लिए",
                "en_a": "To protect the environment"
        },
        {
                "id": 14,
                "hi_q": "पानी बचाना क्यों जरूरी है?",
                "en_q": "Why is saving water important?",
                "hi_a": "भविष्य के लिए",
                "en_a": "For the future"
        },
        {
                "id": 15,
                "hi_q": "बिजली बचाना क्यों जरूरी है?",
                "en_q": "Why should we save electricity?",
                "hi_a": "ऊर्जा बचाने के लिए",
                "en_a": "To save energy"
        },
        {
                "id": 16,
                "hi_q": "दूसरों की मदद करना क्यों अच्छी आदत है?",
                "en_q": "Why is helping others a good habit?",
                "hi_a": "अच्छा इंसान बनने के लिए",
                "en_a": "To become a good person"
        },
        {
                "id": 17,
                "hi_q": "खिलौने और किताबें उपयोग के बाद क्या करना चाहिए?",
                "en_q": "What should we do with toys and books after use?",
                "hi_a": "सही जगह पर रखना",
                "en_a": "Keep them in the right place"
        },
        {
                "id": 18,
                "hi_q": "लाइन में खड़े होना क्यों जरूरी है?",
                "en_q": "Why is standing in a queue important?",
                "hi_a": "अनुशासन सीखने के लिए",
                "en_a": "To learn discipline"
        },
        {
                "id": 19,
                "hi_q": "जोर से चिल्लाना क्यों गलत है?",
                "en_q": "Why is shouting loudly a bad habit?",
                "hi_a": "दूसरों को परेशानी होती है",
                "en_a": "It disturbs others"
        },
        {
                "id": 20,
                "hi_q": "अच्छी नींद क्यों जरूरी है?",
                "en_q": "Why is good sleep important?",
                "hi_a": "शरीर और दिमाग के आराम के लिए",
                "en_a": "For rest of body and mind"
        },
        {
                "id": 21,
                "hi_q": "रोजगार किताब पढ़ना क्यों अच्छा है?",
                "en_q": "Why is reading books daily a good habit?",
                "hi_a": "ज्ञान बढ़ाने के लिए",
                "en_a": "To increase knowledge"
        },
        {
                "id": 22,
                "hi_q": "मिलजुलकर रहना क्यों जरूरी है?",
                "en_q": "Why is living together peacefully important?",
                "hi_a": "खुशी और शांति के लिए",
                "en_a": "For happiness and peace"
        },
        {
                "id": 23,
                "hi_q": "गलती होने पर क्या कहना चाहिए?",
                "en_q": "What should we say when we make a mistake?",
                "hi_a": "माफ़ कीजिए",
                "en_a": "Sorry"
        },
        {
                "id": 24,
                "hi_q": "हमें जानवरों के साथ कैसा व्यवहार करना चाहिए?",
                "en_q": "How should we behave with animals?",
                "hi_a": "दयालुता से",
                "en_a": "With kindness"
        },
        {
                "id": 25,
                "hi_q": "बड़ों की बात ध्यान से सुनना क्यों जरूरी है?",
                "en_q": "Why is it important to listen to elders carefully?",
                "hi_a": "सही मार्गदर्शन पाने के लिए",
                "en_a": "To get proper guidance"
        }
],
    'earth': [
        {
                "id": 1,
                "hi_q": "हम जिस ग्रह पर रहते हैं उसका नाम क्या है?",
                "en_q": "What is the name of the planet we live on?",
                "hi_a": "पृथ्वी",
                "en_a": "Earth"
        },
        {
                "id": 2,
                "hi_q": "पृथ्वी का आकार कैसा है?",
                "en_q": "What is the shape of the Earth?",
                "hi_a": "गोल (लगभग गोल)",
                "en_a": "Round (almost spherical)"
        },
        {
                "id": 3,
                "hi_q": "पृथ्वी का कितना भाग पानी से ढका है?",
                "en_q": "How much of the Earth is covered with water?",
                "hi_a": "लगभग तीन-चौथाई",
                "en_a": "About three-fourths"
        },
        {
                "id": 4,
                "hi_q": "पृथ्वी का ठोस भाग क्या कहलाता है?",
                "en_q": "What is the solid part of the Earth called?",
                "hi_a": "स्थल (भूमि)",
                "en_a": "Land"
        },
        {
                "id": 5,
                "hi_q": "पृथ्वी के चारों ओर हवा की परत को क्या कहते हैं?",
                "en_q": "What is the layer of air around the Earth called?",
                "hi_a": "वायुमंडल",
                "en_a": "Atmosphere"
        },
        {
                "id": 6,
                "hi_q": "पृथ्वी हमें सांस लेने के लिए क्या देती है?",
                "en_q": "What does Earth provide for us to breathe?",
                "hi_a": "ऑक्सीजन",
                "en_a": "Oxygen"
        },
        {
                "id": 7,
                "hi_q": "पृथ्वी पर जीवन किस कारण संभव है?",
                "en_q": "Why is life possible on Earth?",
                "hi_a": "पानी, हवा और सही तापमान के कारण",
                "en_a": "Because of water, air, and suitable temperature"
        },
        {
                "id": 8,
                "hi_q": "पर्वत क्या होते हैं?",
                "en_q": "What are mountains?",
                "hi_a": "बहुत ऊँची प्राकृतिक ऊँचाइयाँ",
                "en_a": "Very high natural elevations"
        },
        {
                "id": 9,
                "hi_q": "नदी क्या है?",
                "en_q": "What is a river?",
                "hi_a": "बहता हुआ मीठे पानी का स्रोत",
                "en_a": "Flowing source of fresh water"
        },
        {
                "id": 10,
                "hi_q": "समुद्र का पानी कैसा होता है?",
                "en_q": "What is the water of the sea like?",
                "hi_a": "खारा",
                "en_a": "Salty"
        },
        {
                "id": 11,
                "hi_q": "जंगल किससे बने होते हैं?",
                "en_q": "What are forests made up of?",
                "hi_a": "बहुत सारे पेड़ों से",
                "en_a": "Many trees"
        },
        {
                "id": 12,
                "hi_q": "रेगिस्तान कैसा स्थान होता है?",
                "en_q": "What is a desert like?",
                "hi_a": "बहुत सूखा और रेत वाला स्थान",
                "en_a": "Very dry and sandy place"
        },
        {
                "id": 13,
                "hi_q": "द्वीप क्या होता है?",
                "en_q": "What is an island?",
                "hi_a": "चारों ओर पानी से घिरी भूमि",
                "en_a": "Land surrounded by water on all sides"
        },
        {
                "id": 14,
                "hi_q": "महाद्वीप क्या होते हैं?",
                "en_q": "What are continents?",
                "hi_a": "पृथ्वी के बड़े-बड़े भूमि भाग",
                "en_a": "Large land masses of the Earth"
        },
        {
                "id": 15,
                "hi_q": "पृथ्वी पर कितने महाद्वीप हैं?",
                "en_q": "How many continents are there on Earth?",
                "hi_a": "सात",
                "en_a": "Seven"
        },
        {
                "id": 16,
                "hi_q": "पृथ्वी का सबसे बड़ा महासागर कौन सा है?",
                "en_q": "Which is the largest ocean on Earth?",
                "hi_a": "प्रशांत महासागर",
                "en_a": "Pacific Ocean"
        },
        {
                "id": 17,
                "hi_q": "पौधे पृथ्वी के लिए क्यों जरूरी हैं?",
                "en_q": "Why are plants important for Earth?",
                "hi_a": "वे ऑक्सीजन देते हैं",
                "en_a": "They provide oxygen"
        },
        {
                "id": 18,
                "hi_q": "जानवर पृथ्वी के लिए क्यों जरूरी हैं?",
                "en_q": "Why are animals important for Earth?",
                "hi_a": "वे प्राकृतिक संतुलन बनाए रखते हैं",
                "en_a": "They help maintain natural balance"
        },
        {
                "id": 19,
                "hi_q": "हमें पृथ्वी को साफ क्यों रखना चाहिए?",
                "en_q": "Why should we keep the Earth clean?",
                "hi_a": "स्वस्थ जीवन के लिए",
                "en_a": "For healthy living"
        },
        {
                "id": 20,
                "hi_q": "कचरा जमीन पर फेंकना क्यों गलत है?",
                "en_q": "Why is it wrong to throw garbage on the ground?",
                "hi_a": "इससे प्रदूषण फैलता है",
                "en_a": "It causes pollution"
        },
        {
                "id": 21,
                "hi_q": "पानी बचाना क्यों जरूरी है?",
                "en_q": "Why is saving water important?",
                "hi_a": "क्योंकि यह सीमित संसाधन है",
                "en_a": "Because it is a limited resource"
        },
        {
                "id": 22,
                "hi_q": "पेड़ काटने से क्या नुकसान होता है?",
                "en_q": "What harm is caused by cutting trees?",
                "hi_a": "पर्यावरण असंतुलित हो जाता है",
                "en_a": "It disturbs environmental balance"
        },
        {
                "id": 23,
                "hi_q": "प्रदूषण क्या है?",
                "en_q": "What is pollution?",
                "hi_a": "हवा, पानी और जमीन का गंदा होना",
                "en_a": "Dirtying of air, water, and land"
        },
        {
                "id": 24,
                "hi_q": "हमें प्लास्टिक का कम उपयोग क्यों करना चाहिए?",
                "en_q": "Why should we use less plastic?",
                "hi_a": "पर्यावरण की रक्षा के लिए",
                "en_a": "To protect the environment"
        },
        {
                "id": 25,
                "hi_q": "पृथ्वी को हरा-भरा रखने के लिए हमें क्या करना चाहिए?",
                "en_q": "What should we do to keep Earth green?",
                "hi_a": "पेड़ लगाना",
                "en_a": "Plant trees"
        }
],
    'colors_shapes': [
        {
                "id": 1,
                "hi_q": "लाल रंग किससे जुड़ा होता है?",
                "en_q": "Red color is often linked with what?",
                "hi_a": "प्यार और ऊर्जा",
                "en_a": "Love and energy"
        },
        {
                "id": 2,
                "hi_q": "आकाश का रंग कैसा होता है?",
                "en_q": "What is the color of the sky?",
                "hi_a": "नीला",
                "en_a": "Blue"
        },
        {
                "id": 3,
                "hi_q": "पेड़ों की पत्तियों का रंग क्या होता है?",
                "en_q": "What is the color of most leaves?",
                "hi_a": "हरा",
                "en_a": "Green"
        },
        {
                "id": 4,
                "hi_q": "सूरजमुखी का फूल किस रंग का होता है?",
                "en_q": "What is the color of a sunflower?",
                "hi_a": "पीला",
                "en_a": "Yellow"
        },
        {
                "id": 5,
                "hi_q": "दूध का रंग क्या होता है?",
                "en_q": "What is the color of milk?",
                "hi_a": "सफेद",
                "en_a": "White"
        },
        {
                "id": 6,
                "hi_q": "कोयला किस रंग का होता है?",
                "en_q": "What is the color of coal?",
                "hi_a": "काला",
                "en_a": "Black"
        },
        {
                "id": 7,
                "hi_q": "इंद्रधनुष में कितने रंग होते हैं?",
                "en_q": "How many colors are in a rainbow?",
                "hi_a": "सात",
                "en_a": "Seven"
        },
        {
                "id": 8,
                "hi_q": "संतरे का रंग क्या होता है?",
                "en_q": "What is the color of an orange fruit?",
                "hi_a": "नारंगी",
                "en_a": "Orange"
        },
        {
                "id": 9,
                "hi_q": "गुलाब का फूल आमतौर पर किस रंग का होता है?",
                "en_q": "What color is a rose commonly?",
                "hi_a": "लाल",
                "en_a": "Red"
        },
        {
                "id": 10,
                "hi_q": "केले का पका हुआ रंग क्या होता है?",
                "en_q": "What is the color of a ripe banana?",
                "hi_a": "पीला",
                "en_a": "Yellow"
        },
        {
                "id": 11,
                "hi_q": "गोल आकार को क्या कहते हैं?",
                "en_q": "What do we call a round shape?",
                "hi_a": "वृत्त",
                "en_a": "Circle"
        },
        {
                "id": 12,
                "hi_q": "तीन भुजाओं वाले आकार को क्या कहते हैं?",
                "en_q": "What do we call a shape with three sides?",
                "hi_a": "त्रिभुज",
                "en_a": "Triangle"
        },
        {
                "id": 13,
                "hi_q": "चार बराबर भुजाओं वाला आकार क्या कहलाता है?",
                "en_q": "What do we call a shape with four equal sides?",
                "hi_a": "वर्ग",
                "en_a": "Square"
        },
        {
                "id": 14,
                "hi_q": "आयत में कितनी भुजाएँ होती हैं?",
                "en_q": "How many sides does a rectangle have?",
                "hi_a": "चार",
                "en_a": "Four"
        },
        {
                "id": 15,
                "hi_q": "दिल (हार्ट) के आकार को किस नाम से जानते हैं?",
                "en_q": "What shape represents a heart symbol?",
                "hi_a": "हृदय आकार",
                "en_a": "Heart shape"
        },
        {
                "id": 16,
                "hi_q": "गेंद का आकार कैसा होता है?",
                "en_q": "What is the shape of a ball?",
                "hi_a": "गोल",
                "en_a": "Round"
        },
        {
                "id": 17,
                "hi_q": "पहिये का आकार कैसा होता है?",
                "en_q": "What is the shape of a wheel?",
                "hi_a": "वृत्त",
                "en_a": "Circle"
        },
        {
                "id": 18,
                "hi_q": "किताब का आकार आमतौर पर किस जैसा होता है?",
                "en_q": "A book is usually in which shape?",
                "hi_a": "आयत",
                "en_a": "Rectangle"
        },
        {
                "id": 19,
                "hi_q": "दरवाजे का आकार किस जैसा होता है?",
                "en_q": "What shape is a door usually?",
                "hi_a": "आयत",
                "en_a": "Rectangle"
        },
        {
                "id": 20,
                "hi_q": "सितारे (⭐) का आकार किस जैसा होता है?",
                "en_q": "What is the shape of a star symbol?",
                "hi_a": "तारा आकार",
                "en_a": "Star shape"
        },
        {
                "id": 21,
                "hi_q": "हरे रंग को किस चीज़ से जोड़ा जाता है?",
                "en_q": "Green color is related to what?",
                "hi_a": "प्रकृति",
                "en_a": "Nature"
        },
        {
                "id": 22,
                "hi_q": "नीला रंग किससे जुड़ा होता है?",
                "en_q": "Blue color is often linked with what?",
                "hi_a": "आकाश और शांति",
                "en_a": "Sky and peace"
        },
        {
                "id": 23,
                "hi_q": "सफेद रंग क्या दर्शाता है?",
                "en_q": "What does white color represent?",
                "hi_a": "शांति और पवित्रता",
                "en_a": "Peace and purity"
        },
        {
                "id": 24,
                "hi_q": "काला रंग किससे जुड़ा होता है?",
                "en_q": "Black color is often linked with what?",
                "hi_a": "अंधेरा",
                "en_a": "Darkness"
        },
        {
                "id": 25,
                "hi_q": "ट्रैफिक लाइट में लाल रंग क्या दर्शाता है?",
                "en_q": "What does red color show in traffic lights?",
                "hi_a": "रुकना",
                "en_a": "Stop"
        }
],
    'home_family': [
        {
                "id": 1,
                "hi_q": "हम जहाँ रहते हैं उसे क्या कहते हैं?",
                "en_q": "What do we call the place where we live?",
                "hi_a": "घर",
                "en_a": "Home"
        },
        {
                "id": 2,
                "hi_q": "घर में हमारे साथ कौन रहते हैं?",
                "en_q": "Who lives with us at home?",
                "hi_a": "परिवार के सदस्य",
                "en_a": "Family members"
        },
        {
                "id": 3,
                "hi_q": "माता को अंग्रेज़ी में क्या कहते हैं?",
                "en_q": "What do we call “माता” in English?",
                "hi_a": "माँ",
                "en_a": "Mother"
        },
        {
                "id": 4,
                "hi_q": "पिता को अंग्रेज़ी में क्या कहते हैं?",
                "en_q": "What do we call “पिता” in English?",
                "hi_a": "पिता",
                "en_a": "Father"
        },
        {
                "id": 5,
                "hi_q": "भाई को अंग्रेज़ी में क्या कहते हैं?",
                "en_q": "What do we call “भाई” in English?",
                "hi_a": "भाई",
                "en_a": "Brother"
        },
        {
                "id": 6,
                "hi_q": "बहन को अंग्रेज़ी में क्या कहते हैं?",
                "en_q": "What do we call “बहन” in English?",
                "hi_a": "बहन",
                "en_a": "Sister"
        },
        {
                "id": 7,
                "hi_q": "दादा-दादी किस पीढ़ी से होते हैं?",
                "en_q": "Grandparents belong to which generation?",
                "hi_a": "बड़ी पीढ़ी",
                "en_a": "Elder generation"
        },
        {
                "id": 8,
                "hi_q": "परिवार हमें क्या सिखाता है?",
                "en_q": "What does family teach us?",
                "hi_a": "प्यार और संस्कार",
                "en_a": "Love and values"
        },
        {
                "id": 9,
                "hi_q": "घर का खाना कौन बनाता है?",
                "en_q": "Who usually cooks food at home?",
                "hi_a": "परिवार का सदस्य (अक्सर माँ)",
                "en_a": "A family member (often mother)"
        },
        {
                "id": 10,
                "hi_q": "घर को साफ रखना क्यों जरूरी है?",
                "en_q": "Why is it important to keep our home clean?",
                "hi_a": "स्वस्थ रहने के लिए",
                "en_a": "To stay healthy"
        },
        {
                "id": 11,
                "hi_q": "हम घर में कहाँ सोते हैं?",
                "en_q": "Where do we sleep at home?",
                "hi_a": "शयनकक्ष (बेडरूम) में",
                "en_a": "In the bedroom"
        },
        {
                "id": 12,
                "hi_q": "हम घर में कहाँ खाना खाते हैं?",
                "en_q": "Where do we eat food at home?",
                "hi_a": "भोजन कक्ष या रसोई में",
                "en_a": "In the dining area or kitchen"
        },
        {
                "id": 13,
                "hi_q": "मेहमान आने पर हमें क्या करना चाहिए?",
                "en_q": "What should we do when guests come home?",
                "hi_a": "उनका स्वागत करना",
                "en_a": "Welcome them"
        },
        {
                "id": 14,
                "hi_q": "हमें बड़ों की मदद क्यों करनी चाहिए?",
                "en_q": "Why should we help elders at home?",
                "hi_a": "सम्मान और जिम्मेदारी के लिए",
                "en_a": "For respect and responsibility"
        },
        {
                "id": 15,
                "hi_q": "घर में इस्तेमाल होने वाली बिजली हमें क्या देती है?",
                "en_q": "What does electricity at home provide us?",
                "hi_a": "रोशनी और उपकरण चलाने की शक्ति",
                "en_a": "Light and power for appliances"
        },
        {
                "id": 16,
                "hi_q": "रसोई घर किस काम के लिए होता है?",
                "en_q": "What is the kitchen used for?",
                "hi_a": "खाना बनाने के लिए",
                "en_a": "For cooking food"
        },
        {
                "id": 17,
                "hi_q": "बाथरूम किस काम के लिए होता है?",
                "en_q": "What is a bathroom used for?",
                "hi_a": "नहाने और सफाई के लिए",
                "en_a": "For bathing and cleaning"
        },
        {
                "id": 18,
                "hi_q": "ड्राइंग रूम में आमतौर पर क्या होता है?",
                "en_q": "What is usually found in a drawing room?",
                "hi_a": "सोफा और मेहमानों के बैठने की जगह",
                "en_a": "Sofa and seating for guests"
        },
        {
                "id": 19,
                "hi_q": "हमें घर के सामान का ध्यान क्यों रखना चाहिए?",
                "en_q": "Why should we take care of things at home?",
                "hi_a": "जिम्मेदार बनने के लिए",
                "en_a": "To be responsible"
        },
        {
                "id": 20,
                "hi_q": "परिवार में मिलजुलकर रहने से क्या होता है?",
                "en_q": "What happens when family members live together happily?",
                "hi_a": "खुशी और शांति रहती है",
                "en_a": "There is happiness and peace"
        },
        {
                "id": 21,
                "hi_q": "त्योहार परिवार के साथ मनाने से क्या होता है?",
                "en_q": "What happens when we celebrate festivals with family?",
                "hi_a": "प्यार और एकता बढ़ती है",
                "en_a": "Love and unity increase"
        },
        {
                "id": 22,
                "hi_q": "हमें अपने छोटे भाई-बहनों के साथ कैसा व्यवहार करना चाहिए?",
                "en_q": "How should we behave with younger siblings?",
                "hi_a": "प्यार और देखभाल से",
                "en_a": "With love and care"
        },
        {
                "id": 23,
                "hi_q": "घर में नियमों का पालन क्यों करना चाहिए?",
                "en_q": "Why should we follow rules at home?",
                "hi_a": "अनुशासन के लिए",
                "en_a": "For discipline"
        },
        {
                "id": 24,
                "hi_q": "अपने माता-पिता का सम्मान क्यों करना चाहिए?",
                "en_q": "Why should we respect our parents?",
                "hi_a": "वे हमारी देखभाल करते हैं",
                "en_a": "They take care of us"
        },
        {
                "id": 25,
                "hi_q": "परिवार हमें मुश्किल समय में क्या देता है?",
                "en_q": "What does family give us in difficult times?",
                "hi_a": "सहारा और प्यार",
                "en_a": "Support and love"
        }
],
    'directions': [
        {
                "id": 1,
                "hi_q": "कुल कितनी मुख्य दिशाएँ होती हैं?",
                "en_q": "How many main directions are there?",
                "hi_a": "चार",
                "en_a": "Four"
        },
        {
                "id": 2,
                "hi_q": "सूरज किस दिशा से उगता है?",
                "en_q": "From which direction does the Sun rise?",
                "hi_a": "पूर्व",
                "en_a": "East"
        },
        {
                "id": 3,
                "hi_q": "सूरज किस दिशा में डूबता है?",
                "en_q": "In which direction does the Sun set?",
                "hi_a": "पश्चिम",
                "en_a": "West"
        },
        {
                "id": 4,
                "hi_q": "उत्तर दिशा को अंग्रेज़ी में क्या कहते हैं?",
                "en_q": "What is North called in Hindi?",
                "hi_a": "उत्तर",
                "en_a": "North"
        },
        {
                "id": 5,
                "hi_q": "दक्षिण दिशा को अंग्रेज़ी में क्या कहते हैं?",
                "en_q": "What is South called in Hindi?",
                "hi_a": "दक्षिण",
                "en_a": "South"
        },
        {
                "id": 6,
                "hi_q": "पूर्व दिशा को अंग्रेज़ी में क्या कहते हैं?",
                "en_q": "What is East called in Hindi?",
                "hi_a": "पूर्व",
                "en_a": "East"
        },
        {
                "id": 7,
                "hi_q": "पश्चिम दिशा को अंग्रेज़ी में क्या कहते हैं?",
                "en_q": "What is West called in Hindi?",
                "hi_a": "पश्चिम",
                "en_a": "West"
        },
        {
                "id": 8,
                "hi_q": "नक्शे में ऊपर की दिशा कौन सी मानी जाती है?",
                "en_q": "Which direction is shown at the top of most maps?",
                "hi_a": "उत्तर",
                "en_a": "North"
        },
        {
                "id": 9,
                "hi_q": "नक्शे में नीचे की दिशा कौन सी होती है?",
                "en_q": "Which direction is shown at the bottom of a map?",
                "hi_a": "दक्षिण",
                "en_a": "South"
        },
        {
                "id": 10,
                "hi_q": "दाएँ हाथ की ओर कौन सी दिशा होती है जब हम उत्तर की ओर देखते हैं?",
                "en_q": "When facing North, which direction is on your right?",
                "hi_a": "पूर्व",
                "en_a": "East"
        },
        {
                "id": 11,
                "hi_q": "बाएँ हाथ की ओर कौन सी दिशा होती है जब हम उत्तर की ओर देखते हैं?",
                "en_q": "When facing North, which direction is on your left?",
                "hi_a": "पश्चिम",
                "en_a": "West"
        },
        {
                "id": 12,
                "hi_q": "कंपास किसलिए उपयोग किया जाता है?",
                "en_q": "What is a compass used for?",
                "hi_a": "दिशा जानने के लिए",
                "en_a": "To find directions"
        },
        {
                "id": 13,
                "hi_q": "कंपास की सुई हमेशा किस दिशा की ओर इशारा करती है?",
                "en_q": "Which direction does a compass needle point to?",
                "hi_a": "उत्तर",
                "en_a": "North"
        },
        {
                "id": 14,
                "hi_q": "चार मुख्य दिशाओं के अलावा बीच की दिशाओं को क्या कहते हैं?",
                "en_q": "What are the directions between main directions called?",
                "hi_a": "उप-दिशाएँ",
                "en_a": "Intermediate directions"
        },
        {
                "id": 15,
                "hi_q": "उत्तर और पूर्व के बीच की दिशा क्या कहलाती है?",
                "en_q": "What is the direction between North and East called?",
                "hi_a": "उत्तर-पूर्व",
                "en_a": "North-East"
        },
        {
                "id": 16,
                "hi_q": "दक्षिण और पूर्व के बीच की दिशा क्या कहलाती है?",
                "en_q": "What is the direction between South and East called?",
                "hi_a": "दक्षिण-पूर्व",
                "en_a": "South-East"
        },
        {
                "id": 17,
                "hi_q": "दक्षिण और पश्चिम के बीच की दिशा क्या कहलाती है?",
                "en_q": "What is the direction between South and West called?",
                "hi_a": "दक्षिण-पश्चिम",
                "en_a": "South-West"
        },
        {
                "id": 18,
                "hi_q": "उत्तर और पश्चिम के बीच की दिशा क्या कहलाती है?",
                "en_q": "What is the direction between North and West called?",
                "hi_a": "उत्तर-पश्चिम",
                "en_a": "North-West"
        },
        {
                "id": 19,
                "hi_q": "दिशा जानना क्यों जरूरी है?",
                "en_q": "Why is it important to know directions?",
                "hi_a": "सही रास्ता खोजने के लिए",
                "en_a": "To find the correct path"
        },
        {
                "id": 20,
                "hi_q": "यात्रा करते समय दिशा जानने में कौन मदद करता है?",
                "en_q": "What helps us know directions while traveling?",
                "hi_a": "नक्शा या कंपास",
                "en_a": "Map or compass"
        },
        {
                "id": 21,
                "hi_q": "सुबह के समय सूरज किस दिशा में दिखाई देता है?",
                "en_q": "In the morning, in which direction is the Sun seen?",
                "hi_a": "पूर्व",
                "en_a": "East"
        },
        {
                "id": 22,
                "hi_q": "शाम के समय सूरज किस दिशा में दिखाई देता है?",
                "en_q": "In the evening, in which direction is the Sun seen?",
                "hi_a": "पश्चिम",
                "en_a": "West"
        },
        {
                "id": 23,
                "hi_q": "यदि आप पूर्व की ओर चल रहे हैं तो आपकी पीठ किस दिशा की ओर होगी?",
                "en_q": "If you walk towards East, which direction is behind you?",
                "hi_a": "पश्चिम",
                "en_a": "West"
        },
        {
                "id": 24,
                "hi_q": "यदि आप पश्चिम की ओर देख रहे हैं तो आपका बायाँ हाथ किस दिशा की ओर होगा?",
                "en_q": "If you are facing West, which direction is on your left?",
                "hi_a": "दक्षिण",
                "en_a": "South"
        }
],
    'continents': [
        {
                "id": 1,
                "hi_q": "महाद्वीप क्या होते हैं?",
                "en_q": "What are continents?",
                "hi_a": "पृथ्वी के बहुत बड़े भूमि भाग",
                "en_a": "Very large land masses on Earth"
        },
        {
                "id": 2,
                "hi_q": "पृथ्वी पर कुल कितने महाद्वीप हैं?",
                "en_q": "How many continents are there on Earth?",
                "hi_a": "सात",
                "en_a": "Seven"
        },
        {
                "id": 3,
                "hi_q": "एशिया किस प्रकार का महाद्वीप है?",
                "en_q": "What type of continent is Asia?",
                "hi_a": "सबसे बड़ा महाद्वीप",
                "en_a": "The largest continent"
        },
        {
                "id": 4,
                "hi_q": "भारत किस महाद्वीप में स्थित है?",
                "en_q": "In which continent is India located?",
                "hi_a": "एशिया",
                "en_a": "Asia"
        },
        {
                "id": 5,
                "hi_q": "अफ्रीका किस लिए प्रसिद्ध है?",
                "en_q": "What is Africa famous for?",
                "hi_a": "जंगल और वन्यजीव",
                "en_a": "Forests and wildlife"
        },
        {
                "id": 6,
                "hi_q": "विश्व का सबसे ठंडा महाद्वीप कौन सा है?",
                "en_q": "Which is the coldest continent in the world?",
                "hi_a": "अंटार्कटिका",
                "en_a": "Antarctica"
        },
        {
                "id": 7,
                "hi_q": "अंटार्कटिका में कौन रहते हैं?",
                "en_q": "Who lives in Antarctica?",
                "hi_a": "वहाँ स्थायी लोग नहीं रहते, केवल वैज्ञानिक",
                "en_a": "No permanent residents, only scientists"
        },
        {
                "id": 8,
                "hi_q": "यूरोप किस लिए जाना जाता है?",
                "en_q": "What is Europe known for?",
                "hi_a": "कई विकसित देशों के लिए",
                "en_a": "Many developed countries"
        },
        {
                "id": 9,
                "hi_q": "उत्तर अमेरिका में कौन सा प्रसिद्ध देश है?",
                "en_q": "Name a famous country in North America.",
                "hi_a": "संयुक्त राज्य अमेरिका",
                "en_a": "United States of America"
        },
        {
                "id": 10,
                "hi_q": "दक्षिण अमेरिका किस जंगल के लिए प्रसिद्ध है?",
                "en_q": "South America is famous for which forest?",
                "hi_a": "अमेज़न वर्षावन",
                "en_a": "Amazon Rainforest"
        },
        {
                "id": 11,
                "hi_q": "ऑस्ट्रेलिया महाद्वीप की खास बात क्या है?",
                "en_q": "What is special about Australia as a continent?",
                "hi_a": "यह सबसे छोटा महाद्वीप है",
                "en_a": "It is the smallest continent"
        },
        {
                "id": 12,
                "hi_q": "ऑस्ट्रेलिया एक देश भी है क्या?",
                "en_q": "Is Australia also a country?",
                "hi_a": "हाँ",
                "en_a": "Yes"
        },
        {
                "id": 13,
                "hi_q": "अफ्रीका में किस प्रकार के जानवर अधिक पाए जाते हैं?",
                "en_q": "What kind of animals are commonly found in Africa?",
                "hi_a": "जंगली जानवर जैसे शेर, हाथी",
                "en_a": "Wild animals like lions and elephants"
        },
        {
                "id": 14,
                "hi_q": "एशिया में दुनिया की सबसे बड़ी आबादी रहती है क्या?",
                "en_q": "Does Asia have the largest population in the world?",
                "hi_a": "हाँ",
                "en_a": "Yes"
        },
        {
                "id": 15,
                "hi_q": "यूरोप और एशिया को मिलाकर किस नाम से जाना जाता है?",
                "en_q": "What are Europe and Asia together called?",
                "hi_a": "यूरेशिया",
                "en_a": "Eurasia"
        },
        {
                "id": 16,
                "hi_q": "कौन सा महाद्वीप केवल बर्फ से ढका रहता है?",
                "en_q": "Which continent is mostly covered with ice?",
                "hi_a": "अंटार्कटिका",
                "en_a": "Antarctica"
        },
        {
                "id": 17,
                "hi_q": "दक्षिण अमेरिका में कौन सी लंबी पर्वतमाला है?",
                "en_q": "Which long mountain range is in South America?",
                "hi_a": "एंडीज पर्वत",
                "en_a": "Andes Mountains"
        },
        {
                "id": 18,
                "hi_q": "उत्तर अमेरिका में प्रसिद्ध जलप्रपात कौन सा है?",
                "en_q": "Which famous waterfall is in North America?",
                "hi_a": "नियाग्रा जलप्रपात",
                "en_a": "Niagara Falls"
        },
        {
                "id": 19,
                "hi_q": "एशिया में दुनिया की सबसे ऊँची पर्वत चोटी कौन सी है?",
                "en_q": "Which is the highest mountain peak in Asia?",
                "hi_a": "माउंट एवरेस्ट",
                "en_a": "Mount Everest"
        },
        {
                "id": 20,
                "hi_q": "अफ्रीका में सबसे लंबी नदी कौन सी है?",
                "en_q": "Which is the longest river in Africa?",
                "hi_a": "नील नदी",
                "en_a": "Nile River"
        },
        {
                "id": 21,
                "hi_q": "किस महाद्वीप में सबसे कम लोग रहते हैं?",
                "en_q": "Which continent has the least population?",
                "hi_a": "अंटार्कटिका",
                "en_a": "Antarctica"
        },
        {
                "id": 22,
                "hi_q": "किस महाद्वीप को “डार्क कॉन्टिनेंट” भी कहा जाता था?",
                "en_q": "Which continent was once called the “Dark Continent”?",
                "hi_a": "अफ्रीका",
                "en_a": "Africa"
        },
        {
                "id": 23,
                "hi_q": "ऑस्ट्रेलिया के आसपास के छोटे द्वीपों को किस क्षेत्र में गिना जाता है?",
                "en_q": "The small islands around Australia are part of which region?",
                "hi_a": "ओशिनिया",
                "en_a": "Oceania"
        },
        {
                "id": 24,
                "hi_q": "यूरोप किस महासागर के पास स्थित है?",
                "en_q": "Europe is located near which ocean?",
                "hi_a": "अटलांटिक महासागर",
                "en_a": "Atlantic Ocean"
        },
        {
                "id": 25,
                "hi_q": "महाद्वीपों को जानना क्यों जरूरी है?",
                "en_q": "Why is it important to learn about continents?",
                "hi_a": "दुनिया को समझने के लिए",
                "en_a": "To understand the world better"
        }
],

        "animals": [
            {
                "id": 1,
                "hi_q": "कौन सा जानवर घर की रखवाली करता है?",
                "en_q": "Which animal guards the house?",
                "hi_a": "कुत्ता",
                "en_a": "Dog"
            },
            {
                "id": 2,
                "hi_q": "कौन सा जानवर चूहे पकड़ती है?",
                "en_q": "Which animal catches rats?",
                "hi_a": "बिल्ली",
                "en_a": "Cat"
            },
            {
                "id": 3,
                "hi_q": "कौन सा जानवर हमें दूध देती है?",
                "en_q": "Which animal gives us milk?",
                "hi_a": "गाय",
                "en_a": "Cow"
            },
            {
                "id": 4,
                "hi_q": "कौन सा जानवर दूध और मांस देती है?",
                "en_q": "Which animal gives milk and meat?",
                "hi_a": "बकरी",
                "en_a": "Goat"
            },
            {
                "id": 5,
                "hi_q": "कौन सा जानवर जंगल का राजा है?",
                "en_q": "Which animal is king of the jungle?",
                "hi_a": "शेर",
                "en_a": "Lion"
            },
            {
                "id": 6,
                "hi_q": "कौन सा जानवर एक ताकतवर जंगली जानवर है?",
                "en_q": "Which animal is a strong wild animal?",
                "hi_a": "बाघ",
                "en_a": "Tiger"
            },
            {
                "id": 7,
                "hi_q": "कौन सा जानवर सबसे बड़ा स्थलीय जानवर है?",
                "en_q": "Which animal is the largest land animal?",
                "hi_a": "हाथी",
                "en_a": "Elephant"
            },
            {
                "id": 8,
                "hi_q": "कौन सा जानवर पेड़ों पर चढ़ना पसंद करता है?",
                "en_q": "Which animal loves climbing trees?",
                "hi_a": "बंदर",
                "en_a": "Monkey"
            },
            {
                "id": 9,
                "hi_q": "कौन सा जानवर खेत जोतने में मदद करता है?",
                "en_q": "Which animal is helps in ploughing fields?",
                "hi_a": "बैल",
                "en_a": "Ox"
            },
            {
                "id": 10,
                "hi_q": "कौन सा जानवर सवारी और सामान ढोने में काम आता है?",
                "en_q": "Which animal is used for riding and carrying loads?",
                "hi_a": "घोड़ा",
                "en_a": "Horse"
            },
            {
                "id": 11,
                "hi_q": "कौन सा जानवर पानी में तैरती है?",
                "en_q": "Which animal swims in water?",
                "hi_a": "मछली",
                "en_a": "Fish"
            },
            {
                "id": 12,
                "hi_q": "कौन सा जानवर समुद्र का सबसे बड़ा जानवर है?",
                "en_q": "Which animal is the largest sea animal?",
                "hi_a": "व्हेल",
                "en_a": "Whale"
            },
            {
                "id": 13,
                "hi_q": "कौन सा जानवर एक दोस्ताना समुद्री जानवर है?",
                "en_q": "Which animal is a friendly sea animal?",
                "hi_a": "डॉल्फ़िन",
                "en_a": "Dolphin"
            },
            {
                "id": 14,
                "hi_q": "कौन सा जानवर हरा पक्षी है जो आवाज़ की नकल कर सकता है?",
                "en_q": "Which animal is green bird that can mimic sounds?",
                "hi_a": "तोता",
                "en_a": "Parrot"
            },
            {
                "id": 15,
                "hi_q": "कौन सा जानवर भारत का राष्ट्रीय पक्षी है?",
                "en_q": "Which animal is national bird of india?",
                "hi_a": "मोर",
                "en_a": "Peacock"
            },
        ],
        "transport": [
            {
                "id": 1,
                "hi_q": "कौन सा वाहन परिवारों द्वारा यात्रा के लिए उपयोग की जाती है?",
                "en_q": "What is used by families for travel?",
                "hi_a": "कार",
                "en_a": "Car"
            },
            {
                "id": 2,
                "hi_q": "कौन सा वाहन कई लोगों को ले जाती है?",
                "en_q": "Who carries many people?",
                "hi_a": "बस",
                "en_a": "Bus"
            },
            {
                "id": 3,
                "hi_q": "कौन सा वाहन पटरियों पर चलती है?",
                "en_q": "Who runs on railway tracks?",
                "hi_a": "रेलगाड़ी",
                "en_a": "Train"
            },
            {
                "id": 4,
                "hi_q": "कौन सा वाहन दो पहियों वाला वाहन है?",
                "en_q": "Which vehicle is a two-wheel vehicle?",
                "hi_a": "साइकिल",
                "en_a": "Bicycle"
            },
            {
                "id": 5,
                "hi_q": "कौन सा वाहन छोटा जल वाहन है?",
                "en_q": "Which vehicle is small water vehicle?",
                "hi_a": "नाव",
                "en_a": "Boat"
            },
            {
                "id": 6,
                "hi_q": "कौन सा वाहन बड़ा जल वाहन है?",
                "en_q": "Which vehicle is big water vehicle?",
                "hi_a": "जहाज",
                "en_a": "Ship"
            },
            {
                "id": 7,
                "hi_q": "कौन सा वाहन लंबी दूरी तय करने का सबसे तेज़ साधन है?",
                "en_q": "Which vehicle is fastest way to travel long distances?",
                "hi_a": "हवाई जहाज",
                "en_a": "Aeroplane"
            },
            {
                "id": 8,
                "hi_q": "कौन सा वाहन छोटी जगहों पर भी उतर सकता है?",
                "en_q": "Which vehicle is can land in small areas?",
                "hi_a": "हेलीकॉप्टर",
                "en_a": "Helicopter"
            },
        ],
        "landforms": [
            {
                "id": 1,
                "hi_q": "स्थलरूप (Landforms) क्या होते हैं?",
                "en_q": "What are landforms?",
                "hi_a": "पृथ्वी की सतह के अलग-अलग प्राकृतिक आकार",
                "en_a": "Different natural shapes on the Earth's surface"
            },
            {
                "id": 2,
                "hi_q": "बहुत ऊँची भूमि को क्या कहते हैं?",
                "en_q": "What do we call very high land?",
                "hi_a": "पर्वत",
                "en_a": "Mountain"
            },
            {
                "id": 3,
                "hi_q": "पर्वतों की लंबी श्रृंखला को क्या कहते हैं?",
                "en_q": "What is a long chain of mountains called?",
                "hi_a": "पर्वतमाला",
                "en_a": "Mountain range"
            },
            {
                "id": 4,
                "hi_q": "पहाड़ और पर्वत में क्या अंतर है?",
                "en_q": "What is the difference between a hill and a mountain?",
                "hi_a": "पहाड़ छोटे होते हैं, पर्वत ऊँचे",
                "en_a": "Hills are smaller, mountains are higher"
            },
            {
                "id": 5,
                "hi_q": "समतल भूमि को क्या कहते हैं?",
                "en_q": "What do we call flat land?",
                "hi_a": "मैदान",
                "en_a": "Plain"
            },
            {
                "id": 6,
                "hi_q": "नदी के किनारे की उपजाऊ भूमि क्या कहलाती है?",
                "en_q": "What is the fertile land near rivers called?",
                "hi_a": "मैदान या समभूमि",
                "en_a": "Plain"
            },
            {
                "id": 7,
                "hi_q": "रेगिस्तान कैसा स्थलरूप है?",
                "en_q": "What type of landform is a desert?",
                "hi_a": "बहुत सूखा और रेत वाला क्षेत्र",
                "en_a": "Very dry and sandy area"
            },
            {
                "id": 8,
                "hi_q": "पठार क्या होता है?",
                "en_q": "What is a plateau?",
                "hi_a": "ऊँचा और समतल क्षेत्र",
                "en_a": "A high flat area"
            },
            {
                "id": 9,
                "hi_q": "घाटी क्या होती है?",
                "en_q": "What is a valley?",
                "hi_a": "दो पहाड़ों के बीच का नीचा क्षेत्र",
                "en_a": "Low land between mountains"
            },
            {
                "id": 10,
                "hi_q": "नदी क्या है?",
                "en_q": "What is a river?",
                "hi_a": "बहता हुआ पानी",
                "en_a": "Flowing water"
            },
            {
                "id": 11,
                "hi_q": "झील क्या होती है?",
                "en_q": "What is a lake?",
                "hi_a": "चारों ओर भूमि से घिरा पानी",
                "en_a": "Water surrounded by land"
            },
            {
                "id": 12,
                "hi_q": "समुद्र और महासागर में क्या अंतर है?",
                "en_q": "What is the difference between a sea and an ocean?",
                "hi_a": "महासागर बड़ा होता है, समुद्र छोटा",
                "en_a": "Ocean is larger, sea is smaller"
            },
            {
                "id": 13,
                "hi_q": "द्वीप क्या होता है?",
                "en_q": "What is an island?",
                "hi_a": "चारों ओर पानी से घिरी भूमि",
                "en_a": "Land surrounded by water"
            },
            {
                "id": 14,
                "hi_q": "प्रायद्वीप क्या होता है?",
                "en_q": "What is a peninsula?",
                "hi_a": "तीन ओर पानी से घिरी भूमि",
                "en_a": "Land surrounded by water on three sides"
            },
            {
                "id": 15,
                "hi_q": "झरना क्या होता है?",
                "en_q": "What is a waterfall?",
                "hi_a": "ऊँचाई से गिरता हुआ पानी",
                "en_a": "Water falling from a height"
            },
            {
                "id": 16,
                "hi_q": "ज्वालामुखी क्या है?",
                "en_q": "What is a volcano?",
                "hi_a": "पृथ्वी के अंदर से लावा निकलने का स्थान",
                "en_a": "An opening where lava comes out from Earth"
            },
            {
                "id": 17,
                "hi_q": "समुद्र तट क्या होता है?",
                "en_q": "What is a seashore?",
                "hi_a": "जहाँ भूमि और समुद्र मिलते हैं",
                "en_a": "Where land meets the sea"
            },
            {
                "id": 18,
                "hi_q": "गुफा क्या होती है?",
                "en_q": "What is a cave?",
                "hi_a": "पहाड़ या चट्टान के अंदर की खाली जगह",
                "en_a": "A hollow space inside a rock or mountain"
            },
            {
                "id": 19,
                "hi_q": "हिमनद (Glacier) क्या है?",
                "en_q": "What is a glacier?",
                "hi_a": "धीरे-धीरे चलने वाली बर्फ की बड़ी चादर",
                "en_a": "A large slow-moving mass of ice"
            },
            {
                "id": 20,
                "hi_q": "डेल्टा क्या होता है?",
                "en_q": "What is a delta?",
                "hi_a": "जहाँ नदी समुद्र में मिलते समय कई धाराओं में बंटती है",
                "en_a": "Where a river splits into branches before meeting the sea"
            },
            {
                "id": 21,
                "hi_q": "मैदान खेती के लिए क्यों अच्छे होते हैं?",
                "en_q": "Why are plains good for farming?",
                "hi_a": "क्योंकि भूमि समतल और उपजाऊ होती है",
                "en_a": "Because the land is flat and fertile"
            },
            {
                "id": 22,
                "hi_q": "पहाड़ी क्षेत्रों में मौसम कैसा होता है?",
                "en_q": "What is the climate like in hilly areas?",
                "hi_a": "ठंडा",
                "en_a": "Cold"
            },
            {
                "id": 23,
                "hi_q": "रेगिस्तान में पानी कम क्यों होता है?",
                "en_q": "Why is there very little water in deserts?",
                "hi_a": "बहुत कम वर्षा होती है",
                "en_a": "Very little rainfall"
            },
            {
                "id": 24,
                "hi_q": "समुद्र का पानी कैसा होता है?",
                "en_q": "What is sea water like?",
                "hi_a": "खारा",
                "en_a": "Salty"
            },
            {
                "id": 25,
                "hi_q": "स्थलरूपों को जानना क्यों जरूरी है?",
                "en_q": "Why is it important to learn about landforms?",
                "hi_a": "पृथ्वी को समझने के लिए",
                "en_a": "To understand the Earth better"
            },
        ],
        "water_animals": [
            {
                "id": 1,
                "hi_q": "मछलियाँ कहाँ रहती हैं?",
                "en_q": "Where do fish live?",
                "hi_a": "पानी में",
                "en_a": "In water"
            },
            {
                "id": 2,
                "hi_q": "मछलियाँ किससे सांस लेती हैं?",
                "en_q": "How do fish breathe?",
                "hi_a": "गलफड़ों से",
                "en_a": "With gills"
            },
            {
                "id": 3,
                "hi_q": "दुनिया का सबसे बड़ा समुद्री जानवर कौन है?",
                "en_q": "Which is the largest sea animal in the world?",
                "hi_a": "नीली व्हेल",
                "en_a": "Blue whale"
            },
            {
                "id": 4,
                "hi_q": "डॉल्फिन किस प्रकार का जानवर है?",
                "en_q": "What type of animal is a dolphin?",
                "hi_a": "स्तनपायी (मेमल)",
                "en_a": "Mammal"
            },
            {
                "id": 5,
                "hi_q": "ऑक्टोपस के कितने हाथ (भुजाएँ) होते हैं?",
                "en_q": "How many arms does an octopus have?",
                "hi_a": "आठ",
                "en_a": "Eight"
            },
            {
                "id": 6,
                "hi_q": "समुद्र में रहने वाली बड़ी मछली कौन सी है?",
                "en_q": "Name a very big fish found in the sea.",
                "hi_a": "व्हेल शार्क",
                "en_a": "Whale shark"
            },
            {
                "id": 7,
                "hi_q": "मेंढक पानी और जमीन दोनों पर रह सकता है क्या?",
                "en_q": "Can a frog live both in water and on land?",
                "hi_a": "हाँ",
                "en_a": "Yes"
            },
            {
                "id": 8,
                "hi_q": "कछुआ कहाँ रहता है?",
                "en_q": "Where does a turtle live?",
                "hi_a": "पानी और जमीन दोनों पर",
                "en_a": "Both in water and on land"
            },
            {
                "id": 9,
                "hi_q": "केकड़ा कैसे चलता है?",
                "en_q": "How does a crab walk?",
                "hi_a": "तिरछा (साइड में)",
                "en_a": "Sideways"
            },
            {
                "id": 10,
                "hi_q": "स्टारफिश (समुद्री तारा) किस प्रकार के जीव हैं?",
                "en_q": "What type of creature is a starfish?",
                "hi_a": "समुद्री जीव",
                "en_a": "Sea animal"
            },
            {
                "id": 11,
                "hi_q": "जेलीफ़िश का शरीर कैसा होता है?",
                "en_q": "What is the body of a jellyfish like?",
                "hi_a": "नरम और पारदर्शी",
                "en_a": "Soft and transparent"
            },
            {
                "id": 12,
                "hi_q": "समुद्री घोड़ा किसे कहते हैं?",
                "en_q": "What do we call a seahorse?",
                "hi_a": "एक छोटी समुद्री मछली",
                "en_a": "A small sea fish"
            },
            {
                "id": 13,
                "hi_q": "शार्क किस प्रकार की मछली है?",
                "en_q": "What type of fish is a shark?",
                "hi_a": "मांसाहारी",
                "en_a": "Carnivorous"
            },
            {
                "id": 14,
                "hi_q": "डॉल्फिन किसके लिए जानी जाती है?",
                "en_q": "What are dolphins known for?",
                "hi_a": "बुद्धिमानी और खेलना",
                "en_a": "Intelligence and playfulness"
            },
            {
                "id": 15,
                "hi_q": "व्हेल मछली है या स्तनपायी?",
                "en_q": "Is a whale a fish or a mammal?",
                "hi_a": "स्तनपायी",
                "en_a": "Mammal"
            },
            {
                "id": 16,
                "hi_q": "ऑक्टोपस किससे खुद की रक्षा करता है?",
                "en_q": "How does an octopus protect itself?",
                "hi_a": "स्याही छोड़कर",
                "en_a": "By releasing ink"
            },
            {
                "id": 17,
                "hi_q": "झींगा (श्रिम्प) कहाँ पाया जाता है?",
                "en_q": "Where is shrimp found?",
                "hi_a": "समुद्र और नदियों में",
                "en_a": "In seas and rivers"
            },
            {
                "id": 18,
                "hi_q": "समुद्री कछुआ कहाँ अंडे देता है?",
                "en_q": "Where does a sea turtle lay eggs?",
                "hi_a": "समुद्र तट की रेत में",
                "en_a": "In sand on the beach"
            },
            {
                "id": 19,
                "hi_q": "जल में रहने वाले जानवरों को क्या कहते हैं?",
                "en_q": "What do we call animals that live in water?",
                "hi_a": "जलीय जीव",
                "en_a": "Aquatic animals"
            },
            {
                "id": 20,
                "hi_q": "मछलियों का शरीर किससे ढका होता है?",
                "en_q": "What covers the body of most fish?",
                "hi_a": "शल्क (स्केल्स)",
                "en_a": "Scales"
            },
            {
                "id": 21,
                "hi_q": "डॉल्फिन सांस लेने के लिए कहाँ आती है?",
                "en_q": "Where does a dolphin come to breathe?",
                "hi_a": "पानी की सतह पर",
                "en_a": "To the water surface"
            },
            {
                "id": 22,
                "hi_q": "सील (Seal) किस प्रकार का जानवर है?",
                "en_q": "What type of animal is a seal?",
                "hi_a": "समुद्री स्तनपायी",
                "en_a": "Marine mammal"
            },
            {
                "id": 23,
                "hi_q": "जल प्रदूषण से किसे नुकसान होता है?",
                "en_q": "Who gets harmed due to water pollution?",
                "hi_a": "जलीय जीव",
                "en_a": "Aquatic animals"
            },
            {
                "id": 24,
                "hi_q": "हमें समुद्र और नदियों को साफ क्यों रखना चाहिए?",
                "en_q": "Why should we keep seas and rivers clean?",
                "hi_a": "जलीय जीवों की सुरक्षा के लिए",
                "en_a": "To protect aquatic life"
            },
        ],
        "buildings": [
            {
                "id": 1,
                "hi_q": "कौन वह जगह है जहाँ परिवार रहता है। यह हमें सुरक्षित और आरामदायक रखता है। ?",
                "en_q": "Which place where a family lives. It keeps us safe and comfortable.?",
                "hi_a": "घर",
                "en_a": "House"
            },
            {
                "id": 2,
                "hi_q": "कौन वह जगह है जहाँ बच्चे पढ़ते हैं। यहाँ शिक्षक पढ़ाते हैं। ?",
                "en_q": "What is a place where children learn. Teachers teach students here.?",
                "hi_a": "स्कूल",
                "en_a": "School"
            },
            {
                "id": 3,
                "hi_q": "कौन वह जगह है जहाँ बीमार लोगों का इलाज होता है। यहाँ डॉक्टर और नर्स काम करते हैं। ?",
                "en_q": "Which place where sick people get treatment. Doctors and nurses work here.?",
                "hi_a": "अस्पताल",
                "en_a": "Hospital"
            },
            {
                "id": 4,
                "hi_q": "कौन वह जगह है जहाँ लोग काम करते हैं। ?",
                "en_q": "Which place where people work.?",
                "hi_a": "कार्यालय",
                "en_a": "Office"
            },
            {
                "id": 5,
                "hi_q": "कौन वह जगह है जहाँ हम चीजें खरीदते हैं। ?",
                "en_q": "Which place where we buy things.?",
                "hi_a": "दुकान",
                "en_a": "Shop"
            },
            {
                "id": 6,
                "hi_q": "कौन हमारे पैसे सुरक्षित रखता है। ?",
                "en_q": "What is keeps our money safe.?",
                "hi_a": "बैंक",
                "en_a": "Bank"
            },
            {
                "id": 7,
                "hi_q": "कौन चिट्ठियाँ और पार्सल भेजता है। ?",
                "en_q": "What is sends letters and parcels.?",
                "hi_a": "डाकघर",
                "en_a": "Post Office"
            },
            {
                "id": 8,
                "hi_q": "यहाँ पुलिस काम करती है ताकि हम सुरक्षित रहें।  (कौन?)",
                "en_q": "What is Police officers work here to keep us safe. ?",
                "hi_a": "पुलिस स्टेशन",
                "en_a": "Police Station"
            },
            {
                "id": 9,
                "hi_q": "अग्निशामक यहाँ रहते हैं और आग बुझाने जाते हैं। इमारतें कैसे बनती हैं इमारतें ईंट, सीमेंट, रेत और लोहे से बनती हैं। इंजीनियर और मजदूर इन्हें बनाने में मदद करते हैं। घर, स्कूल, अस्पताल — buildings help me and you! दुकान, बैंक, दफ्तर — buildings big and small!  (कौन?)",
                "en_q": "What is Firefighters stay here and go to put out fires. 🏗️ HOW BUILDINGS ARE MADE Buildings are made with bricks, cement, sand, and steel. Engineers and workers help build them. House and school, hospital too, Shops and banks and offices tall, ?",
                "hi_a": "अग्निशमन केंद्र",
                "en_a": "Fire Station"
            },
        ],
        "good_manners": [
            {
                "id": 1,
                "hi_q": "कुछ मांगते समय “कृपया” कहते हैं।  (कौन?)",
                "en_q": "What is We say “please” when asking for something.?",
                "hi_a": "कृपया बोलें",
                "en_a": ""
            },
            {
                "id": 2,
                "hi_q": "जब कोई मदद करे तो “धन्यवाद” कहते हैं।  (कौन?)",
                "en_q": "What is We say “thank you” when someone helps us.?",
                "hi_a": "धन्यवाद कहें",
                "en_a": ""
            },
            {
                "id": 3,
                "hi_q": "हम “गुड मॉर्निंग” या “नमस्ते” कहते हैं।  (कौन?)",
                "en_q": "What is We say “Good morning” or “Namaste”. ?",
                "hi_a": "नमस्ते करें",
                "en_a": "Greet Others"
            },
            {
                "id": 4,
                "hi_q": "हम खिलौने और खाना दोस्तों के साथ बाँटते हैं।  (कौन?)",
                "en_q": "What is We share toys and food with friends. ?",
                "hi_a": "साझा करें",
                "en_a": "Share With Others"
            },
            {
                "id": 5,
                "hi_q": "हमें कचरा जमीन पर नहीं फेंकना चाहिए।  (कौन?)",
                "en_q": "What is We should not throw garbage on the ground. ?",
                "hi_a": "सफाई रखें",
                "en_a": "Keep Things Clean"
            },
            {
                "id": 6,
                "hi_q": "जब किसी को मदद की जरूरत हो तो मदद करें।  (कौन?)",
                "en_q": "What is We should help others when they need help. ?",
                "hi_a": "दयालु बनें",
                "en_a": "Be Kind"
            },
            {
                "id": 7,
                "hi_q": "हमें चिल्लाना या बुरे शब्द नहीं बोलने चाहिए।  (कौन?)",
                "en_q": "What is We should not shout or use bad words. ?",
                "hi_a": "विनम्रता से बोलें",
                "en_a": "Speak Politely"
            },
            {
                "id": 8,
                "hi_q": "खाँसते या छींकते समय कौन। ?",
                "en_q": "What is while coughing or sneezing.?",
                "hi_a": "मुँह ढकें",
                "en_a": "Cover Your Mouth"
            },
            {
                "id": 9,
                "hi_q": "माता-पिता, शिक्षक और बड़ों का सम्मान करें। अच्छे व्यवहार क्यों ज़रूरी हैं अच्छे व्यवहार से सभी खुश रहते हैं। ये हमें अच्छे दोस्त बनाने में मदद करते हैं। कृपया और धन्यवाद — manners show the way! मदद करो, बाँटो प्यार — good manners everywhere!  (कौन?)",
                "en_q": "What is Respect parents, teachers, and elders. 🌟 WHY GOOD MANNERS ARE IMPORTANT Good manners make everyone happy. They help us make good friends. Please and thank you, smile each day, Help and share, be kind and fair, ?",
                "hi_a": "बड़ों की बात सुनें",
                "en_a": "Listen to Elders"
            },
        ],
        "water_animals_facts": [
            {
                "id": 1,
                "hi_q": "मछलियों के पास तैरने के लिए पंख और पूंछ होती है। वे गलफड़ों से सांस लेती हैं।  (कौन?)",
                "en_q": "Which animal have fins and tails to swim. They breathe through gills.?",
                "hi_a": "मछली",
                "en_a": "Fish"
            },
            {
                "id": 2,
                "hi_q": "कौन दोस्ताना और बुद्धिमान जानवर हैं। वे समुद्र में रहती हैं। ?",
                "en_q": "Which animal s are friendly and intelligent animals. They live in the sea.?",
                "hi_a": "डॉल्फ़िन",
                "en_a": "Dolphin"
            },
            {
                "id": 3,
                "hi_q": "कौन समुद्र के सबसे बड़े जानवर हैं। वे स्तनधारी होते हैं। ?",
                "en_q": "Which animal s are the largest animals in the ocean. They are mammals.?",
                "hi_a": "व्हेल",
                "en_a": "Whale"
            },
            {
                "id": 4,
                "hi_q": "कौन की आठ भुजाएँ होती हैं। यह अपना रंग बदल सकता है। ?",
                "en_q": "Which animal has eight arms. It can change its color.?",
                "hi_a": "ऑक्टोपस",
                "en_a": "Octopus"
            },
            {
                "id": 5,
                "hi_q": "कौन तारे जैसी दिखती है। यह समुद्र के तल में रहती है। ?",
                "en_q": "Which animal looks like a star. It lives at the bottom of the sea.?",
                "hi_a": "स्टारफिश",
                "en_a": "Starfish"
            },
            {
                "id": 6,
                "hi_q": "केकड़ों का खोल सख्त होता है और पंजे होते हैं। वे तिरछा चलते हैं।  (कौन?)",
                "en_q": "Which animal s have hard shells and claws. They walk sideways.?",
                "hi_a": "केकड़ा",
                "en_a": "Crab"
            },
            {
                "id": 7,
                "hi_q": "कछुओं का खोल सख्त होता है। वे पानी और जमीन दोनों पर रह सकते हैं।  (कौन?)",
                "en_q": "Which animal s have hard shells. They can live in water and on land.?",
                "hi_a": "कछुआ",
                "en_a": "Turtle"
            },
            {
                "id": 8,
                "hi_q": "समुद्री घोड़े छोटे समुद्री जीव होते हैं। ये छोटे घोड़ों जैसे दिखते हैं।  (कौन?)",
                "en_q": "Which animal s are small sea animals. They look like tiny horses.?",
                "hi_a": "समुद्री घोड़ा",
                "en_a": "Seahorse"
            },
            {
                "id": 9,
                "hi_q": "कौन का शरीर जेली जैसा मुलायम होता है। कुछ कौन डंक मार सकती हैं। ?",
                "en_q": "Which animal have soft, jelly-like bodies. Some jellyfish can sting.?",
                "hi_a": "जेलीफ़िश",
                "en_a": "Jellyfish"
            },
            {
                "id": 10,
                "hi_q": "कौन ताकतवर समुद्री जानवर हैं। इनके दाँत बहुत तेज होते हैं। नीले पानी में मछलियाँ तैरें — swift and true! डॉल्फ़िन कूदे, व्हेल बड़ी — sea life is so big! ?",
                "en_q": "Which animal s are strong sea animals. They have sharp teeth. Fish swim fast in water blue, Dolphins jump and whales are big,?",
                "hi_a": "शार्क",
                "en_a": "Shark"
            },
        ],
        "insects": [
            {
                "id": 1,
                "hi_q": "तितलियों के पंख रंग-बिरंगे होते हैं। वे फूलों पर उड़ती हैं।  (कौन?)",
                "en_q": "Which insect Butterflies have colorful wings. They fly from flower to flower. ?",
                "hi_a": "तितली",
                "en_a": "Butterfly"
            },
            {
                "id": 2,
                "hi_q": "चींटियाँ बहुत मेहनती होती हैं। वे झुंड में रहती हैं।  (कौन?)",
                "en_q": "Which insect s are very hardworking insects. They live in groups.?",
                "hi_a": "चींटी",
                "en_a": "Ant"
            },
            {
                "id": 3,
                "hi_q": "मधुमक्खियाँ फूलों से रस इकट्ठा करती हैं। वे शहद बनाती हैं।  (कौन?)",
                "en_q": "Which insect Bees collect nectar from flowers. They make honey. ?",
                "hi_a": "मधुमक्खी",
                "en_a": "Honey Bee"
            },
            {
                "id": 4,
                "hi_q": "कौन छोटे लाल कीड़े होते हैं जिन पर काले धब्बे होते हैं। ये पौधों के लिए फायदेमंद होते हैं। ?",
                "en_q": "Which insect s are small and red with black spots. They are helpful for plants.?",
                "hi_a": "लेडीबर्ड",
                "en_a": "Ladybug"
            },
            {
                "id": 5,
                "hi_q": "टिड्डे बहुत दूर तक कूद सकते हैं। ये हरे रंग के होते हैं।  (कौन?)",
                "en_q": "Which insect s can jump very far. They are green in color.?",
                "hi_a": "टिड्डा",
                "en_a": "Grasshopper"
            },
            {
                "id": 6,
                "hi_q": "कौन लोगों और जानवरों को काटते हैं। ये बीमारियाँ फैला सकते हैं। ?",
                "en_q": "Which insect es bite people and animals. They can spread diseases.?",
                "hi_a": "मच्छर",
                "en_a": "Mosquito"
            },
            {
                "id": 7,
                "hi_q": "मक्खियाँ खाने और गंदी जगहों पर बैठती हैं। ये कीटाणु फैला सकती हैं।  (कौन?)",
                "en_q": "Which insect Houseflies sit on food and dirty places. They can spread germs. ?",
                "hi_a": "मक्खी",
                "en_a": "Housefly"
            },
            {
                "id": 8,
                "hi_q": "कौन का शरीर लंबा और पंख बड़े होते हैं। वे बहुत तेज उड़ सकती हैं। ?",
                "en_q": "Which insect Dragonflies have long bodies and big wings. They can fly very fast. ?",
                "hi_a": "व्याध पतंग",
                "en_a": "Dragonfly"
            },
            {
                "id": 9,
                "hi_q": "कौन आगे चलकर तितली बनती है। उन्हें पत्ते खाना पसंद है। ?",
                "en_q": "Which insect s later turn into butterflies. They love eating leaves.?",
                "hi_a": "इल्ली",
                "en_a": "Caterpillar"
            },
            {
                "id": 10,
                "hi_q": "मकड़ियाँ जाल बनाकर कीड़े पकड़ती हैं। इनके आठ पैर होते हैं। तितली उड़ती, मधुमक्खी गुनगुनाए — in the sky! चींटियाँ मेहनत करें, टिड्डे कूदें — insects never sleep!  (कौन?)",
                "en_q": "Which insect s spin webs to catch insects. They have eight legs. Butterflies flutter, bees buzz by, Ants work hard and grasshoppers leap,?",
                "hi_a": "मकड़ी",
                "en_a": "Spider"
            },
            {
                "id": 11,
                "hi_q": "कौन एक सुंदर फूल है जिसकी पंखुड़ियाँ मुलायम होती हैं। इसमें मीठी खुशबू होती है। कौन लाल, कौनी और सफेद रंगों में मिलते हैं। ?",
                "en_q": "Which insect a beautiful flower with soft petals. It has a sweet fragrance. Roses come in many colors like red, pink, and white.?",
                "hi_a": "गुलाब",
                "en_a": "Rose"
            },
            {
                "id": 12,
                "hi_q": "भारत का राष्ट्रीय insect कौन सा है?",
                "en_q": "Which is the national insect?",
                "hi_a": "कमल",
                "en_a": "Lotus"
            },
            {
                "id": 13,
                "hi_q": "कौन बड़ा और चमकीला पीला होता है। यह सूरज की दिशा में घूमता है। इसके बीज खाने में काम आते हैं। ?",
                "en_q": "Which insect large and bright yellow. It turns towards the sun. Its seeds are used as food.?",
                "hi_a": "सूरजमुखी",
                "en_a": "Sunflower"
            },
            {
                "id": 14,
                "hi_q": "कौन नारंगी या पीला होता है। इसे सजावट और माला बनाने में उपयोग करते हैं। यह बगीचों में आसानी से उगता है। ?",
                "en_q": "Which insect orange or yellow in color. It is used for decoration and garlands. It blooms easily in gardens.?",
                "hi_a": "गेंदा",
                "en_a": "Marigold"
            },
            {
                "id": 15,
                "hi_q": "कौन छोटा सफेद फूल है। इसकी खुशबू बहुत अच्छी होती है। इससे इत्र और बालों की मालाएँ बनती हैं। ?",
                "en_q": "Which insect a small white flower. It has a very sweet smell. It is used to make perfumes and hair garlands.?",
                "hi_a": "चमेली",
                "en_a": "Jasmine"
            },
            {
                "id": 16,
                "hi_q": "कौन बड़ा और सुंदर फूल है। यह सफेद, गुलाबी और नारंगी रंग में मिलता है। कौन फूलों के गुलदस्तों में उपयोग होती है। ?",
                "en_q": "Which insect a large and elegant flower. It comes in white, pink, and orange colors. Lilies are often used in bouquets.?",
                "hi_a": "लिली",
                "en_a": "Lily"
            },
            {
                "id": 17,
                "hi_q": "कौन ठंडी जगहों पर उगते हैं। इनकी पंखुड़ियाँ कप जैसी होती हैं। कौन कई चमकीले रंगों में मिलते हैं। ?",
                "en_q": "Which insect s grow in cold places. They have cup-shaped petals. Tulips come in many bright colors.?",
                "hi_a": "ट्यूलिप",
                "en_a": "Tulip"
            },
            {
                "id": 18,
                "hi_q": "कौन बड़ा और रंगीन होता है। यह अक्सर लाल होता है पर अन्य रंगों में भी मिलता है। इसे मंदिरों में चढ़ाया जाता है। ?",
                "en_q": "Which insect big and colorful. It is often red but can be other colors too. It is offered in temples.?",
                "hi_a": "गुड़हल",
                "en_a": "Hibiscus"
            },
            {
                "id": 19,
                "hi_q": "कौन छोटा और सुंदर फूल है। इसकी सफेद पंखुड़ियाँ और पीला बीच होता है। यह बगीचों और खेतों में उगता है। ?",
                "en_q": "Which insect a small and cheerful flower. It has white petals and a yellow center. It grows in gardens and fields.?",
                "hi_a": "गुलबहार",
                "en_a": "Daisy"
            },
            {
                "id": 20,
                "hi_q": "कौन खास और अनोखे फूल होते हैं। ये कई आकार और रंगों में मिलते हैं। इन्हें सजावट में उपयोग किया जाता है। ?",
                "en_q": "Which insect s are special and exotic flowers. They come in many shapes and colors. They are often used for decoration.?",
                "hi_a": "ऑर्किड",
                "en_a": "Orchid"
            },
        ],
        "flowers": [
            {
                "id": 1,
                "hi_q": "कौन एक सुंदर फूल है। इसकी खुशबू बहुत अच्छी होती है。 ?",
                "en_q": "What is a beautiful flower. It has a sweet smell.?",
                "hi_a": "गुलाब",
                "en_a": "Rose"
            },
            {
                "id": 2,
                "hi_q": "भारत का राष्ट्रीय flower कौन सा है?",
                "en_q": "Which is the national flower?",
                "hi_a": "कमल",
                "en_a": "Lotus"
            },
            {
                "id": 3,
                "hi_q": "कौन बड़ा और पीला होता है। यह सूरज की ओर मुड़ता है। ?",
                "en_q": "What is big and yellow. It turns towards the sun.?",
                "hi_a": "सूरजमुखी",
                "en_a": "Sunflower"
            },
            {
                "id": 4,
                "hi_q": "कौन नारंगी या पीला होता है। इसे सजावट में उपयोग करते हैं। ?",
                "en_q": "What is orange or yellow. It is used in decorations.?",
                "hi_a": "गेंदा",
                "en_a": "Marigold"
            },
            {
                "id": 5,
                "hi_q": "कौन छोटी और सफेद होती है। इसकी खुशबू मनभावन होती है। फूल सजावट के लिए उपयोग होते हैं। इन्हें मंदिरों में चढ़ाया जाता है। कुछ फूलों से इत्र बनाया जाता है। लाल गुलाब, पीला सूरजमुखी — flowers are fun! कमल, कौन, गेंदा — make the world bright! ?",
                "en_q": "What is small and white. It has a lovely smell. Flowers are used for decoration. They are offered in temples. Some flowers are used to make perfumes. Red rose and yellow sun, Lotus, jasmine, marigold bright,?",
                "hi_a": "चमेली",
                "en_a": "Jasmine"
            },
        ],
        "spices": [
            {
                "id": 1,
                "hi_q": "कौन पीले रंग की होती है। यह खाने को रंग देती है और सेहत के लिए अच्छी होती है। ?",
                "en_q": "What is yellow in color. It gives color to food and is good for health.?",
                "hi_a": "हल्दी",
                "en_a": "Turmeric"
            },
            {
                "id": 2,
                "hi_q": "कौन छोटे भूरे बीज होते हैं। यह खाने में अच्छी खुशबू लाता है। ?",
                "en_q": "What is seeds are small and brown. It adds a nice smell to food.?",
                "hi_a": "जीरा",
                "en_a": "Cumin"
            },
            {
                "id": 3,
                "hi_q": "कौन के बीज और पाउडर खाना बनाने में उपयोग होते हैं। यह खाने का स्वाद बढ़ाता है। ?",
                "en_q": "What is seeds and powder are used in cooking. It adds flavor to dishes.?",
                "hi_a": "धनिया",
                "en_a": "Coriander"
            },
            {
                "id": 4,
                "hi_q": "कौन खाना तीखा बनाती है। ?",
                "en_q": "What is makes food spicy.?",
                "hi_a": "लाल मिर्च",
                "en_a": "Red Chili"
            },
            {
                "id": 5,
                "hi_q": "कौन छोटी और गोल होती है। यह हल्की तीखापन देती है। ?",
                "en_q": "What is small and round. It adds mild spice to food.?",
                "hi_a": "काली मिर्च",
                "en_a": "Black Pepper"
            },
            {
                "id": 6,
                "hi_q": "कौन के दाने छोटे और काले या पीले होते हैं। ?",
                "en_q": "What is tiny and black or yellow.?",
                "hi_a": "सरसों",
                "en_a": "Mustard Seeds"
            },
            {
                "id": 7,
                "hi_q": "इनका उपयोग तड़के में होता है।  (कौन?)",
                "en_q": "What is ?",
                "hi_a": "tadka",
                "en_a": "They are used in tempering"
            },
            {
                "id": 8,
                "hi_q": "कौन छोटे और गहरे भूरे होते हैं। इनकी खुशबू तेज होती है। ?",
                "en_q": "What is small and dark brown. They have a strong smell.?",
                "hi_a": "लौंग",
                "en_a": "Cloves"
            },
            {
                "id": 9,
                "hi_q": "कौन छोटी और हरी होती है। इसे मिठाइयों और चाय में डालते हैं। ?",
                "en_q": "What is small and green. It is used in sweets and tea.?",
                "hi_a": "इलायची",
                "en_a": "Cardamom"
            },
            {
                "id": 10,
                "hi_q": "कौन भूरे डंडे जैसी दिखती है। इसकी खुशबू मीठी और अच्छी होती है। ?",
                "en_q": "What is looks like a brown stick. It smells sweet and nice.?",
                "hi_a": "दालचीनी",
                "en_a": "Cinnamon"
            },
            {
                "id": 11,
                "hi_q": "कौन की गंध तेज होती है। यह पाचन में मदद करती है। मसाले क्यों ज़रूरी हैं मसाले खाने को स्वादिष्ट और रंगीन बनाते हैं। कुछ मसाले सेहत के लिए भी अच्छे होते हैं। हल्दी, जीरा, धनिया — tasty food for you! इलायची, लौंग, दालचीनी — make the flavor quick! ?",
                "en_q": "What is has a strong smell. It helps in digestion. 🌶️ WHY SPICES ARE IMPORTANT Spices make food tasty and colorful. Some spices are good for health. Haldi, jeera, dhania too, Elaichi, laung and dalchini stick,?",
                "hi_a": "हींग",
                "en_a": "Asafoetida"
            },
        ],
        "directions_info": [
            {
                "id": 1,
                "hi_q": "तुम्हारा कौन हाथ इस तरफ होता है। ?",
                "en_q": "What is Your left hand is on this side. ?",
                "hi_a": "बायाँ",
                "en_a": "Left"
            },
            {
                "id": 2,
                "hi_q": "तुम्हारा कौन हाथ इस तरफ होता है। ?",
                "en_q": "What is Your right hand is on this side. ?",
                "hi_a": "दायाँ",
                "en_a": "Right"
            },
            {
                "id": 3,
                "hi_q": "पक्षी आसमान में कौन उड़ते हैं। ?",
                "en_q": "What is Birds fly up in the sky. ?",
                "hi_a": "ऊपर",
                "en_a": "Up"
            },
            {
                "id": 4,
                "hi_q": "गेंद जमीन पर कौन गिरती है। ?",
                "en_q": "What is A ball falls down on the ground. ?",
                "hi_a": "नीचे",
                "en_a": "Down"
            },
            {
                "id": 5,
                "hi_q": "कौन – स्कूल मेरे घर के कौन है। ?",
                "en_q": "What is The school is near my house.?",
                "hi_a": "पास",
                "en_a": "Near"
            },
            {
                "id": 6,
                "hi_q": "कौन – बाजार यहाँ से कौन है। ?",
                "en_q": "What is The market is far from here.?",
                "hi_a": "दूर",
                "en_a": "Far"
            },
            {
                "id": 7,
                "hi_q": "कौन – किताब बैग के कौन है। ?",
                "en_q": "What is The book is inside the bag.?",
                "hi_a": "अंदर",
                "en_a": "Inside"
            },
            {
                "id": 8,
                "hi_q": "कौन – कुत्ता घर के कौन है। दिशाएँ क्यों महत्वपूर्ण हैं दिशाएँ हमें जगह ढूंढने में मदद करती हैं। ये हमें रास्ता भटकने से बचाती हैं। बायाँ, दायाँ, ऊपर, नीचे — move around the town! पास और दूर, अंदर-कौन — that’s what directions are about! ?",
                "en_q": "What is The dog is outside the house.🎯 WHY DIRECTIONS ARE IMPORTANT Directions help us find places. They keep us from getting lost. Left and right, up and down, Near and far, inside, out, ?",
                "hi_a": "बाहर",
                "en_a": "Outside"
            },
        ],
        "family_members": [
            {
                "id": 1,
                "hi_q": "कौन परिवार की देखभाल के लिए मेहनत करते हैं। ?",
                "en_q": "What is works hard to take care of the family.?",
                "hi_a": "पिता",
                "en_a": "Father"
            },
            {
                "id": 2,
                "hi_q": "कौन खाना बनाती हैं और सबकी देखभाल करती हैं। ?",
                "en_q": "What is cooks food and looks after everyone.?",
                "hi_a": "माता",
                "en_a": "Mother"
            },
            {
                "id": 3,
                "hi_q": "कौन हमारे साथ खेलता और पढ़ता है। ?",
                "en_q": "What is plays and studies with us.?",
                "hi_a": "भाई",
                "en_a": "Brother"
            },
            {
                "id": 4,
                "hi_q": "कौन खिलौने बाँटती है और घर में मदद करती है। ?",
                "en_q": "What is shares toys and helps at home.?",
                "hi_a": "बहन",
                "en_a": "Sister"
            },
            {
                "id": 5,
                "hi_q": "कौन हमें कहानियाँ सुनाते हैं और प्यार करते हैं। ?",
                "en_q": "What is tells us stories and loves us.?",
                "hi_a": "दादा/नाना",
                "en_a": "Grandfather"
            },
            {
                "id": 6,
                "hi_q": "हमें हमारी देखभाल करती हैं और सोने से पहले कहानियाँ सुनाती हैं। परिवार क्यों महत्वपूर्ण है परिवार हमें प्यार और सहारा । हम परिवार के साथ सुरक्षित और खुश महसूस करते हैं। परिवार मतलब प्यार अपार। हर दिन मिलकर रहें, खुश रहें — that’s the family way! कौन देता है?",
                "en_q": "What gives us Grandmother takes care of us and tells bedtime stories. ❤️ WHY FAMILY IS IMPORTANT Family gives us love and support. We feel safe and happy with our family. Family means love and care, We help each other every day,?",
                "hi_a": "दादी/नानी",
                "en_a": "Grandmother"
            },
        ],
        "festivals": [
            {
                "id": 1,
                "hi_q": "कौन रोशनी का त्योहार है। लोग दीये जलाते हैं और घर सजाते हैं। हम मिठाइयाँ बाँटते हैं और खुशियाँ मनाते हैं। ?",
                "en_q": "What is the festival of lights. People light diyas and decorate their homes. We share sweets and happiness.?",
                "hi_a": "दीवाली",
                "en_a": "Diwali"
            },
            {
                "id": 2,
                "hi_q": "कौन रंगों का त्योहार है। लोग रंग और पानी से खेलते हैं। यह खुशी और दोस्ती का त्योहार है। ?",
                "en_q": "What is the festival of colors. People play with colors and water. It celebrates joy and friendship.?",
                "hi_a": "होली",
                "en_a": "Holi"
            },
            {
                "id": 3,
                "hi_q": "कौन मुस्लिमों का त्योहार है। लोग नमाज़ पढ़ते हैं और नए कपड़े पहनते हैं। वे मिठाइयाँ और खाना बाँटते हैं। ?",
                "en_q": "What is a festival celebrated by Muslims. People offer prayers and wear new clothes. They share sweets and food.?",
                "hi_a": "ईद",
                "en_a": "Eid"
            },
            {
                "id": 4,
                "hi_q": "कौन यीशु मसीह के जन्मदिन पर मनाया जाता है। लोग कौन ट्री सजाते हैं। बच्चों को सांता क्लॉस से उपहार मिलते हैं। त्योहार क्यों महत्वपूर्ण हैं त्योहार खुशी और एकता लाते हैं। वे हमें बाँटना और प्रेम करना सिखाते हैं। दीवाली की रोशनी जगमग light! होली के रंग उड़ें हर जगह, everywhere! ईद और कौन खुशियाँ लाएँ — big and small! ?",
                "en_q": "What is celebrates the birthday of Jesus Christ. People decorate Christmas trees. Children receive gifts from Santa Claus. 🎊 WHY FESTIVALS ARE IMPORTANT Festivals bring happiness and togetherness. They teach us to share and care. Lights of Diwali shining bright, Colors of Holi in the air, Eid and Christmas bring joy to all,?",
                "hi_a": "क्रिसमस",
                "en_a": "Christmas"
            },
        ],
        "school_objects": [
            {
                "id": 1,
                "hi_q": "हम अपनी किताबें और कॉपियाँ कौन में रखते हैं। ?",
                "en_q": "What is We carry our books and notebooks in a school bag. ?",
                "hi_a": "स्कूल बैग",
                "en_a": "School Bag"
            },
            {
                "id": 2,
                "hi_q": "हम कौनों से पढ़ते और सीखते हैं। ?",
                "en_q": "What is We read and learn from books. ?",
                "hi_a": "किताब",
                "en_a": "Book"
            },
            {
                "id": 3,
                "hi_q": "हम कॉपी में कक्षा कार्य और गृहकार्य लिखते हैं।  (कौन?)",
                "en_q": "What is We write our classwork and homework in a notebook. ?",
                "hi_a": "कॉप़ी",
                "en_a": "Notebook"
            },
            {
                "id": 4,
                "hi_q": "हम कौन से लिखते हैं। ?",
                "en_q": "What is We use a pencil for writing. ?",
                "hi_a": "पेंसिल",
                "en_a": "Pencil"
            },
            {
                "id": 5,
                "hi_q": "कौन से भी लिखते हैं। ?",
                "en_q": "What is also used for writing.?",
                "hi_a": "पेन",
                "en_a": "Pen"
            },
            {
                "id": 6,
                "hi_q": "हम कौन से पेंसिल की गलतियाँ मिटाते हैं। ?",
                "en_q": "What is We use an eraser to remove pencil mistakes. ?",
                "hi_a": "रबर",
                "en_a": "Eraser"
            },
            {
                "id": 7,
                "hi_q": "कौन से सीधी रेखाएँ बनाते हैं। ?",
                "en_q": "What is helps us draw straight lines.?",
                "hi_a": "स्केल",
                "en_a": "Ruler"
            },
            {
                "id": 8,
                "hi_q": "कौन पेंसिल को नुकीला बनाती है। ?",
                "en_q": "What is makes the pencil sharp.?",
                "hi_a": "छीलनी",
                "en_a": "Sharpener"
            },
            {
                "id": 9,
                "hi_q": "हम क्रेयॉन से चित्रों में रंग भरते हैं।  (कौन?)",
                "en_q": "What is We use crayons to color pictures. ?",
                "hi_a": "रंगीन पेंसिल/क्रेयॉन",
                "en_a": "Crayons"
            },
            {
                "id": 10,
                "hi_q": " (कौन?)",
                "en_q": "What is ?",
                "hi_a": "कक्षा में",
                "en_a": "In the Classroom"
            },
            {
                "id": 11,
                "hi_q": "कौन – शिक्षक इस पर लिखते हैं ?",
                "en_q": "What is Teacher writes on it?",
                "hi_a": "ब्लैकबोर्ड",
                "en_a": "Blackboard"
            },
            {
                "id": 12,
                "hi_q": "क्या – लिखने के लिए ?",
                "en_q": "What is Used for writing?",
                "hi_a": "चॉक/मार्कर",
                "en_a": "Chalk/Marker"
            },
            {
                "id": 13,
                "hi_q": "कौन – विद्यार्थी बैठकर लिखते हैं ?",
                "en_q": "What is Students sit and write?",
                "hi_a": "डेस्क",
                "en_a": "Desk"
            },
            {
                "id": 14,
                "hi_q": "क्या – बैठने के लिए किताबें, पेंसिल, बैग हमारा — learning feels so right! पढ़ो, लिखो, रंग भरो — school is fun, hooray! ?",
                "en_q": "What is Used to sitBooks and pencils, bag so bright, Write and read and draw all day,?",
                "hi_a": "कुर्सी",
                "en_a": "Chair"
            },
        ],
        "bathroom_items": [
            {
                "id": 1,
                "hi_q": "हम कौन से दाँत साफ करते हैं। ?",
                "en_q": "What is We use a toothbrush to clean our teeth. ?",
                "hi_a": "टूथब्रश",
                "en_a": "Toothbrush"
            },
            {
                "id": 2,
                "hi_q": "कौन दाँतों को मजबूत और साफ रखता है। ?",
                "en_q": "What is helps keep our teeth strong and clean.?",
                "hi_a": "टूथपेस्ट",
                "en_a": "Toothpaste"
            },
            {
                "id": 3,
                "hi_q": "कौन गंदगी और कीटाणुओं को हटाता है। ?",
                "en_q": "What is helps wash dirt and germs away.?",
                "hi_a": "साबुन",
                "en_a": "Soap"
            },
            {
                "id": 4,
                "hi_q": "कौन बाल धोने के लिए उपयोग होता है। ?",
                "en_q": "What is used to wash hair.?",
                "hi_a": "शैम्पू",
                "en_a": "Shampoo"
            },
            {
                "id": 5,
                "hi_q": "हम कौन से बाल संवारते हैं। ?",
                "en_q": "What is We use a comb to set our hair. ?",
                "hi_a": "कंघी",
                "en_a": "Comb"
            },
            {
                "id": 6,
                "hi_q": "तैयार होते समय हम आईने में देखते हैं।  (कौन?)",
                "en_q": "What is We look in the mirror while getting ready. ?",
                "hi_a": "आईना",
                "en_a": "Mirror"
            },
            {
                "id": 7,
                "hi_q": "कौन शरीर सुखाने के लिए उपयोग होता है। ?",
                "en_q": "What is used to dry our body.?",
                "hi_a": "तौलिया",
                "en_a": "Towel"
            },
            {
                "id": 8,
                "hi_q": "कौन में पानी भरा जाता है। ?",
                "en_q": "What is holds water.?",
                "hi_a": "बाल्टी",
                "en_a": "Bucket"
            },
            {
                "id": 9,
                "hi_q": "कौन से पानी डालते हैं। ?",
                "en_q": "What is used to pour water.?",
                "hi_a": "मग",
                "en_a": "Mug"
            },
            {
                "id": 10,
                "hi_q": "कौन नहाने के लिए उपयोग होता है। दिन में दो बार दाँत साफ करें। रोज़ नहाएँ। स्नानघर साफ रखें। दाँत साफ करो, चेहरा धो — stay fresh every place! साबुन और पानी रखें तुम्हें clean and green! ?",
                "en_q": "What is used for bathing. 🧼 GOOD HABIT Brush your teeth twice a day. Take a bath daily. Keep the bathroom clean. Brush your teeth and wash your face, Soap and water make you clean,?",
                "hi_a": "शावर",
                "en_a": "Shower"
            },
        ],
        "clothes": [
            {
                "id": 1,
                "hi_q": "ऊपरी शरीर पर पहनी जाती है।  (कौन?)",
                "en_q": "What is Worn on the upper body. ?",
                "hi_a": "शर्ट",
                "en_a": "Shirt"
            },
            {
                "id": 2,
                "hi_q": "आरामदायक रोज़मर्रा का कपड़ा।  (कौन?)",
                "en_q": "What is A comfortable casual top. ?",
                "hi_a": "टी-शर्ट",
                "en_a": "shirt"
            },
            {
                "id": 3,
                "hi_q": "निचले शरीर पर पहनी जाती है।  (कौन?)",
                "en_q": "What is Worn on the lower body. ?",
                "hi_a": "पैंट",
                "en_a": "Pants"
            },
            {
                "id": 4,
                "hi_q": "लड़कियाँ कौन पहनती हैं। ?",
                "en_q": "What is Girls wear frocks. ?",
                "hi_a": "फ्रॉक",
                "en_a": "Frock"
            },
            {
                "id": 5,
                "hi_q": "भारत में महिलाओं का पारंपरिक वस्त्र।  (कौन?)",
                "en_q": "What is Traditional dress for women in India. ?",
                "hi_a": "साड़ी",
                "en_a": "Saree"
            },
            {
                "id": 6,
                "hi_q": "पुरुष और महिलाएँ दोनों पहनते हैं।  (कौन?)",
                "en_q": "What is Traditional dress worn by men and women. ?",
                "hi_a": "कुर्ता",
                "en_a": "Kurta"
            },
            {
                "id": 7,
                "hi_q": "सूती कपड़े हमें ठंडक देते हैं।  (कौन?)",
                "en_q": "What is Cotton clothes keep us cool. ?",
                "hi_a": "गर्मी के कपड़े",
                "en_a": "Summer Clothes"
            },
            {
                "id": 8,
                "hi_q": "स्वेटर, जैकेट और टोपी हमें गर्म रखते हैं।  (कौन?)",
                "en_q": "What is Sweater, jacket, and cap keep us warm. ?",
                "hi_a": "सर्दी के कपड़े",
                "en_a": "Winter Clothes"
            },
            {
                "id": 9,
                "hi_q": "रेनकोट और छाता हमें बारिश से बचाते हैं।  (कौन?)",
                "en_q": "What is Raincoat and umbrella protect us from rain. ?",
                "hi_a": "बरसात के कपड़े",
                "en_a": "Rainy Clothes"
            },
            {
                "id": 10,
                "hi_q": "कौन – स्कूल या बाहर पहनते हैं ?",
                "en_q": "What is Worn for school or outdoors?",
                "hi_a": "जूते",
                "en_a": "Shoes"
            },
            {
                "id": 11,
                "hi_q": "कौन – घर या बाहर पहने जाते हैं शर्ट, पैंट, फ्रॉक, टोपी — clothes make us smart! सर्दी में स्वेटर, गर्मी में सूती — clothes make life neat! ?",
                "en_q": "What is Worn at home or outsideShirt and pants, frock and hat, Sweater in winter, cotton in heat, ?",
                "hi_a": "सैंडल",
                "en_a": "Sandals"
            },
        ],
        "classroom": [
            {
                "id": 1,
                "hi_q": "कौन – विद्यार्थी यहाँ बैठकर लिखते हैं ?",
                "en_q": "What is Students sit and write here?",
                "hi_a": "डेस्क",
                "en_a": "Desk"
            },
            {
                "id": 2,
                "hi_q": "क्या – बैठने के लिए ?",
                "en_q": "What is Used to sit?",
                "hi_a": "कुर्सी",
                "en_a": "Chair"
            },
            {
                "id": 3,
                "hi_q": "कौन – शिक्षक इस पर लिखते हैं ?",
                "en_q": "What is Teacher writes on it?",
                "hi_a": "ब्लैकबोर्ड",
                "en_a": "Blackboard"
            },
            {
                "id": 4,
                "hi_q": "क्या – लिखने के लिए ?",
                "en_q": "What is Used for writing?",
                "hi_a": "चॉक/मार्कर",
                "en_a": "Chalk/Marker"
            },
            {
                "id": 5,
                "hi_q": "क्या – पढ़ने के लिए ?",
                "en_q": "What is Used for reading?",
                "hi_a": "किताबें",
                "en_a": "Books"
            },
            {
                "id": 6,
                "hi_q": "क्या – किताबें रखने के लिए शिक्षक की बात सुनें। चिल्लाएँ नहीं। कक्षा को साफ रखें। सहपाठियों के साथ अच्छा व्यवहार करें। कक्षा में पढ़ते, आगे बढ़ते — knowledge flows! सुनो, लिखो, हाथ उठाओ — learning is grand! ?",
                "en_q": "What is Used to carry booksListen to the teacher. Do not shout. Keep the classroom clean. Be kind to classmates. In the classroom we learn and grow, Listen, write, and raise your hand,?",
                "hi_a": "बैग",
                "en_a": "Bag"
            },
        ],
        "kitchen": [
            {
                "id": 1,
                "hi_q": "क्या – खाना खाने के लिए ?",
                "en_q": "What is Used to eat food?",
                "hi_a": "प्लेट",
                "en_a": "Plate"
            },
            {
                "id": 2,
                "hi_q": "क्या – दाल या सब्जी के लिए ?",
                "en_q": "What is Used for curry or soup?",
                "hi_a": "कटोरी",
                "en_a": "Bowl"
            },
            {
                "id": 3,
                "hi_q": "क्या – खाने और परोसने के लिए ?",
                "en_q": "What is Used to eat or serve food?",
                "hi_a": "चम्मच",
                "en_a": "Spoon"
            },
            {
                "id": 4,
                "hi_q": "क्या – खाना उठाने के लिए ?",
                "en_q": "What is Used to pick food?",
                "hi_a": "कांटा",
                "en_a": "Fork"
            },
            {
                "id": 5,
                "hi_q": "क्या – फल और सब्जी काटने के लिए ?",
                "en_q": "What is Used to cut fruits and vegetables?",
                "hi_a": "चाकू",
                "en_a": "Knife"
            },
            {
                "id": 6,
                "hi_q": "क्या – रोटी या खाना बनाने के लिए ?",
                "en_q": "What is Used to cook chapati or fry food?",
                "hi_a": "तवा/पैन",
                "en_a": "Pan"
            },
            {
                "id": 7,
                "hi_q": "भगोना – चावल या सब्जी उबालने के लिए ?",
                "en_q": "What is Used to boil rice or vegetables?",
                "hi_a": "बर्तन/भगोना",
                "en_a": "Pot"
            },
            {
                "id": 8,
                "hi_q": "क्या – खाना पकाने के लिए ?",
                "en_q": "What is Used to cook food?",
                "hi_a": "गैस चूल्हा",
                "en_a": "Gas Stove"
            },
            {
                "id": 9,
                "hi_q": "क्या – पीसने और मिलाने के लिए ?",
                "en_q": "What is Used to grind and mix food?",
                "hi_a": "मिक्सर",
                "en_a": "Mixer"
            },
            {
                "id": 10,
                "hi_q": " (कौन?)",
                "en_q": "What is ?",
                "hi_a": "चावल",
                "en_a": "Rice"
            },
            {
                "id": 11,
                "hi_q": " (कौन?)",
                "en_q": "What is ?",
                "hi_a": "आटा",
                "en_a": "Flour"
            },
            {
                "id": 12,
                "hi_q": " (कौन?)",
                "en_q": "What is ?",
                "hi_a": "तेल",
                "en_a": "Oil"
            },
            {
                "id": 13,
                "hi_q": " (कौन?)",
                "en_q": "What is ?",
                "hi_a": "नमक",
                "en_a": "Salt"
            },
            {
                "id": 14,
                "hi_q": " (कौन?)",
                "en_q": "What is ?",
                "hi_a": "चीनी",
                "en_a": "Sugar"
            },
            {
                "id": 15,
                "hi_q": " (कौन?)",
                "en_q": "What is ?",
                "hi_a": "सब्जियाँ",
                "en_a": "Vegetables"
            },
            {
                "id": 16,
                "hi_q": "बड़ों के बिना चूल्हा न छुएँ। चाकू से सावधान रहें। खाने से पहले हाथ धोएँ। रसोईघर में बनता खाना good and good! साफ रखो, सावधान रहो — show that you care!  (कौन?)",
                "en_q": "What is Do not touch the stove without elders. Be careful with knives. Wash hands before eating. In the kitchen we cook our food, Keep it clean and stay aware, ?",
                "hi_a": "फल",
                "en_a": "Fruits"
            },
        ],
        "wild_animals": [
            {
                "id": 1,
                "hi_q": "कौन को जंगल का राजा कहा जाता है। यह बहुत ताकतवर होता है। ?",
                "en_q": "What called the king of the jungle. It is strong and powerful.?",
                "hi_a": "शेर",
                "en_a": "Lion"
            },
            {
                "id": 2,
                "hi_q": "भारत का राष्ट्रीय wild animal कौन सा है?",
                "en_q": "Which is the national wild animal?",
                "hi_a": "बाघ",
                "en_a": "Tiger"
            },
            {
                "id": 3,
                "hi_q": "कौन सबसे बड़ा स्थलीय जानवर है। इसकी लंबी सूंड होती है। ?",
                "en_q": "Which animal the largest land animal. It has a long trunk.?",
                "hi_a": "हाथी",
                "en_a": "Elephant"
            },
            {
                "id": 4,
                "hi_q": "कौन सबसे लंबा जानवर है। इसकी गर्दन बहुत लंबी होती है। ?",
                "en_q": "Which animal the tallest animal. It has a very long neck.?",
                "hi_a": "जिराफ",
                "en_a": "Giraffe"
            },
            {
                "id": 5,
                "hi_q": "कौन के शरीर पर काली-सफेद धारियाँ होती हैं। ?",
                "en_q": "Which animal has black and white stripes.?",
                "hi_a": "ज़ेब्रा",
                "en_a": "Zebra"
            },
            {
                "id": 6,
                "hi_q": "भालुओं के शरीर पर घने बाल होते हैं। उन्हें शहद पसंद होता है।  (कौन?)",
                "en_q": "Which animal s have thick fur. They love honey.?",
                "hi_a": "भालू",
                "en_a": "Bear"
            },
            {
                "id": 7,
                "hi_q": "कौन बहुत तेज दौड़ता है। इसके सुंदर सींग होते हैं। ?",
                "en_q": "Which animal runs very fast. It has beautiful horns.?",
                "hi_a": "हिरण",
                "en_a": "Deer"
            },
            {
                "id": 8,
                "hi_q": "कौन पेड़ों पर चढ़ना पसंद करते हैं। उन्हें केले पसंद हैं। ?",
                "en_q": "Which animal s love climbing trees. They like bananas.?",
                "hi_a": "बंदर",
                "en_a": "Monkey"
            },
            {
                "id": 9,
                "hi_q": "भेड़िए झुंड में रहते हैं। वे तेज आवाज़ में हुआँ-हुआँ करते हैं।  (कौन?)",
                "en_q": "Which animal Wolves live in groups called packs. They howl loudly. ?",
                "hi_a": "भेड़िया",
                "en_a": "Wolf"
            },
            {
                "id": 10,
                "hi_q": "कौन चालाक जानवर होती है। इनकी झबरीली पूंछ होती है। ?",
                "en_q": "Which animal es are clever animals. They have bushy tails.?",
                "hi_a": "लोमड़ी",
                "en_a": "Fox"
            },
        ],
        "birds": [
            {
                "id": 1,
                "hi_q": "कौन खाने में मदद करती है ?",
                "en_q": "Which bird Helps birds eat food?",
                "hi_a": "चोंच",
                "en_a": "Beak"
            },
            {
                "id": 2,
                "hi_q": "कौन उड़ने में मदद करते हैं ?",
                "en_q": "Which bird Help birds fly?",
                "hi_a": "पंख",
                "en_a": "Wings"
            },
            {
                "id": 3,
                "hi_q": "कौन शरीर को ढकती हैं ?",
                "en_q": "Which bird Cover the bird’s body?",
                "hi_a": "पंखुड़ियाँ",
                "en_a": "Feathers"
            },
            {
                "id": 4,
                "hi_q": "कौन चीजें पकड़ने में मदद करते हैं ?",
                "en_q": "Which bird Help birds hold things?",
                "hi_a": "पंजे",
                "en_a": "Claws"
            },
            {
                "id": 5,
                "hi_q": "छोटी भूरी चिड़िया  (कौन?)",
                "en_q": "Which bird A small brown bird ?",
                "hi_a": "गौरैया",
                "en_a": "Sparrow"
            },
            {
                "id": 6,
                "hi_q": "भारत का राष्ट्रीय bird कौन सा है?",
                "en_q": "Which is the national bird?",
                "hi_a": "मोर",
                "en_a": "Peacock"
            },
            {
                "id": 7,
                "hi_q": "हरा पक्षी जो आवाज़ की नकल करता है  (कौन?)",
                "en_q": "Which bird Green bird that can mimic sounds ?",
                "hi_a": "तोता",
                "en_a": "Parrot"
            },
            {
                "id": 8,
                "hi_q": "ऊँचा उड़ने वाला शक्तिशाली पक्षी  (कौन?)",
                "en_q": "Which bird A strong bird that flies high ?",
                "hi_a": "गरुड़/चील",
                "en_a": "Eagle"
            },
            {
                "id": 9,
                "hi_q": "दिन में सोता, रात में जागता है  (कौन?)",
                "en_q": "Which bird Sleeps in the day, awake at night ?",
                "hi_a": "उल्लू",
                "en_a": "Owl"
            },
            {
                "id": 10,
                "hi_q": "शहरों में पाया जाने वाला पक्षी  (कौन?)",
                "en_q": "Which bird A common city bird ?",
                "hi_a": "कबूतर",
                "en_a": "Pigeon"
            },
            {
                "id": 11,
                "hi_q": "काला पक्षी जिसकी आवाज़ तेज होती है  (कौन?)",
                "en_q": "Which bird Black bird with a loud voice ?",
                "hi_a": "कौआ",
                "en_a": "Crow"
            },
            {
                "id": 12,
                "hi_q": "हमें अंडे कौन देता है?",
                "en_q": "What gives us eggs?",
                "hi_a": "मुर्गी",
                "en_a": "Hen"
            },
            {
                "id": 13,
                "hi_q": "पानी में तैरती है पक्षी अंडे देते हैं। अंडों से बच्चे निकलते हैं। पक्षियों के पंख होते, वे उड़ते जैसे kings। कुछ उड़ते ऊँचा, up so high! कुछ तैरते, कुछ गाते — birds are a wonderful thing!  (कौन?)",
                "en_q": "Which bird Swims in water 🥚 BIRDS LAY EGGS Baby birds come out of eggs. Birds have feathers, birds have wings, Some can fly high in the sky, Some can swim and some can sing, ?",
                "hi_a": "बतख",
                "en_a": "Duck"
            },
        ],
        "opposites": [
            {
                "id": 1,
                "hi_q": "हमें मिट्टी के अंदर उगते हैं। ये हमें ऊर्जा देते हैं। कौन देता है?",
                "en_q": "What gives us Potatoes grow under the soil. They give us energy.?",
                "hi_a": "आलू",
                "en_a": "Potato"
            },
            {
                "id": 2,
                "hi_q": "कौन लाल और रसदार होते हैं। इनका उपयोग सलाद और सब्जी में होता है। ?",
                "en_q": "What is es are red and juicy. They are used in salads and curries.?",
                "hi_a": "टमाटर",
                "en_a": "Tomato"
            },
            {
                "id": 3,
                "hi_q": "कौन नारंगी और कुरकुरी होती है। ये आँखों के लिए अच्छी होती है। ?",
                "en_q": "What is s are orange and crunchy. They are good for our eyes.?",
                "hi_a": "गाजर",
                "en_a": "Carrot"
            },
            {
                "id": 4,
                "hi_q": "कौन मिट्टी के अंदर उगती है। ये खाने में स्वाद बढ़ाती है। ?",
                "en_q": "What is s grow under the soil. They add taste to food.?",
                "hi_a": "प्याज",
                "en_a": "Onion"
            },
            {
                "id": 5,
                "hi_q": "कौन में कई हरी पत्तियाँ होती हैं। यह सलाद और सब्जी में काम आती है। ?",
                "en_q": "What is has many green leaves. It is used in salads and vegetables.?",
                "hi_a": "पत्ता गोभी",
                "en_a": "Cabbage"
            },
            {
                "id": 6,
                "hi_q": "कौन सफेद फूल जैसी दिखती है। यह स्वादिष्ट और सेहतमंद है। ?",
                "en_q": "What is looks like a white flower. It is healthy and tasty.?",
                "hi_a": "फूल गोभी",
                "en_a": "Cauliflower"
            },
            {
                "id": 7,
                "hi_q": "कौन हरी पत्तेदार सब्जी है। यह हमें ताकत देती है। ?",
                "en_q": "What is a green leafy vegetable. It makes us strong.?",
                "hi_a": "पालक",
                "en_a": "Spinach"
            },
            {
                "id": 8,
                "hi_q": "कौन कौनी और चमकदार होता है। इससे कई तरह की सब्जियाँ बनती हैं। ?",
                "en_q": "What is Brinjal is purple and shiny. It is used in many dishes. ?",
                "hi_a": "बैंगन",
                "en_a": "Brinjal / Eggplant"
            },
            {
                "id": 9,
                "hi_q": "कौन छोटी और हरी होती है। ये फली में उगती हैं। ?",
                "en_q": "What is small and green. They grow in pods.?",
                "hi_a": "मटर",
                "en_a": "Peas"
            },
            {
                "id": 10,
                "hi_q": "कौन लंबा और हरा होता है। यह शरीर को ठंडक देता है। ?",
                "en_q": "What is long and green. It keeps us cool.?",
                "hi_a": "खीरा",
                "en_a": "Cucumber"
            },
            {
                "id": 11,
                "hi_q": "कौन बड़ा और नारंगी होता है। यह मीठा और सेहतमंद है। ?",
                "en_q": "What is big and orange. It is sweet and healthy.?",
                "hi_a": "कद्दू",
                "en_a": "Pumpkin"
            },
            {
                "id": 12,
                "hi_q": "कौन लंबी और हरी होती है। यह सेहत के लिए अच्छी है। ?",
                "en_q": "What is Lady finger is long and green. It is good for health. ?",
                "hi_a": "भिंडी",
                "en_a": "Lady Finger / Okra"
            },
            {
                "id": 13,
                "hi_q": "कौन हल्की हरी होती है। यह पचने में आसान है। ?",
                "en_q": "What is light green. It is easy to digest.?",
                "hi_a": "लौकी",
                "en_a": "Bottle Gourd"
            },
            {
                "id": 14,
                "hi_q": " (कौन?)",
                "en_q": "What is Bitter ?",
                "hi_a": "करेला",
                "en_a": "Bitter Gourd"
            },
        ],
        "classroom_rules": [
            {
                "id": 1,
                "hi_q": "नियम: अपनी सीट पर शांत होकर बैठो। दूसरों को परेशान न करो।",
                "en_q": "Rule: Sit calmly on your seat. Do not push or disturb others.",
                "hi_a": "सीधे बैठो",
                "en_a": "SIT PROPERLY"
            },
            {
                "id": 2,
                "hi_q": "नियम: बोलने से पहले हाथ उठाओ। शिक्षक के बुलाने का इंतजार करो।",
                "en_q": "Rule: Raise your hand before speaking. Wait for teacher to call your name.",
                "hi_a": "हाथ उठाकर बोलो",
                "en_a": "✋ RAISE YOUR HAND"
            },
            {
                "id": 3,
                "hi_q": "नियम: जब शिक्षक या दोस्त बोलें तो ध्यान से सुनो।",
                "en_q": "Rule: Listen when teacher or friends are speaking.",
                "hi_a": "ध्यान से सुनो",
                "en_a": "LISTEN CAREFULLY"
            },
            {
                "id": 4,
                "hi_q": "नियम: कक्षा में धीरे बोलो। कक्षा पढ़ाई की जगह है।",
                "en_q": "Rule: Use soft voice in class. Classroom is a place for learning.",
                "hi_a": "शोर मत करो",
                "en_a": "DO NOT SHOUT"
            },
            {
                "id": 5,
                "hi_q": "नियम: किताबें और पेंसिल साझा करो। लड़ाई मत करो।",
                "en_q": "Rule: Share books and pencils. Do not fight.",
                "hi_a": "दोस्तों के साथ अच्छा व्यवहार",
                "en_a": "BE KIND TO FRIENDS"
            },
            {
                "id": 6,
                "hi_q": "नियम: कचरा डस्टबिन में डालो। अपनी डेस्क साफ रखो।",
                "en_q": "Rule: Throw waste in dustbin. Keep desk neat and tidy.",
                "hi_a": "कक्षा साफ रखो",
                "en_a": "KEEP CLASSROOM CLEAN"
            },
            {
                "id": 7,
                "hi_q": "नियम: कक्षा कार्य और गृहकार्य पूरा करो।",
                "en_q": "Rule: Finish classwork and homework.",
                "hi_a": "काम समय पर करो",
                "en_a": "DO YOUR WORK ON TIME"
            },
            {
                "id": 8,
                "hi_q": "नियम: कक्षा के अंदर धीरे चलो।",
                "en_q": "Rule: Walk slowly inside classroom.",
                "hi_a": "दौड़ो मत",
                "en_a": "WALK, DON’T RUN"
            },
            {
                "id": 9,
                "hi_q": "नियम: विनम्रता से मदद माँगो।",
                "en_q": "Rule: Say: \"Teacher, please help me.\"",
                "hi_a": "विनम्रता से मदद माँगो",
                "en_a": "ASK FOR HELP POLITELY"
            },
            {
                "id": 10,
                "hi_q": "नियम: अभिवादन करो और धन्यवाद कहो। शिक्षक की बात मानो।",
                "en_q": "Rule: Say \"Good Morning\" and \"Thank You\". Listen and follow instructions.",
                "hi_a": "शिक्षक का सम्मान करो",
                "en_a": "RESPECT YOUR TEACHER"
            },
            {
                "id": 11,
                "hi_q": "नियम: \"मैं दयालु, शांत और सीखने के लिए तैयार रहूँगा/रहूँगी।\"",
                "en_q": "Rule: \"I will be kind, quiet, and ready to learn.\"",
                "hi_a": "",
                "en_a": "CLASSROOM PROMISE"
            },
        ],
        "good_manners__etiquette": [
            {
                "id": 1,
                "hi_q": "नियम: कुछ माँगते समय \"कृपया\" कहें।",
                "en_q": "Rule: Use \"please\" when asking for something. Example: \"Please give me water.\"",
                "hi_a": "कृपया",
                "en_a": "SAY \"PLEASE\""
            },
            {
                "id": 2,
                "hi_q": "नियम: जब कोई मदद करे तो धन्यवाद कहें।",
                "en_q": "Rule: Say thank you when someone helps you. Example: \"Thank you for helping me.\"",
                "hi_a": "धन्यवाद",
                "en_a": "SAY \"THANK YOU\""
            },
            {
                "id": 3,
                "hi_q": "नियम: गलती होने पर माफ़ी माँगें।",
                "en_q": "Rule: Say sorry when you make a mistake. Example: \"Sorry, I broke the pencil.\"",
                "hi_a": "माफ़ कीजिए",
                "en_a": "SAY \"SORRY\""
            },
            {
                "id": 4,
                "hi_q": "नियम: बड़ों को नमस्ते या प्रणाम करें।",
                "en_q": "Rule: Say \"Good Morning\", \"Namaste\", or \"Hello\".",
                "hi_a": "नमस्ते / अभिवादन",
                "en_a": "GREET PEOPLE"
            },
            {
                "id": 5,
                "hi_q": "नियम: धक्का न दें, बीच में न बोलें। कक्षा में हाथ उठाकर बोलें।",
                "en_q": "Rule: Do not push or interrupt. Raise your hand in class.",
                "hi_a": "अपनी बारी का इंतजार करें",
                "en_a": "WAIT FOR YOUR TURN"
            },
            {
                "id": 6,
                "hi_q": "नियम: खाने से पहले हाथ धोएँ, धीरे खाएँ, भोजन बर्बाद न करें।",
                "en_q": "Rule: ✔ Wash hands before eating ✔ Eat slowly ✔ Do not talk with food in mouth ✔ Do not waste food",
                "hi_a": "खाने के शिष्टाचार",
                "en_a": "️ TABLE MANNERS"
            },
            {
                "id": 7,
                "hi_q": "नियम: दोस्तों के साथ चीजें बाँटें।",
                "en_q": "Rule: Share toys and things with friends. Sharing makes everyone happy 😊",
                "hi_a": "साझा करना",
                "en_a": "SHARING"
            },
            {
                "id": 8,
                "hi_q": "नियम: चिल्लाकर बात न करें। मीठे शब्द बोलें।",
                "en_q": "Rule: Do not shout. Use kind words.",
                "hi_a": "विनम्रता से बोलें",
                "en_a": "️ SPEAK POLITELY"
            },
            {
                "id": 9,
                "hi_q": "नियम: कचरा डस्टबिन में डालें। कमरा और कक्षा साफ रखें।",
                "en_q": "Rule: Throw garbage in the dustbin. Keep your room and classroom clean.",
                "hi_a": "साफ-सफाई",
                "en_a": "CLEANLINESS"
            },
            {
                "id": 10,
                "hi_q": "नियम: माता-पिता और शिक्षक की बात मानें। जरूरत पड़ने पर बड़ों की मदद करें।",
                "en_q": "Rule: Listen to parents and teachers. Help elders when needed.",
                "hi_a": "बड़ों का सम्मान",
                "en_a": "RESPECT ELDERS"
            },
            {
                "id": 11,
                "hi_q": "नियम: जानवरों को चोट न पहुँचाएँ।",
                "en_q": "Rule: Do not hurt animals.",
                "hi_a": "जानवरों के साथ दया",
                "en_a": "BE KIND TO ANIMALS"
            },
            {
                "id": 12,
                "hi_q": "नियम: \"दूसरों के साथ वैसा ही व्यवहार करो जैसा तुम अपने लिए चाहते हो।\"",
                "en_q": "Rule: \"Treat others the way you want to be treated.\"",
                "hi_a": "",
                "en_a": "GOLDEN RULE"
            },
        ],
        "farming_words": [
            {
                "id": 1,
                "hi_q": "कौन/क्या है: फसल उगाने और पशु पालने वाला व्यक्ति।?",
                "en_q": "Who/What is: A person who grows crops and raises animals.?",
                "hi_a": "किसान",
                "en_a": "FARMER"
            },
            {
                "id": 2,
                "hi_q": "कौन/क्या है: खेती के काम में उपयोग होने वाली गाड़ी।?",
                "en_q": "Who/What is: A vehicle used for farming work.?",
                "hi_a": "ट्रैक्टर",
                "en_a": "TRACTOR"
            },
            {
                "id": 3,
                "hi_q": "कौन/क्या है: छोटा भाग जिससे नया पौधा उगता है।?",
                "en_q": "Who/What is: Small part of a plant that grows into a new plant.?",
                "hi_a": "बीज",
                "en_a": "SEED"
            },
            {
                "id": 4,
                "hi_q": "कौन/क्या है: खेत में उगाई जाने वाली खाद्य फसल।?",
                "en_q": "Who/What is: Plants grown on a farm for food.?",
                "hi_a": "फसल",
                "en_a": "CROP"
            },
            {
                "id": 5,
                "hi_q": "कौन/क्या है: बादलों से गिरने वाला पानी जो फसल उगने में मदद करता है।?",
                "en_q": "Who/What is: Water from clouds that helps crops grow.?",
                "hi_a": "बारिश",
                "en_a": "️ RAIN"
            },
            {
                "id": 6,
                "hi_q": "कौन/क्या है: फसलों को पानी देना।?",
                "en_q": "Who/What is: Supplying water to crops.?",
                "hi_a": "सिंचाई",
                "en_a": "IRRIGATION"
            },
            {
                "id": 7,
                "hi_q": "कौन/क्या है: मिट्टी जिसमें पौधे उगते हैं।?",
                "en_q": "Who/What is: Earth in which plants grow.?",
                "hi_a": "मिट्टी",
                "en_a": "SOIL"
            },
            {
                "id": 8,
                "hi_q": "कौन/क्या है: तैयार फसल को काटना और इकट्ठा करना।?",
                "en_q": "Who/What is: Cutting and collecting crops when ready.?",
                "hi_a": "कटाई",
                "en_a": "HARVEST"
            },
            {
                "id": 9,
                "hi_q": "कौन/क्या है: वह जमीन जहाँ खेती और पशुपालन होता है।?",
                "en_q": "Who/What is: Land used for growing crops and animals.?",
                "hi_a": "खेत",
                "en_a": "FARM"
            },
            {
                "id": 10,
                "hi_q": "कौन/क्या है: दूध देने वाला पशु।?",
                "en_q": "Who/What is: Farm animal that gives milk.?",
                "hi_a": "गाय",
                "en_a": "COW"
            },
            {
                "id": 11,
                "hi_q": "कौन/क्या है: दूध और मांस देती है।?",
                "en_q": "Who/What is: Gives milk and meat.?",
                "hi_a": "बकरी",
                "en_a": "GOAT"
            },
            {
                "id": 12,
                "hi_q": "कौन/क्या है: अंडे देती है।?",
                "en_q": "Who/What is: Lays eggs.?",
                "hi_a": "मुर्गी",
                "en_a": "HEN"
            },
            {
                "id": 13,
                "hi_q": "कौन/क्या है: आटा बनाने वाला अनाज।?",
                "en_q": "Who/What is: A grain used to make flour and bread.?",
                "hi_a": "गेहूं",
                "en_a": "WHEAT"
            },
            {
                "id": 14,
                "hi_q": "कौन/क्या है: मुख्य खाद्यान्न।?",
                "en_q": "Who/What is: Main food grain in many countries.?",
                "hi_a": "चावल",
                "en_a": "RICE"
            },
            {
                "id": 15,
                "hi_q": "कौन/क्या है: तेल देने वाला पौधा।?",
                "en_q": "Who/What is: Plant that gives oil seeds.?",
                "hi_a": "सूरजमुखी",
                "en_a": "SUNFLOWER"
            },
            {
                "id": 16,
                "hi_q": "कौन/क्या है: जहाँ किसान फसल बेचते हैं।?",
                "en_q": "Who/What is: Place where farmers sell crops.?",
                "hi_a": "बाज़ार",
                "en_a": "MARKET"
            },
            {
                "id": 17,
                "hi_q": "कौन/क्या है: अनाज या पशुओं को रखने की जगह।?",
                "en_q": "Who/What is: Place where grains or animals are kept.?",
                "hi_a": "गोदाम",
                "en_a": "BARN"
            },
            {
                "id": 18,
                "hi_q": "कौन/क्या है: पौधों को भोजन बनाने में मदद करती है।?",
                "en_q": "Who/What is: Helps plants make food.?",
                "hi_a": "धूप",
                "en_a": "SUNLIGHT"
            },
            {
                "id": 19,
                "hi_q": "कौन/क्या है: पौधों को बढ़ने के लिए हवा चाहिए।?",
                "en_q": "Who/What is: Plants need air to grow.?",
                "hi_a": "हवा",
                "en_a": "AIR"
            },
        ],
        "solar_system__kids_learning": [
            {
                "id": 1,
                "hi_q": "कथन: 'Hello! I am the Sun 🌞' - मैं कौन हूँ?",
                "en_q": "I say: 'Hello! I am the Sun 🌞' - Who am I?",
                "hi_a": "Sun",
                "en_a": "Sun"
            },
            {
                "id": 2,
                "hi_q": "कथन: 'I am Earth’s Moon 🌙' - मैं कौन हूँ?",
                "en_q": "I say: 'I am Earth’s Moon 🌙' - Who am I?",
                "hi_a": "Moon",
                "en_a": "Moon"
            },
            {
                "id": 3,
                "hi_q": "कथन: 'Take care of Earth 🌍' - मैं कौन हूँ?",
                "en_q": "I say: 'Take care of Earth 🌍' - Who am I?",
                "hi_a": "Sun",
                "en_a": "Sun"
            },
        ],
        "globe__continents__kids_learning": [
            {
                "id": 1,
                "hi_q": "कथन: 'Hello kids! I am the Earth 🌍' - मैं कौन हूँ?",
                "en_q": "I say: 'Hello kids! I am the Earth 🌍' - Who am I?",
                "hi_a": "Globe",
                "en_a": "Globe"
            },
            {
                "id": 2,
                "hi_q": "कथन: 'Most of me is covered with water!' - मैं कौन हूँ?",
                "en_q": "I say: 'Most of me is covered with water!' - Who am I?",
                "hi_a": "Globe",
                "en_a": "Globe"
            },
            {
                "id": 3,
                "hi_q": "कथन: 'We live in Asia!' - मैं कौन हूँ?",
                "en_q": "I say: 'We live in Asia!' - Who am I?",
                "hi_a": "Globe",
                "en_a": "Globe"
            },
            {
                "id": 4,
                "hi_q": "कथन: 'Take care of me. I am your home!' - मैं कौन हूँ?",
                "en_q": "I say: 'Take care of me. I am your home!' - Who am I?",
                "hi_a": "Globe",
                "en_a": "Globe"
            },
        ],
        "teacher__kids_learning": [
            {
                "id": 1,
                "hi_q": "कथन: 'Good morning, children!' - मैं कौन हूँ?",
                "en_q": "I say: 'Good morning, children!' - Who am I?",
                "hi_a": "Teacher",
                "en_a": "Teacher"
            },
            {
                "id": 2,
                "hi_q": "कथन: 'Today we will learn letters and numbers!' - मैं कौन हूँ?",
                "en_q": "I say: 'Today we will learn letters and numbers!' - Who am I?",
                "hi_a": "Teacher",
                "en_a": "Teacher"
            },
            {
                "id": 3,
                "hi_q": "कथन: 'Yes, dear?' - मैं कौन हूँ?",
                "en_q": "I say: 'Yes, dear?' - Who am I?",
                "hi_a": "Teacher",
                "en_a": "Teacher"
            },
            {
                "id": 4,
                "hi_q": "कथन: 'Learning can be fun too!' - मैं कौन हूँ?",
                "en_q": "I say: 'Learning can be fun too!' - Who am I?",
                "hi_a": "Teacher",
                "en_a": "Teacher"
            },
            {
                "id": 5,
                "hi_q": "कथन: 'We must share and be kind.' - मैं कौन हूँ?",
                "en_q": "I say: 'We must share and be kind.' - Who am I?",
                "hi_a": "Teacher",
                "en_a": "Teacher"
            },
            {
                "id": 6,
                "hi_q": "कथन: 'Excellent work!' - मैं कौन हूँ?",
                "en_q": "I say: 'Excellent work!' - Who am I?",
                "hi_a": "Teacher",
                "en_a": "Teacher"
            },
            {
                "id": 7,
                "hi_q": "कथन: 'See you tomorrow!' - मैं कौन हूँ?",
                "en_q": "I say: 'See you tomorrow!' - Who am I?",
                "hi_a": "Teacher",
                "en_a": "Teacher"
            },
        ],
        "doctor_visit__kids_learning": [
            {
                "id": 1,
                "hi_q": "कथन: 'Hello! I am here to help you feel better 😊' - मैं कौन हूँ?",
                "en_q": "I say: 'Hello! I am here to help you feel better 😊' - Who am I?",
                "hi_a": "Doctor",
                "en_a": "Doctor"
            },
            {
                "id": 2,
                "hi_q": "कथन: 'Don’t worry, I will only check you.' - मैं कौन हूँ?",
                "en_q": "I say: 'Don’t worry, I will only check you.' - Who am I?",
                "hi_a": "Doctor",
                "en_a": "Doctor"
            },
            {
                "id": 3,
                "hi_q": "कथन: 'I am listening to your heartbeat. Thump thump!' - मैं कौन हूँ?",
                "en_q": "I say: 'I am listening to your heartbeat. Thump thump!' - Who am I?",
                "hi_a": "Doctor",
                "en_a": "Doctor"
            },
            {
                "id": 4,
                "hi_q": "कथन: 'Just checking if you have fever.' - मैं कौन हूँ?",
                "en_q": "I say: 'Just checking if you have fever.' - Who am I?",
                "hi_a": "Doctor",
                "en_a": "Doctor"
            },
            {
                "id": 5,
                "hi_q": "कथन: 'Say Aaaa… very good!' - मैं कौन हूँ?",
                "en_q": "I say: 'Say Aaaa… very good!' - Who am I?",
                "hi_a": "Doctor",
                "en_a": "Doctor"
            },
            {
                "id": 6,
                "hi_q": "कथन: 'Take this medicine and rest. You will feel better soon.' - मैं कौन हूँ?",
                "en_q": "I say: 'Take this medicine and rest. You will feel better soon.' - Who am I?",
                "hi_a": "Doctor",
                "en_a": "Doctor"
            },
            {
                "id": 7,
                "hi_q": "कथन: 'Eat healthy food and drink water!' - मैं कौन हूँ?",
                "en_q": "I say: 'Eat healthy food and drink water!' - Who am I?",
                "hi_a": "Doctor",
                "en_a": "Doctor"
            },
            {
                "id": 8,
                "hi_q": "कथन: 'These habits keep you strong!' - मैं कौन हूँ?",
                "en_q": "I say: 'These habits keep you strong!' - Who am I?",
                "hi_a": "Doctor",
                "en_a": "Doctor"
            },
        ],
        "traffic_light__kids_learning": [
            {
                "id": 1,
                "hi_q": "कथन: 'Hello kids! I help keep everyone safe on the road!' - मैं कौन हूँ?",
                "en_q": "I say: 'Hello kids! I help keep everyone safe on the road!' - Who am I?",
                "hi_a": "Traffic Light",
                "en_a": "Traffic Light"
            },
            {
                "id": 2,
                "hi_q": "कथन: 'RED means STOP!' - मैं कौन हूँ?",
                "en_q": "I say: 'RED means STOP!' - Who am I?",
                "hi_a": "Traffic Light",
                "en_a": "Traffic Light"
            },
            {
                "id": 3,
                "hi_q": "कथन: 'YELLOW means WAIT… get ready!' - मैं कौन हूँ?",
                "en_q": "I say: 'YELLOW means WAIT… get ready!' - Who am I?",
                "hi_a": "Traffic Light",
                "en_a": "Traffic Light"
            },
            {
                "id": 4,
                "hi_q": "कथन: 'GREEN means GO!' - मैं कौन हूँ?",
                "en_q": "I say: 'GREEN means GO!' - Who am I?",
                "hi_a": "Traffic Light",
                "en_a": "Traffic Light"
            },
        ],
    }
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

    # 42. Word Scramble
    await content_collection.replace_one(
        {"game_id": "word_scramble"},
        WORD_SCRAMBLE_DATA,
        upsert=True
    )
    print("Seeded Word Scramble")

    # 43. English Stories
    await content_collection.replace_one(
        {"game_id": "english_stories"},
        ENGLISH_STORIES_DATA,
        upsert=True
    )
    print("Seeded English Stories")


    # 45. Bilingual GK
    await content_collection.replace_one(
        {"game_id": "bilingual_gk"},
        BILINGUAL_GK_DATA,
        upsert=True
    )
    print("Seeded Bilingual GK")

    print("Done!")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed())
