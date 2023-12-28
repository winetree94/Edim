export const rangeBetween =
  (min: number, max: number) =>
  (...values: number[]) => {
    return values.every(
      (value) => value >= Math.min(min, max) && value <= Math.max(max),
    );
  };
