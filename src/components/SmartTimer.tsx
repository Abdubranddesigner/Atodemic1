import React, { useState, useEffect, useRef } from 'react';
import { useAtodemicStore } from '../context/AppContext';
import { Play, Pause, Square, Zap, ShieldAlert, Sparkles, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

export default function SmartTimer() {
  const store = useAtodemicStore();
  const { subjects } = store;

  // Configuration values
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('');
  const [sessionLength, setSessionLength] = useState(25); // minutes

  // Running states
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync Timer settings on length change
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setSecondsLeft(sessionLength * 60);
    }
  }, [sessionLength]);

  // Audio simulation (Web Audio API synthesis for clean distraction tick)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthesizedTick = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      // Synth click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Ignored if browser policy blocks
    }
  };

  // Counting cycle running loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          if (isSoundActive) {
            playSynthesizedTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isSoundActive]);

  const handleStart = () => {
    if (!selectedSubjectId) {
      setStatusMessage('Please select a subject to associate this study session.');
      return;
    }
    setStatusMessage('');
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStop = (save = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);

    if (save) {
      const minutesSpent = Math.max(Math.round(((sessionLength * 60) - secondsLeft) / 60), 1);
      store.completeStudySession(selectedSubjectId, topic, goal, minutesSpent);
      setStatusMessage(`Session logged! Spent ${minutesSpent} mins (+${minutesSpent * 10} XP).`);
    } else {
      setStatusMessage('Session reset.');
    }

    setSecondsLeft(sessionLength * 60);
    setIsFocusMode(false);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    store.completeStudySession(selectedSubjectId, topic, goal, sessionLength);
    setStatusMessage(`Great work! Saved ${sessionLength} study minutes and earned ${sessionLength * 10} XP!`);
    setSecondsLeft(sessionLength * 60);
    setIsFocusMode(false);
  };

  // Convert seconds display text
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeSubject = subjects.find(s => s.id === selectedSubjectId);

  // DISTRACTION-FREE FOCUS MODE OVERLAY
  if (isFocusMode) {
    return (
      <div className="fixed inset-0 bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-8 z-50 animate-fade-in select-none">
        
        {/* Subtle breathing ring pulse indicator */}
        <div className="absolute h-96 w-96 rounded-full border border-zinc-700/30 bg-zinc-800/[0.012] animate-pulse duration-[4000ms] pointer-events-none" />

        <div className="text-center space-y-8 max-w-lg z-10">
          <div>
            <span 
              className="text-xs uppercase font-semibold tracking-widest font-mono text-zinc-400"
            >
              {activeSubject?.name || 'Syllabus Focus Node'}
            </span>
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight mt-1">
              Active Chapter: {topic || 'Studying Core Context'}
            </h1>
            {goal && (
              <p className="text-xs text-zinc-500 italic mt-2">
                "Target Goal: {goal}"
              </p>
            )}
          </div>

          <div className="py-8 font-mono">
            <span className="text-7xl font-extralight tracking-tight text-zinc-100 select-none">
              {formatTime(secondsLeft)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-6">
            {isRunning ? (
              <button
                id="focus_btn_pause"
                onClick={handlePause}
                className="h-12 w-12 rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-all cursor-pointer"
              >
                <Pause className="h-5 w-5" />
              </button>
            ) : (
              <button
                id="focus_btn_resume"
                onClick={handleResume}
                className="h-12 w-12 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <Play className="h-5 w-5 fill-zinc-950 text-zinc-950" />
              </button>
            )}

            <button
              id="focus_btn_stop"
              onClick={() => handleStop(true)}
              className="h-12 w-12 rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <Square className="h-5 w-5" />
            </button>

            <button
              id="focus_btn_sound"
              onClick={() => setIsSoundActive(!isSoundActive)}
              className="h-10 w-10 rounded-full border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              {isSoundActive ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
            </button>
          </div>

          <button
            id="focus_btn_exit"
            onClick={() => setIsFocusMode(false)}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-wider font-mono flex items-center gap-1 mx-auto pt-6 cursor-pointer"
          >
            <Minimize2 className="h-3.5 w-3.5" /> Exit focus view
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-zinc-900/10 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 font-mono font-medium">Smart Pomodoro Terminal</span>
          <h2 className="text-base font-bold text-zinc-100 mt-1">Focus Study Room</h2>
        </div>
        <div className="flex gap-2">
          <button
            id="btn_active_sound"
            onClick={() => setIsSoundActive(!isSoundActive)}
            className="p-2 border border-zinc-800 bg-[#09090b] hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
          >
            {isSoundActive ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-xs text-zinc-300 font-medium text-center animate-fade-in flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left config parameters card */}
        <div id="sm_config_panel" className="lg:col-span-1 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-4">
          <h3 className="font-bold text-sm text-zinc-100 mb-2">Workspace Parameters</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-zinc-400 text-[9px] font-bold uppercase tracking-wider mb-1 font-mono">Select Academic Subject</label>
              <select
                id="timer_select_subject"
                disabled={isRunning}
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b]/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 transition-colors"
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 text-[9px] font-bold uppercase tracking-wider mb-1 font-mono">Chapter Topic</label>
              <input
                id="timer_topic"
                type="text"
                disabled={isRunning}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Backpropagation, Cellular Respiration"
                className="w-full px-3 py-2 bg-[#09090b]/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[9px] font-bold uppercase tracking-wider mb-1 font-mono">Session Focus Goal</label>
              <input
                id="timer_goal"
                type="text"
                disabled={isRunning}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Outline 3 proof formulas..."
                className="w-full px-3 py-2 bg-[#09090b]/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-zinc-400 text-[9px] font-bold uppercase tracking-wider font-mono">Focus Length</label>
                <span className="text-xs font-bold text-zinc-200 font-mono">{sessionLength} min</span>
              </div>
              <input
                id="timer_duration_slider"
                disabled={isRunning}
                type="range"
                min="5"
                max="120"
                step="5"
                value={sessionLength}
                onChange={(e) => setSessionLength(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-100 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Center clock area */}
        <div id="sm_clock_room" className="lg:col-span-2 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          {/* Symmetrical simple grid details */}
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-25 pointer-events-none" />

          <div className="space-y-6 relative z-10 w-full max-w-sm">
            <div>
              {activeSubject && (
                <span className="px-2.5 py-0.5 rounded-full border border-zinc-800 bg-[#09090b] text-[10px] font-mono font-bold" style={{ color: activeSubject.color }}>
                  {activeSubject.name}
                </span>
              )}
              {topic && <h4 className="text-xs text-zinc-400 font-medium mt-3">Targeting: {topic}</h4>}
            </div>

            <div className="py-2.5">
              <span className="text-6xl md:text-7xl font-extralight font-mono text-zinc-100 select-none tracking-tight">
                {formatTime(secondsLeft)}
              </span>
            </div>

            {/* Timers triggers triggers */}
            <div className="flex justify-center items-center gap-4">
              {!isRunning && !isPaused && (
                <button
                  id="timer_btn_start"
                  onClick={handleStart}
                  className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Play className="h-4 w-4 fill-zinc-950 text-zinc-950" /> Start Focus
                </button>
              )}

              {isRunning && (
                <button
                  id="timer_btn_pause"
                  onClick={handlePause}
                  className="px-6 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Pause className="h-4 w-4" /> Pause Timer
                </button>
              )}

              {isPaused && (
                <button
                  id="timer_btn_resume"
                  onClick={handleResume}
                  className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-zinc-950 text-zinc-950" /> Resume focus
                </button>
              )}

              {(isRunning || isPaused) && (
                <button
                  id="timer_btn_save"
                  onClick={() => handleStop(true)}
                  className="px-4 py-2.5 rounded-lg border border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-900/40 transition-colors cursor-pointer text-xs font-semibold"
                >
                  Log Spent Minutes
                </button>
              )}

              {(isRunning || isPaused) && (
                <button
                  id="timer_btn_cancel"
                  onClick={() => handleStop(false)}
                  className="p-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-400 transition-colors cursor-pointer"
                >
                  <Square className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Maximize screen prompt */}
            {isRunning && (
              <button
                id="timer_btn_distraction_free"
                onClick={() => setIsFocusMode(true)}
                className="mt-4 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase font-bold tracking-wider font-mono flex items-center gap-1 mx-auto cursor-pointer"
              >
                <Maximize2 className="h-3 w-3" /> Distraction-Free View
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
