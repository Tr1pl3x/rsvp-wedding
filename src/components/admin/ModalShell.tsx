"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "@phosphor-icons/react";

type ModalShellProps = {
  title: string;
  subtitle?: string;
  size?: "sm" | "lg";
  onClose: () => void;
  children: React.ReactNode;
};

// Animated, focus-trapped dialog. Wrap its render site in <AnimatePresence> so
// the exit animation plays on close.
export default function ModalShell({
  title,
  subtitle,
  size = "lg",
  onClose,
  children,
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "Tab" && dialog) {
        const focusables = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-shell-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className={`w-full ${
          size === "sm" ? "max-w-md" : "max-w-lg"
        } rounded-2xl bg-white p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] outline-none`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              id="modal-shell-title"
              className="text-base font-semibold tracking-tight text-zinc-900"
            >
              {title}
            </h2>
            {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </motion.div>
    </motion.div>
  );
}
