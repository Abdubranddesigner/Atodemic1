import React, { useState } from 'react';
import { useAtodemicStore } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  CheckCircle, 
  Trash2, 
  Briefcase, 
  CheckSquare, 
  X,
  PlusCircle
} from 'lucide-react';

export default function CalendarSystem() {
  const store = useAtodemicStore();
  const { calendarBlocks, subjects, tasks } = store;

  const [activeView, setActiveView] = useState<'month' | 'week' | 'day'>('month');

  // New Block state
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [blockTitle, setBlockTitle] = useState('');
  const [blockSubjectId, setBlockSubjectId] = useState('');
  const [blockDate, setBlockDate] = useState('');
  const [blockStartTime, setBlockStartTime] = useState('09:00');
  const [blockEndTime, setBlockEndTime] = useState('10:30');

  // Task creation state
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskSubjectId, setTaskSubjectId] = useState('');
  const [taskType, setTaskType] = useState<'daily' | 'weekly' | 'revision'>('daily');

  // Month date computation limits: June 14, 2026 (local context date)
  // Simple CSS implementation of Calendar days
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1); // 30 Mock grid days representing June 2026

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockTitle.trim() || !blockSubjectId || !blockDate) return;

    const startISO = `${blockDate}T${blockStartTime}:00`;
    const endISO = `${blockDate}T${blockEndTime}:00`;

    store.addCalendarBlock(blockTitle, startISO, endISO, blockSubjectId);

    // reset Form
    setBlockTitle('');
    setBlockSubjectId('');
    setBlockDate('');
    setBlockStartTime('09:00');
    setBlockEndTime('10:30');
    setShowAddBlock(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDeadline) return;

    store.addTask(
      taskTitle,
      taskPriority,
      taskDeadline,
      taskSubjectId,
      taskType
    );

    setTaskTitle('');
    setTaskPriority('medium');
    setTaskDeadline('');
    setTaskSubjectId('');
    setTaskType('daily');
    setShowAddTask(false);
  };

  return (
    <div className="space-y-6">
      
      {/* View Select header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/10">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">Academic Timetable Hub</span>
          <h2 className="text-base font-bold text-zinc-100 mt-1 font-sans">Calendar & Task Management</h2>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggles */}
          <div className="inline-flex p-1 bg-zinc-950 rounded-lg border border-zinc-800">
            {(['month', 'week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${activeView === v ? 'bg-zinc-850 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            id="btn_open_block_form"
            onClick={() => setShowAddBlock(true)}
            className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Study Block
          </button>
          
          <button
            id="btn_open_task_form"
            onClick={() => setShowAddTask(true)}
            className="px-3.5 py-1.5 border border-zinc-850 bg-zinc-900/40 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" /> Task Item
          </button>
        </div>
      </div>

      {/* Dynamic Popups for Adding Events */}
      {showAddBlock && (
        <form onSubmit={handleCreateBlock} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2"><CalendarIcon className="h-4.5 w-4.5 text-zinc-300" /> Plan Focused Study Block</h3>
            <button type="button" onClick={() => setShowAddBlock(false)} className="text-zinc-500 hover:text-white"><X className="h-4.5 w-4.5" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Block Title</label>
              <input
                id="cal_block_title"
                type="text"
                required
                value={blockTitle}
                onChange={(e) => setBlockTitle(e.target.value)}
                placeholder="e.g. Solve Calc Practice Sheet 2"
                className="w-full px-3 py-2 bg-[#09090b]/65 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Subject Assignment</label>
              <select
                id="cal_block_subject"
                required
                value={blockSubjectId}
                onChange={(e) => setBlockSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b]/65 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 transition-colors"
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Topic Study Date</label>
              <input
                id="cal_block_date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b]/65 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Start Time</label>
                <input
                  id="cal_block_start"
                  type="time"
                  required
                  value={blockStartTime}
                  onChange={(e) => setBlockStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b]/65 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">End Time</label>
                <input
                  id="cal_block_end"
                  type="time"
                  required
                  value={blockEndTime}
                  onChange={(e) => setBlockEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b]/65 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>
          </div>

          <button
            id="btn_submit_block"
            type="submit"
            className="px-5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors block ml-auto cursor-pointer"
          >
            Insert Study Event
          </button>
        </form>
      )}

      {showAddTask && (
        <form onSubmit={handleCreateTask} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2"><CheckSquare className="h-4.5 w-4.5 text-zinc-350" /> Insert Dynamic Task</h3>
            <button type="button" onClick={() => setShowAddTask(false)} className="text-slate-500 hover:text-white"><X className="h-4.5 w-4.5" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Task Details</label>
              <input
                id="cal_task_title"
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Proofread Chapter 3 essays..."
                className="w-full px-3 py-2 bg-[#09090b]/65 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Syllabus Subject (Optional)</label>
              <select
                id="cal_task_sub"
                value={taskSubjectId}
                onChange={(e) => setTaskSubjectId(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#09090b]/65 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 transition-colors"
              >
                <option value="">-- No Association --</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Completion Deadline Date</label>
              <input
                id="cal_task_deadline"
                type="date"
                required
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b]/65 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Priority Level</label>
                <select
                  id="cal_task_priority"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full px-2 py-2 bg-[#09090b]/65 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Task Category Type</label>
                <select
                  id="cal_task_type"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as any)}
                  className="w-full px-2 py-2 bg-[#09090b]/65 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                >
                  <option value="daily">Daily Item</option>
                  <option value="weekly">Weekly Work</option>
                  <option value="revision">Active Revision</option>
                </select>
              </div>
            </div>
          </div>

          <button
            id="btn_submit_task"
            type="submit"
            className="px-5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors block ml-auto cursor-pointer"
          >
            Insert Task
          </button>
        </form>
      )}

      {/* Primary Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Symmetrical simple calendar grid container */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800/60 pb-3">
            <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
              <CalendarIcon className="h-4.5 w-4.5 text-zinc-400" />
              <span>Timetable: June 2026</span>
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 font-medium">Local Day Grid Tracker</span>
          </div>

          {activeView === 'month' && (
            <div>
              {/* Day naming rows */}
              <div className="grid grid-cols-7 gap-1 text-center text-zinc-500 text-[9px] font-mono uppercase font-bold mb-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {/* 5 offset days to align June 1st, 2026 (a Monday in 2026 calendar limits) */}
                {calendarDays.map(d => {
                  const todayStr = `2026-06-${d.toString().padStart(2, '0')}`;
                  const blocksForDay = calendarBlocks.filter(b => b.start.startsWith(todayStr));
                  const isTodayLocal = d === 14; // current metadata date: June 14, 2026

                  return (
                    <div 
                      key={d} 
                      className={`min-h-[55px] p-1 rounded-lg border flex flex-col justify-between transition-colors ${
                        isTodayLocal ? 'bg-zinc-100/[0.03] border-zinc-500/20 shadow-[inset_0_0_10px_rgba(255,255,255,0.03)]' :
                        'bg-[#09090b]/40 border-zinc-850 hover:border-zinc-700'
                      }`}
                    >
                      <span className={`text-[10px] font-mono leading-none ${isTodayLocal ? 'text-zinc-100 font-bold' : 'text-zinc-500 font-medium'}`}>{d}</span>
                      
                      {blocksForDay.length > 0 && (
                        <div className="space-y-0.5 mt-1 overflow-hidden max-h-[35px] select-none">
                          {blocksForDay.map(b => {
                            const sub = subjects.find(s => s.id === b.subjectId);
                            return (
                              <div 
                                key={b.id} 
                                className="text-[7.5px] truncate px-1 rounded-sm text-zinc-350 font-semibold leading-relaxed"
                                style={{ backgroundColor: (sub?.color || '#fafafa') + '15', color: sub?.color || '#fafafa', borderLeft: `1.5px solid ${sub?.color || '#fafafa'}` }}
                              >
                                {b.title}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeView !== 'month' && (
            <div className="py-12 text-center text-zinc-500 text-xs italic">
              Day and Week timetable grids are simulated. Standard multi-device view fits on Month layouts. Use block overlays above to trace schedule maps.
            </div>
          )}
        </div>

        {/* Right Task Scheduler checklist console */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800/60 pb-3">
            <h3 className="font-bold text-sm text-zinc-100">Planned Study Blocks</h3>
            <span className="text-[10px] text-zinc-500 font-mono font-bold">Today & Upcoming</span>
          </div>

          {calendarBlocks.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-zinc-800 rounded-2xl p-4">
              <Clock className="h-8 w-8 text-zinc-650 mx-auto mb-3" />
              <p className="text-zinc-500 text-[11px]">No planned study blocks mapped to your timetable.</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {calendarBlocks.map(block => {
                const sub = subjects.find(s => s.id === block.subjectId);
                const blockTime = block.start.split('T')[1]?.substring(0, 5) || 'Time';

                return (
                  <div 
                    key={block.id} 
                    className="p-3 bg-[#09090b]/50 border border-zinc-850 rounded-xl hover:border-zinc-800 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        id={`btn_check_block_${block.id}`}
                        onClick={() => store.toggleCalendarBlock(block.id)}
                        className={`h-4.5 w-4.5 shrink-0 rounded border flex items-center justify-center text-zinc-100 bg-zinc-900 transition-all cursor-pointer border-zinc-800 hover:border-zinc-500`}
                      >
                        {block.completed && <CheckCircle className="h-3.5 w-3.5 fill-zinc-100 text-[#09090b] stroke-[3]" />}
                      </button>

                      <div className="text-left leading-normal">
                        <span className={`text-xs font-semibold block text-zinc-200 ${block.completed ? 'line-through text-zinc-550 italic opacity-50' : ''}`}>
                          {block.title}
                        </span>
                        
                        <div className="flex items-center gap-1.5 mt-1 text-[8.5px] font-mono text-zinc-500 leading-none">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sub?.color || '#fafafa' }} />
                          <span>{sub?.name || 'Subject'}</span>
                          <span>•</span>
                          <span>{block.start.split('T')[0]} ({blockTime})</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`btn_delete_block_${block.id}`}
                      onClick={() => store.deleteCalendarBlock(block.id)}
                      className="text-zinc-600 hover:text-zinc-400 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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
