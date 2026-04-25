import { useEffect } from 'react';
import Board from './components/Board';
import NewTaskDialog from './components/NewTaskDialog';
import { Zap, Loader2, AlertTriangle } from 'lucide-react';
import { useTaskStore } from './store/useTaskStore';

function App() {
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const loading = useTaskStore((state) => state.loading);
  const error = useTaskStore((state) => state.error);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-mesh font-sans text-foreground selection:bg-primary/20">
      {/* Subtle moving shimmer overlay */}
      <div className="fixed inset-0 header-shimmer pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1500px] mx-auto px-4 md:px-8 flex flex-col min-h-screen">

        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 mb-8">
          {/* Thin gradient separator line */}
          <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 logo-glow rounded-xl text-purple-400">
              <Zap size={22} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-[1.6rem] font-extrabold tracking-tight leading-none title-gradient">
                TaskFlow
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-1 tracking-wide uppercase">
                Developer workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 border border-border/50 px-3 py-1.5 rounded-full">
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin text-purple-400" />
                  Syncing…
                </>
              ) : error ? (
                <>
                  <AlertTriangle size={12} className="text-red-400" />
                  <span className="text-red-400">API error</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_hsl(155,70%,55%)]" />
                  All systems running
                </>
              )}
            </span>
            <NewTaskDialog />
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>
              <span className="font-semibold">Could not reach backend: </span>
              {error}
            </span>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-x-auto pb-10">
          {loading && !error ? (
            <div className="flex items-center justify-center h-[400px] gap-3 text-muted-foreground">
              <Loader2 size={24} className="animate-spin text-purple-400" />
              <span className="text-sm">Loading tasks…</span>
            </div>
          ) : (
            <Board />
          )}
        </main>

        <footer className="py-5 text-center text-xs text-muted-foreground/50 border-t border-border/20 tracking-wide">
          Built with React · TypeScript · Tailwind v4 · Zustand · dnd-kit
        </footer>
      </div>
    </div>
  );
}

export default App;
