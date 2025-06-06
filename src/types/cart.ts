export interface CartItem {
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
    phone: string;
    address: string;
  };
  paymentMethod: string;
  addedAt: Date;
}