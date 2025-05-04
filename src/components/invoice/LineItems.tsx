
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";

export type LineItem = {
  description: string;
  amount: string;
};

interface LineItemsProps {
  items: LineItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItemDescription: (index: number, value: string) => void;
  onUpdateItemAmount: (index: number, value: string) => void;
}

const LineItems = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItemDescription,
  onUpdateItemAmount
}: LineItemsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Line Items</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onAddItem}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Item
        </Button>
      </div>
      
      {items.map((item, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="flex-1">
            <Input
              placeholder="Item description"
              value={item.description}
              onChange={(e) => onUpdateItemDescription(index, e.target.value)}
              required
            />
          </div>
          <div className="w-32">
            <Input
              type="number"
              placeholder="Amount"
              value={item.amount}
              onChange={(e) => onUpdateItemAmount(index, e.target.value)}
              required
            />
          </div>
          {items.length > 1 && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onRemoveItem(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default LineItems;
