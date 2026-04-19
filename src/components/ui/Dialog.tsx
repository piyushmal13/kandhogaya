import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Dialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  children
}: DialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-white/10 bg-zinc-900 p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className={cn(
                "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl",
                variant === "danger" && "bg-red-500/10 text-red-500",
                variant === "warning" && "bg-amber-500/10 text-amber-500",
                variant === "info" && "bg-emerald-500/10 text-emerald-500"
              )}>
                <AlertTriangle className="h-8 w-8" />
              </div>

              <h3 className="mb-2 text-2xl font-bold text-white tracking-tight">{title}</h3>
              {description && <p className="mb-8 text-sm leading-6 text-gray-400">{description}</p>}

              {/* Custom Acquisition Layer */}
              {children && <div className="w-full mb-8">{children}</div>}

              {onConfirm && (
                <div className="flex w-full gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 rounded-xl bg-white/5 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={cn(
                      "flex-1 rounded-xl py-4 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2",
                      variant === "danger" && "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
                      variant === "warning" && "bg-amber-500 text-black hover:bg-amber-600 shadow-lg shadow-amber-500/20",
                      variant === "info" && "bg-emerald-500 text-black hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                    )}
                  >
                    {isLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                    {confirmText}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
