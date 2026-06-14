import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Subject, 
  StudySession, 
  Task, 
  CalendarBlock, 
  ResourceVaultItem, 
  SpacedRepetitionItem, 
  Achievement 
} from '../types';

interface AtodemicContextType {
  currentUser: User | null;
  subjects: Subject[];
  sessions: StudySession[];
  tasks: Task[];
  calendarBlocks: CalendarBlock[];
  vaultItems: ResourceVaultItem[];
  spacedRepetition: SpacedRepetitionItem[];
  achievements: Achievement[];
  theme: 'dark' | 'light' | 'system';
  
  // Auth Operations
  signup: (fullName: string, username: string, email: string, passwordHash: string) => { success: boolean; message: string };
  login: (usernameOrEmail: string, passwordHash: string, rememberMe: boolean) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (fullName: string, username: string, bio: string, academicLevel: string, school: string) => { success: boolean; message: string };
  updateProfilePic: (avatarUrl: string) => void;
  setOnboarding: (examDate: string, targetScore: number, dailyHourGoal: number, initialSubjects: string[], chaptersCount: number) => void;
  
  // Subject Operations
  addSubject: (name: string, color: string, totalChapters: number, estimatedHours: number) => void;
  editSubject: (id: string, name: string, color: string, totalChapters: number, completedChapters: number, estimatedHours: number, completedHours: number) => void;
  deleteSubject: (id: string) => void;
  
  // Session Task Operations
  completeStudySession: (subjectId: string, topic: string, goal: string, durationMinutes: number) => void;
  
  // Task Operations
  addTask: (title: string, priority: 'low' | 'medium' | 'high', deadline: string, subjectId: string, type: 'daily' | 'weekly' | 'revision') => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Calendar Operations
  addCalendarBlock: (title: string, start: string, end: string, subjectId: string) => void;
  toggleCalendarBlock: (id: string) => void;
  deleteCalendarBlock: (id: string) => void;
  
  // Vault Operations
  addVaultItem: (title: string, type: ResourceVaultItem['type'], url: string) => void;
  updateVaultProgress: (id: string, progress: number) => void;
  deleteVaultItem: (id: string) => void;
  
  // Spaced Repetition Operations
  triggerChapterCompletionReview: (subjectId: string, chapterTitle: string) => void;
  completeRepetitionReview: (id: string) => void;
  
  // Theme Toggle
  setThemePreference: (theme: 'dark' | 'light' | 'system') => void;
  
  // Computed Dashboard Metrics
  getReadinessMetrics: () => {
    readinessScore: number;
    riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low' | 'No Data';
    recommendedHoursPerDay: number;
    daysRemaining: number;
    completionPercentage: number;
    estimatedCompletionDate: string;
  };
}

const AtodemicContext = createContext<AtodemicContextType | undefined>(undefined);

const DEFAULT_ACHIEVEMENTS = (userId: string): Achievement[] => [
  { id: 'ach1', title: 'First Session', description: 'Log your first completed study block.', unlockedAt: null, milestoneType: 'first_session', progressNeeded: 1 },
  { id: 'ach2', title: '7 Day Streak', description: 'Maintain a study streak for 7 consecutive days.', unlockedAt: null, milestoneType: 'streak_7', progressNeeded: 7 },
  { id: 'ach3', title: '30 Day Streak', description: 'Maintain a study streak for 30 consecutive days.', unlockedAt: null, milestoneType: 'streak_30', progressNeeded: 30 },
  { id: 'ach4', title: '100 Hours Studied', description: 'Complete 100 total study hours with Atodemic.', unlockedAt: null, milestoneType: 'hours_100', progressNeeded: 100 },
  { id: 'ach5', title: 'Subject Master', description: 'Successfully finish all chapters of any subject.', unlockedAt: null, milestoneType: 'subject_master', progressNeeded: 1 }
];

export function AtodemicProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('atodemic_users') || '[]');
    } catch {
      return [];
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem('atodemic_session');
  });

  const currentUser = users.find(u => u.id === currentUserId) || null;

  // Local storage lists for individual entities
  const [allSubjects, setAllSubjects] = useState<Subject[]>(() => {
    try { return JSON.parse(localStorage.getItem('atodemic_subjects') || '[]'); } catch { return []; }
  });
  const [allSessions, setAllSessions] = useState<StudySession[]>(() => {
    try { return JSON.parse(localStorage.getItem('atodemic_sessions') || '[]'); } catch { return []; }
  });
  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    try { return JSON.parse(localStorage.getItem('atodemic_tasks') || '[]'); } catch { return []; }
  });
  const [allCalendar, setAllCalendar] = useState<CalendarBlock[]>(() => {
    try { return JSON.parse(localStorage.getItem('atodemic_calendar') || '[]'); } catch { return []; }
  });
  const [allVault, setAllVault] = useState<ResourceVaultItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('atodemic_vault') || '[]'); } catch { return []; }
  });
  const [allSpaced, setAllSpaced] = useState<SpacedRepetitionItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('atodemic_spaced') || '[]'); } catch { return []; }
  });
  const [allAchievements, setAllAchievements] = useState<{ [userId: string]: Achievement[] }>(() => {
    try { return JSON.parse(localStorage.getItem('atodemic_achievements') || '{}'); } catch { return {}; }
  });

  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    return (localStorage.getItem('atodemic_theme') as 'dark' | 'light' | 'system') || 'dark';
  });

  // Sync users to local storage
  useEffect(() => {
    localStorage.setItem('atodemic_users', JSON.stringify(users));
  }, [users]);

  // Sync state helpers
  useEffect(() => {
    localStorage.setItem('atodemic_subjects', JSON.stringify(allSubjects));
  }, [allSubjects]);

  useEffect(() => {
    localStorage.setItem('atodemic_sessions', JSON.stringify(allSessions));
  }, [allSessions]);

  useEffect(() => {
    localStorage.setItem('atodemic_tasks', JSON.stringify(allTasks));
  }, [allTasks]);

  useEffect(() => {
    localStorage.setItem('atodemic_calendar', JSON.stringify(allCalendar));
  }, [allCalendar]);

  useEffect(() => {
    localStorage.setItem('atodemic_vault', JSON.stringify(allVault));
  }, [allVault]);

  useEffect(() => {
    localStorage.setItem('atodemic_spaced', JSON.stringify(allSpaced));
  }, [allSpaced]);

  useEffect(() => {
    localStorage.setItem('atodemic_achievements', JSON.stringify(allAchievements));
  }, [allAchievements]);

  // Theme Syncing
  useEffect(() => {
    localStorage.setItem('atodemic_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Filter lists for CURRENT user context
  const subjects = allSubjects.filter(s => s.userId === currentUserId);
  const sessions = allSessions.filter(s => s.userId === currentUserId);
  const tasks = allTasks.filter(t => t.userId === currentUserId);
  const calendarBlocks = allCalendar.filter(c => c.userId === currentUserId);
  const vaultItems = allVault.filter(v => v.userId === currentUserId);
  const spacedRepetition = allSpaced.filter(s => s.userId === currentUserId);
  const achievements = currentUserId ? (allAchievements[currentUserId] || DEFAULT_ACHIEVEMENTS(currentUserId)) : [];

  // Streak Verification on Mount / Login
  useEffect(() => {
    if (currentUserId && currentUser) {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = currentUser.lastActiveDate;
      
      let updatedStreak = currentUser.streak;
      if (lastActive) {
        const lastDateObj = new Date(lastActive);
        const todayObj = new Date(today);
        const diffTime = Math.abs(todayObj.getTime() - lastDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Continuous active day
          updatedStreak += 1;
        } else if (diffDays > 1) {
          // Streak broken
          updatedStreak = 1; // start over from 1
        }
      } else {
        updatedStreak = 1; // First day log
      }

      setUsers(prev => prev.map(u => u.id === currentUserId ? {
        ...u,
        streak: updatedStreak,
        lastActiveDate: today
      } : u));
    }
  }, [currentUserId]);

  // User Authentication Logic
  const signup = (fullName: string, username: string, email: string, passwordHash: string) => {
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return { success: false, message: 'Username or email already in use.' };
    }

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      fullName,
      username,
      email,
      passwordHash,
      academicLevel: '',
      school: '',
      examDate: '',
      targetScore: 0,
      dailyHourGoal: 0,
      xp: 0,
      streak: 0,
      lastActiveDate: '',
      joinDate: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);
    
    // Set default achievements
    setAllAchievements(prev => ({
      ...prev,
      [newUser.id]: DEFAULT_ACHIEVEMENTS(newUser.id)
    }));

    return { success: true, message: 'Account successfully created!' };
  };

  const login = (usernameOrEmail: string, passwordHash: string, rememberMe: boolean) => {
    const foundUser = users.find(u => 
      (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && 
      u.passwordHash === passwordHash
    );

    if (!foundUser) {
      return { success: false, message: 'Invalid username, email, or password.' };
    }

    setCurrentUserId(foundUser.id);
    if (rememberMe) {
      localStorage.setItem('atodemic_session', foundUser.id);
    } else {
      localStorage.setItem('atodemic_session', foundUser.id); // for simple container flow
    }

    return { success: true, message: 'Logged in successfully.' };
  };

  const logout = () => {
    setCurrentUserId(null);
    localStorage.removeItem('atodemic_session');
  };

  // Profile operations
  const updateProfile = (fullName: string, username: string, bio: string, academicLevel: string, school: string) => {
    if (!currentUserId) return { success: false, message: 'Unauthorized' };

    // Unique Username Validation
    const otherUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.id !== currentUserId);
    if (otherUser) {
      return { success: false, message: 'Username already taken.' };
    }

    setUsers(prev => prev.map(u => u.id === currentUserId ? {
      ...u,
      fullName,
      username,
      academicLevel: academicLevel as any,
      school
    } : u));

    return { success: true, message: 'Profile updated successfully.' };
  };

  const updateProfilePic = (avatarUrl: string) => {
    // optional helper
  };

  const setOnboarding = (examDate: string, targetScore: number, dailyHourGoal: number, initialSubjects: string[], chaptersCount: number) => {
    if (!currentUserId) return;

    // Update current user values
    setUsers(prev => prev.map(u => u.id === currentUserId ? {
      ...u,
      examDate,
      targetScore,
      dailyHourGoal
    } : u));

    // Seed academic subjects
    const seededSubjects: Subject[] = initialSubjects.map(subName => ({
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      userId: currentUserId,
      name: subName,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0'),
      totalChapters: chaptersCount,
      completedChapters: 0,
      estimatedHours: chaptersCount * 2, // default 2 hours per chapter
      completedHours: 0
    }));

    setAllSubjects(prev => [...prev, ...seededSubjects]);
  };

  // SUBJECT CONTROL
  const addSubject = (name: string, color: string, totalChapters: number, estimatedHours: number) => {
    if (!currentUserId) return;
    const newSub: Subject = {
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      userId: currentUserId,
      name,
      color: color || '#22C55E',
      totalChapters: totalChapters || 1,
      completedChapters: 0,
      estimatedHours: estimatedHours || 10,
      completedHours: 0
    };
    setAllSubjects(prev => [...prev, newSub]);
  };

  const editSubject = (id: string, name: string, color: string, totalChapters: number, completedChapters: number, estimatedHours: number, completedHours: number) => {
    setAllSubjects(prev => prev.map(s => s.id === id ? {
      ...s,
      name,
      color,
      totalChapters,
      completedChapters: Math.min(completedChapters, totalChapters),
      estimatedHours,
      completedHours
    } : s));

    // Audit subject completion achievements
    if (completedChapters >= totalChapters && completedChapters > 0) {
      triggerAchievementUnlock('subject_master');
    }
  };

  const deleteSubject = (id: string) => {
    setAllSubjects(prev => prev.filter(s => s.id !== id));
  };

  // STUDY TIMER INTEGRATION (The smart Core Log session)
  const completeStudySession = (subjectId: string, topic: string, goal: string, durationMinutes: number) => {
    if (!currentUserId) return;

    const matchedSubject = subjects.find(s => s.id === subjectId);
    const xpBonus = Math.floor(durationMinutes * 10); // 10 XP per study minute

    const newSession: StudySession = {
      id: 'sess_' + Math.random().toString(36).substring(2, 9),
      userId: currentUserId,
      subjectId,
      topic: topic || 'General Focus Block',
      goal: goal || 'None',
      durationMinutes,
      xpEarned: xpBonus,
      timestamp: new Date().toISOString()
    };

    setAllSessions(prev => [newSession, ...prev]);

    // Update Study hours on Subject
    if (matchedSubject) {
      const additionalHours = durationMinutes / 60;
      setAllSubjects(prev => prev.map(s => s.id === subjectId ? {
        ...s,
        completedHours: parseFloat((s.completedHours + additionalHours).toFixed(2))
      } : s));
    }

    // Award XP to user
    setUsers(prev => prev.map(u => u.id === currentUserId ? {
      ...u,
      xp: u.xp + xpBonus
    } : u));

    // Achievements evaluation
    triggerAchievementUnlock('first_session');

    // Aggregate hour check
    const totalMinutes = [...sessions, newSession].reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalHours = totalMinutes / 60;
    if (totalHours >= 100) {
      triggerAchievementUnlock('hours_100');
    }
  };

  // TASK CONTROLS
  const addTask = (title: string, priority: 'low' | 'medium' | 'high', deadline: string, subjectId: string, type: 'daily' | 'weekly' | 'revision') => {
    if (!currentUserId) return;
    const newTask: Task = {
      id: 'task_' + Math.random().toString(36).substring(2, 9),
      userId: currentUserId,
      subjectId,
      title,
      deadline,
      priority,
      isCompleted: false,
      type
    };
    setAllTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setAllTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setAllTasks(prev => prev.filter(t => t.id !== id));
  };

  // CALENDAR CONTROLS
  const addCalendarBlock = (title: string, start: string, end: string, subjectId: string) => {
    if (!currentUserId) return;
    const newBlock: CalendarBlock = {
      id: 'cal_' + Math.random().toString(36).substring(2, 9),
      userId: currentUserId,
      subjectId,
      title,
      start,
      end,
      completed: false
    };
    setAllCalendar(prev => [...prev, newBlock]);
  };

  const toggleCalendarBlock = (id: string) => {
    setAllCalendar(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const deleteCalendarBlock = (id: string) => {
    setAllCalendar(prev => prev.filter(c => c.id !== id));
  };

  // VAULT CONTROLS
  const addVaultItem = (title: string, type: ResourceVaultItem['type'], url: string) => {
    if (!currentUserId) return;
    const newItem: ResourceVaultItem = {
      id: 'v_' + Math.random().toString(36).substring(2, 9),
      userId: currentUserId,
      title,
      type,
      url: url || 'https://youtube.com',
      progress: 0,
      isCompleted: false
    };
    setAllVault(prev => [...prev, newItem]);
  };

  const updateVaultProgress = (id: string, progress: number) => {
    setAllVault(prev => prev.map(v => v.id === id ? {
      ...v,
      progress: Math.min(Math.max(progress, 0), 100),
      isCompleted: progress >= 100
    } : v));
  };

  const deleteVaultItem = (id: string) => {
    setAllVault(prev => prev.filter(v => v.id !== id));
  };

  // SPACED REPETITION LOGIC
  const triggerChapterCompletionReview = (subjectId: string, chapterTitle: string) => {
    if (!currentUserId) return;

    // Set first review 1 day out
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newItem: SpacedRepetitionItem = {
      id: 'sr_' + Math.random().toString(36).substring(2, 9),
      userId: currentUserId,
      subjectId,
      chapterTitle,
      stage: 1, // first stage (1 day)
      nextReviewDate: tomorrow.toISOString().split('T')[0],
      lastReviewDate: new Date().toISOString().split('T')[0]
    };

    setAllSpaced(prev => [...prev, newItem]);

    // Add also an automatic Spaced Repetition task!
    addTask(
      `Review Chapter: ${chapterTitle}`,
      'medium',
      tomorrow.toISOString().split('T')[0],
      subjectId,
      'revision'
    );
  };

  const completeRepetitionReview = (id: string) => {
    const intervals = [0, 1, 3, 7, 14, 30]; // stages (1, 3, 7, 14, 30 days)
    
    setAllSpaced(prev => prev.map(sr => {
      if (sr.id === id) {
        const nextStage = Math.min(sr.stage + 1, 5);
        const nextDays = intervals[nextStage];
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + nextDays);

        // Add next revision task
        addTask(
          `Revision Phase ${nextStage}: ${sr.chapterTitle}`,
          'medium',
          nextDate.toISOString().split('T')[0],
          sr.subjectId,
          'revision'
        );

        return {
          ...sr,
          stage: nextStage,
          lastReviewDate: new Date().toISOString().split('T')[0],
          nextReviewDate: nextDate.toISOString().split('T')[0]
        };
      }
      return sr;
    }));
  };

  // GAMIFICATION TRIGGERS
  const triggerAchievementUnlock = (type: Achievement['milestoneType']) => {
    if (!currentUserId) return;
    const userAchievements = allAchievements[currentUserId] || DEFAULT_ACHIEVEMENTS(currentUserId);
    const updated = userAchievements.map(ac => {
      if (ac.milestoneType === type && !ac.unlockedAt) {
        return {
          ...ac,
          unlockedAt: new Date().toISOString()
        };
      }
      return ac;
    });

    setAllAchievements(prev => ({
      ...prev,
      [currentUserId]: updated
    }));
  };

  const setThemePreference = (pref: 'dark' | 'light' | 'system') => {
    setTheme(pref);
  };

  // THE READINESS ALGORITHM (Absolute Core Feature)
  const getReadinessMetrics = () => {
    if (!currentUser || !currentUser.examDate) {
      return {
        readinessScore: 0,
        riskLevel: 'No Data' as const,
        recommendedHoursPerDay: 0,
        daysRemaining: 0,
        completionPercentage: 0,
        estimatedCompletionDate: 'N/A'
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const examDateStr = currentUser.examDate;
    
    const daysLeft = Math.ceil((new Date(examDateStr).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24));
    const safeDaysLeft = daysLeft > 0 ? daysLeft : 0.1; // prevent division by zero

    // Core factors: 
    // 1. Chapters completion rating (Weight: 45%)
    // 2. Completed Study Hours vs Estimate Goal (Weight: 30%)
    // 3. Spaced revision schedule attendance (Weight: 15%)
    // 4. Completed tasks rating (Weight: 10%)

    const totalChaptersTarget = subjects.reduce((sum, s) => sum + s.totalChapters, 0);
    const completedChaptersTotal = subjects.reduce((sum, s) => sum + s.completedChapters, 0);
    const totalEstHours = subjects.reduce((sum, s) => sum + s.estimatedHours, 0);
    const completedHoursTotal = subjects.reduce((sum, s) => sum + s.completedHours, 0);

    const chaptersRatio = totalChaptersTarget > 0 ? (completedChaptersTotal / totalChaptersTarget) : 0;
    const hoursRatio = totalEstHours > 0 ? Math.min(completedHoursTotal / totalEstHours, 1.2) : 0;

    const completedTasksCount = tasks.filter(t => t.isCompleted).length;
    const totalTasksCount = tasks.length;
    const tasksRatio = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) : 0;

    const spacedCount = spacedRepetition.length;
    const reviewRatio = spacedCount > 0 ? Math.min(spacedCount / 5, 1) : 0.5; // default buffer neutral

    // Calculated readiness value
    const baseValue = (chaptersRatio * 45) + (hoursRatio * 30) + (reviewRatio * 15) + (tasksRatio * 10);
    
    // Safety boundaries for scores
    let readinessScore = Math.min(Math.max(Math.round(baseValue), 5), 100);

    // Dynamic warning calibration: risk assessment
    // Risk is Critical if score is low and days remaining is low
    let riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low' | 'No Data' = 'Low';
    
    if (daysLeft < 10 && readinessScore < 40) {
      riskLevel = 'Critical';
    } else if (daysLeft < 30 && readinessScore < 60) {
      riskLevel = 'High';
    } else if (readinessScore < 75) {
      riskLevel = 'Moderate';
    } else {
      riskLevel = 'Low';
    }

    // Recommended daily workload
    const remainingHours = Math.max(totalEstHours - completedHoursTotal, 0);
    const recommendedDailyWorkload = parseFloat((remainingHours / safeDaysLeft).toFixed(2));

    // Completion percentage estimator
    const generalProgress = Math.min(Math.round(((chaptersRatio * 0.6) + (hoursRatio * 0.4)) * 100), 100);

    // Calculated finish date based on daily workout rate
    const currentDailyPace = sessions.length > 0
      ? (completedHoursTotal / Math.max(daysLeft, 1)) 
      : 0;

    let estCompletion = 'Calculating pace...';
    if (currentDailyPace > 0 && remainingHours > 0) {
      const daysToFinish = Math.ceil(remainingHours / currentDailyPace);
      const estFinishDate = new Date();
      estFinishDate.setDate(estFinishDate.getDate() + daysToFinish);
      estCompletion = estFinishDate.toISOString().split('T')[0];
    } else if (remainingHours === 0) {
      estCompletion = 'Finished';
    }

    // If subjects are totally empty, default metrics nicely:
    if (subjects.length === 0) {
      return {
        readinessScore: 0,
        riskLevel: 'No Data',
        recommendedHoursPerDay: 0,
        daysRemaining: Math.max(daysLeft, 0),
        completionPercentage: 0,
        estimatedCompletionDate: 'No Subjects Configured'
      };
    }

    return {
      readinessScore,
      riskLevel,
      recommendedHoursPerDay: recommendedDailyWorkload,
      daysRemaining: Math.max(daysLeft, 0),
      completionPercentage: generalProgress,
      estimatedCompletionDate: estCompletion
    };
  };

  return (
    <AtodemicContext.Provider value={{
      currentUser,
      subjects,
      sessions,
      tasks,
      calendarBlocks,
      vaultItems,
      spacedRepetition,
      achievements,
      theme,

      signup,
      login,
      logout,
      updateProfile,
      updateProfilePic,
      setOnboarding,

      addSubject,
      editSubject,
      deleteSubject,

      completeStudySession,

      addTask,
      toggleTask,
      deleteTask,

      addCalendarBlock,
      toggleCalendarBlock,
      deleteCalendarBlock,

      addVaultItem,
      updateVaultProgress,
      deleteVaultItem,

      triggerChapterCompletionReview,
      completeRepetitionReview,

      setThemePreference,
      getReadinessMetrics
    }}>
      {children}
    </AtodemicContext.Provider>
  );
}

export function useAtodemicStore() {
  const context = useContext(AtodemicContext);
  if (!context) {
    throw new Error('useAtodemicStore must be used within an AtodemicProvider');
  }
  return context;
}
