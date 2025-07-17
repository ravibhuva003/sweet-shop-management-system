import { useState, useCallback } from 'react';
import { Sweet, PurchaseRequest, RestockRequest, SearchFilters } from '@/types/sweet';
import { SweetShopService } from '@/services/sweetShop';
import { useToast } from '@/hooks/use-toast';

export const useSweetShop = () => {
  const [service] = useState(() => new SweetShopService());
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const { toast } = useToast();

  const refreshSweets = useCallback(() => {
    setSweets(service.getAllSweets());
  }, [service]);

  const addSweet = useCallback((sweetData: Omit<Sweet, 'id'>) => {
    try {
      const newSweet = service.addSweet(sweetData);
      refreshSweets();
      toast({
        title: "Sweet Added! 🍭",
        description: `${newSweet.name} has been added to your shop.`,
      });
      return newSweet;
    } catch (error) {
      toast({
        title: "Error Adding Sweet",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  }, [service, refreshSweets, toast]);

  const deleteSweet = useCallback((id: string) => {
    try {
      const sweet = service.getSweetById(id);
      const success = service.deleteSweet(id);
      if (success) {
        refreshSweets();
        toast({
          title: "Sweet Removed 🗑️",
          description: `${sweet?.name} has been removed from your shop.`,
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Error Removing Sweet",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  }, [service, refreshSweets, toast]);

  const updateSweet = useCallback((id: string, updates: Partial<Omit<Sweet, 'id'>>) => {
    try {
      const updated = service.updateSweet(id, updates);
      if (updated) {
        refreshSweets();
        toast({
          title: "Sweet Updated! ✨",
          description: `${updated.name} has been updated.`,
        });
      }
      return updated;
    } catch (error) {
      toast({
        title: "Error Updating Sweet",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }, [service, refreshSweets, toast]);

  const purchaseSweet = useCallback((request: PurchaseRequest) => {
    try {
      const sweet = service.purchaseSweet(request);
      refreshSweets();
      toast({
        title: "Purchase Successful! 🛒",
        description: `Purchased ${request.quantity}x ${sweet.name}. Remaining stock: ${sweet.quantity}`,
      });
      return sweet;
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  }, [service, refreshSweets, toast]);

  const restockSweet = useCallback((request: RestockRequest) => {
    try {
      const sweet = service.restockSweet(request);
      refreshSweets();
      toast({
        title: "Restocked Successfully! 📦",
        description: `Added ${request.quantity}x ${sweet.name}. New stock: ${sweet.quantity}`,
      });
      return sweet;
    } catch (error) {
      toast({
        title: "Restock Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  }, [service, refreshSweets, toast]);

  const searchSweets = useCallback((filters: SearchFilters) => {
    return service.searchSweets(filters);
  }, [service]);

  const sortSweets = useCallback((sortBy: 'name' | 'price' | 'quantity', order: 'asc' | 'desc' = 'asc') => {
    return service.sortSweets(sweets, sortBy, order);
  }, [service, sweets]);

  return {
    sweets,
    addSweet,
    deleteSweet,
    updateSweet,
    purchaseSweet,
    restockSweet,
    searchSweets,
    sortSweets,
    refreshSweets,
  };
};