import React, { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { X, Plus, Sparkles } from 'lucide-react';

export default function NewTaskDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, description);
    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-new-task flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
      >
        <Plus size={16} strokeWidth={2.5} />
        New Task
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="modal-glass rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400">
                  <Sparkles size={15} />
                </div>
                <h2 className="text-base font-bold text-foreground">Create New Task</h2>
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="task-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Title <span className="text-purple-400">*</span>
                </label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="E.g., Setup database schema"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="task-desc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description <span className="text-muted-foreground/40 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  id="task-desc"
                  placeholder="Add some details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="btn-new-task px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
