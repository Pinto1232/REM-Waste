import { SearchIcon } from '../icons.tsx';
import { BaseEmptyState } from './BaseEmptyState.tsx';

interface NoFilterResultsProps {
  totalCount: number;
}

export function NoFilterResults({ totalCount }: NoFilterResultsProps) {
  return (
    <BaseEmptyState
      icon={<SearchIcon className='h-16 w-16 text-slate-400' />}
      title='No skips match your filters'
      description='Try adjusting your search criteria to see more options.'
      actions={
        <>
          <button className='px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors'>
            Clear All Filters
          </button>
          <button className='px-6 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors'>
            Show All {totalCount} Skips
          </button>
        </>
      }
    />
  );
}
