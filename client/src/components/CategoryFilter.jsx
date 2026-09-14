import React from 'react';
import { Search, Sparkles, Filter, X } from 'lucide-react';

const categories = [
  { name: 'All', icon: '✨' },
  { name: 'Pastries', icon: '🥐' },
  { name: 'Breads', icon: '🥖' },
  { name: 'Cakes', icon: '🎂' },
  { name: 'Cookies', icon: '🍪' },
  { name: 'Savory', icon: '🥨' },
];

const dietaryOptions = ['All', 'Vegan', 'Gluten-Free', 'Vegetarian', 'Organic'];

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedDietary,
  onSelectDietary,
}) => {
  return (
    <div className="space-y-6">
      {/* Search and Dietary Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bakery-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search croissants, sourdough..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-bakery-200 rounded-full text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-bakery-500 focus:ring-2 focus:ring-bakery-300/40 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dietary Preferences Select */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-cinnamon" /> Diet:
          </span>
          {dietaryOptions.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectDietary(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                selectedDietary === tag
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-white border border-bakery-200 text-stone-600 hover:bg-bakery-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bakery Category Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 shrink-0 shadow-sm ${
                isActive
                  ? 'bg-cinnamon text-white shadow-md scale-105'
                  : 'bg-white hover:bg-bakery-100 text-stone-700 border border-bakery-200 hover:border-bakery-300'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
