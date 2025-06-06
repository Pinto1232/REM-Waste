interface BaseEmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actions?: React.ReactNode;
}

export function BaseEmptyState({ title, description, icon, actions }: BaseEmptyStateProps) {
  return (
    <div className='w-full'>
      <div className='text-center py-12 px-4 sm:px-0'>
        <div className='bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-8'>
          <div className='mx-auto mb-4'>{icon}</div>
          <h3 className='text-xl font-semibold text-white mb-2'>{title}</h3>
          <p className='text-slate-400 mb-6'>{description}</p>
          {actions && (
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
}
