export const parseNumber = (str: string | undefined, def: number): number => {
  if (str === '') {
    return def;
  }

  const num = Number(str);

  // eslint-disable-next-line no-compare-neg-zero
  if (num === 0 || num === -0) {
    return num;
  }

  return Number.isNaN(num) ? def : num;
};
