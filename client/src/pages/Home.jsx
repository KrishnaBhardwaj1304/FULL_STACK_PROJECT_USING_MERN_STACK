import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CategoryFilter } from '../components/CategoryFilter';
import { Sparkles, Award, Heart, Wheat, Flame, ArrowRight, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick view modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedDietary, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts({
        category: selectedCategory,
        dietary: selectedDietary,
        search: searchQuery,
      });
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load products. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                <Flame className="w-4 h-4 text-cinnamon animate-pulse" />
                <span>Wood-Fired & Oven Fresh Since 2012</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-bakery-950 leading-[1.15] tracking-tight">
                Freshly Baked Goodness,{' '}
                <span className="text-cinnamon italic underline decoration-amber-300 decoration-wavy decoration-2">
                  Every Single Morning.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Slow-fermented artisan sourdoughs, flaky golden French croissants, and handcrafted gourmet cakes made using 100% cultured butter and heirloom grains.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#menu"
                  className="w-full sm:w-auto px-8 py-4 bg-cinnamon hover:bg-bakery-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>Explore Fresh Bakes</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/cart"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-bakery-100 text-bakery-900 border border-bakery-300 font-bold rounded-2xl shadow-sm transition-all text-center"
                >
                  View Today's Basket
                </Link>
              </div>

              {/* Artisan Value Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-bakery-200/60 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="block font-serif text-xl sm:text-2xl font-bold text-bakery-900">36h</span>
                  <span className="text-xs text-stone-500 font-medium">Slow Fermentation</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block font-serif text-xl sm:text-2xl font-bold text-bakery-900">100%</span>
                  <span className="text-xs text-stone-500 font-medium">Pure Butter</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block font-serif text-xl sm:text-2xl font-bold text-bakery-900">0%</span>
                  <span className="text-xs text-stone-500 font-medium">Preservatives</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visuals */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] relative">
                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
                    alt="Artisan Pastries in Bakery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Overlay Badge */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-bakery-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-cinnamon font-bold uppercase tracking-wider block">Today's Special</span>
                        <h4 className="font-serif font-bold text-stone-900 text-sm">Spiced Cinnamon Brioche Roll</h4>
                      </div>
                      <span className="text-lg font-bold text-cinnamon font-serif">$4.50</span>
                    </div>
                  </div>
                </div>

                {/* Floating mini badge */}
                <div className="absolute -top-4 -left-4 bg-amber-500 text-bakery-950 font-bold p-3 rounded-2xl shadow-xl flex items-center gap-2 transform -rotate-6">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-xs">Baked at 6:00 AM</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Menu & Product Catalog Section */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-cinnamon">
            From Our Stone Hearth
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-900">
            Explore Our Handcrafted Menu
          </h2>
          <p className="text-stone-600 text-sm">
            Select from our fresh morning bakes, rustic whole loaves, and sweet pastry treats.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-10">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDietary={selectedDietary}
            onSelectDietary={setSelectedDietary}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 border border-bakery-200 animate-pulse p-4 space-y-3">
                <div className="bg-bakery-200 h-44 rounded-xl" />
                <div className="bg-bakery-200 h-4 w-3/4 rounded" />
                <div className="bg-bakery-200 h-3 w-full rounded" />
                <div className="bg-bakery-200 h-6 w-1/3 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-red-200 p-8 shadow-sm">
            <p className="text-red-600 font-semibold mb-2">{error}</p>
            <p className="text-stone-500 text-xs mb-4">Start the server using: npm run dev in server/</p>
            <button
              onClick={fetchProducts}
              className="px-5 py-2 bg-cinnamon text-white text-xs font-bold rounded-xl"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-bakery-200 p-8">
            <span className="text-4xl mb-3 block">🥖</span>
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">No baked goods found</h3>
            <p className="text-stone-500 text-xs mb-4">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDietary('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-bakery-800 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Artisan Story & Craft Section */}
      <section id="artisan-story" className="bg-bakery-100/70 border-y border-bakery-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Story Visuals */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80"
                  alt="Sourdough Loaf Bread"
                  className="rounded-2xl shadow-md object-cover h-56 w-full"
                />
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
                  alt="Golden Croissant"
                  className="rounded-2xl shadow-md object-cover h-40 w-full"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80"
                  alt="French Macaron Box"
                  className="rounded-2xl shadow-md object-cover h-40 w-full"
                />
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
                  alt="Chocolate Ganache Cake"
                  className="rounded-2xl shadow-md object-cover h-56 w-full"
                />
              </div>
            </div>

            {/* Story Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cinnamon tracking-wider uppercase">
                <Wheat className="w-4 h-4" />
                <span>Our Bread Making Heritage</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-950 leading-tight">
                We believe great baking cannot be rushed.
              </h2>

              <p className="text-stone-600 leading-relaxed text-sm">
                At Sweet Crust Bakery, our sourdough starters are nurtured continuously with pure water and unbleached stone-ground wheat. We respect the slow 36-hour cold ferment that allows complex flavors to blossom and makes our bread naturally gentle to digest.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-200/80 rounded-xl text-bakery-900 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Normandy Cultured Butter</h4>
                    <p className="text-xs text-stone-600">84% high butterfat giving our viennoiserie that unforgettable honeycomb crispness.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-200/80 rounded-xl text-bakery-900 mt-0.5">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Community Hearth</h4>
                    <p className="text-xs text-stone-600">Any unsold loaves at the end of each day are delivered to local community food pantries.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-cinnamon">
            Words From Our Regulars
          </span>
          <h2 className="font-serif text-3xl font-bold text-bakery-900">
            Loved By Bread & Pastry Lovers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-bakery-200/80 shadow-sm space-y-3">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-600 italic leading-relaxed">
              "The sourdough crust is perfection. Crisp on the outside, airy and delightfully tangy inside. Best bread in the entire county!"
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">Claire M.</span>
              <span className="text-[11px] text-stone-400">Verified Customer</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-bakery-200/80 shadow-sm space-y-3">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-600 italic leading-relaxed">
              "The Almond Pain au Chocolat is pure art. You can see the countless butter layers. Ordered for my birthday and everyone was stunned."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">David K.</span>
              <span className="text-[11px] text-stone-400">Pastry Enthusiast</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-bakery-200/80 shadow-sm space-y-3">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-600 italic leading-relaxed">
              "The online ordering is so smooth. I order our morning breakfast box the night before and it arrives fresh and warm right on schedule."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">Elena R.</span>
              <span className="text-[11px] text-stone-400">Regular Subscriber</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
