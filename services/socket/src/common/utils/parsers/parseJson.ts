export const parseJson = <T = object>(str: string | undefined, def: T): T => {
  try {
    return JSON.parse(str as string) as T;
  } catch (e) {
    return def;
  }
};
