type ClassValue = any;

/**
 * Lightweight cn() utility — merges class names without clsx/tailwind-merge.
 * Compatible with all motion-primitives components that import from '@/lib/utils'.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat(Infinity)
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .join(" ");
}
