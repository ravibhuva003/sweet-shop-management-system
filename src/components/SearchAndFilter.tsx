import { SearchFilters, SweetCategory } from '@/types/sweet';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface SearchAndFilterProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onSort: (sortBy: 'name' | 'price' | 'quantity', order: 'asc' | 'desc') => void;
}

const categories: { value: SweetCategory; label: string; emoji: string }[] = [
  { value: 'chocolate', label: 'Chocolate', emoji: '🍫' },
  { value: 'candy', label: 'Candy', emoji: '🍬' },
  { value: 'pastry', label: 'Pastry', emoji: '🥐' },
  { value: 'gummy', label: 'Gummy', emoji: '🐻' },
  { value: 'lollipop', label: 'Lollipop', emoji: '🍭' },
];

export const SearchAndFilter = ({ onFiltersChange, onSort }: SearchAndFilterProps) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const handleSort = () => {
    onSort(sortBy, sortOrder);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search & Filter
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by Name */}
        <div className="space-y-2">
          <Label htmlFor="search-name" className="text-sm font-medium text-foreground">
            Search by Name
          </Label>
          <Input
            id="search-name"
            placeholder="Sweet name..."
            value={filters.name || ''}
            onChange={(e) => updateFilters({ name: e.target.value || undefined })}
            className="border-border/50 focus:border-primary"
          />
        </div>

        {/* Filter by Category */}
        <div className="space-y-2">
          <Label htmlFor="filter-category" className="text-sm font-medium text-foreground">
            Category
          </Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => updateFilters({ 
              category: value === 'all' ? undefined : value as SweetCategory 
            })}
          >
            <SelectTrigger className="border-border/50 focus:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <span className="flex items-center gap-2">
                    {category.emoji} {category.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Min Price ($)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={filters.minPrice || ''}
            onChange={(e) => updateFilters({ 
              minPrice: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="border-border/50 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Max Price ($)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="100.00"
            value={filters.maxPrice || ''}
            onChange={(e) => updateFilters({ 
              maxPrice: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="border-border/50 focus:border-primary"
          />
        </div>
      </div>

      {/* Sorting */}
      <div className="flex flex-wrap items-end gap-4 pt-4 border-t border-border/50">
        <div className="space-y-2 flex-1 min-w-[140px]">
          <Label className="text-sm font-medium text-foreground">
            Sort by
          </Label>
          <Select value={sortBy} onValueChange={(value: 'name' | 'price' | 'quantity') => setSortBy(value)}>
            <SelectTrigger className="border-border/50 focus:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="quantity">Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex-1 min-w-[140px]">
          <Label className="text-sm font-medium text-foreground">
            Order
          </Label>
          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
            <SelectTrigger className="border-border/50 focus:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSort}
          className="bg-gradient-mint hover:opacity-90 text-foreground"
        >
          <Filter className="h-4 w-4 mr-2" />
          Apply Sort
        </Button>
      </div>
    </div>
  );
};