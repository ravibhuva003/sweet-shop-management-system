import { Sweet, PurchaseRequest, RestockRequest, SearchFilters } from '@/types/sweet';

export class SweetShopService {
  private sweets: Sweet[] = [];
  private nextId = 1;

  addSweet(sweet: Omit<Sweet, 'id'>): Sweet {
    const newSweet: Sweet = {
      ...sweet,
      id: this.nextId.toString(),
    };
    this.nextId++;
    this.sweets.push(newSweet);
    return newSweet;
  }

  deleteSweet(id: string): boolean {
    const index = this.sweets.findIndex(sweet => sweet.id === id);
    if (index === -1) return false;
    this.sweets.splice(index, 1);
    return true;
  }

  updateSweet(id: string, updates: Partial<Omit<Sweet, 'id'>>): Sweet | null {
    const sweet = this.sweets.find(s => s.id === id);
    if (!sweet) return null;
    
    Object.assign(sweet, updates);
    return sweet;
  }

  getAllSweets(): Sweet[] {
    return [...this.sweets];
  }

  getSweetById(id: string): Sweet | null {
    return this.sweets.find(sweet => sweet.id === id) || null;
  }

  searchSweets(filters: SearchFilters): Sweet[] {
    return this.sweets.filter(sweet => {
      if (filters.name && !sweet.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.category && sweet.category !== filters.category) {
        return false;
      }
      if (filters.minPrice !== undefined && sweet.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && sweet.price > filters.maxPrice) {
        return false;
      }
      return true;
    });
  }

  purchaseSweet(request: PurchaseRequest): Sweet {
    const sweet = this.getSweetById(request.sweetId);
    if (!sweet) {
      throw new Error(`Sweet with ID ${request.sweetId} not found`);
    }
    if (sweet.quantity < request.quantity) {
      throw new Error(`Insufficient stock. Available: ${sweet.quantity}, Requested: ${request.quantity}`);
    }
    
    sweet.quantity -= request.quantity;
    return sweet;
  }

  restockSweet(request: RestockRequest): Sweet {
    const sweet = this.getSweetById(request.sweetId);
    if (!sweet) {
      throw new Error(`Sweet with ID ${request.sweetId} not found`);
    }
    
    sweet.quantity += request.quantity;
    return sweet;
  }

  sortSweets(sweets: Sweet[], sortBy: 'name' | 'price' | 'quantity', order: 'asc' | 'desc' = 'asc'): Sweet[] {
    return [...sweets].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
      }
      
      return order === 'desc' ? -comparison : comparison;
    });
  }
}