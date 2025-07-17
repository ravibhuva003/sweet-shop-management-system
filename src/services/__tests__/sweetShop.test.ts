import { describe, beforeEach, test, expect } from 'vitest';
import { SweetShopService } from '../sweetShop';
import { Sweet } from '@/types/sweet';

describe('SweetShopService', () => {
  let sweetShop: SweetShopService;

  beforeEach(() => {
    sweetShop = new SweetShopService();
  });

  describe('Adding Sweets', () => {
    test('should add a new sweet with unique ID', () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'chocolate' as const,
        price: 2.50,
        quantity: 10
      };

      const sweet = sweetShop.addSweet(sweetData);

      expect(sweet.id).toBeDefined();
      expect(sweet.name).toBe('Chocolate Bar');
      expect(sweet.category).toBe('chocolate');
      expect(sweet.price).toBe(2.50);
      expect(sweet.quantity).toBe(10);
    });

    test('should generate unique IDs for multiple sweets', () => {
      const sweet1 = sweetShop.addSweet({
        name: 'Gummy Bears',
        category: 'gummy',
        price: 1.50,
        quantity: 20
      });

      const sweet2 = sweetShop.addSweet({
        name: 'Lollipop',
        category: 'lollipop',
        price: 1.00,
        quantity: 15
      });

      expect(sweet1.id).not.toBe(sweet2.id);
    });
  });

  describe('Deleting Sweets', () => {
    test('should delete an existing sweet', () => {
      const sweet = sweetShop.addSweet({
        name: 'Candy Cane',
        category: 'candy',
        price: 0.75,
        quantity: 30
      });

      const deleted = sweetShop.deleteSweet(sweet.id);
      expect(deleted).toBe(true);
      expect(sweetShop.getSweetById(sweet.id)).toBeNull();
    });

    test('should return false when deleting non-existent sweet', () => {
      const deleted = sweetShop.deleteSweet('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('Viewing Sweets', () => {
    test('should return all sweets', () => {
      sweetShop.addSweet({
        name: 'Croissant',
        category: 'pastry',
        price: 3.00,
        quantity: 5
      });

      sweetShop.addSweet({
        name: 'Donut',
        category: 'pastry',
        price: 2.25,
        quantity: 8
      });

      const allSweets = sweetShop.getAllSweets();
      expect(allSweets).toHaveLength(2);
    });

    test('should return sweet by ID', () => {
      const sweet = sweetShop.addSweet({
        name: 'Macaron',
        category: 'pastry',
        price: 2.75,
        quantity: 12
      });

      const found = sweetShop.getSweetById(sweet.id);
      expect(found).toEqual(sweet);
    });
  });

  describe('Searching Sweets', () => {
    beforeEach(() => {
      sweetShop.addSweet({ name: 'Dark Chocolate', category: 'chocolate', price: 3.50, quantity: 15 });
      sweetShop.addSweet({ name: 'Milk Chocolate', category: 'chocolate', price: 2.50, quantity: 20 });
      sweetShop.addSweet({ name: 'Gummy Bears', category: 'gummy', price: 1.50, quantity: 25 });
      sweetShop.addSweet({ name: 'Fruit Pastille', category: 'candy', price: 1.75, quantity: 18 });
    });

    test('should search by name', () => {
      const results = sweetShop.searchSweets({ name: 'chocolate' });
      expect(results).toHaveLength(2);
      expect(results.every(s => s.name.toLowerCase().includes('chocolate'))).toBe(true);
    });

    test('should search by category', () => {
      const results = sweetShop.searchSweets({ category: 'chocolate' });
      expect(results).toHaveLength(2);
      expect(results.every(s => s.category === 'chocolate')).toBe(true);
    });

    test('should search by price range', () => {
      const results = sweetShop.searchSweets({ minPrice: 2.00, maxPrice: 3.00 });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Milk Chocolate');
    });

    test('should combine multiple search filters', () => {
      const results = sweetShop.searchSweets({ 
        category: 'chocolate', 
        maxPrice: 3.00 
      });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Milk Chocolate');
    });
  });

  describe('Purchase Sweets', () => {
    test('should decrease quantity when purchasing', () => {
      const sweet = sweetShop.addSweet({
        name: 'Chocolate Chip Cookie',
        category: 'pastry',
        price: 1.25,
        quantity: 10
      });

      sweetShop.purchaseSweet({ sweetId: sweet.id, quantity: 3 });
      
      const updated = sweetShop.getSweetById(sweet.id);
      expect(updated?.quantity).toBe(7);
    });

    test('should throw error when insufficient stock', () => {
      const sweet = sweetShop.addSweet({
        name: 'Limited Edition Candy',
        category: 'candy',
        price: 5.00,
        quantity: 2
      });

      expect(() => {
        sweetShop.purchaseSweet({ sweetId: sweet.id, quantity: 5 });
      }).toThrow('Insufficient stock. Available: 2, Requested: 5');
    });

    test('should throw error when sweet not found', () => {
      expect(() => {
        sweetShop.purchaseSweet({ sweetId: 'non-existent', quantity: 1 });
      }).toThrow('Sweet with ID non-existent not found');
    });
  });

  describe('Restock Sweets', () => {
    test('should increase quantity when restocking', () => {
      const sweet = sweetShop.addSweet({
        name: 'Popular Candy',
        category: 'candy',
        price: 2.00,
        quantity: 5
      });

      sweetShop.restockSweet({ sweetId: sweet.id, quantity: 10 });
      
      const updated = sweetShop.getSweetById(sweet.id);
      expect(updated?.quantity).toBe(15);
    });

    test('should throw error when sweet not found', () => {
      expect(() => {
        sweetShop.restockSweet({ sweetId: 'non-existent', quantity: 10 });
      }).toThrow('Sweet with ID non-existent not found');
    });
  });

  describe('Sorting Sweets', () => {
    let sweets: Sweet[];

    beforeEach(() => {
      sweetShop.addSweet({ name: 'Zebra Cake', category: 'pastry', price: 4.00, quantity: 3 });
      sweetShop.addSweet({ name: 'Apple Pie', category: 'pastry', price: 6.00, quantity: 1 });
      sweetShop.addSweet({ name: 'Banana Split', category: 'pastry', price: 2.00, quantity: 5 });
      sweets = sweetShop.getAllSweets();
    });

    test('should sort by name ascending', () => {
      const sorted = sweetShop.sortSweets(sweets, 'name', 'asc');
      expect(sorted[0].name).toBe('Apple Pie');
      expect(sorted[1].name).toBe('Banana Split');
      expect(sorted[2].name).toBe('Zebra Cake');
    });

    test('should sort by price descending', () => {
      const sorted = sweetShop.sortSweets(sweets, 'price', 'desc');
      expect(sorted[0].price).toBe(6.00);
      expect(sorted[1].price).toBe(4.00);
      expect(sorted[2].price).toBe(2.00);
    });

    test('should sort by quantity ascending', () => {
      const sorted = sweetShop.sortSweets(sweets, 'quantity', 'asc');
      expect(sorted[0].quantity).toBe(1);
      expect(sorted[1].quantity).toBe(3);
      expect(sorted[2].quantity).toBe(5);
    });
  });
});