import { calculateTotalPrice } from './pricing.ts';

export function formatPrice(priceBeforeVat: number, vat: number): string {
  try {
    if (typeof priceBeforeVat !== 'number' || isNaN(priceBeforeVat) || priceBeforeVat < 0) {
      return 'Price unavailable';
    }

    if (typeof vat !== 'number' || isNaN(vat) || vat < 0) {
      return 'Price unavailable';
    }

    const totalPrice = calculateTotalPrice(priceBeforeVat, vat);

    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(totalPrice);
  } catch {
    return 'Price unavailable';
  }
}
