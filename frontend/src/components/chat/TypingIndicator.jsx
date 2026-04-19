import { useEffect, useState } from 'react';

const steps = [
  { icon: '🔍', label: 'Searching PubMed for publications…' },
  { icon: '📖', label: 'Scanning OpenAlex research database…' },
  { icon: '🏥', label: 'Checking ClinicalTrials.gov…' },
  { icon: '📊', label: 'Ranking top results by relevance…' },
  { icon: '🧠', label: 'Generating AI-powered summary…' },
];

export default function TypingIndicator() {
  const [stepIndex, setStepIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setStepIndex((prev) => (prev + 1) % steps.length);
        setFade(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = steps[stepIndex];

  return (
    <div className="flex gap-3 px-4 py-3">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-xs text-red-300 shrink-0 mt-1">
        AI
      </div>

      {/* Card */}
      <div className="bg-surface-card border border-surface-border rounded-xl px-5 py-4 flex flex-col gap-3 min-w-[240px]">

        {/* Step label */}
        <div
          className="flex items-center gap-2 text-sm text-slate-300 transition-opacity duration-300"
          style={{ opacity: fade ? 1 : 0 }}
        >
          <span className="text-base">{current.icon}</span>
          <span>{current.label}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-surface-border rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-[1800ms] ease-linear"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Bouncing dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
          <span className="text-xs text-slate-500 ml-1">Analyzing research…</span>
        </div>
      </div>
    </div>
  );
}
