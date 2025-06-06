import { useMemo } from 'react';
import type { Skip } from '../../../schemas/skip';
import { calculateTotalPrice } from '../utils/pricing.ts';

interface SearchFilters {
  sizeRange: string;
  priceRange: string;
  roadLegal: string;
  searchTerm: string;
}

export function useSkipFiltering(skips: Skip[] | undefined, searchFilters?: SearchFilters) {
  return useMemo(() => {
    if (!skips?.length || !searchFilters) {
      return skips || [];
    }

    return skips.filter(skip => {
      if (!isValidSkip(skip)) {
        return false;
      }

      if (searchFilters.searchTerm && !matchesSearchTerm(skip, searchFilters.searchTerm)) {
        return false;
      }

      if (
        searchFilters.sizeRange !== 'all' &&
        !matchesSizeRange(skip.size, searchFilters.sizeRange)
      ) {
        return false;
      }

      if (
        searchFilters.priceRange !== 'all' &&
        !matchesPriceRange(skip, searchFilters.priceRange)
      ) {
        return false;
      }

      if (
        searchFilters.roadLegal !== 'all' &&
        !matchesRoadLegal(skip.allowed_on_road, searchFilters.roadLegal)
      ) {
        return false;
      }

      return true;
    });
  }, [skips, searchFilters]);
}

function isValidSkip(skip: Skip): boolean {
  return !!(
    skip &&
    typeof skip.id === 'number' &&
    typeof skip.size === 'number' &&
    typeof skip.price_before_vat === 'number' &&
    typeof skip.vat === 'number'
  );
}

function matchesSearchTerm(skip: Skip, searchTerm: string): boolean {
  const searchLower = searchTerm.toLowerCase();
  const totalPrice = calculateTotalPrice(skip.price_before_vat, skip.vat);

  return (
    skip.size.toString().includes(searchLower) ||
    totalPrice.toFixed(2).includes(searchLower) ||
    skip.hire_period_days.toString().includes(searchLower) ||
    (skip.allowed_on_road ? 'road legal' : 'private property').includes(searchLower)
  );
}

function matchesSizeRange(size: number, sizeRange: string): boolean {
  switch (sizeRange) {
    case 'small':
      return size <= 4;
    case 'medium':
      return size >= 6 && size <= 8;
    case 'large':
      return size >= 10 && size <= 12;
    case 'xlarge':
      return size >= 14;
    default:
      return true;
  }
}

function matchesPriceRange(skip: Skip, priceRange: string): boolean {
  const totalPrice = calculateTotalPrice(skip.price_before_vat, skip.vat);

  switch (priceRange) {
    case 'budget':
      return totalPrice < 200;
    case 'mid':
      return totalPrice >= 200 && totalPrice < 400;
    case 'premium':
      return totalPrice >= 400;
    default:
      return true;
  }
}

function matchesRoadLegal(allowedOnRoad: boolean, roadLegal: string): boolean {
  switch (roadLegal) {
    case 'road':
      return allowedOnRoad;
    case 'private':
      return !allowedOnRoad;
    default:
      return true;
  }
}
