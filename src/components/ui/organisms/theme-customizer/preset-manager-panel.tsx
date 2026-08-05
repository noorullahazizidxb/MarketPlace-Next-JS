"use client";
/**
 * PresetManagerPanel — Add, Edit, Delete custom theme presets.
 *
 * Built-in presets (from @repo/constants) are read-only.
 * Custom presets (fetched from /api/themes) support full CRUD.
 *
 * Props:
 *   - label      Section title, e.g. "Shadcn UI Theme Presets"
 *   - builtins   Array of built-in preset option items
 *   - value      Currently selected preset value
 *   - onChange   Fires when the user picks a preset
 *   - onRandom   Fires when the user clicks "Random"
 *   - clearOthers  Clears other preset categories on selection
 */

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    Dices,
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../../atoms/shadcn/button";
import { Label } from "../../atoms/shadcn/label";
import {
    useApiGet,
    useApiMutation,
    useApiMutationDynamic,
} from "@/lib/api-hooks";
import toast from "react-hot-toast";
import { cn } from "@/lib/cn";

// ── types ─────────────────────────────────────────────────────────────────────

export type PresetOption = {
    value: string;
    name: string;
    preset: { styles: { light: Record<string, string>; dark: Record<string, string> } };
};

type ApiTheme = {
    id: number;
    name: string;
    tokens: Record<string, unknown>;
    isActive: boolean;
    createdAt: string;
};

// ── colour swatches helper ────────────────────────────────────────────────────

const solidKeys = ["primary", "secondary", "accent", "success", "warning"] as const;

function Swatches({ styles }: { styles: Record<string, string> }) {
    const gradStart = styles["brand-gradient-start"] ?? styles.primary ?? "transparent";
    const gradEnd = styles["brand-gradient-end"] ?? styles.accent ?? "transparent";
    return (
        <div className="flex items-center gap-1 shrink-0">
            {solidKeys.map((k) =>
                styles[k] ? (
                    <div
                        key={k}
                        className="size-3 rounded-full border border-border/20 flex-shrink-0"
                        style={{ backgroundColor: styles[k] }}
                        title={k}
                    />
                ) : null,
            )}
            <div
                className="w-6 h-3 rounded-full border border-border/20 flex-shrink-0"
                style={{ background: `linear-gradient(90deg, ${gradStart}, ${gradEnd})` }}
                title="Brand gradient"
            />
        </div>
    );
}

// ── preset item row ───────────────────────────────────────────────────────────

function PresetRow({
    item,
    isActive,
    isCustom,
    onSelect,
    onEdit,
    onDelete,
}: {
    item: PresetOption | { value: string; name: string; custom: true; id: number; tokens: Record<string, unknown> };
    isActive: boolean;
    isCustom: boolean;
    onSelect: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}) {
    const styles = isCustom
        ? ((item as any).tokens?.styles?.light ?? {})
        : (item as PresetOption).preset?.styles?.light ?? {};

    return (
        <motion.div
            layout
            className={cn(
                "group flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors duration-150",
                isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "hover:bg-muted/60 text-foreground border border-transparent",
            )}
            onClick={onSelect}
        >
            <Swatches styles={styles} />
            <span className="flex-1 text-sm truncate font-medium">{item.name}</span>
            {isActive && <Check className="size-3.5 text-primary shrink-0" />}
            {isCustom && (
                <div
                    className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        aria-label="Edit preset"
                        onClick={onEdit}
                        className="size-6 rounded grid place-items-center hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Pencil className="size-3" />
                    </button>
                    <button
                        aria-label="Delete preset"
                        onClick={onDelete}
                        className="size-6 rounded grid place-items-center hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    >
                        <Trash2 className="size-3" />
                    </button>
                </div>
            )}
        </motion.div>
    );
}

// ── create / edit dialog ──────────────────────────────────────────────────────

function PresetDialog({
    open,
    onClose,
    initial,
    onSave,
}: {
    open: boolean;
    onClose: () => void;
    initial?: { id?: number; name: string; tokens: Record<string, unknown> };
    onSave: (data: { name: string; tokens: Record<string, unknown> }) => Promise<void>;
}) {
    const [name, setName] = useState(initial?.name ?? "");
    const [rawTokens, setRawTokens] = useState(
        initial?.tokens ? JSON.stringify(initial.tokens, null, 2) : "{}",
    );
    const [saving, setSaving] = useState(false);
    const [jsonError, setJsonError] = useState<string | null>(null);

    // reset when dialog opens
    React.useEffect(() => {
        if (open) {
            setName(initial?.name ?? "");
            setRawTokens(initial?.tokens ? JSON.stringify(initial.tokens, null, 2) : "{}");
            setJsonError(null);
        }
    }, [open, initial]);

    const handleSave = async () => {
        if (!name.trim()) { setJsonError("Name is required"); return; }
        let parsed: Record<string, unknown>;
        try {
            parsed = JSON.parse(rawTokens);
        } catch {
            setJsonError("Invalid JSON — please fix the token JSON before saving.");
            return;
        }
        setSaving(true);
        try {
            await onSave({ name: name.trim(), tokens: parsed });
            onClose();
        } catch (e: any) {
            setJsonError(e?.message ?? "Save failed");
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={initial?.id ? "Edit preset" : "New preset"}
        >
            <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />
            <motion.div
                className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">
                        {initial?.id ? "Edit Preset" : "New Preset"}
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="size-7 rounded-lg grid place-items-center hover:bg-muted transition-colors text-muted-foreground"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    <div>
                        <Label htmlFor="preset-name" className="mb-1.5 block text-sm">Preset Name</Label>
                        <input
                            id="preset-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My custom preset"
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
                        />
                    </div>

                    <div>
                        <Label htmlFor="preset-tokens" className="mb-1.5 block text-sm">
                            CSS Tokens{" "}
                            <span className="text-muted-foreground font-normal">(JSON)</span>
                        </Label>
                        <textarea
                            id="preset-tokens"
                            value={rawTokens}
                            onChange={(e) => { setRawTokens(e.target.value); setJsonError(null); }}
                            rows={10}
                            spellCheck={false}
                            className="w-full font-mono rounded-lg border border-border bg-background/50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                        />
                        {jsonError && (
                            <p className="mt-1 text-xs text-destructive">{jsonError}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30">
                    <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} loading={saving}>
                        <Check className="size-3.5 mr-1" />
                        {initial?.id ? "Save Changes" : "Create Preset"}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function PresetManagerPanel({
    label,
    builtins,
    value,
    onChange,
    onRandom,
    clearOthers,
    presetCategory,
}: {
    label: string;
    builtins: PresetOption[];
    value: string;
    onChange: (v: string) => void;
    onRandom: () => void;
    clearOthers?: () => void;
    presetCategory?: string;
}) {
    // custom presets from backend
    const { data: apiData, refetch } = useApiGet<ApiTheme[]>(
        ["themes", presetCategory ?? label],
        "/themes",
    );
    const apiThemes: ApiTheme[] = useMemo(
        () => (Array.isArray(apiData) ? apiData : []),
        [apiData],
    );

    const createMutation = useApiMutation<ApiTheme>("post", "/themes");
    const updateMutation = useApiMutationDynamic<ApiTheme>("put");
    const deleteMutation = useApiMutationDynamic<void>("delete");

    const [expanded, setExpanded] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<ApiTheme | null>(null);

    const openNew = () => { setEditTarget(null); setDialogOpen(true); };
    const openEdit = (t: ApiTheme) => { setEditTarget(t); setDialogOpen(true); };

    const handleSave = useCallback(
        async (data: { name: string; tokens: Record<string, unknown> }) => {
            if (editTarget) {
                await updateMutation.mutateAsync({ url: `/themes/${editTarget.id}`, body: data });
                toast.success("Preset updated");
            } else {
                await createMutation.mutateAsync(data as any);
                toast.success("Preset created");
            }
            refetch();
        },
        [editTarget, createMutation, updateMutation, refetch],
    );

    const handleDelete = useCallback(
        async (t: ApiTheme) => {
            if (!window.confirm(`Delete preset "${t.name}"? This cannot be undone.`)) return;
            await deleteMutation.mutateAsync({ url: `/themes/${t.id}` });
            toast.success("Preset deleted");
            if (value === `custom:${t.id}`) onChange("");
            refetch();
        },
        [deleteMutation, value, onChange, refetch],
    );

    return (
        <>
            <div className="space-y-2">
                {/* Section header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                        <motion.span
                            animate={{ rotate: expanded ? 0 : -90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="size-3.5" />
                        </motion.span>
                        {label}
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {builtins.length + apiThemes.length}
                        </span>
                    </button>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={onRandom}
                            title="Random preset"
                            className="size-7 rounded-lg grid place-items-center border border-border/50 bg-card/80 hover:bg-accent/20 hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all text-xs"
                        >
                            <Dices className="size-3.5" />
                        </button>
                        <button
                            onClick={openNew}
                            title="Add new preset"
                            className="size-7 rounded-lg grid place-items-center border border-border/50 bg-card/80 hover:bg-primary/20 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all"
                        >
                            <Plus className="size-3.5" />
                        </button>
                    </div>
                </div>

                {/* Preset list */}
                <AnimatePresence initial={false}>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                                {/* Built-in */}
                                {builtins.map((bi) => (
                                    <PresetRow
                                        key={bi.value}
                                        item={bi}
                                        isActive={value === bi.value}
                                        isCustom={false}
                                        onSelect={() => {
                                            onChange(bi.value);
                                            clearOthers?.();
                                        }}
                                    />
                                ))}
                                {/* Custom (from API) */}
                                {apiThemes.map((t) => (
                                    <PresetRow
                                        key={`custom:${t.id}`}
                                        item={{
                                            value: `custom:${t.id}`,
                                            name: t.name,
                                            custom: true,
                                            id: t.id,
                                            tokens: t.tokens,
                                        } as any}
                                        isActive={value === `custom:${t.id}`}
                                        isCustom
                                        onSelect={() => {
                                            onChange(`custom:${t.id}`);
                                            clearOthers?.();
                                        }}
                                        onEdit={() => openEdit(t)}
                                        onDelete={() => handleDelete(t)}
                                    />
                                ))}
                                {builtins.length === 0 && apiThemes.length === 0 && (
                                    <p className="text-xs text-muted-foreground py-2 px-2.5">
                                        No presets yet. Click + to add one.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {dialogOpen && (
                    <PresetDialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        initial={
                            editTarget
                                ? { id: editTarget.id, name: editTarget.name, tokens: editTarget.tokens }
                                : undefined
                        }
                        onSave={handleSave}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
