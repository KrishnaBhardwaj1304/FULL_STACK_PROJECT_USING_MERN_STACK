import React, { useState } from 'react';
import { Plus, Check, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 1200);
  };

  return (
    <div
      onClick={() => onQuickView && onQuickView(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-bakery-200/80 hover:border-bakery-400 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bakery-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-bakery-900/80 backdrop-blur-sm text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {product.category}
        </span>

        {/* Dietary Tag if available */}
        {product.dietaryTags && product.dietaryTags.length > 0 && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-cinnamon text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
            {product.dietaryTags[0]}
          </span>
        )}

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-bakery-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-bakery-900 text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1.5 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating and Weight */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <div className="flex items-center gap-1 text-amber-600 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
            <span className="text-stone-400 font-normal">({product.reviewsCount || 24})</span>
          </div>
          <span className="text-stone-400 italic">{product.weightOrUnit || 'per piece'}</span>
        </div>

        {/* Product Title */}
        <h3 className="font-serif text-lg font-bold text-bakery-900 group-hover:text-cinnamon transition-colors line-clamp-1 mb-1.5">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed mb-4 flex-grow">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-bakery-100 mt-auto">
          <div>
            <span className="text-xs text-stone-400 block font-medium">Price</span>
            <span className="text-xl font-bold text-cinnamon font-serif">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isAdding}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
              isAdding
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-bakery-800 hover:bg-cinnamon text-bakery-50 hover:shadow-md active:scale-95'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4" /> Added!
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add to Basket
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
