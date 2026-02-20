import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Home from './components/Home';
import Menu from './components/Menu';
import EnglishMenu from './components/EnglishMenu';
import ReasoningMenu from './components/ReasoningMenu';
import HindiMenu from './components/HindiMenu';
import GamesMenu from './components/GamesMenu';
import BilingualGKGame from './components/BilingualGKGame';
import { GameProvider, useGame } from './context/GameContext';

// Math Games
const AdditionGame = lazy(() => import('./components/AdditionGame'));
const SubtractionGame = lazy(() => import('./components/SubtractionGame'));
const MultiplicationGame = lazy(() => import('./components/MultiplicationGame'));
const DivisionGame = lazy(() => import('./components/DivisionGame'));
const FractionsGame = lazy(() => import('./components/FractionsGame'));
const LCMGame = lazy(() => import('./components/LCMGame'));
const MentalMathGame = lazy(() => import('./components/MentalMathGame'));
const TablesGame = lazy(() => import('./components/TablesGame'));
const TimeArithmeticGame = lazy(() => import('./components/TimeArithmeticGame'));
const TimeGame = lazy(() => import('./components/TimeGame'));
const UnitaryMethodGame = lazy(() => import('./components/UnitaryMethodGame'));
const DecimalArithmeticGame = lazy(() => import('./components/DecimalArithmeticGame'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));
const LevelMap = lazy(() => import('./components/LevelMap'));
const BubbleMultiplicationGame = lazy(() => import('./components/BubbleMultiplicationGame'));
const DirectionAdventureGame = lazy(() => import('./components/DirectionAdventureGame'));
const TrafficLightHero = lazy(() => import('./components/TrafficLightHero'));
const NightSafetyGame = lazy(() => import('./components/NightSafetyGame'));
const ForceMotionGame = lazy(() => import('./components/ForceMotionGame'));
const GravityDropLab = lazy(() => import('./components/GravityDropLab'));
const LightBeamAdventure = lazy(() => import('./components/LightBeamAdventure'));

// Reasoning Games
const ReasoningBasicsGame = lazy(() => import('./components/ReasoningBasicsGame'));
const LogicPuzzleGame = lazy(() => import('./components/LogicPuzzleGame'));

// Hindi Games
const HindiGame = lazy(() => import('./components/HindiGame'));
const HindiStoriesGame = lazy(() => import('./components/HindiStoriesGame'));

// English Games
const AlphabetGame = lazy(() => import('./components/AlphabetGame'));
const SpellingGame = lazy(() => import('./components/SpellingGame'));
const WordScrambleGame = lazy(() => import('./components/WordScrambleGame'));
const EnglishStoriesGame = lazy(() => import('./components/EnglishStoriesGame'));
const TwoLetterWordsGame = lazy(() => import('./components/TwoLetterWordsGame'));
const ThreeLetterWordsGame = lazy(() => import('./components/ThreeLetterWordsGame'));
const FourLetterWordsGame = lazy(() => import('./components/FourLetterWordsGame'));
const FiveLetterWordsGame = lazy(() => import('./components/FiveLetterWordsGame'));
const SixLetterWordsGame = lazy(() => import('./components/SixLetterWordsGame'));
const SevenLetterWordsGame = lazy(() => import('./components/SevenLetterWordsGame'));
const SentenceBuildingGame = lazy(() => import('./components/SentenceBuildingGame'));
const ThreeWordSentencesGame = lazy(() => import('./components/ThreeWordSentencesGame'));
const FourWordSentencesGame = lazy(() => import('./components/FourWordSentencesGame'));
const ActionSentencesGame = lazy(() => import('./components/ActionSentencesGame'));
const HomeActionsGame = lazy(() => import('./components/HomeActionsGame'));
const BasicActionsGame = lazy(() => import('./components/BasicActionsGame'));
const PhysicalActionsGame = lazy(() => import('./components/PhysicalActionsGame'));
const SchoolActionsGame = lazy(() => import('./components/SchoolActionsGame'));
const HomeAppliancesGame = lazy(() => import('./components/HomeAppliancesGame'));
const CommandsActionsGame = lazy(() => import('./components/CommandsActionsGame'));
const FeelingThinkingGame = lazy(() => import('./components/FeelingThinkingGame'));
const EncouragementGame = lazy(() => import('./components/EncouragementGame'));
const PolitePhrasesGame = lazy(() => import('./components/PolitePhrasesGame'));
const GuestMannersGame = lazy(() => import('./components/GuestMannersGame'));
const MorningRoutineGame = lazy(() => import('./components/MorningRoutineGame'));
const PrepositionsGame = lazy(() => import('./components/PrepositionsGame'));
const VerbsGame = lazy(() => import('./components/VerbsGame'));
const NounsGame = lazy(() => import('./components/NounsGame'));
const SingularPluralGame = lazy(() => import('./components/SingularPluralGame'));
const PronounsGame = lazy(() => import('./components/PronounsGame'));
const AdverbsGame = lazy(() => import('./components/AdverbsGame'));
const AdjectivesGame = lazy(() => import('./components/AdjectivesGame'));
const YesNoQuestionsGame = lazy(() => import('./components/YesNoQuestionsGame'));
const ConversationGame = lazy(() => import('./components/ConversationGame'));
const Settings = lazy(() => import('./components/Settings'));

// Basic Header
// Premium Header
// Premium Header
const GlobalHeader = ({ stars, level, onShowSettings }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0,
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 2000,
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(15px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
  }}>
    {/* App Name / Logo */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '40px', height: '40px', background: 'linear-gradient(45deg, #3498DB, #2ECC71)',
        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(52, 152, 219, 0.3)'
      }}>
        🚀
      </div>
      <div>
        <h1 style={{
          fontSize: '1.2rem', margin: 0, color: '#2C3E50',
          letterSpacing: '1px', textTransform: 'uppercase',
          background: 'linear-gradient(45deg, #2C3E50, #3498DB)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 900
        }}>
          Kids Hero
        </h1>
        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', marginTop: '-4px' }}>
          LEARN & PLAY
        </div>
      </div>
    </div>

    {/* Right Side Controls */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        background: 'white',
        padding: '6px 15px',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid #F1F5F9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1rem' }}>⭐</span>
          <span style={{ fontWeight: '900', color: '#1E293B' }}>{stars}</span>
        </div>
        <div style={{ width: '1px', height: '20px', background: '#E2E8F0' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#64748B' }}>LVL</span>
          <span style={{ fontWeight: '900', color: '#3498DB' }}>{level}</span>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={onShowSettings}
        style={{
          background: 'white',
          padding: '10px',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          border: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748B'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>⚙️</span>
      </motion.div>
    </div>
  </div>
);

function AppContent() {
  const [currentMode, setCurrentMode] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const context = useGame();
  const userData = context?.userData;

  const navigate = useCallback((mode) => {
    setCurrentMode(mode);
  }, []);

  useEffect(() => {
    if (userData?.settings) {
      document.documentElement.style.setProperty('--active-english-font', `var(--font-family-${userData.settings.englishFont.toLowerCase()})`);
      document.documentElement.style.setProperty('--active-hindi-font', `var(--font-family-${userData.settings.hindiFont.toLowerCase()})`);
    }
  }, [userData?.settings?.englishFont, userData?.settings?.hindiFont]);

  if (!userData) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <h2 style={{ color: '#64748b' }}>Initializing Game Data...</h2>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentMode) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'menu':
        return <Menu onSelectMode={navigate} onBack={() => navigate('home')} />;
      case 'english-menu':
        return <EnglishMenu onSelectMode={navigate} onBack={() => navigate('home')} />;
      case 'reasoning-menu':
        return <ReasoningMenu onSelectMode={navigate} onBack={() => navigate('home')} />;
      case 'hindi-menu':
        return <HindiMenu onSelectMode={navigate} onBack={() => navigate('home')} />;
      case 'games':
        return <GamesMenu onSelectMode={navigate} onBack={() => navigate('home')} />;
      case 'bilingual_gk': return <BilingualGKGame onBack={() => navigate('home')} subject="gk" />;
      case 'physics': return <BilingualGKGame onBack={() => navigate('home')} subject="physics" />;
      case 'chemistry': return <BilingualGKGame onBack={() => navigate('home')} subject="chemistry" />;
      case 'biology': return <BilingualGKGame onBack={() => navigate('home')} subject="biology" />;

      // Math Games Routing
      case 'addition': return <AdditionGame onBack={() => navigate('menu')} />;
      case 'subtraction': return <SubtractionGame onBack={() => navigate('menu')} />;
      case 'multiplication': return <MultiplicationGame onBack={() => navigate('menu')} />;
      case 'division': return <DivisionGame onBack={() => navigate('menu')} />;
      case 'fractions': return <FractionsGame onBack={() => navigate('menu')} />;
      case 'lcm': return <LCMGame onBack={() => navigate('menu')} />;
      case 'mentalmath': return <MentalMathGame onBack={() => navigate('menu')} />;
      case 'tables': return <TablesGame onBack={() => navigate('menu')} />;
      case 'time': return <TimeGame onBack={() => navigate('menu')} />;
      case 'timearithmetic': return <TimeArithmeticGame onBack={() => navigate('menu')} />;
      case 'unitary': return <UnitaryMethodGame onBack={() => navigate('menu')} />;
      case 'decimals': return <DecimalArithmeticGame onBack={() => navigate('menu')} />;
      case 'leaderboard': return <Leaderboard onBack={() => navigate('menu')} />;
      case 'levelmap': return <LevelMap onBack={() => navigate('menu')} />;
      case 'bubble-multi': return <BubbleMultiplicationGame onBack={() => navigate('menu')} />;
      case 'direction-adventure': return <DirectionAdventureGame onBack={() => navigate('games')} />;
      case 'traffic-hero': return <TrafficLightHero onBack={() => navigate('games')} />;
      case 'night-safety': return <NightSafetyGame onBack={() => navigate('games')} />;
      case 'force-motion': return <ForceMotionGame onBack={() => navigate('games')} />;
      case 'gravity-drop': return <GravityDropLab onBack={() => navigate('games')} />;
      case 'light-beam': return <LightBeamAdventure onBack={() => navigate('games')} />;

      // Reasoning Games
      case 'reasoning-basics': return <ReasoningBasicsGame onBack={() => navigate('reasoning-menu')} />;
      case 'logic-puzzles': return <LogicPuzzleGame onBack={() => navigate('reasoning-menu')} />;

      // Hindi Games
      case 'hindi-varnamala': return <HindiGame gameType="varnamala" onBack={() => navigate('hindi-menu')} />;
      case 'hindi-2-letter': return <HindiGame gameType="hindi-2-letter" onBack={() => navigate('hindi-menu')} />;
      case 'hindi-3-letter': return <HindiGame gameType="hindi-3-letter" onBack={() => navigate('hindi-menu')} />;
      case 'hindi-stories': return <HindiStoriesGame onBack={() => navigate('hindi-menu')} />;

      // English Games Routing
      case 'alphabet': return <AlphabetGame onBack={() => navigate('english-menu')} />;
      case 'spelling': return <SpellingGame onBack={() => navigate('english-menu')} />;
      case 'wordscramble': return <WordScrambleGame onBack={() => navigate('english-menu')} />;
      case 'english-stories': return <EnglishStoriesGame onBack={() => navigate('english-menu')} />;
      case 'twoletter': return <TwoLetterWordsGame onBack={() => navigate('english-menu')} />;
      case 'threeletter': return <ThreeLetterWordsGame onBack={() => navigate('english-menu')} />;
      case 'fourletter': return <FourLetterWordsGame onBack={() => navigate('english-menu')} />;
      case 'fiveletter': return <FiveLetterWordsGame onBack={() => navigate('english-menu')} />;
      case 'sixletter': return <SixLetterWordsGame onBack={() => navigate('english-menu')} />;
      case 'sevenletter': return <SevenLetterWordsGame onBack={() => navigate('english-menu')} />;
      case 'sentences': return <SentenceBuildingGame onBack={() => navigate('english-menu')} />;
      case 'sentencebuilder': return <SentenceBuildingGame onBack={() => navigate('english-menu')} />;
      case 'threewordsentences': return <ThreeWordSentencesGame onBack={() => navigate('english-menu')} />;
      case 'fourwordsentences': return <FourWordSentencesGame onBack={() => navigate('english-menu')} />;
      case 'actionsentences': return <ActionSentencesGame onBack={() => navigate('english-menu')} />;
      case 'homeactions': return <HomeActionsGame onBack={() => navigate('english-menu')} />;
      case 'basicactions': return <BasicActionsGame onBack={() => navigate('english-menu')} />;
      case 'physicalactions': return <PhysicalActionsGame onBack={() => navigate('english-menu')} />;
      case 'schoolactions': return <SchoolActionsGame onBack={() => navigate('english-menu')} />;
      case 'homeappliances': return <HomeAppliancesGame onBack={() => navigate('english-menu')} />;
      case 'commandsactions': return <CommandsActionsGame onBack={() => navigate('english-menu')} />;
      case 'feelingthinking': return <FeelingThinkingGame onBack={() => navigate('english-menu')} />;
      case 'encouragement': return <EncouragementGame onBack={() => navigate('english-menu')} />;
      case 'politephrases': return <PolitePhrasesGame onBack={() => navigate('english-menu')} />;
      case 'guestmanners': return <GuestMannersGame onBack={() => navigate('english-menu')} />;
      case 'morningroutine': return <MorningRoutineGame onBack={() => navigate('english-menu')} />;
      case 'prepositions': return <PrepositionsGame onBack={() => navigate('english-menu')} />;
      case 'verbs': return <VerbsGame onBack={() => navigate('english-menu')} />;
      case 'nouns': return <NounsGame onBack={() => navigate('english-menu')} />;
      case 'singularplural': return <SingularPluralGame onBack={() => navigate('english-menu')} />;
      case 'pronouns': return <PronounsGame onBack={() => navigate('english-menu')} />;
      case 'adverbs': return <AdverbsGame onBack={() => navigate('english-menu')} />;
      case 'adjectives': return <AdjectivesGame onBack={() => navigate('english-menu')} />;
      case 'yesnoquestions': return <YesNoQuestionsGame onBack={() => navigate('english-menu')} />;

      // Conversations
      case 'conv_school': return <ConversationGame scenarioId="school" onBack={() => navigate('english-menu')} />;
      case 'conv_mom': return <ConversationGame scenarioId="mom" onBack={() => navigate('english-menu')} />;
      case 'conv_sister': return <ConversationGame scenarioId="sister" onBack={() => navigate('english-menu')} />;
      case 'conv_friend': return <ConversationGame scenarioId="friend" onBack={() => navigate('english-menu')} />;

      case 'settings':
        setShowSettings(true);
        setCurrentMode('home');
        return <Home onNavigate={navigate} />;

      default:
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Game Mode: {currentMode}</h2>
            <p>Game content for "{currentMode}" will be loaded here.</p>
            <button
              onClick={() => navigate('home')}
              style={{
                padding: '10px 20px',
                background: '#3498DB',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              Back to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'sans-serif',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      <GlobalHeader
        stars={userData.stars}
        level={userData.currentLevel}
        onShowSettings={() => setShowSettings(true)}
      />

      <div style={{
        paddingTop: '90px',
        paddingBottom: '40px',
        WebkitOverflowScrolling: 'touch' // Smooth scroll on iOS
      }}>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
            <div className="loader">Loading Game...</div>
          </div>
        }>
          {renderContent()}
          {showSettings && <Settings onClose={() => setShowSettings(false)} />}
        </Suspense>
      </div>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
