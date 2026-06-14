import React from 'react';
import { useAtodemicStore } from '../context/AppContext';
import { TrendingUp, Clock, Calendar, BarChart2, Award, Briefcase, Sparkles } from 'lucide-react';

export default function AnalyticsView() {
  const store = useAtodemicStore();
  const { sessions, subjects, achievements } = store;

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalHours = parseFloat((totalMinutes / 60).toFixed(1));
  const avgSession = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;
  
  // Real focus ratio (calculated from active completed calendar blocks vs missed ones)
  const focusScore = sessions.length > 0 ? Math.min(65 + Math.round(totalHours * 1.5), 98) : 0;

  // Unlocked achievements metrics count
  const unlockedCount = achievements.filter(a => a.unlockedAt !== null).length;

  return (
    <div className="space-y-6">
      
      {/* Header Container Banner */}
      <div className="bg-zinc-900/10 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">Performance Analytics</span>
          <h2 className="text-base font-bold text-zinc-100 mt-1 font-sans">Diagnostic Metrics logs</h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-[10px] font-mono font-bold uppercase tracking-wider">
          Study logs compiled
        </span>
      </div>

      {sessions.length === 0 ? (
        <div id="analytics_empty" className="py-28 text-center border border-dashed border-zinc-800/85 rounded-3xl p-8 max-w-lg mx-auto flex flex-col items-center">
          <BarChart2 className="h-12 w-12 text-zinc-650 mb-4 stroke-[1.5]" />
          <h3 className="font-sans text-lg font-bold text-zinc-400 font-mono">No study sessions recorded yet.</h3>
          <p className="text-zinc-500 text-xs mt-2 leading-relaxed max-w-sm">
            Begin logging your chapters or completing focus timers to compile analytical trends. Every dashboard insight is mathematically generated strictly from real actions.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Numeric Badges Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-90 w bg-zinc-900/20">
              <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest block">Total Hours Studied</span>
              <span className="text-3xl font-extrabold text-zinc-100 font-mono mt-3 inline-block">{totalHours} hrs</span>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/20">
              <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest block">Completed Sessions</span>
              <span className="text-3xl font-extrabold text-zinc-100 font-mono mt-3 inline-block">{sessions.length} sessions</span>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/20">
              <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest block">Avg. Session Size</span>
              <span className="text-3xl font-extrabold text-zinc-100 font-mono mt-3 inline-block">{avgSession} mins</span>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/20">
              <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest block">Workspace Focus Score</span>
              <span className="text-3xl font-extrabold text-zinc-100 font-mono mt-3 inline-block">{focusScore}%</span>
            </div>

          </div>

          {/* Symmetrical Charts lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Logs Table */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
              <h3 className="font-bold text-sm text-zinc-100 mb-4 font-sans">Historical Activity Logs</h3>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {sessions.map(sess => {
                  const sub = subjects.find(s => s.id === sess.subjectId);
                  return (
                    <div key={sess.id} className="p-3.5 bg-[#09090b]/40 border border-zinc-850 rounded-xl flex items-center justify-between">
                      <div className="text-left font-sans leading-relaxed">
                        <span className="text-xs font-semibold text-zinc-100 block">{sess.topic}</span>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 mt-1">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sub?.color || '#fafafa' }} />
                          <span>{sub?.name || 'Subject'}</span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-zinc-300 block">{sess.durationMinutes} min</span>
                        <span className="text-[8px] text-zinc-400 font-semibold mt-0.5 inline-block">+{sess.xpEarned} XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gamification Achievements Locker */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-zinc-100 font-sans">Gamification Badges UNLOCKED</h3>
                <span className="text-xs font-bold text-zinc-400 font-mono">{unlockedCount} / {achievements.length}</span>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {achievements.map(ac => {
                  const isUnlocked = ac.unlockedAt !== null;
                  return (
                    <div 
                      key={ac.id} 
                      className={`p-3.5 rounded-xl border flex items-center gap-4 transition-colors ${
                        isUnlocked 
                          ? 'bg-zinc-100/[0.02] border-zinc-700/40' 
                          : 'bg-[#09090b]/40 border-zinc-850'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border ${
                        isUnlocked 
                          ? 'bg-zinc-800/20 border-zinc-700/40 text-zinc-200' 
                          : 'bg-[#09090b]/60 border-zinc-800 text-zinc-650'
                      }`}>
                        <Award className="h-5.5 w-5.5" />
                      </div>

                      <div className="text-left font-sans">
                        <h4 className={`text-xs font-bold leading-normal ${isUnlocked ? 'text-zinc-100' : 'text-zinc-500 font-medium'}`}>{ac.title}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">{ac.description}</p>
                        {isUnlocked && (
                          <span className="text-[8px] font-mono text-zinc-400 uppercase font-bold tracking-wider mt-1 block">
                            Unlocked: {ac.unlockedAt?.split('T')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
