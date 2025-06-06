export const VALIDATION_MESSAGES = {
  POSTCODE_REQUIRED: 'Please enter a postcode',
  INVALID_POSTCODE: 'Please enter a valid UK postcode (e.g., NR32 1AB)',
  NAME_REQUIRED: 'Name is required',
  EMAIL_INVALID: 'Invalid email address',
  PHONE_INVALID: 'Phone number must be at least 10 digits',
  ADDRESS_REQUIRED: 'Address is required',
  WASTE_TYPE_REQUIRED: 'Waste type is required',
  SKIP_REQUIRED: 'Please select a skip',
  DATE_REQUIRED: 'Please select a date',
  PAYMENT_METHOD_REQUIRED: 'Please select a payment method',
} as const;

export const VALIDATION_PATTERNS = {
  UK_POSTCODE: /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\-+()]{10,}$/,
} as const;

export const FIELD_CONSTRAINTS = {
  POSTCODE_MIN_LENGTH: 3,
  NAME_MIN_LENGTH: 1,
  PHONE_MIN_LENGTH: 10,
  ADDRESS_MIN_LENGTH: 5,
} as const;