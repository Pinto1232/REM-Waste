import type { Skip } from './skip';

export interface BookingFormData {
  postcode: string;
  area?: string;
  wasteType: string;
  selectedSkip?: Skip;
  permitRequired?: boolean;
  permitDetails?: string;
  deliveryDate?: string;
  collectionDate?: string;
  paymentMethod?: string;
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export type BookingStep = 
  | 'postcode'
  | 'waste-type'
  | 'select-skip'
  | 'permit-check'
  | 'choose-date'
  | 'payment';

export interface StepConfig {
  id: BookingStep;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface WasteType {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export const WASTE_TYPES: WasteType[] = [
  {
    id: 'general',
    name: 'General Waste',
    description: 'Household and commercial waste',
  },
  {
    id: 'construction',
    name: 'Construction Waste',
    description: 'Building materials, rubble, concrete',
  },
  {
    id: 'garden',
    name: 'Garden Waste',
    description: 'Grass, leaves, branches, soil',
  },
  {
    id: 'mixed',
    name: 'Mixed Waste',
    description: 'Combination of different waste types',
  },
];
