import { useState, useEffect } from 'react';
import { Sweet, SearchFilters } from '@/types/sweet';
import { useSweetShop } from '@/hooks/useSweetShop';
import { SweetCard } from '@/components/SweetCard';
import { AddSweetDialog } from '@/components/AddSweetDialog';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { Button } from '@/components/ui/button';
import { Store, Candy, TrendingUp, Package } from 'lucide-react';

const Index = () => {
  const {
    sweets,
    addSweet,
    deleteSweet,
    updateSweet,
    purchaseSweet,
    restockSweet,
    searchSweets,
    sortSweets,
    refreshSweets,
  } = useSweetShop();

  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  // Initialize with some sample data
  useEffect(() => {
    if (sweets.length === 0) {
      const sampleSweets = [
        {
          name: 'Dark Chocolate Bar',
          category: 'chocolate' as const,
          price: 3.50,
          quantity: 15,
          description: 'Rich 70% dark chocolate made with premium cocoa beans'
        },
        {
          name: 'Rainbow Gummy Bears',
          category: 'gummy' as const,
          price: 2.25,
          quantity: 30,
          description: 'Colorful fruit-flavored gummy bears in assorted flavors'
        },
        {
          name: 'Strawberry Lollipop',
          category: 'lollipop' as const,
          price: 1.50,
          quantity: 25,
          description: 'Sweet strawberry-flavored lollipop with a chewy center'
        },
        {
          name: 'Chocolate Croissant',
          category: 'pastry' as const,
          price: 4.75,
          quantity: 8,
          description: 'Buttery croissant filled with rich chocolate'
        },
        {
          name: 'Peppermint Candy Canes',
          category: 'candy' as const,
          price: 0.75,
          quantity: 50,
          description: 'Classic red and white striped peppermint candy canes'
        }
      ];

      sampleSweets.forEach(sweet => addSweet(sweet));
    }
  }, [sweets.length, addSweet]);

  useEffect(() => {
    refreshSweets();
  }, [refreshSweets]);

  useEffect(() => {
    setFilteredSweets(sweets);
  }, [sweets]);

  const handleFiltersChange = (filters: SearchFilters) => {
    const filtered = searchSweets(filters);
    setFilteredSweets(filtered);
  };

  const handleSort = (sortBy: 'name' | 'price' | 'quantity', order: 'asc' | 'desc') => {
    const sorted = sortSweets(sortBy, order);
    setFilteredSweets(sorted);
  };

  const handlePurchase = (sweetId: string, quantity: number) => {
    try {
      purchaseSweet({ sweetId, quantity });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleRestock = (sweetId: string, quantity: number) => {
    try {
      restockSweet({ sweetId, quantity });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
  };

  const handleUpdateSweet = (id: string, updates: Partial<Omit<Sweet, 'id'>>) => {
    updateSweet(id, updates);
    setEditingSweet(null);
  };

  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
  const totalItems = sweets.reduce((sum, sweet) => sum + sweet.quantity, 0);
  const lowStockItems = sweets.filter(sweet => sweet.quantity <= 5).length;

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-candy p-2 rounded-lg shadow-candy">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sweet Shop Management</h1>
                <p className="text-sm text-muted-foreground">Manage your candy store inventory</p>
              </div>
            </div>
            <AddSweetDialog onAddSweet={addSweet} />
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 p-6 shadow-sweet">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-mint p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Inventory Value</p>
                <p className="text-2xl font-bold text-foreground">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 p-6 shadow-sweet">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-orange p-2 rounded-lg">
                <Candy className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items in Stock</p>
                <p className="text-2xl font-bold text-foreground">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 p-6 shadow-sweet">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-candy p-2 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-foreground">{lowStockItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <SearchAndFilter
            onFiltersChange={handleFiltersChange}
            onSort={handleSort}
          />
        </div>

        {/* Sweet Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Your Sweet Inventory ({filteredSweets.length} items)
            </h2>
          </div>

          {filteredSweets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍭</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No sweets found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search filters or add some delicious sweets to your inventory!</p>
              <AddSweetDialog onAddSweet={addSweet} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSweets.map((sweet, index) => (
                <div
                  key={sweet.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-bounce-in"
                >
                  <SweetCard
                    sweet={sweet}
                    onPurchase={handlePurchase}
                    onRestock={handleRestock}
                    onEdit={handleEdit}
                    onDelete={deleteSweet}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Sweet Dialog */}
      {editingSweet && (
        <AddSweetDialog
          editSweet={editingSweet}
          onAddSweet={() => {}}
          onUpdateSweet={handleUpdateSweet}
        />
      )}
    </div>
  );
};

export default Index;
