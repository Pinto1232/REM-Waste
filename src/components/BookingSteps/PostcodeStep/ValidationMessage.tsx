import { StatusIcon } from '../../ui';

export interface ValidationMessageProps {
  error: string;
}

export function ValidationMessage({ error }: ValidationMessageProps) {
  return (
    <div className='bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-4'>
      <div className='flex items-start'>
        <div className='flex-shrink-0'>
          <StatusIcon status='error' size='medium' />
        </div>
        <div className='ml-3'>
          <h4 className='text-sm font-medium text-red-300 mb-1'>Input Error</h4>
          <p className='text-sm text-red-200'>{error}</p>
        </div>
      </div>
    </div>
  );
}
