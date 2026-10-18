
import type { Measurement } from "../interfaces/Measurement";

export function calculatePearson(
  measurements: Measurement[]
): number | null {

  // En az 5 ölçüm gerekli.
  if (measurements.length < 5) {
    return null;
  }

  // Geçersiz sayılarla hesaplama yapma.
  const valid = measurements.every(
    (m) =>
      Number.isFinite(m.valueA) &&
      Number.isFinite(m.valueB)
  );

  if (!valid) {
    return null;
  }

  const n = measurements.length;

  // Değişkenlerin ortalamalarını hesapla.
  const meanA =
    measurements.reduce((sum, m) => sum + m.valueA, 0) / n;

  const meanB =
    measurements.reduce((sum, m) => sum + m.valueB, 0) / n;

  let numerator = 0;
  let sumA = 0;
  let sumB = 0;

  // Pearson formülünün parçalarını hesapla.
  for (const measurement of measurements) {
    const diffA = measurement.valueA - meanA;
    const diffB = measurement.valueB - meanB;

    numerator += diffA * diffB;
    sumA += diffA ** 2;
    sumB += diffB ** 2;
  }

  const denominator = Math.sqrt(sumA * sumB);

  // Değişkenlerden biri sabitse korelasyon tanımsızdır.
  if (denominator === 0) {
    return null;
  }

  const r = numerator / denominator;

  // Sayısal yuvarlama hatalarına karşı sınırlandır.
  return Math.max(-1, Math.min(1, r));
}
