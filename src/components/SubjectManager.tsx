import React, { useState } from 'react';
import { useAtodemicStore } from '../context/AppContext';
import { BookOpen, PlusCircle, Trash2, Edit3, Save, XCircle, Sparkles, CheckSquare } from 'lucide-react';

export default function SubjectManager() {
  const store = useAtodemicStore();
  const { subjects } = store;

  // New Form states
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#fafafa'); // default premium zinc-ish / light gray
  const [totalChapters, setTotalChapters] = useState(15);
  const [estimatedHours, setEstimatedHours] = useState(30);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#fafafa');
  const [editTotalChapters, setEditTotalChapters] = useState(15);
  const [editCompletedChapters, setEditCompletedChapters] = useState(0);
  const [editEstimatedHours, setEditEstimatedHours] = useState(30);
  const [editCompletedHours, setEditCompletedHours] = useState(0);
  const [chapterReviewName, setChapterReviewName] = useState('');

  // Symmetrical muted design palette
  const COLOR_PALETTE = [
    '#fafafa', // Zinc 50
    '#a1a1aa', // Zinc 400
    '#71717a', // Zinc 500
    '#e4e4e7', // Zinc 200
    '#d4d4d8', // Zinc 300
    '#cbd5e1', // Slate 300
    '#94a3b8', // Slate 400
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    store.addSubject(
      name,
      color,
      totalChapters || 1,
      estimatedHours || 10
    );

    // reset fields
    setName('');
    setColor('#fafafa');
    setTotalChapters(15);
    setEstimatedHours(30);
    setIsAdding(false);
  };

  const startEdit = (sub: any) => {
    setEditingId(sub.id);
    setEditName(sub.name);
    setEditColor(sub.color);
    setEditTotalChapters(sub.totalChapters);
    setEditCompletedChapters(sub.completedChapters);
    setEditEstimatedHours(sub.estimatedHours);
    setEditCompletedHours(sub.completedHours);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editName.trim()) return;

    store.editSubject(
      editingId,
      editName,
      editColor,
      editTotalChapters,
      editCompletedChapters,
      editEstimatedHours,
      editCompletedHours
    );

    setEditingId(null);
  };

  const handleChapterCompletionTrigger = (subjectId: string, currentChapters: number, maxChapters: number) => {
    if (currentChapters >= maxChapters) return;
    
    // Automatically increment completed chapters on Subject by 1
    const targetSubject = subjects.find(s => s.id === subjectId);
    if (targetSubject) {
      const updatedCount = currentChapters + 1;
      const title = chapterReviewName.trim() || `Chapter ${updatedCount}`;
      
      store.editSubject(
        subjectId,
        targetSubject.name,
        targetSubject.color,
        targetSubject.totalChapters,
        updatedCount,
        targetSubject.estimatedHours,
        targetSubject.completedHours
      );

      // Trigger automatic Spaced Repetition log schedule
      store.triggerChapterCompletionReview(subjectId, title);

      // Clean input
      setChapterReviewName('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center bg-zinc-900/10 p-4 rounded-xl border border-zinc-800">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">Academic Syllabus Control</span>
          <h2 className="text-base font-bold text-zinc-100 mt-1 font-sans">Subjects Datastore</h2>
        </div>
        {!isAdding && (
          <button
            id="btn_show_subject_form"
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_1px_4px_rgba(255,255,255,0.05)]"
          >
            <PlusCircle className="h-4 w-4" /> Map New Subject
          </button>
        )}
      </div>

      {/* Add subject form overlay */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-zinc-805 border-zinc-800 bg-zinc-900/40 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-zinc-150 text-zinc-100 flex items-center gap-2 font-sans"><BookOpen className="h-4 w-4 text-zinc-400" /> Define Subject Specifications</h3>
            <button
              id="btn_cancel_add_sub"
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-zinc-400 hover:text-white cursor-pointer text-xs font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Subject Name</label>
              <input
                id="add_sub_name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Artificial Intelligence, Organic Chemistry"
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-[#09090b]/60 text-zinc-100 placeholder:text-zinc-650 text-xs focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Visual Tag Color</label>
              <div className="flex gap-2.5 pt-1.5">
                {COLOR_PALETTE.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-6 w-6 rounded-full border transition-all cursor-pointer ${color === c ? 'border-white scale-110 ring-2 ring-zinc-500/35' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Total Chapters in Syllabus</label>
              <input
                id="add_sub_chapters"
                type="number"
                min="1"
                required
                value={totalChapters}
                onChange={(e) => setTotalChapters(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-[#09090b]/60 text-zinc-100 text-xs focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Estimated Required Hours</label>
              <input
                id="add_sub_hours"
                type="number"
                min="1"
                required
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-[#09090b]/60 text-zinc-100 text-xs focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>
          </div>

          <button
            id="btn_submit_sub"
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer block ml-auto"
          >
            Deploy Subject Parameter
          </button>
        </form>
      )}

      {/* Main Subjects Data Grid */}
      {subjects.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-zinc-800/80 rounded-2xl p-6">
          <BookOpen className="h-10 w-10 text-zinc-650 mx-auto mb-4" />
          <h4 className="font-bold text-zinc-200 text-sm font-sans">Your study node lists are clear</h4>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed max-w-sm mx-auto">
            You must register your scheduled subjects to operate exam readiness, calendars, timers and revision charts.
          </p>
          <button
            id="btn_empty_add_sub"
            onClick={() => setIsAdding(true)}
            className="mt-6 px-4 py-2 bg-[#09090b] border border-zinc-800 hover:bg-zinc-900 text-zinc-100 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Map Your First Syllabus
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map(sub => {
            const isEditing = editingId === sub.id;
            const subPct = sub.totalChapters > 0 ? Math.round((sub.completedChapters / sub.totalChapters) * 100) : 0;
            const hourPct = sub.estimatedHours > 0 ? Math.min(Math.round((sub.completedHours / sub.estimatedHours) * 100), 100) : 0;

            return (
              <div 
                key={sub.id} 
                className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 flex flex-col justify-between hover:border-zinc-750 transition-colors"
              >
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-4 w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono tracking-wider font-bold text-zinc-500 uppercase">Updating Configuration</span>
                      <button 
                        type="button" 
                        onClick={() => setEditingId(null)}
                        className="text-zinc-400 hover:text-white text-xs cursor-pointer font-semibold"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-mono">Title</label>
                        <input
                          id={`edit_name_${sub.id}`}
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#09090b]/60 border border-zinc-850 rounded text-xs text-white focus:outline-none focus:border-zinc-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-mono">Completed Chapters</label>
                          <input
                            id={`edit_completed_ch_${sub.id}`}
                            type="number"
                            min="0"
                            max={editTotalChapters}
                            value={editCompletedChapters}
                            onChange={(e) => setEditCompletedChapters(parseInt(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 bg-[#09090b]/60 border border-zinc-850 rounded text-xs text-white focus:outline-none focus:border-zinc-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-mono">Total Chapters</label>
                          <input
                            id={`edit_total_ch_${sub.id}`}
                            type="number"
                            min="1"
                            value={editTotalChapters}
                            onChange={(e) => setEditTotalChapters(parseInt(e.target.value) || 1)}
                            className="w-full px-2.5 py-1.5 bg-[#09090b]/60 border border-zinc-850 rounded text-xs text-white focus:outline-none focus:border-zinc-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-mono">Completed Hours</label>
                          <input
                            id={`edit_comp_hr_${sub.id}`}
                            type="number"
                            step="0.1"
                            min="0"
                            value={editCompletedHours}
                            onChange={(e) => setEditCompletedHours(parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 bg-[#09090b]/60 border border-zinc-850 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-mono">Estimated Hours</label>
                          <input
                            id={`edit_est_hr_${sub.id}`}
                            type="number"
                            min="1"
                            value={editEstimatedHours}
                            onChange={(e) => setEditEstimatedHours(parseInt(e.target.value) || 1)}
                            className="w-full px-2.5 py-1.5 bg-[#09090b]/60 border border-zinc-850 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      id={`btn_save_edit_${sub.id}`}
                      type="submit"
                      className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-[#09090b] font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </form>
                ) : (
                  <>
                    {/* Visual Card Row */}
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: sub.color || '#fafafa' }} />
                          <h4 className="font-bold text-sm text-zinc-150 text-zinc-100 leading-none font-sans">{sub.name}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            id={`btn_edit_sub_${sub.id}`}
                            onClick={() => startEdit(sub)}
                            className="text-zinc-500 hover:text-white p-1 cursor-pointer transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            id={`btn_delete_sub_${sub.id}`}
                            onClick={() => store.deleteSubject(sub.id)}
                            className="text-zinc-650 hover:text-white p-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Math metrics details progress */}
                      <div className="mt-6 space-y-4">
                        {/* Chapters Bar */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-1.5">
                            <span className="text-zinc-400 font-medium font-sans">Syllabus Chapters Completed</span>
                            <span className="text-zinc-200 font-semibold font-mono">{sub.completedChapters} / {sub.totalChapters} Ch.</span>
                          </div>
                          <div className="h-1 bg-[#09090b]/80 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all" 
                              style={{ backgroundColor: sub.color || '#fafafa', width: `${subPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Hours Bar */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-1.5">
                            <span className="text-zinc-400 font-medium font-sans">Logged Studying Hours</span>
                            <span className="text-zinc-200 font-semibold font-mono">{sub.completedHours} / {sub.estimatedHours} hrs</span>
                          </div>
                          <div className="h-1 bg-[#09090b]/80 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all bg-zinc-100/80" 
                              style={{ width: `${hourPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive recall tracker block */}
                    {sub.completedChapters < sub.totalChapters && (
                      <div className="mt-6 pt-4 border-t border-zinc-800/60">
                        <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase font-mono block mb-2.5">
                          Trigger Chapter Completion Review
                        </span>
                        
                        <div className="flex gap-2">
                          <input
                            id={`inp_chapter_name_${sub.id}`}
                            type="text"
                            value={editingId === null ? chapterReviewName : ''}
                            onChange={(e) => setChapterReviewName(e.target.value)}
                            placeholder={`e.g. Chapter ${sub.completedChapters + 1} Title`}
                            className="flex-1 px-2.5 py-1.5 rounded border border-zinc-805 border-zinc-800 bg-[#09090b]/40 text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-[#09090b]"
                          />
                          <button
                            id={`btn_comp_chapter_${sub.id}`}
                            onClick={() => handleChapterCompletionTrigger(sub.id, sub.completedChapters, sub.totalChapters)}
                            className="px-3 py-1.5 rounded bg-zinc-100/[0.03] border border-zinc-700/40 text-zinc-150 font-bold hover:bg-zinc-100/[0.08] text-[11px] cursor-pointer transition-colors"
                          >
                            Mark Finished
                          </button>
                        </div>
                        <span className="text-[9px] text-zinc-500 mt-1 block font-sans">
                          This automatically schedules critical Spaced Repetition reviews at 1, 3, 7, 14, and 30 days.
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
