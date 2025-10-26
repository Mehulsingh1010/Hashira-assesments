/**
 * Debounce utility - delays function execution until after specified wait time
 * Useful for validation on input change to avoid excessive re-renders
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=debounce.d.ts.map