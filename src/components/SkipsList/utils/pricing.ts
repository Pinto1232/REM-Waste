export function calculateTotalPrice(priceBeforeVat: number, vat: number): number {
  return priceBeforeVat * (1 + vat / 100);
}
