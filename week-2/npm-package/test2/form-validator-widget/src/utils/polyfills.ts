/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export const polyfills = () => {
  if (!Array.prototype.flatMap) {
    // @ts-ignore
    Array.prototype.flatMap = function <T, U>(callback: (value: T, index: number, array: T[]) => U | U[], thisArg?: any) {
      return (this as T[]).map(callback, thisArg).reduce<U[]>((acc: U[], val: U | U[]) => acc.concat(Array.isArray(val) ? val : [val]), [] as U[]);
    };
  }
};
