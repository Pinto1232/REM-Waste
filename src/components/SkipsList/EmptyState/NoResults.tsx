import { SearchIcon } from '../icons.tsx';
import { BaseEmptyState } from './BaseEmptyState.tsx';

export function NoResults() {
  return (
    <BaseEmptyState
      icon={<SearchIcon className='h-16 w-16 text-slate-400' />}
      title='No skips found'
      description='Try searching with a different postcode or area.'
      actions={
        <button
          onClick={() => window.location.reload()}
          className='px-6 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors'
        >
          Try Again
        </button>
      }
    />
  );
}
