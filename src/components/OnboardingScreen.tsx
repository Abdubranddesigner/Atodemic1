import React, { useState } from 'react';
import { useAtodemicStore } from '../context/AppContext';
import { Target, CalendarDays, BookOpen, Clock, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const store = useAtodemicStore();
  const [step, setStep] = useState(1);

  // Form values
  const [examDate, setExamDate] = useState('');
  const [targetScore, setTargetScore] = useState(85);
  const [subjectsInput, setSubjectsInput] = useState('');
  const [subjectsList, setSubjectsList] = useState<string[]>(['Mathematics', 'Physics', 'Chemistry']);
  const [chaptersCount, setChaptersCount] = useState(12);
  const [dailyHourGoal, setDailyHourGoal] = useState(3);
  
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState('');

  const nextStep = () => {
    setError('');
    if (step === 1 && !examDate) {
      setError('An exam deadline is required for readiness math calculations.');
      return;
    }
    if (step === 2 && subjectsList.length === 0) {
      setError('Please configure at least one academic subject.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = subjectsInput.trim();
    if (formatted && !subjectsList.includes(formatted)) {
      setSubjectsList(prev => [...prev, formatted]);
      setSubjectsInput('');
    }
  };

  const handleRemoveSubject = (name: string) => {
    setSubjectsList(prev => prev.filter(s => s !== name));
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setError('');

    try {
      store.setOnboarding(
        examDate,
        targetScore,
        dailyHourGoal,
        subjectsList,
        chaptersCount
      );
      
      // Simulate slight build progress for visual reward
      setTimeout(() => {
        setIsFinishing(false);
        onComplete();
      }, 1000);
    } catch (e: any) {
      setError('An issue occurred during data initialization.');
      setIsFinishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 relative font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />
      
      <div className="w-full max-w-lg relative z-10">
        
        {/* Progress header bar */}
        <div className="flex justify-between items-center mb-6 px-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">Personal Onboarding Console</span>
          <span className="text-xs font-semibold text-zinc-100 font-mono">Step {step} of 3</span>
        </div>

        <div className="h-1 bg-zinc-900 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-zinc-100 transition-all duration-300 rounded-full" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8 rounded-2xl border border-zinc-850 bg-zinc-900/10 backdrop-blur-xl relative">
          
          {error && (
            <div className="mb-6 p-3 rounded-lg border border-red-500/10 bg-red-500/5 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* STEP 1: Exam Deadlines */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-200">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 font-sans">Target Exam Milestones</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">When is the big day and what are you aiming for?</p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Your Exam Date</label>
                  <input
                    id="onboarding_exam_date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-805 border-zinc-800 bg-[#09090b]/60 text-zinc-100 text-xs focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1.5 font-sans">Our scheduler calculates your dynamic readiness directly against this date.</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 font-mono">Target Exam Score</label>
                    <span className="text-xs font-bold text-zinc-100 font-mono">{targetScore}%</span>
                  </div>
                  <input
                    id="onboarding_target_score"
                    type="range"
                    min="50"
                    max="100"
                    value={targetScore}
                    onChange={(e) => setTargetScore(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-100"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600 font-mono pt-1">
                    <span>50% (Passing)</span>
                    <span>100% (Perfect)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Subject Mapping */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-200">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 font-sans">Syllabus Mapping</h3>
                  <p className="text-zinc-500 text-xs mt-0.5 font-sans">Which subjects and how many core chapters per subject?</p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <form onSubmit={handleAddSubject} className="flex gap-2">
                  <input
                    id="onboarding_subjects_input"
                    type="text"
                    value={subjectsInput}
                    onChange={(e) => setSubjectsInput(e.target.value)}
                    placeholder="Add Subject e.g. Biology, History..."
                    className="flex-1 px-3 py-2.5 rounded-lg border border-zinc-805 border-zinc-800 bg-[#09090b]/60 text-zinc-100 text-xs focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#09090b] border border-zinc-800 hover:border-zinc-700 text-zinc-250 hover:text-white rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Add
                  </button>
                </form>

                {/* Subject Badges */}
                <div className="flex flex-wrap gap-2 py-2 min-h-12 border border-zinc-805 border-zinc-800 bg-[#09090b]/45 p-3 rounded-lg">
                  {subjectsList.length === 0 ? (
                    <span className="text-zinc-550 text-xs italic font-sans">No subjects configured yet...</span>
                  ) : (
                    subjectsList.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-150 rounded-full text-xs">
                        <span>{sub}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSubject(sub)}
                          className="h-3 w-3 text-zinc-400 hover:text-white ml-1 cursor-pointer font-bold leading-none align-middle"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider font-mono">Avg. Chapters Per Subject</label>
                    <span className="text-xs font-bold text-zinc-100 font-mono">{chaptersCount} Chapters</span>
                  </div>
                  <input
                    id="onboarding_chapters_count"
                    type="range"
                    min="1"
                    max="50"
                    value={chaptersCount}
                    onChange={(e) => setChaptersCount(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Workload Parameters */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-200">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 font-sans">Daily Committal Goals</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Define your available high-focus study hours daily.</p>
                </div>
              </div>

              <div className="space-y-6 pt-6">
                <div className="p-4 bg-[#09090b] border border-zinc-850 rounded-xl text-center">
                  <span className="text-zinc-500 text-[9px] font-mono tracking-widest uppercase block">Focus Study Target</span>
                  <span className="text-3xl font-bold text-zinc-100 font-mono mt-1.5 inline-block">{dailyHourGoal} Hours / Day</span>
                  <p className="text-zinc-500 text-[10px] leading-relaxed max-w-xs mx-auto mt-2 font-sans">
                     Our dynamic diagnostic will compare your actual daily execution averages directly with this committal barrier.
                  </p>
                </div>

                <div>
                  <input
                    id="onboarding_daily_goal"
                    type="range"
                    min="1"
                    max="12"
                    value={dailyHourGoal}
                    onChange={(e) => setDailyHourGoal(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-100"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-650 font-mono pt-1">
                    <span>1 hrs / day (Casual)</span>
                    <span>12 hrs / day (Maximal)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Control Triggers */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-805 border-zinc-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                disabled={isFinishing}
                className="px-4 py-2 rounded-lg border border-zinc-805 border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#09090b] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                Next Step <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={isFinishing}
                className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#09090b] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-auto disabled:opacity-50"
              >
                {isFinishing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Provisioning...
                  </>
                ) : (
                  <>
                    Finish Setup <Target className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
