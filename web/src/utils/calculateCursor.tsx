export type Options = {
  min?: number;
  max: number;
  next: number;
  looped?: boolean;
};

/** Calculate next cursor position based on options */
export function calculateCursor(options: Options): number {
  const { min = 0, max, next, looped = false } = options;
  if (next < min) {
    return looped ? max : min;
  }

  if (next > max) {
    return looped ? min : max;
  }

  return next;
}
