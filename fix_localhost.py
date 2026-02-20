

"""
Script to fix all hardcoded localhost URLs in game components
"""
import os
import re

# Directory containing the components
components_dir = r'c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame\src\components'

# Files to fix (from grep results)
files_to_fix = [
    'YesNoQuestionsGame.jsx', 'WordScrambleGame.jsx', 'VerbsGame.jsx',
    'UnitaryMethodGame.jsx', 'TwoWordSentencesGame.jsx', 'TwoLetterWordsGame.jsx',
    'ThreeWordSentencesGame.jsx', 'ThreeLetterWordsGame.jsx', 'SixLetterWordsGame.jsx',
    'SpellingGame.jsx', 'SingularPluralGame.jsx', 'SevenLetterWordsGame.jsx',
    'SentenceBuildingGame.jsx', 'SchoolActionsGame.jsx', 'ReasoningBasicsGame.jsx',
    'PronounsGame.jsx', 'PrepositionsGame.jsx', 'PolitePhrasesGame.jsx',
    'PhysicalActionsGame.jsx', 'NounsGame.jsx', 'MorningRoutineGame.jsx',
    'MentalMathGame.jsx', 'LogicPuzzleGame.jsx', 'HomeAppliancesGame.jsx',
    'HomeActionsGame.jsx', 'HindiStoriesGame.jsx', 'GuestMannersGame.jsx',
    'FourWordSentencesGame.jsx', 'FourLetterWordsGame.jsx', 'FiveLetterWordsGame.jsx',
    'FeelingThinkingGame.jsx', 'EnglishStoriesGame.jsx', 'EncouragementGame.jsx',
    'ConversationGame.jsx', 'CommandsActionsGame.jsx', 'BasicActionsGame.jsx',
    'AlphabetGame.jsx', 'AdverbsGame.jsx', 'AdjectivesGame.jsx', 'ActionSentencesGame.jsx'
]

count = 0
for filename in files_to_fix:
    filepath = os.path.join(components_dir, filename)
    
    if not os.path.exists(filepath):
        print(f"❌ Not found: {filename}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace fetch('http://localhost:8000/... with const API_URL + fetch
    original_content = content
    
    # Pattern: fetch('http://localhost:8000/api/...
    pattern = r"fetch\('http://localhost:8000(/api/[^']+)'\)"
    
    def replacement(match):
        api_path = match.group(1)
        return f"fetch(`${{API_URL}}{api_path}`)"
    
    content = re.sub(pattern, replacement, content)
    
    # Check if API_URL is already defined
    if content != original_content and 'const API_URL = import.meta.env.VITE_API_URL' not in content:
        # Add API_URL definition after the first useEffect line
        useeffect_pattern = r'(useEffect\(\(\) => \{)'
        content = re.sub(
            useeffect_pattern,
            r"\1\n        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';",
            content,
            count=1
        )
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {filename}")
        count += 1
    else:
        print(f"Skipped (no changes): {filename}")

print(f"\nFixed {count} files!")
