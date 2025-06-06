import { memo } from 'react';
import { FiTrash2, FiCalendar, FiMapPin, FiPackage } from 'react-icons/fi';
import { formatPrice, formatDate } from './utils/formatting.ts';

interface CartItemProps {
  item: {
    id: string;
    skipSize: number;
    hirePeriod: number;
    price: number;
    vat: number;
    deliveryDate: string;
    collectionDate?: string;
    postcode: string;
    wasteType: string;
    customerDetails: {
      name: string;
      email: string;
    };
  };
  onRemove: (itemId: string) => void;
}

export const CartItem = memo(function CartItem({ item, onRemove }: CartItemProps) {
  const handleRemove = () => onRemove(item.id);

  return (
    <div className='bg-slate-700/50 rounded-xl p-4 border border-slate-600/50'>
      {}
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center'>
          <div className='w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center mr-3'>
            <span className='text-slate-800 font-bold text-xs'>SKIP</span>
          </div>
          <div>
            <h4 className='text-white font-semibold'>{item.skipSize} Yard Skip</h4>
            <p className='text-slate-400 text-sm'>{item.hirePeriod} day hire</p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-lg font-bold text-blue-400'>
            {formatPrice(item.price, item.vat)}
          </span>
          <button
            onClick={handleRemove}
            className='p-1 text-red-400 hover:text-red-300 transition-colors rounded'
            aria-label={`Remove ${item.skipSize} yard skip from cart`}
          >
            <FiTrash2 className='w-4 h-4' />
          </button>
        </div>
      </div>

      {}
      <div className='space-y-2 text-sm'>
        <DetailRow
          icon={<FiCalendar className='w-4 h-4 mr-2 text-slate-400' />}
          text={`Delivery: ${formatDate(item.deliveryDate)}`}
        />
        {item.collectionDate && (
          <DetailRow
            icon={<FiCalendar className='w-4 h-4 mr-2 text-slate-400' />}
            text={`Collection: ${formatDate(item.collectionDate)}`}
          />
        )}
        <DetailRow
          icon={<FiMapPin className='w-4 h-4 mr-2 text-slate-400' />}
          text={item.postcode}
        />
        <DetailRow
          icon={<FiPackage className='w-4 h-4 mr-2 text-slate-400' />}
          text={`${item.wasteType.charAt(0).toUpperCase() + item.wasteType.slice(1)} waste`}
        />
      </div>

      {}
      <div className='mt-3 pt-3 border-t border-slate-600/50'>
        <p className='text-slate-300 text-sm'>
          <span className='font-medium'>Customer:</span> {item.customerDetails.name}
        </p>
        <p className='text-slate-400 text-xs'>{item.customerDetails.email}</p>
      </div>
    </div>
  );
});

interface DetailRowProps {
  icon: React.ReactNode;
  text: string;
}

function DetailRow({ icon, text }: DetailRowProps) {
  return (
    <div className='flex items-center text-slate-300'>
      {icon}
      <span>{text}</span>
    </div>
  );
}
