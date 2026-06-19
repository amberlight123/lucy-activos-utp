export function mockQrMatrix(seed: string, size = 9) {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      const char = seed.charCodeAt((row * size + col) % seed.length);
      return (char + row + col) % 3 !== 0;
    }),
  );
}
