
// Polyfill for String.prototype.includes
if (!String.prototype.includes) {
  String.prototype.includes = function (search: string, start?: number): boolean {
    if (typeof start !== "number") {
      start = 0
    }
    return this.indexOf(search, start) !== -1
  }
}

// Polyfill for Array.prototype.find
if (!Array.prototype.find) {
  Array.prototype.find = function <T>(
    predicate: (value: T, index: number, obj: T[]) => boolean,
    thisArg?: any,
  ): T | undefined {
    if (this == null) {
      throw new TypeError("Array.prototype.find called on null or undefined")
    }
    const O = Object(this)
    const len = Number.parseInt(O.length, 10) || 0
    if (len === 0) {
      return undefined
    }
    for (let i = 0; i < len; i++) {
      const element = O[i]
      if (predicate.call(thisArg, element, i, O)) {
        return element
      }
    }
    return undefined
  }
}

// Polyfill for Object.assign
if (typeof Object.assign !== "function") {
  Object.defineProperty(Object, "assign", {
    value: function assign(target: any, ...sources: any[]) {
      if (target === null || target === undefined) {
        throw new TypeError("Cannot convert undefined or null to object")
      }
      const to = Object(target)
      for (let index = 0; index < sources.length; index++) {
        const nextSource = sources[index]
        if (nextSource !== null && nextSource !== undefined) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
    configurable: true,
  })
}

export {}