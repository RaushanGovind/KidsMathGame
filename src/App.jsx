import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Menu from './components/Menu';
import Home from './components/Home'; // Import Home
import AdditionGame from './components/AdditionGame';
import SubtractionGame from './components/SubtractionGame';
import MultiplicationGame from './components/MultiplicationGame';
import DivisionGame from './components/DivisionGame';
import TimeGame from './components/TimeGame';
import FractionsGame from './components/FractionsGame';
import LevelMap from './components/LevelMap'; // Import LevelMap
import Progress from './components/Progress'; // Import Progress
import Settings from './components/Settings'; // Import Settings
import GlobalChallenge from './components/GlobalChallenge';
import TablesGame from './components/TablesGame';
import LCMGame from './components/LCMGame';
import UnitaryMethodGame from './components/UnitaryMethodGame';
import TimeArithmeticGame from './components/TimeArithmeticGame';
import DecimalArithmeticGame from './components/DecimalArithmeticGame';
import EnglishMenu from './components/EnglishMenu';
import SpellingGame from './components/SpellingGame';
import AlphabetGame from './components/AlphabetGame';
import TwoLetterWordsGame from './components/TwoLetterWordsGame';
import ThreeLetterWordsGame from './components/ThreeLetterWordsGame';
import FourLetterWordsGame from './components/FourLetterWordsGame';
import FiveLetterWordsGame from './components/FiveLetterWordsGame';
import SixLetterWordsGame from './components/SixLetterWordsGame';
import SevenLetterWordsGame from './components/SevenLetterWordsGame';
import TwoWordSentencesGame from './components/TwoWordSentencesGame';
import ThreeWordSentencesGame from './components/ThreeWordSentencesGame';
import FourWordSentencesGame from './components/FourWordSentencesGame';
import ActionSentencesGame from './components/ActionSentencesGame';
import HomeActionsGame from './components/HomeActionsGame';
import HomeAppliancesGame from './components/HomeAppliancesGame';
import BasicActionsGame from './components/BasicActionsGame';
import PhysicalActionsGame from './components/PhysicalActionsGame';
import SchoolActionsGame from './components/SchoolActionsGame';
import CommandsActionsGame from './components/CommandsActionsGame';
import FeelingThinkingGame from './components/FeelingThinkingGame';
import EncouragementGame from './components/EncouragementGame';
import PolitePhrasesGame from './components/PolitePhrasesGame';
import GuestMannersGame from './components/GuestMannersGame';
import MorningRoutineGame from './components/MorningRoutineGame';
import PrepositionsGame from './components/PrepositionsGame';
import VerbsGame from './components/VerbsGame';
import NounsGame from './components/NounsGame';
import MentalMathGame from './components/MentalMathGame';

import SingularPluralGame from './components/SingularPluralGame';
import PronounsGame from './components/PronounsGame';
import AdverbsGame from './components/AdverbsGame';
import AdjectivesGame from './components/AdjectivesGame';

import YesNoQuestionsGame from './components/YesNoQuestionsGame';
import SentenceBuildingGame from './components/SentenceBuildingGame';
import ConversationGame from './components/ConversationGame';
import Leaderboard from './components/Leaderboard';
import WordScrambleGame from './components/WordScrambleGame';
import ReasoningMenu from './components/ReasoningMenu';
import ReasoningBasicsGame from './components/ReasoningBasicsGame';
import LogicPuzzleGame from './components/LogicPuzzleGame';
import HindiMenu from './components/HindiMenu';
import HindiGame from './components/HindiGame';

import { GameProvider } from './context/GameContext';

function App() {
  const [currentMode, setCurrentMode] = useState('home'); // Default to home

  const renderContent = () => {
    switch (currentMode) {
      case 'home':
        return <Home onNavigate={setCurrentMode} />;
      case 'settings':
        return <Settings onBack={() => setCurrentMode('home')} />;
      case 'progress':
        return <Progress onNavigate={setCurrentMode} onBack={() => setCurrentMode('menu')} />;
      case 'levelmap':
        return <LevelMap onBack={() => setCurrentMode('menu')} onSelectLevel={(id) => alert(`Level ${id} Selected!`)} />;
      case 'menu':
        return <Menu onSelectMode={setCurrentMode} onBack={() => setCurrentMode('home')} />;
      case 'addition':
        return <AdditionGame onBack={() => setCurrentMode('menu')} />;
      case 'subtraction':
        return <SubtractionGame onBack={() => setCurrentMode('menu')} />;
      case 'multiplication':
        return <MultiplicationGame onBack={() => setCurrentMode('menu')} />;
      case 'division':
        return <DivisionGame onBack={() => setCurrentMode('menu')} />;
      case 'time':
        return <TimeGame onBack={() => setCurrentMode('menu')} />;
      case 'fractions':
        return <FractionsGame onBack={() => setCurrentMode('menu')} />;
      case 'global':
        return <GlobalChallenge onBack={() => setCurrentMode('menu')} />;
      case 'tables':
        return <TablesGame onBack={() => setCurrentMode('menu')} />;
      case 'lcm':
        return <LCMGame onBack={() => setCurrentMode('menu')} />;
      case 'unitary':
        return <UnitaryMethodGame onBack={() => setCurrentMode('menu')} />;
      case 'timearithmetic':
        return <TimeArithmeticGame onBack={() => setCurrentMode('menu')} />;
      case 'decimals':
        return <DecimalArithmeticGame onBack={() => setCurrentMode('menu')} />;
      case 'english-menu':
        return <EnglishMenu onSelectMode={(mode) => setCurrentMode(mode)} onBack={() => setCurrentMode('home')} />;
      case 'reasoning-menu':
        return <ReasoningMenu onSelectMode={(mode) => setCurrentMode(mode)} onBack={() => setCurrentMode('home')} />;
      case 'reasoning-basics':
        return <ReasoningBasicsGame onBack={() => setCurrentMode('reasoning-menu')} />;
      case 'logic-puzzles':
        return <LogicPuzzleGame onBack={() => setCurrentMode('reasoning-menu')} />;
      case 'hindi-menu':
        return <HindiMenu onSelectMode={setCurrentMode} onBack={() => setCurrentMode('home')} />;
      case 'hindi-varnamala':
        return <HindiGame gameType="varnamala" onBack={() => setCurrentMode('hindi-menu')} />;
      case 'hindi-2-letter':
        return <HindiGame gameType="hindi-2-letter" onBack={() => setCurrentMode('hindi-menu')} />;
      case 'hindi-3-letter':
        return <HindiGame gameType="hindi-3-letter" onBack={() => setCurrentMode('hindi-menu')} />;
      case 'mentalmath':
        return <MentalMathGame onBack={() => setCurrentMode('menu')} />;
      case 'spelling':
        return <SpellingGame onBack={() => setCurrentMode('english-menu')} />;
      case 'wordscramble':
        return <WordScrambleGame onBack={() => setCurrentMode('english-menu')} />;
      case 'alphabet':
        return <AlphabetGame onBack={() => setCurrentMode('english-menu')} />;
      case 'twoletter':
        return <TwoLetterWordsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'threeletter':
        return <ThreeLetterWordsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'fourletter':
        return <FourLetterWordsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'fiveletter':
        return <FiveLetterWordsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'sixletter':
        return <SixLetterWordsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'sevenletter':
        return <SevenLetterWordsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'twowordsentences':
        return <TwoWordSentencesGame onBack={() => setCurrentMode('english-menu')} />;
      case 'threewordsentences':
        return <ThreeWordSentencesGame onBack={() => setCurrentMode('english-menu')} />;
      case 'fourwordsentences':
        return <FourWordSentencesGame onBack={() => setCurrentMode('english-menu')} />;
      case 'actionsentences':
        return <ActionSentencesGame onBack={() => setCurrentMode('english-menu')} />;
      case 'homeactions':
        return <HomeActionsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'homeappliances':
        return <HomeAppliancesGame onBack={() => setCurrentMode('english-menu')} />;
      case 'basicactions':
        return <BasicActionsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'physicalactions':
        return <PhysicalActionsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'schoolactions':
        return <SchoolActionsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'commandsactions':
        return <CommandsActionsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'feelingthinking':
        return <FeelingThinkingGame onBack={() => setCurrentMode('english-menu')} />;
      case 'encouragement':
        return <EncouragementGame onBack={() => setCurrentMode('english-menu')} />;
      case 'politephrases':
        return <PolitePhrasesGame onBack={() => setCurrentMode('english-menu')} />;
      case 'guestmanners':
        return <GuestMannersGame onBack={() => setCurrentMode('english-menu')} />;
      case 'morningroutine':
        return <MorningRoutineGame onBack={() => setCurrentMode('english-menu')} />;
      case 'prepositions':
        return <PrepositionsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'verbs':
        return <VerbsGame onBack={() => setCurrentMode('english-menu')} />;

      case 'nouns':
        return <NounsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'singularplural':
        return <SingularPluralGame onBack={() => setCurrentMode('english-menu')} />;
      case 'pronouns':
        return <PronounsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'adverbs':
        return <AdverbsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'adjectives':
        return <AdjectivesGame onBack={() => setCurrentMode('english-menu')} />;
      case 'prepositions':
        return <PrepositionsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'yesnoquestions':
        return <YesNoQuestionsGame onBack={() => setCurrentMode('english-menu')} />;
      case 'sentencebuilder':
        return <SentenceBuildingGame onBack={() => setCurrentMode('english-menu')} />;
      case 'conv_school':
        return <ConversationGame scenarioId="school" onBack={() => setCurrentMode('english-menu')} />;
      case 'conv_mom':
        return <ConversationGame scenarioId="mom" onBack={() => setCurrentMode('english-menu')} />;
      case 'conv_sister':
        return <ConversationGame scenarioId="sister" onBack={() => setCurrentMode('english-menu')} />;
      case 'conv_friend':
        return <ConversationGame scenarioId="friend" onBack={() => setCurrentMode('english-menu')} />;
      case 'leaderboard':
        return <Leaderboard onBack={() => setCurrentMode('menu')} />;
      default:
        return <Home onNavigate={setCurrentMode} />;
    }
  };

  return (
    <GameProvider>
      <div className="app-container" style={{ padding: '0px', maxWidth: '100vw', margin: '0 auto', minHeight: '100vh', overflowX: 'hidden' }}>
        {/* Header removal: Home screen has its own title now. We might want a smaller header for game modes or just keep games as is. 
            The 'Kids Math Adventure' header in existing App.jsx was nice but 'Fast Math Fun' replaces it on Home.
            Games have their own back buttons. Menu has its own header now too.
            Let's remove the global header to avoid clutter.
        */}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </GameProvider>
  );
}

export default App;
