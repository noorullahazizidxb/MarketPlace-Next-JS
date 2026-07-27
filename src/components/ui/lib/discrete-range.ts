/** Builds evenly spaced selectable values from min → max using step. */
export function buildDiscreteRangeValues(
  min: number,
  max: number,
  step: number,
): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [min];
  if (min > max) return [min];
  if (step <= 0) return [min, max];

  const precision =
    step < 1 ? Math.min(6, Math.max(0, Math.ceil(-Math.log10(step)) + 1)) : 0;
  const round = (value: number) =>
    precision > 0 ? Number(value.toFixed(precision)) : Math.round(value);

  const values: number[] = [];
  const epsilon = Math.abs(step) * 0.001;

  for (let cursor = min; cursor <= max + epsilon; cursor += step) {
    const next = round(Math.min(cursor, max));
    const last = values[values.length - 1];
    if (last === undefined || Math.abs(last - next) > epsilon) {
      values.push(next);
    }
    if (next >= max - epsilon) break;
  }

  const lastValue = values[values.length - 1];
  if (lastValue === undefined || Math.abs(lastValue - max) > epsilon) {
    values.push(round(max));
  }

  return values;
}

export function nearestDiscreteIndex(values: number[], target: number): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return 0;

  let bestIndex = 0;
  let bestDistance = Infinity;

  values.forEach((candidate, index) => {
    const distance = Math.abs(candidate - target);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

export function snapToDiscreteRange(
  values: number[],
  target: number,
): number {
  if (values.length === 0) return target;
  return values[nearestDiscreteIndex(values, target)] ?? values[0]!;
}

/** Minimal helpers kept for other callers. */
export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function nearestStep(value: number, min: number, max: number, step: number) {
  if (step <= 0) return clamp(value, min, max);
  const stepped = Math.round((value - min) / step) * step + min;
  return clamp(stepped, min, max);
}
