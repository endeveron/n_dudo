export const calculateBinomialProbability = (
  n: number,
  p: number,
  k: number
): number => {
  if (k > n || k < 0) return 0;
  if (k === 0) return Math.pow(1 - p, n);

  // Use normal approximation for large n
  if (n > 30) {
    const mean = n * p;
    const variance = n * p * (1 - p);
    const standardDev = Math.sqrt(variance);

    if (standardDev === 0) return k === mean ? 1 : 0;

    // Continuity correction
    const z1 = (k - 0.5 - mean) / standardDev;
    const z2 = (k + 0.5 - mean) / standardDev;

    return normalCdf(z2) - normalCdf(z1);
  }

  // Exact calculation for small n using combination formula
  let result = 1;
  for (let i = 0; i < k; i++) {
    result *= (n - i) / (i + 1);
  }
  return result * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

const normalCdf = (z: number): number => {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
};

const erf = (x: number): number => {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
};
