import { UI_STYLES, UI_SPACING } from '../../../constants';

export interface FeatureCardProps {
  title: string;

  description: string;

  icon: React.ReactNode;

  iconColor?: 'blue' | 'green' | 'purple' | 'amber' | 'red';

  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  iconColor = 'blue',
  className = '',
}: FeatureCardProps) {
  const iconColorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
    amber: 'bg-gradient-to-r from-amber-500 to-amber-600',
    red: 'bg-gradient-to-r from-red-500 to-red-600',
  };

  const baseClasses = [
    'bg-slate-800/50',
    UI_STYLES.BORDERS.DEFAULT,
    UI_STYLES.ROUNDED.DEFAULT,
    UI_SPACING.PADDING.MEDIUM,
    'text-center',
  ];

  const allClasses = [...baseClasses, className].filter(Boolean).join(' ');

  return (
    <div className={allClasses}>
      {}
      <div
        className={`w-10 h-10 ${iconColorClasses[iconColor]} ${UI_STYLES.ROUNDED.FULL} flex items-center justify-center mx-auto mb-3`}
      >
        <div className='text-white'>{icon}</div>
      </div>

      {}
      <h4 className='text-sm font-semibold text-white mb-1'>{title}</h4>
      <p className='text-xs text-slate-400'>{description}</p>
    </div>
  );
}
