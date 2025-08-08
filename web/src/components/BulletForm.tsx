import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import type { BulletItem } from '../types/api';

interface BulletFormProps {
  initialItems: BulletItem[];
  onSave: (items: Omit<BulletItem, 'id' | 'bullet_entry_id' | 'created_at'>[]) => void;
  onCancel: () => void;
}

interface FormItem {
  emoji: string;
  text: string;
  category: string;
}

const BulletForm: React.FC<BulletFormProps> = ({ 
  initialItems, 
  onSave, 
  onCancel 
}) => {
  const [items, setItems] = useState<FormItem[]>(() => 
    initialItems.length > 0
      ? initialItems.map(item => ({
          emoji: item.emoji,
          text: item.text,
          category: item.category || '',
        }))
      : [{ emoji: '', text: '', category: '' }]
  );

  const addItem = () => {
    if (items.length < 5) {
      setItems([...items, { emoji: '', text: '', category: '' }]);
    }
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof FormItem, value: string) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all items have emoji and text
    const validItems = items.filter(item => item.emoji.trim() && item.text.trim());
    
    if (validItems.length === 0) {
      alert('Please add at least one bullet point with emoji and text.');
      return;
    }

    // Convert to API format
    const formattedItems = validItems.map((item, index) => ({
      order_index: index,
      emoji: item.emoji.trim(),
      text: item.text.trim(),
      category: item.category.trim() || undefined,
    }));

    onSave(formattedItems);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {initialItems.length > 0 ? 'Edit' : 'Create'} Weekly Entry
        </h3>
        <p className="text-sm text-gray-500">
          Add up to 5 bullet points
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-shrink-0">
              <input
                type="text"
                placeholder="🎯"
                value={item.emoji}
                onChange={(e) => updateItem(index, 'emoji', e.target.value)}
                className="w-12 h-10 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                maxLength={2}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Describe your accomplishment..."
                value={item.text}
                onChange={(e) => updateItem(index, 'text', e.target.value)}
                className="input-field"
                maxLength={100}
              />
            </div>
            <div className="w-32">
              <input
                type="text"
                placeholder="Category"
                value={item.category}
                onChange={(e) => updateItem(index, 'category', e.target.value)}
                className="input-field"
                maxLength={20}
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        {items.length < 5 && (
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add another bullet point
          </button>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Entry
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulletForm;
