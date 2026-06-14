import React from 'react';
import { useAtodemicStore } from '../context/AppContext';
import { Award, CheckCircle2, Calendar, RefreshCw, Layers, Sparkles } from 'lucide-react';

export default function SpacedRepetition() {
  const store = useAtodemicStore();
  const { spacedRepetition, subjects } = store;

  const getStageTitle = (stage: number) => {
    switch (stage) {
      case 1: return 'Stage 1: Active Recall (+1d)';
      case 2: return 'Stage 2: Short Retention (+3d)';
      case 3: return 'Stage 3: Consolidating (+7d)';
      case 4: return 'Stage 4: Permanent Recall (+14d)';
      case 5: return 'Stage 5: Master Mastery (+30d)';
      default: return 'Finished';
    }
  };

  const getStageColorClass = (stage: number) => {
    switch (stage) {
      case 1: return 'bg-zinc-100/[0.02] text-zinc-350 border-zinc-700/30';
      case 2: return 'bg-zinc-105 bg-zinc-100/[0.02] text-zinc-300 border-zinc-700/30';
      case 3: return 'bg-zinc-100/[0.02] text-zinc-300 border-zinc-700/30';
      case 4: return 'bg-zinc-100/[0.02] text-zinc-200 border-zinc-700/35';
      case 5: return 'bg-zinc-100/[0.04] text-zinc-100 border-zinc-650';
      default: return 'bg-zinc-900/40 text-zinc-400 border-zinc-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-zinc-900/10 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">Neural Retrieval Schedule</span>
          <h2 className="text-base font-bold text-zinc-100 mt-1 font-sans">Spaced Repetition Scheduler</h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-[10px] font-mono font-bold uppercase tracking-wider">
          {spacedRepetition.length} chapter logs tracked
        </span>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed max-w-xl font-sans">
        Memory decay curves require structured spacing intervals. When you mark a chapter finished inside resources or subjects, Atodemic injects them here to schedule systematic reviews.
      </p>

      {/* Main Grid table */}
      {spacedRepetition.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-zinc-800/80 rounded-2xl p-6">
          <Layers className="h-10 w-10 text-zinc-650 mx-auto mb-4" />
          <h4 className="font-bold text-zinc-200 text-sm font-sans">Scheduler is static</h4>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed max-w-sm mx-auto">
            You don't have chapters marked for retention. Tick "Mark Chapter Finished" on subject blocks to start mapping decay pathways.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-zinc-300">
              <thead className="bg-[#09090b]/80 text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono border-b border-zinc-800">
                <tr>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Chapter Title</th>
                  <th className="p-4">Interval Stage</th>
                  <th className="p-4">Last Reviewed</th>
                  <th className="p-4">Next Review</th>
                  <th className="p-4 text-right">Action Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 font-sans">
                {spacedRepetition.map(item => {
                  const sub = subjects.find(s => s.id === item.subjectId);
                  
                  return (
                    <tr key={item.id} className="hover:bg-zinc-900/10 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sub?.color || '#fafafa' }} />
                          <span className="font-bold text-zinc-150 text-zinc-100">{sub?.name || 'Subject'}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-zinc-200">{item.chapterTitle}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStageColorClass(item.stage)}`}>
                          {getStageTitle(item.stage)}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-zinc-500">{item.lastReviewDate}</td>
                      <td className="p-4 font-mono text-[11px] text-zinc-200 font-semibold">{item.nextReviewDate}</td>
                      <td className="p-4 text-right">
                        {item.stage < 5 ? (
                          <button
                            id={`btn_trigger_sr_review_${item.id}`}
                            onClick={() => store.completeRepetitionReview(item.id)}
                            className="px-3 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-[#09090b] font-semibold transition-all text-[11px] cursor-pointer"
                          >
                            Mark Completed Stage
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-1 text-zinc-400 text-[10px] font-bold">
                            <CheckCircle2 className="h-4 w-4 text-zinc-350" /> Full Mastery
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
