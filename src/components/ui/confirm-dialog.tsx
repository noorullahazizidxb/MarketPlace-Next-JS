"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/shadcn/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { X } from "lucide-react";

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
  confirmLabel,
  cancelLabel,
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
      <DialogContent
        showCloseButton={false}
        className="max-w-sm p-0 overflow-hidden md:w-[min(92vw,24rem)] lg:w-[min(92vw,24rem)] xl:w-[min(92vw,24rem)]"
      >
        <DialogHeader className="p-5 pb-4 text-left">
          <div className="flex items-start gap-3">
            {icon && <div className="mt-0.5">{icon}</div>}
            <div className="min-w-0 flex-1 space-y-1">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Close"
                className="size-8 shrink-0 p-0"
                onClick={() => {
                  onCancel?.();
                  close();
                }}
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <DialogFooter className="px-5 pb-5 pt-2 flex-row justify-end gap-3 bg-muted/20 sm:justify-end">
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
            variant={tone === "danger" ? "destructive" : "primary"}
          >
            {loading || submitting
              ? t("pleaseWait")
              : confirmLabel || t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
