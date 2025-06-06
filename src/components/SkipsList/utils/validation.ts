import type { SkipSearchParams } from '../../../types/skip';

export function validateSearchParams(searchParams: SkipSearchParams): boolean {
  return !!(searchParams && (searchParams.postcode || searchParams.area));
}
