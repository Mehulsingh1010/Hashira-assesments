/**
 * Throttle utility - ensures function is called at most once per specified interval
 * Useful for form submission and scroll events
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=throttle.d.ts.map