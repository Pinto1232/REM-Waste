import { useMemo, useCallback } from 'react';
import { useSkipsByLocation } from '../../hooks/useSkips';
import type { Skip } from '../../types/skip';
import { SkipCard } from './SkipCard.tsx';
import { EmptyState } from './EmptyState/index.ts';
import { LoadingState } from './LoadingState.tsx';
import { ErrorState } from './ErrorState.tsx';
import { useSkipFiltering } from './hooks/useSkipFiltering.ts';
import { validateSearchParams } from './utils/validation.ts';
import type { SkipsListProps, SearchFilters } from './types.ts';

export function SkipsList({
  searchParams,
  onSkipSelect,
  selectedSkipId,
  searchFilters,
}: SkipsListProps) {
  const isValidSearch = useMemo(() => validateSearchParams(searchParams), [searchParams]);

  const {
    data: skips,
    isLoading,
    isError,
    error,
    refetch,
  } = useSkipsByLocation(isValidSearch ? searchParams : null);

  const filteredSkips = useSkipFiltering(skips, searchFilters);

  const handleSkipSelect = useCallback(
    (skip: Skip) => {
      if (!skip?.id || !onSkipSelect) return;
      onSkipSelect(skip);
    },
    [onSkipSelect]
  );

  if (!isValidSearch) {
    return <EmptyState.InvalidSearch />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!skips?.length) {
    return <EmptyState.NoResults />;
  }

  if (!filteredSkips.length) {
    return <EmptyState.NoFilterResults totalCount={skips.length} />;
  }

  return (
    <div className='w-full'>
      {}
      <div className='mb-6 px-4 sm:px-0'>
        <p className='text-slate-400 text-sm'>
          {searchFilters && hasActiveFilters(searchFilters) ? (
            <>
              Showing {filteredSkips.length} of {skips.length} skips
            </>
          ) : (
            <>
              {skips.length} skip{skips.length !== 1 ? 's' : ''} available
            </>
          )}
        </p>
      </div>

      {}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0'>
        {filteredSkips.map(skip => (
          <SkipCard
            key={skip.id}
            skip={skip}
            isSelected={selectedSkipId === skip.id}
            onSelect={handleSkipSelect}
          />
        ))}
      </div>
    </div>
  );
}

function hasActiveFilters(filters: SearchFilters): boolean {
  return !!(
    filters.searchTerm ||
    filters.sizeRange !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.roadLegal !== 'all'
  );
}
