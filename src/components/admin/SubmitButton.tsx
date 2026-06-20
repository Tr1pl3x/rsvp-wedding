"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  /** Shown in place of children while the form action is pending (text buttons). */
  pendingText?: string;
  ariaLabel?: string;
  title?: string;
};

// Reads the enclosing <form>'s pending state, so it must be rendered inside the
// form whose Server Action it submits. Disables to prevent double-submits.
export default function SubmitButton({
  children,
  className = "",
  pendingText,
  ariaLabel,
  title,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-label={ariaLabel}
      title={title}
      className={`${className} ${pending ? "opacity-60" : ""}`}
    >
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
