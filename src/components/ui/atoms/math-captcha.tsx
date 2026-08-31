"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { RefreshCw, ShieldCheck, ShieldX } from "lucide-react";
import { cn } from "@/lib/cn";

// ── types ─────────────────────────────────────────────────────────────────────
export type CaptchaVariant = "classic" | "tiles" | "slider";
export type CaptchaStatus = "idle" | "valid" | "invalid";

export interface CaptchaHandle {
  /** Returns the current solved answer or null if not yet solved */
  getValue: () => number | null;
  /** True when the user has solved the challenge correctly */
  isValid: boolean;
  /** Reset to a new challenge */
  reset: () => void;
}

interface Challenge {
  a: number;
  b: number;
  op: "+" | "−";
  answer: number;
}

function genChallenge(): Challenge {
  const op: "+" | "−" = Math.random() > 0.4 ? "+" : "−";
  const a = Math.floor(Math.random() * 9) + 1;
  const b =
    op === "+"
      ? Math.floor(Math.random() * 9) + 1
      : Math.floor(Math.random() * a) + 1;
  return { a, b, op, answer: op === "+" ? a + b : a - b };
}

function genTileOptions(answer: number): number[] {
  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const d =
      answer +
      (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
    if (d !== answer && d > 0) distractors.add(d);
  }
  return [...distractors, answer].sort(() => Math.random() - 0.5);
}

// ── Variant A: Classic input ──────────────────────────────────────────────────
function ClassicCaptcha({
  challenge,
  onSolved,
  onFailed,
}: {
  challenge: Challenge;
  onSolved: () => void;
  onFailed: () => void;
}) {
  const id = useId();
  const [val, setVal] = useState("");

  const check = (v: string) => {
    const n = parseInt(v, 10);
    if (!isNaN(n)) n === challenge.answer ? onSolved() : onFailed();
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono font-bold app-text-heading-sm tracking-widest select-none text-foreground">
        {challenge.a} {challenge.op} {challenge.b} =
      </span>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={val}
        maxLength={3}
        onChange={(e) => {
          setVal(e.target.value);
          if (e.target.value.length > 0) check(e.target.value);
        }}
        className="w-16 rounded-xl border border-border bg-background px-3 py-2 text-center font-mono app-text-body focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        aria-label="Enter CAPTCHA answer"
        autoComplete="off"
      />
    </div>
  );
}

// ── Variant B: Tap-the-tile ───────────────────────────────────────────────────
function TilesCaptcha({
  challenge,
  onSolved,
  onFailed,
}: {
  challenge: Challenge;
  onSolved: () => void;
  onFailed: () => void;
}) {
  const [tiles] = useState(() => genTileOptions(challenge.answer));
  const [picked, setPicked] = useState<number | null>(null);

  const pick = (n: number) => {
    setPicked(n);
    n === challenge.answer ? onSolved() : onFailed();
  };

  return (
    <div className="space-y-2">
      <p className="app-text-label text-muted-foreground">
        Tap the correct answer to{" "}
        <span className="font-mono font-bold text-foreground">
          {challenge.a} {challenge.op} {challenge.b}
        </span>
      </p>
      <div className="flex gap-2 flex-wrap">
        {tiles.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => pick(t)}
            className={cn(
              "h-10 min-w-11 rounded-xl border px-3 font-mono font-semibold app-text-body transition-all duration-150",
              picked === null
                ? "border-border bg-muted/50 hover:border-primary/50 hover:bg-primary/8"
                : picked === t && t === challenge.answer
                  ? "border-success/60 bg-success/12 text-success"
                  : picked === t
                    ? "border-destructive/60 bg-destructive/12 text-destructive"
                    : "border-border bg-muted/30 opacity-40",
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Variant C: Slider ─────────────────────────────────────────────────────────
function SliderCaptcha({
  challenge,
  onSolved,
  onFailed,
}: {
  challenge: Challenge;
  onSolved: () => void;
  onFailed: () => void;
}) {
  const max = challenge.answer + 5;
  const [val, setVal] = useState(0);
  const solvedRef = useRef(false);

  const handle = (v: number) => {
    setVal(v);
    if (v === challenge.answer && !solvedRef.current) {
      solvedRef.current = true;
      onSolved();
    } else if (v !== challenge.answer && solvedRef.current) {
      solvedRef.current = false;
      onFailed();
    }
  };

  return (
    <div className="space-y-2">
      <p className="app-text-label text-muted-foreground">
        Slide to{" "}
        <span className="font-mono font-bold text-foreground">
          {challenge.a} {challenge.op} {challenge.b} = {challenge.answer}
        </span>
      </p>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={max}
          value={val}
          onChange={(e) => handle(Number(e.target.value))}
          className="rem-range-slider-input flex-1"
          style={
            { "--range-fill": `${(val / max) * 100}%` } as React.CSSProperties
          }
          aria-label="Slide to the correct answer"
        />
        <span className="w-8 text-center font-mono font-bold app-text-body">
          {val}
        </span>
      </div>
    </div>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export interface MathCaptchaProps {
  variant?: CaptchaVariant;
  onVerified?: (valid: boolean) => void;
  className?: string;
}

export function MathCaptcha({
  variant = "classic",
  onVerified,
  className,
}: MathCaptchaProps) {
  const [challenge, setChallenge] = useState<Challenge>(genChallenge);
  const [status, setStatus] = useState<CaptchaStatus>("idle");

  const reset = useCallback(() => {
    setChallenge(genChallenge());
    setStatus("idle");
    onVerified?.(false);
  }, [onVerified]);

  const onSolved = useCallback(() => {
    setStatus("valid");
    onVerified?.(true);
  }, [onVerified]);

  const onFailed = useCallback(() => {
    setStatus("invalid");
    onVerified?.(false);
    // auto-reset after short delay on wrong answer
    setTimeout(reset, 1200);
  }, [onVerified, reset]);

  useEffect(() => {
    setStatus("idle");
  }, [challenge]);

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-colors duration-200",
        status === "valid" && "border-success/50 bg-success/5",
        status === "invalid" && "border-destructive/50 bg-destructive/5",
        status === "idle" && "border-border bg-muted/30",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {status === "valid" ? (
            <ShieldCheck className="app-icon-sm text-success" />
          ) : status === "invalid" ? (
            <ShieldX className="app-icon-sm text-destructive" />
          ) : (
            <ShieldCheck className="app-icon-sm text-muted-foreground" />
          )}
          <span className="app-text-label font-medium">
            {status === "valid"
              ? "Verified ✓"
              : status === "invalid"
                ? "Try again…"
                : "Security check"}
          </span>
        </div>
        <button
          type="button"
          aria-label="New challenge"
          onClick={reset}
          className="grid size-7 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <RefreshCw className="size-3.5" />
        </button>
      </div>

      {variant === "classic" && (
        <ClassicCaptcha
          challenge={challenge}
          onSolved={onSolved}
          onFailed={onFailed}
        />
      )}
      {variant === "tiles" && (
        <TilesCaptcha
          challenge={challenge}
          onSolved={onSolved}
          onFailed={onFailed}
        />
      )}
      {variant === "slider" && (
        <SliderCaptcha
          challenge={challenge}
          onSolved={onSolved}
          onFailed={onFailed}
        />
      )}
    </div>
  );
}
