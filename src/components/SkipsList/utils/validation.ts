import type { SkipSearchParams } from '../../../schemas/skip';

export function validateSearchParams(searchParams: SkipSearchParams): boolean {
  return !!(searchParams && (searchParams.postcode || searchParams.area));
}
