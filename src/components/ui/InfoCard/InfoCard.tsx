import { UI_STYLES, UI_SPACING } from '../../../constants';

export interface InfoCardProps {
  title: string;

  description: string;

  icon: React.ReactNode;

  variant?: 'info' | 'success' | 'warning' | 'error';

  className?: string;
}

export function InfoCard({
  title,
  description,
  icon,
  variant = 'info',
  className = '',
}: InfoCardProps) {
  const variantStyles = {
    info: {
      background: UI_STYLES.GRADIENTS.INFO_CARD,
      border: UI_STYLES.BORDERS.INFO,
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-300',
      textColor: 'text-slate-300',
    },
    success: {
      background: 'bg-gradient-to-r from-green-500/10 to-green-600/10',
      border: 'border border-green-500/20',
      iconColor: 'text-green-400',
      titleColor: 'text-green-300',
      textColor: 'text-slate-300',
    },
    warning: {
      background: 'bg-gradient-to-r from-amber-500/10 to-amber-600/10',
      border: 'border border-amber-500/20',
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-300',
      textColor: 'text-slate-300',
    },
    error: {
      background: UI_STYLES.GRADIENTS.ERROR_CARD,
      border: 'border border-red-500/30',
      iconColor: 'text-red-400',
      titleColor: 'text-red-300',
      textColor: 'text-red-200',
    },
  };

  const styles = variantStyles[variant];

  const baseClasses = [
    styles.background,
    styles.border,
    UI_STYLES.ROUNDED.DEFAULT,
    UI_SPACING.PADDING.MEDIUM,
    'mb-8',
  ];

  const allClasses = [...baseClasses, className].filter(Boolean).join(' ');

  return (
    <div className={allClasses}>
      <div className='flex items-start'>
        <div className='flex-shrink-0'>
          <div className={`${styles.iconColor} mt-0.5`}>{icon}</div>
        </div>
        <div className='ml-3'>
          <h3 className={`text-sm font-medium ${styles.titleColor} mb-1`}>{title}</h3>
          <p className={`text-sm ${styles.textColor}`}>{description}</p>
        </div>
      </div>
    </div>
  );
}
