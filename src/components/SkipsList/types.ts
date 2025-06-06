import type { SkipSearchParams, Skip } from '../../types/skip';

export interface SearchFilters {
  sizeRange: string;
  priceRange: string;
  roadLegal: string;
  searchTerm: string;
}

export interface SkipsListProps {
  searchParams: SkipSearchParams;
  onSkipSelect?: (skip: Skip) => void;
  selectedSkipId?: number;
  searchFilters?: SearchFilters;
}
