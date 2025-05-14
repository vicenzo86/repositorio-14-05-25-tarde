
import React from 'react';
import { Button } from '@/components/ui/button';
import { CategoryOption } from '@/types/construction';

interface CategoryScrollerProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryScroller: React.FC<CategoryScrollerProps> = ({ 
  categories, 
  selectedCategory,
  onSelectCategory 
}) => {
  return (
    <div className="category-scroller flex items-center space-x-2 overflow-x-auto py-2 px-1">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          className="flex-shrink-0 rounded-full px-4"
          onClick={() => onSelectCategory(category.id)}
        >
          <span className="mr-2">{category.icon}</span>
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryScroller;
