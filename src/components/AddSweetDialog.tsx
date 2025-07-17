import { Sweet, SweetCategory } from '@/types/sweet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface AddSweetDialogProps {
  onAddSweet: (sweet: Omit<Sweet, 'id'>) => void;
  editSweet?: Sweet;
  onUpdateSweet?: (id: string, updates: Partial<Omit<Sweet, 'id'>>) => void;
}

const categories: { value: SweetCategory; label: string; emoji: string }[] = [
  { value: 'chocolate', label: 'Chocolate', emoji: '🍫' },
  { value: 'candy', label: 'Candy', emoji: '🍬' },
  { value: 'pastry', label: 'Pastry', emoji: '🥐' },
  { value: 'gummy', label: 'Gummy', emoji: '🐻' },
  { value: 'lollipop', label: 'Lollipop', emoji: '🍭' },
];

export const AddSweetDialog = ({ onAddSweet, editSweet, onUpdateSweet }: AddSweetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: editSweet?.name || '',
    category: editSweet?.category || 'chocolate' as SweetCategory,
    price: editSweet?.price || 0,
    quantity: editSweet?.quantity || 0,
    description: editSweet?.description || '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'chocolate',
      price: 0,
      quantity: 0,
      description: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editSweet && onUpdateSweet) {
      onUpdateSweet(editSweet.id, formData);
    } else {
      onAddSweet(formData);
    }
    
    setOpen(false);
    if (!editSweet) resetForm();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && !editSweet) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {editSweet ? (
          <Button variant="ghost" size="sm" className="h-auto p-0 text-primary hover:text-primary/80">
            Edit Sweet
          </Button>
        ) : (
          <Button className="bg-gradient-candy hover:opacity-90 text-white shadow-candy">
            <Plus className="h-4 w-4 mr-2" />
            Add New Sweet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            🍭 {editSweet ? 'Edit Sweet' : 'Add New Sweet'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Sweet Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Chocolate Chip Cookie"
              required
              className="border-border/50 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-foreground">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value: SweetCategory) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="border-border/50 focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-foreground">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0.00"
                required
                className="border-border/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-foreground">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                placeholder="0"
                required
                className="border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your sweet..."
              rows={3}
              className="border-border/50 focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-candy hover:opacity-90 text-white"
            >
              {editSweet ? 'Update Sweet' : 'Add Sweet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};