
import { Sweet } from '@/types/sweet';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweetId: string, quantity: number) => void;
  onRestock: (sweetId: string, quantity: number) => void;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: string) => void;
}

const categoryColors = {
  chocolate: 'bg-gradient-candy',
  candy: 'bg-gradient-orange',
  pastry: 'bg-gradient-mint',
  gummy: 'bg-accent',
  lollipop: 'bg-primary'
};

const categoryEmojis = {
  chocolate: '🍫',
  candy: '🍬',
  pastry: '🥐',
  gummy: '🐻',
  lollipop: '🍭'
};

export const SweetCard = ({ sweet, onPurchase, onRestock, onEdit, onDelete }: SweetCardProps) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(10);

  const isLowStock = sweet.quantity <= 5;
  const isOutOfStock = sweet.quantity === 0;

  return (
    <Card className="group hover:shadow-candy transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur-sm border-border/50 animate-bounce-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{categoryEmojis[sweet.category]}</span>
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {sweet.name}
              </h3>
            </div>
            <Badge 
              className={`${categoryColors[sweet.category]} text-white font-medium mb-2`}
            >
              {sweet.category}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(sweet)}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(sweet.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">
              ${sweet.price.toFixed(2)}
            </span>
            <div className="text-right">
              <div className={`text-sm font-medium ${isOutOfStock ? 'text-destructive' : isLowStock ? 'text-orange-500' : 'text-green-600'}`}>
                {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
              </div>
              <div className="text-xs text-muted-foreground">
                {sweet.quantity} remaining
              </div>
            </div>
          </div>

          {sweet.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {sweet.description}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col gap-3">
        {/* Purchase Section */}
        <div className="w-full">
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={purchaseQuantity}
              onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
              className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
              disabled={isOutOfStock}
            />
            <Button
              onClick={() => onPurchase(sweet.id, purchaseQuantity)}
              disabled={isOutOfStock || purchaseQuantity > sweet.quantity}
              className="bg-gradient-candy hover:opacity-90 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy
            </Button>
          </div>
        </div>

        {/* Restock Section */}
        <div className="w-full">
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(Number(e.target.value))}
              className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
            />
            <Button
              variant="outline"
              onClick={() => onRestock(sweet.id, restockQuantity)}
              className="border-primary/20 hover:bg-primary/5"
            >
              <Package className="h-4 w-4 mr-2" />
              Restock
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
