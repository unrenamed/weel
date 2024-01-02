export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T) =>
    fns.reduce((acc, fn) => fn(acc), value);

export function exclude<T>(obj: T, keys: (keyof T)[]): Partial<T> {
  const excludedObj: Partial<T> = {};

  for (const key in obj) {
    if (!keys.includes(key as keyof T)) {
      excludedObj[key] = obj[key];
    }
  }

  return excludedObj;
}
