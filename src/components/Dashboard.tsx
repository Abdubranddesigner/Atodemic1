import React from 'react';
import { useAtodemicStore } from '../context/AppContext';
import { 
  Award, 
  Calendar, 
  Clock, 
  Flame, 
  Layers, 
  CheckCircle2, 
  ShieldAlert, 
  BookOpen, 
  TrendingUp, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  onSetActiveView: (view: string) => void;
}

export default function Dashboard({ onSetActiveView }: DashboardProps) {
  const store = useAtodemicStore();
  const { currentUser, subjects, sessions, tasks, achievements } = store;
  
  const metrics = store.getReadinessMetrics();

  // Streak/XP definitions
  const streak = currentUser?.streak || 0;
  const xp = currentUser?.xp || 0;

  // Grade/Scholar rank determination
  const getScholarRank = (xpPoints: number) => {
    if (xpPoints <= 500) return 'Beginner';
    if (xpPoints <= 1500) return 'Scholar I';
    if (xpPoints <= 3000) return 'Scholar II';
    if (xpPoints <= 6000) return 'Scholar III';
    return 'Master Scholar';
  };

  const scholarRank = getScholarRank(xp);

  // SVG parameters for circular meter
  const strokeRadius = 60;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeOffset = strokeCircumference - (metrics.readinessScore / 100) * strokeCircumference;

  // Next upcoming tasks (Uncompleted)
  const incompleteTasks = tasks.filter(t => !t.isCompleted).slice(0, 4);

  // Subject completion progress overview
  const totalSyllabusChapters = subjects.reduce((acc, curr) => acc + curr.totalChapters, 0);
  const totalCompletedChapters = subjects.reduce((acc, curr) => acc + curr.completedChapters, 0);
  const chapterPercentage = totalSyllabusChapters > 0 ? Math.round((totalCompletedChapters / totalSyllabusChapters) * 100) : 0;

  return (
    <div id="dashboard_view" className="space-y-6">
      
      {/* Top Banner Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm relative overflow-hidden">
        {/* Ambient background light */}
        <div className="absolute top-0 right-0 h-48 w-48 bg-zinc-100/[0.015] rounded-full blur-[80px]" />
        
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">Academic Diagnostic Terminal</span>
          <h2 className="text-xl font-bold font-sans text-zinc-100 mt-1">Welcome back, {currentUser?.fullName}!</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-md">
            Syllabus completion pace is mapped against your deadline of <span className="text-zinc-200 font-semibold">{currentUser?.examDate || 'Not set'}</span>.
          </p>
        </div>

        {/* Level & Streak Capsule */}
        <div className="flex gap-4 items-center shrink-0">
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg flex items-center gap-3">
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Streak</span>
            <span className="font-mono font-bold text-zinc-100">{streak} Days</span>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg flex items-center gap-3">
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">XP</span>
            <span className="font-mono font-bold text-zinc-100">{xp}</span>
          </div>
        </div>
      </div>

      {/* Primary Row: Readiness score Gauge & Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Circular Gauge */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-sm text-zinc-100">Dynamic Readiness</h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-zinc-700 bg-zinc-900/60 text-zinc-300">
              {metrics.riskLevel} Risk
            </span>
          </div>

          <div className="flex items-center justify-center my-6 relative">
            {/* SVG circle */}
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Gray Base Background Ring */}
              <circle
                cx="72"
                cy="72"
                r={strokeRadius}
                fill="transparent"
                stroke="#1c1917"
                strokeWidth="8"
              />
              {/* Dynamic Overlay Ring */}
              {subjects.length > 0 && (
                <circle
                  cx="72"
                  cy="72"
                  r={strokeRadius}
                  fill="transparent"
                  stroke="#f4f4f5"
                  strokeWidth="8"
                  strokeDasharray={strokeCircumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              )}
            </svg>
            <div className="absolute text-center">
              <span className="block text-3xl font-extrabold text-zinc-100 font-mono">{metrics.readinessScore}%</span>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-medium">Ready index</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-400 flex items-center gap-2 leading-relaxed">
            <TrendingUp className="h-4 w-4 text-zinc-100 shrink-0" />
            <span>Recommended workload is <strong className="text-zinc-100 font-semibold font-mono">{metrics.recommendedHoursPerDay} hrs/day</strong>.</span>
          </div>
        </div>

        {/* Countdown details */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase font-mono">Exam Countdown</span>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-5xl font-extrabold text-[#f4f4f5] font-mono tracking-tighter">{metrics.daysRemaining}</span>
              <span className="text-zinc-400 text-sm font-semibold">days remaining</span>
            </div>
            
            <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
              Target goal score set to <strong className="text-zinc-100 font-bold font-mono">{currentUser?.targetScore || 85}%</strong>. You studied <strong className="text-zinc-200 font-semibold font-mono">{sessions.reduce((a,c) => a+c.durationMinutes,0)} mins</strong> across {subjects.length} subjects.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-xs">
            <span className="text-zinc-500 font-medium">Est. Completion:</span>
            <span className="text-zinc-200 font-semibold font-mono">{metrics.estimatedCompletionDate}</span>
          </div>
        </div>

        {/* Daily workload info */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase font-mono font-medium">Today's Commitment</span>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#f4f4f5] font-mono tracking-tight">{currentUser?.dailyHourGoal || 0} hrs</span>
              <span className="text-zinc-500 text-xs">goal per day</span>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Chapters Completed:</span>
                  <span className="text-zinc-200 font-semibold font-mono">{totalCompletedChapters} / {totalSyllabusChapters}</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-zinc-100 transition-all rounded-full" 
                    style={{ width: `${chapterPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            id="btn_tab_timer"
            onClick={() => onSetActiveView('timer')}
            className="w-full mt-4 py-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Launch Focus Workroom <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* Bottom Section: Active Syllabus Summary & Tasks Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Subjects list tracker */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm text-zinc-100">Syllabus Breakdown</h3>
            <button
              id="btn_tab_sub_nav"
              onClick={() => onSetActiveView('subjects')}
              className="text-[11px] text-zinc-400 hover:text-white transition-colors font-semibold cursor-pointer"
            >
              Configure List
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-medium text-xs border border-zinc-800 border-dashed rounded-xl">
              No subjects mapped yet. Open Subject Manager to map your syllabus.
            </div>
          ) : (
            <div className="space-y-4">
              {subjects.map(sub => {
                const subPct = sub.totalChapters > 0 ? Math.round((sub.completedChapters / sub.totalChapters) * 100) : 0;
                return (
                  <div key={sub.id} className="p-3.5 rounded-xl border border-zinc-800/60 bg-zinc-950/40">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: sub.color }} />
                        <span className="font-bold text-xs text-zinc-100 leading-none">{sub.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{sub.completedChapters} / {sub.totalChapters} Ch.</span>
                    </div>

                    <div className="h-1 bg-zinc-900 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ backgroundColor: sub.color, width: `${subPct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>Completed studied: {sub.completedHours} hrs</span>
                      <span className="font-bold text-zinc-300">{subPct}% Finished</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Immediate Checklist tasks */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm text-zinc-100">Daily Tasks Checklist</h3>
            <button
              id="btn_tab_tasks_nav"
              onClick={() => onSetActiveView('calendar')}
              className="text-[11px] text-zinc-400 hover:text-white transition-colors font-semibold cursor-pointer"
            >
              Calendar & Tasks Tracker
            </button>
          </div>

          {incompleteTasks.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-medium text-xs border border-zinc-800 border-dashed rounded-xl flex flex-col items-center justify-center gap-2">
              <span>All daily items completed! Nice work.</span>
              <button
                type="button"
                onClick={() => onSetActiveView('calendar')}
                className="text-zinc-200 font-semibold hover:text-white mt-1 cursor-pointer"
              >
                + Add dynamic task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {incompleteTasks.map(task => {
                const matchedSub = subjects.find(s => s.id === task.subjectId);
                return (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/30 hover:border-zinc-750 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        id={`btn_check_task_${task.id}`}
                        onClick={() => store.toggleTask(task.id)}
                        className="h-4.5 w-4.5 rounded border border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-zinc-100 transition-colors bg-zinc-900 cursor-pointer"
                      >
                        {task.isCompleted && <CheckCircle2 className="h-3.5 w-3.5 stroke-[3] text-zinc-100 fill-zinc-100 placeholder:text-zinc-100" />}
                      </button>
                      <div className="text-left">
                        <span className={`text-xs font-medium text-zinc-100 ${task.isCompleted ? 'line-through text-zinc-500' : ''}`}>
                          {task.title}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-1">
                          {matchedSub && (
                            <span className="text-[9px] font-semibold text-zinc-400 px-1.5 py-0.5 rounded-md border border-zinc-800 bg-zinc-900/50">
                              {matchedSub.name}
                            </span>
                          )}
                          <span className="text-[8px] font-mono text-zinc-500 uppercase">
                            Due: {task.deadline}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                      task.priority === 'high' ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' :
                      task.priority === 'medium' ? 'bg-zinc-900 text-zinc-400' :
                      'bg-zinc-950 text-zinc-500'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
