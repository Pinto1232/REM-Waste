import { describe, it, expect } from 'vitest';
import { SkipSchema, SkipSearchParamsSchema } from './skip';

describe('Skip Schema Validation', () => {
  describe('SkipSchema', () => {
    it('should validate a valid skip object', () => {
      const validSkip = {
        id: 1,
        size: 8,
        name: '8 Yard Skip',
        description: 'Perfect for medium projects',
        price_before_vat: 200,
        vat: 20,
        postcode: 'SW1A 1AA',
        area: 'London',
        forbidden: false,
        allowed_on_road: true,
        allows_heavy_waste: false,
        hire_period_days: 7,
        dimensions: {
          length: 3.7,
          width: 1.8,
          height: 1.2,
        },
        weight_limit: 8000,
        suitable_for: ['general waste', 'garden waste'],
        image_url: 'https://example.com/skip.jpg',
        availability: {
          available: true,
          next_available_date: '2024-01-15',
        },
      };

      const result = SkipSchema.parse(validSkip);
      expect(result).toEqual(validSkip);
    });

    it('should validate a minimal skip object', () => {
      const minimalSkip = {
        id: 1,
        size: 8,
        price_before_vat: 200,
        vat: 20,
        postcode: 'SW1A 1AA',
        area: 'London',
        forbidden: false,
        allowed_on_road: true,
        allows_heavy_waste: false,
        hire_period_days: 7,
      };

      const result = SkipSchema.parse(minimalSkip);
      // The schema transforms the data to add a generated name
      const expectedResult = {
        ...minimalSkip,
        name: '8 Yard Skip', // Generated from size
      };
      expect(result).toEqual(expectedResult);
    });

    it('should reject invalid skip object', () => {
      const invalidSkip = {
        id: 'invalid', // Should be number
        size: 8,
        name: '8 Yard Skip',
        price_before_vat: 200,
        vat: 20,
        hire_period_days: 7,
      };

      expect(() => SkipSchema.parse(invalidSkip)).toThrow();
    });
  });

  describe('SkipSearchParamsSchema', () => {
    it('should validate valid search parameters', () => {
      const validParams = {
        postcode: 'SW1A 1AA',
        area: 'London',
        waste_type: 'general',
        min_size: 4,
        max_size: 12,
      };

      const result = SkipSearchParamsSchema.parse(validParams);
      expect(result).toEqual(validParams);
    });

    it('should validate minimal search parameters', () => {
      const minimalParams = {
        postcode: 'SW1A',
      };

      const result = SkipSearchParamsSchema.parse(minimalParams);
      expect(result).toEqual(minimalParams);
    });

    it('should reject postcode that is too short', () => {
      const invalidParams = {
        postcode: 'SW', // Too short
      };

      expect(() => SkipSearchParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject missing postcode', () => {
      const invalidParams = {
        area: 'London',
      };

      expect(() => SkipSearchParamsSchema.parse(invalidParams)).toThrow();
    });
  });
});