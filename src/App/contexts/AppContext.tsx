import React, { createContext, useContext, useState, useCallback } from 'react';

export type Screen =
  | 'splash'
  | 'login'
  | 'registration'
  | 'mode-selection'
  | 'ai-assessment'
  | 'child-mode'
  | 'parent-dashboard'
  | 'stories'
  | 'animals'
  | 'letters'
  | 'numbers'
  | 'colors'
  | 'life-skills'
  | 'songs'
  | 'drawing'
  | 'shapes'
  | 'fruits'
  | 'vehicles'
  | 'rewards'
  | 'memory-game'
  | 'body-parts'
  | 'emotions'
  | 'balloon-pop'
  | 'shadow-match'
  | 'games-hub'
  | 'family-guidance'
  | 'community-sessions'
  | 'parent-settings';

export type Condition = 'down-syndrome' | 'autism' | 'williams' | 'fragile-x' | 'other';

export interface Badge {
  id: string;
  nameAr: string;
  nameEn: string;
  emoji: string;
  descriptionAr: string;
  descriptionEn: string;
  unlocked: boolean;
}

export interface ChildProfile {
  name: string;
  age: number;
  dateOfBirth: string;
  gender: 'male' | 'female';
  country: string;
  city: string;
  motherName: string;
  motherJob: string;
  fatherName: string;
  fatherJob: string;
  phone: string;
  condition: Condition;
  email?: string;
  dailyTimeSpent?: Record<string, number>; // date string -> minutes
}

export interface AssessmentResult {
  level: number;
  iqScore?: number;
  completedAt: Date;
  strengths: string[];
  areasToImprove: string[];
}


export interface ModuleProgress {
  [moduleId: string]: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  taskAr: string;
  taskEn: string;
  icon: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}


interface AppContextType {
  currentScreen: Screen;
  navigateTo: (screen: Screen) => void;
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;
  assessmentResult: AssessmentResult | null;
  setAssessmentResult: (result: AssessmentResult | null) => void;
  isParentModeUnlocked: boolean;

  unlockParentMode: (password: string) => boolean;
  isReturningUser: boolean;
  setIsReturningUser: (value: boolean) => void;
  earnedBadges: string[];
  unlockBadge: (badgeId: string) => void;
  moduleProgress: ModuleProgress;
  incrementProgress: (moduleId: string) => void;
  resetProgress: () => void;
  activities: ActivityItem[];
  logActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  loginUser: (email: string, password?: string) => Promise<any>;
  registerUser: (profile: ChildProfile & { password?: string }) => Promise<boolean>;
  updateUser: (email: string, updates: Partial<ChildProfile & { moduleProgress: ModuleProgress; earnedBadges: string[]; assessmentResult: AssessmentResult; activities: ActivityItem[] }>) => Promise<boolean>;
  addTime: (minutes: number) => void;

  irisProfile: IrisProfile | null;
  setIrisProfile: (profile: IrisProfile | null) => void;
  reconstructIrisProfile: () => Promise<void>;
  getAiRecommendations: (contentType?: string) => Promise<any[]>;

  parentChatHistory: ChatMessage[];
  sendParentMessage: (text: string) => Promise<void>;
}



const AppContext = createContext<AppContextType | undefined>(undefined);

const PARENT_PASSWORD = '1234'; // Simple password for demo

const API_URL = 'http://localhost:5000/api';
const AI_API_URL = 'http://localhost:8000';

export interface IrisProfile {
  child_id: string;
  age: number;
  condition: string;
  iq_score: number;
  iq_category: string;
  age_group: string;
  cognitive_level: string;
  recommended_difficulty: string;
  content_pace: string;
  strengths: string[];
  challenges: string[];
  preferred_modalities: string[];
}


export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [assessmentResult, _setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isParentModeUnlocked, setIsParentModeUnlocked] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>(['explorer', 'beginner']);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress>({});
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [irisProfile, setIrisProfile] = useState<IrisProfile | null>(null);
  const [parentChatHistory, setParentChatHistory] = useState<ChatMessage[]>([]);

  const reconstructIrisProfile = useCallback(async () => {
    if (!childProfile || !assessmentResult) return;

    console.log("IRIS: Reconstructing session for", childProfile.name);
    const iqToUse = assessmentResult.iqScore || (40 + (assessmentResult.level * 10));

    try {
      const res = await fetch(`${AI_API_URL}/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: childProfile.name,
          age: childProfile.age,
          condition: childProfile.condition.replace('-', '_'),
          iq_score: iqToUse
        }),
      });
      if (res.ok) {
        const aiData = await res.json();
        if (aiData) {
          console.log("IRIS: Session restored successfully");
          setIrisProfile(aiData.profile);
        }
      }
    } catch (err) {
      console.error("IRIS Persistence error:", err);
    }
  }, [childProfile, assessmentResult]);

  // Auto-persist and reconstruct IRIS session
  React.useEffect(() => {
    if (childProfile && assessmentResult && !irisProfile) {
      reconstructIrisProfile();
    }
  }, [childProfile?.email, assessmentResult, !!irisProfile, reconstructIrisProfile]);




  const updateUser = useCallback(async (email: string, updates: Partial<ChildProfile & { moduleProgress: ModuleProgress; earnedBadges: string[]; assessmentResult: AssessmentResult; activities: ActivityItem[] }>) => {
    try {
      const response = await fetch(`${API_URL}/users/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        // Only update childProfile if relevant fields are changed
        if (updates.name || updates.age || updates.gender || updates.country || updates.city || updates.motherName || updates.motherJob || updates.fatherName || updates.fatherJob || updates.phone || updates.condition || updates.email) {
          setChildProfile(prev => prev ? { ...prev, ...updates as Partial<ChildProfile> } : null);
        }
        // Update other states if they are part of the updates
        if (updates.moduleProgress) setModuleProgress(updates.moduleProgress);
        if (updates.earnedBadges) setEarnedBadges(updates.earnedBadges);
        if (updates.assessmentResult) _setAssessmentResult(updates.assessmentResult);
        if (updates.activities) setActivities(updates.activities);
        return true;
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
    return false;
  }, []);

  const syncWithBackend = useCallback(async (updates: Partial<{ moduleProgress: ModuleProgress; earnedBadges: string[]; assessmentResult: AssessmentResult | null; activities: ActivityItem[]; dailyTimeSpent: Record<string, number> }>) => {
    if (!childProfile?.email) return;
    updateUser(childProfile.email, updates as any);
  }, [childProfile?.email, updateUser]);

  const setAssessmentResult = useCallback((result: AssessmentResult | null) => {
    _setAssessmentResult(result);
    setTimeout(() => syncWithBackend({ assessmentResult: result }), 0);
  }, [syncWithBackend]);


  const registerUser = useCallback(async (profile: ChildProfile & { password?: string }) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          moduleProgress: {},
          earnedBadges: ['explorer', 'beginner'],
          assessmentResult: null,
          activities: [],
          dailyTimeSpent: {}
        }),
      });
      if (response.ok) {
        setChildProfile(profile as ChildProfile);
        setIsReturningUser(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }, []);

  const loginUser = useCallback(async (email: string, password?: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setChildProfile({
          email: data.email,
          name: data.name,
          age: data.age,
          condition: data.condition,
          gender: data.gender || 'male',
          motherName: data.motherName || '',
          fatherName: data.fatherName || '',
          phone: data.phone || '',
          country: data.country || '',
          city: data.city || '',
          dateOfBirth: data.dateOfBirth || '',
          motherJob: data.motherJob || '',
          fatherJob: data.fatherJob || '',
          dailyTimeSpent: data.dailyTimeSpent || {}
        });
        setModuleProgress(data.moduleProgress || {});
        setEarnedBadges(data.earnedBadges || ['explorer', 'beginner']);
        if (data.assessmentResult) {
          setAssessmentResult(data.assessmentResult);
          // Auto-reconstruct IRIS profile
          const iqToUse = data.assessmentResult.iqScore || (40 + (data.assessmentResult.level * 10));

          fetch(`${AI_API_URL}/assessment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              child_id: data.name,
              age: data.age,
              condition: data.condition.replace('-', '_'),
              iq_score: iqToUse
            }),
          }).then(res => res.ok && res.json()).then(aiData => {
            if (aiData) setIrisProfile(aiData.profile);
          }).catch(err => console.error("Auto-reconstruction failed", err));

        } else {
          setAssessmentResult(null);
        }
        setActivities(data.activities || []);
        setIsReturningUser(true);
        return data;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    return null;
  }, []);


  const logActivity = useCallback((activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newItem: ActivityItem = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setActivities(prev => {
      const newActivities = [newItem, ...prev].slice(0, 50); // Keep last 50
      setTimeout(() => syncWithBackend({ activities: newActivities }), 0);
      return newActivities;
    });
  }, [syncWithBackend]);

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const unlockParentMode = useCallback((password: string) => {
    if (password === PARENT_PASSWORD) {
      setIsParentModeUnlocked(true);
      return true;
    }
    return false;
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setEarnedBadges(prev => {
      const newBadges = [...new Set([...prev, badgeId])];
      if (newBadges.length !== prev.length) {
        setTimeout(() => syncWithBackend({ earnedBadges: newBadges }), 0);
      }
      return newBadges;
    });
  }, [syncWithBackend]);

  const incrementProgress = useCallback((moduleId: string) => {
    setModuleProgress(prev => {
      const current = prev[moduleId] || 0;
      if (current >= 100) return prev;
      const newProgress = { ...prev, [moduleId]: Math.min(100, current + 10) };
      setTimeout(() => syncWithBackend({ moduleProgress: newProgress }), 0);
      return newProgress;
    });
  }, [syncWithBackend]);

  const resetProgress = useCallback(() => {
    setModuleProgress({});
    syncWithBackend({ moduleProgress: {} });
  }, [syncWithBackend]);

  const addTime = useCallback((minutes: number) => {
    setChildProfile(prev => {
      if (!prev) return null;
      const today = new Date().toISOString().split('T')[0];
      const currentDailyTime = prev.dailyTimeSpent || {};
      const newDailyTime = {
        ...currentDailyTime,
        [today]: (currentDailyTime[today] || 0) + minutes
      };

      // Use setTimeout to avoid side effects during render
      setTimeout(() => syncWithBackend({ dailyTimeSpent: newDailyTime } as any), 0);

      return { ...prev, dailyTimeSpent: newDailyTime };
    });
  }, [syncWithBackend]);

  const getAiRecommendations = useCallback(async (contentType?: string) => {
    if (!irisProfile) {
      console.warn("IRIS: Attempted recommend without profile");
      return [];
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      console.log(`IRIS: Calling AI at ${AI_API_URL}/recommendations`);
      const response = await fetch(`${AI_API_URL}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...irisProfile, content_type: contentType || null }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`IRIS API Error (${response.status}):`, errorText);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];

    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('IRIS: Request Timed Out (8s)');
      } else {
        console.error('IRIS: Failed to fetch recommendations:', error);
      }
      return [];
    }
  }, [irisProfile]);



  const sendParentMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setParentChatHistory(prev => [...prev, userMsg]);

    try {
      const response = await fetch(`${AI_API_URL}/parent-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: childProfile?.name || 'GUEST',
          message: text,
          profile: irisProfile || { name: childProfile?.name, age: childProfile?.age }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          role: 'ai',
          text: data.response,
          timestamp: new Date().toISOString()
        };
        setParentChatHistory(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error('Failed to send parent message:', error);
    }
  }, [childProfile, irisProfile]);



  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        childProfile,
        setChildProfile,
        assessmentResult,
        setAssessmentResult,
        isParentModeUnlocked,
        unlockParentMode,
        isReturningUser,
        setIsReturningUser,
        earnedBadges,
        unlockBadge,
        moduleProgress,
        incrementProgress,
        resetProgress,
        activities,
        logActivity,
        loginUser,
        registerUser,
        updateUser,
        addTime,
        irisProfile,
        setIrisProfile,
        reconstructIrisProfile,
        getAiRecommendations,
        parentChatHistory,

        sendParentMessage
      }}


    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}