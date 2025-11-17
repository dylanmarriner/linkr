import { CheckCircle2 } from 'lucide-react';

import { type DashboardSummary } from '@/lib/types';

export function TaskList({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="card-lux rounded-3xl border border-white/5 p-6">
      <p className="text-xs uppercase tracking-[0.4em] text-white/40">Compliance</p>
      <h3 className="font-display text-2xl">Action items</h3>
      <ul className="mt-4 space-y-3">
        {summary.tasks.map((task) => (
          <li key={task.label} className="flex items-center gap-3 text-sm text-white/70">
            <CheckCircle2 className={`h-5 w-5 ${task.status === 'done' ? 'text-emerald-400' : 'text-white/30'}`} />
            <span>{task.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
