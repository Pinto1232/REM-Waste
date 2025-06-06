import type { SkipSearchParams, Skip } from '../../schemas/skip';

export interface SearchFilters {
  sizeRange: string;
  priceRange: string;
  roadLegal: string;
  searchTerm: string;
}

export interface SkipsListProps {
  searchParams: SkipSearchParams;
  onSkipSelect?: (skip: Skip) => void;
  selectedSkipId: number | undefined;
  searchFilters?: SearchFilters;
}
