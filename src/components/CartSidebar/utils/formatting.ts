export function formatPrice(priceBeforeVat: number, vat: number): string {
  const totalPrice = priceBeforeVat * (1 + vat / 100);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(totalPrice);
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'Not specified';

  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
