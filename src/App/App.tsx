import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioProvider } from './contexts/AudioContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { GlobalControls } from './components/GlobalControls';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { ModeSelectionScreen } from './components/ModeSelectionScreen';
import { AIAssessmentScreen } from './components/AIAssessmentScreen';
import { ChildModeScreen } from './components/ChildModeScreen';
import { ParentDashboardScreen } from './components/ParentDashboardScreen';
import { StoriesScreen } from './components/StoriesScreen';
import { AnimalsScreen } from './components/AnimalsScreen';
import { LettersScreen } from './components/LettersScreen';
import { NumbersScreen } from './components/NumbersScreen';
import { ColorsScreen } from './components/ColorsScreen';
import { LifeSkillsScreen } from './components/LifeSkillsScreen';
import { SongsScreen } from './components/SongsScreen';
import { DrawingScreen } from './components/DrawingScreen';
import { ShapesScreen } from './components/ShapesScreen';
import { FruitsScreen } from './components/FruitsScreen';
import { VehiclesScreen } from './components/VehiclesScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { MemoryGameScreen } from './components/MemoryGameScreen';
import { GamesHubScreen } from './components/GamesHubScreen';
import { BalloonPopScreen } from './components/BalloonPopScreen';
import { ShadowMatchScreen } from './components/ShadowMatchScreen';
import { EmotionsScreen } from './components/EmotionsScreen';
import { BodyPartsScreen } from './components/BodyPartsScreen';
import { FamilyGuidanceScreen } from './components/FamilyGuidanceScreen';
import { CommunitySessionsScreen } from './components/CommunitySessionsScreen';
import { ParentSettingsScreen } from './components/ParentSettingsScreen';
import { PlayfulBackground } from './components/ui/PlayfulBackground';


function AppContent() {
  const { currentScreen, addTime } = useApp();

  // Time tracking effect
  const startTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const childScreens = [
      'ai-assessment', 'child-mode', 'stories', 'animals', 'letters',
      'numbers', 'colors', 'life-skills', 'songs', 'drawing',
      'shapes', 'fruits', 'vehicles', 'memory-game', 'balloon-pop',
      'shadow-match', 'games-hub', 'body-parts', 'emotions'
    ];

    const isChildScreen = childScreens.includes(currentScreen);

    if (isChildScreen) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }
    } else {
      if (startTimeRef.current !== null) {
        const elapsedMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
        if (elapsedMinutes > 0) {
          addTime(elapsedMinutes);
        }
        startTimeRef.current = null;
      }
    }

    // Interval to flush time if staying on one screen for long
    const interval = setInterval(() => {
      if (startTimeRef.current !== null) {
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed >= 60000) {
          addTime(1);
          startTimeRef.current = Date.now(); // Reset start time for next minute
        }
      }
    }, 10000); // Check every 10 seconds

    return () => {
      clearInterval(interval);
      if (startTimeRef.current !== null) {
        const elapsedMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
        if (elapsedMinutes > 0) {
          addTime(elapsedMinutes);
        }
        startTimeRef.current = null;
      }
    };
  }, [currentScreen, addTime]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen key="splash" />;
      case 'login':
        return <LoginScreen key="login" />;
      case 'registration':
        return <RegistrationScreen key="registration" />;
      case 'mode-selection':
        return <ModeSelectionScreen key="mode-selection" />;
      case 'ai-assessment':
        return <AIAssessmentScreen key="ai-assessment" />;
      case 'child-mode':
        return <ChildModeScreen key="child-mode" />;
      case 'parent-dashboard':
        return <ParentDashboardScreen key="parent-dashboard" />;
      case 'stories':
        return <StoriesScreen key="stories" />;
      case 'animals':
        return <AnimalsScreen key="animals" />;
      case 'letters':
        return <LettersScreen key="letters" />;
      case 'numbers':
        return <NumbersScreen key="numbers" />;
      case 'colors':
        return <ColorsScreen key="colors" />;
      case 'life-skills':
        return <LifeSkillsScreen key="life-skills" />;
      case 'songs':
        return <SongsScreen key="songs" />;
      case 'drawing':
        return <DrawingScreen key="drawing" />;
      case 'shapes':
        return <ShapesScreen key="shapes" />;
      case 'fruits':
        return <FruitsScreen key="fruits" />;
      case 'vehicles':
        return <VehiclesScreen key="vehicles" />;
      case 'rewards':
        return <RewardsScreen key="rewards" />;
      case 'memory-game':
        return <MemoryGameScreen key="memory-game" />;
      case 'balloon-pop':
        return <BalloonPopScreen key="balloon-pop" />;
      case 'shadow-match':
        return <ShadowMatchScreen key="shadow-match" />;
      case 'games-hub':
        return <GamesHubScreen key="games-hub" />;
      case 'body-parts':
        return <BodyPartsScreen key="body-parts" />;
      case 'emotions':
        return <EmotionsScreen key="emotions" />;
      case 'family-guidance':
        return <FamilyGuidanceScreen key="family-guidance" />;
      case 'community-sessions':
        return <CommunitySessionsScreen key="community-sessions" />;
      case 'parent-settings':
        return <ParentSettingsScreen key="parent-settings" />;
      default:
        return <SplashScreen key="default" />;
    }
  };

  return (
    <div className="size-full overflow-hidden bg-white relative">
      <PlayfulBackground />
      <GlobalControls />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 1.02 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="size-full relative z-10"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AudioProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AudioProvider>
    </LanguageProvider>
  );
}