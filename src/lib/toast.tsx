"use client";

import { ReactNode } from "react";
import toast, { Toast } from "react-hot-toast";
import { Check, XOctagon, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";

function ToastCard({
  t,
  icon,
  title,
  message,
  color,
}: {
  t: Toast;
  icon: ReactNode;
  title?: string;
  message: string;
  color: "success" | "error" | "info";
}) {
  const ringColor =
    color === "success"
      ? "ring-[var(--primary)]/30"
      : color === "error"
      ? "ring-red-500/30"
      : "ring-[var(--accent)]/30";
  return (
    <div
      className={clsx(
        "pointer-events-auto inline-block min-w-[12rem] max-w-[28rem] overflow-hidden rounded-xl border bg-[var(--card)] text-[var(--foreground)] shadow-lg",
        "border-[var(--border)]",
        "ring-1",
        ringColor,
        t.visible
          ? "animate-in fade-in slide-in-from-top-3"
          : "animate-out fade-out slide-out-to-top-2"
      )}
      onClick={() => toast.dismiss(t.id)}
    >
      <div className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div
              className={clsx(
                "rounded-full p-2",
                color === "success"
                  ? "bg-[var(--primary)]/10"
                  : color === "error"
                  ? "bg-red-50"
                  : "bg-[var(--accent)]/10"
              )}
            >
              {icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {title ? (
              <div className="font-semibold leading-tight mb-0.5 truncate">
                {title}
              </div>
            ) : null}
            <div className="text-sm opacity-90 truncate">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function toastSuccess(message: string, title?: string) {
  toast.custom((t) => (
    <ToastCard
      t={t}
      title={title}
      message={message}
      color="success"
      icon={<Check className="h-5 w-5 text-[var(--primary)]" />}
    />
  ));
}

export function toastError(message: string, title?: string) {
  toast.custom((t) => (
    <ToastCard
      t={t}
      title={title}
      message={message}
      color="error"
      icon={<XOctagon className="h-5 w-5 text-red-500" />}
    />
  ));
}

export function toastInfo(message: string, title?: string) {
  toast.custom((t) => (
    <ToastCard
      t={t}
      title={title}
      message={message}
      color="info"
      icon={<Info className="h-5 w-5 text-[var(--accent)]" />}
    />
  ));
}

export default toast;
