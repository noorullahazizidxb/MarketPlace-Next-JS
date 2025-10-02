"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  tone?: "danger" | "default";
  icon?: React.ReactNode;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading,
  tone = "default",
  icon,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = React.useState(false);
  const handleConfirm = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };
  const close = () => onOpenChange(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <div className="p-5 pb-4">
          <div className="flex items-start gap-3">
            {icon && <div className="mt-0.5">{icon}</div>}
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold leading-snug">{title}</h3>
              {description && (
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  {description}
                </p>
              )}
            </div>
            <DialogClose asChild>
              <button
                aria-label="Close"
                className="size-8 grid place-items-center rounded-xl hover:bg-foreground/5"
                onClick={() => {
                  onCancel?.();
                  close();
                }}
              >
                <X className="size-4" />
              </button>
            </DialogClose>
          </div>
        </div>
        <div className="px-5 pb-5 pt-2 flex justify-end gap-3 bg-[hsl(var(--muted))]/20">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onCancel?.();
                close();
              }}
            >
              {cancelLabel || t("cancel")}
            </Button>
          </DialogClose>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={loading || submitting}
            className={
              tone === "danger"
                ? "bg-red-600 hover:bg-red-500 text-white border-red-600"
                : undefined
            }
          >
            {loading || submitting
              ? t("pleaseWait")
              : confirmLabel || t("confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
