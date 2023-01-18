export const roundTo = (number: number, to = 20): number => {
  return number % to < to / 2
    ? number - (number % to)
    : number + (to - (number % to));
};
