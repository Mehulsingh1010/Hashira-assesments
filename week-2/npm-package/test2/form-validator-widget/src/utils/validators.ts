export const isRequired = (msg = "This field is required") => (value: string) =>
  value.trim() ? null : msg;

export const isEmail = (msg = "Invalid email") => (value: string) =>
  /^\S+@\S+\.\S+$/.test(value) ? null : msg;

export const minLength = (length: number, msg?: string) => (value: string) =>
  value.length >= length ? null : msg || `Minimum ${length} characters required`;
