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

    print("Done!")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed())
