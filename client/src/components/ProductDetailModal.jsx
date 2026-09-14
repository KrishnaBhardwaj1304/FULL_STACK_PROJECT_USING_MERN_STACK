import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Star, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-bakery-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full text-stone-700 hover:text-stone-900 shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-bakery-100 overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-bakery-900/85 text-amber-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Rating & Review */}
              <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold mb-2">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
                <span className="text-stone-400 font-normal">({product.reviewsCount || 24} reviews)</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl font-bold text-bakery-900 mb-2 leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-cinnamon font-serif">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-stone-500 italic">
                  {product.weightOrUnit || 'per piece'}
                </span>
              </div>

              {/* Description */}
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Dietary Tags */}
              {product.dietaryTags && product.dietaryTags.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Dietary Highlights:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.dietaryTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-medium"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients List */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Artisan Ingredients:
                  </span>
                  <p className="text-xs text-stone-600 italic">
                    {product.ingredients.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-bakery-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-bakery-900">Quantity</span>
                <div className="flex items-center border border-bakery-300 rounded-xl overflow-hidden bg-bakery-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-bakery-200 text-stone-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 hover:bg-bakery-200 text-stone-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedNotice}
                className={`w-full py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                  addedNotice
                    ? 'bg-emerald-600 text-white'
                    : 'bg-bakery-800 hover:bg-cinnamon text-bakery-50 hover:shadow-xl'
                }`}
              >
                {addedNotice ? (
                  <>
                    <CheckCircle className="w-5 h-5" /> Added to Basket!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add {(quantity * product.price).toFixed(2)} to Basket
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
