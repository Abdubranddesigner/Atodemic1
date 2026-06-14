export interface User {
  id: string; // unique ID
  fullName: string;
  username: string;
  email: string;
  passwordHash: string; // saved securely in state
  academicLevel: 'High School' | 'University' | 'Graduate' | 'Other' | '';
  school: string;
  examDate: string; // ISO String (YYYY-MM-DD)
  targetScore: number; // e.g., 90
  dailyHourGoal: number; // e.g., 2.5
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  joinDate: string; // YYYY-MM-DD
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  color: string; // hex
  totalChapters: number;
  completedChapters: number;
  estimatedHours: number;
  completedHours: number;
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  topic: string;
  goal: string;
  durationMinutes: number;
  xpEarned: number;
  timestamp: string; // ISO datetime
}

export interface Task {
  id: string;
  userId: string;
  subjectId: string; // can be empty or refer to subject
  title: string;
  deadline: string; // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  type: 'daily' | 'weekly' | 'revision';
}

export interface CalendarBlock {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  completed: boolean;
}

export interface ResourceVaultItem {
  id: string;
  userId: string;
  title: string;
  type: 'pdf' | 'notes' | 'youtube' | 'video' | 'website' | 'image';
  url: string;
  progress: number; // 0 - 100
  isCompleted: boolean;
}

export interface SpacedRepetitionItem {
  id: string;
  userId: string;
  subjectId: string;
  chapterTitle: string;
  stage: number; // 0 to 5 (intervals: 1, 3, 7, 14, 30 days)
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewDate: string; // YYYY-MM-DD
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string | null; // Null if locked, timestamp string if unlocked
  milestoneType: 'first_session' | 'streak_7' | 'streak_30' | 'hours_100' | 'subject_master';
  progressNeeded: number;
}
