import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Window({ title, isOpen, onClose, children }: WindowProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          drag
          dragMomentum={false}
          dragHandle=".handle"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-24 left-24 w-[800px] h-[600px] bg-slate-950/60 backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden flex flex-col ring-1 ring-white/5 z-50"
        >
          {/* Windows-style Premium Title Bar */}
          <div className="handle h-12 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none">
            <span className="text-sm font-medium text-slate-300 tracking-wide">{title}</span>
            <div className="flex items-center gap-3">
              <button className="text-slate-400 hover:text-white transition-colors"><Minus size={14} /></button>
              <button className="text-slate-400 hover:text-white transition-colors"><Maximize2 size={12} /></button>
              <button onClick={onClose} className="text-slate-400 hover:text-red-400 transition-colors"><X size={16} /></button>
            </div>
          </div>
          
          {/* App Content Area */}
          <div className="flex-1 overflow-y-auto p-8 text-slate-200">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}