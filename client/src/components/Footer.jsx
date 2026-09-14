import React from 'react';
import { Heart, MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-bakery-900 text-bakery-100 mt-20 border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🥐</span>
              <span className="font-serif text-2xl font-bold text-amber-200">Sweet Crust</span>
            </div>
            <p className="text-bakery-200 text-sm leading-relaxed">
              Handcrafting daily rustic breads, buttery viennoiserie, and celebratory cakes with 
              locally sourced grains and traditional slow fermentation.
            </p>
            <div className="flex items-center space-x-3 text-amber-400 pt-2">
              <a href="#instagram" className="p-2 bg-bakery-800 rounded-full hover:bg-cinnamon hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="p-2 bg-bakery-800 rounded-full hover:bg-cinnamon hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Hours & Hearth */}
          <div className="space-y-3 text-sm">
            <h4 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Baking Hours
            </h4>
            <ul className="space-y-2 text-bakery-200">
              <li className="flex justify-between">
                <span>Mon – Fri:</span>
                <span className="font-medium text-amber-300">7:00 AM – 6:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-medium text-amber-300">7:30 AM – 7:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-medium text-amber-300">8:00 AM – 4:00 PM</span>
              </li>
            </ul>
            <p className="text-xs text-amber-400/80 pt-2 italic">
              *Fresh sourdough loaves emerge hot from stone ovens daily at 8:00 AM & 1:00 PM.
            </p>
          </div>

          {/* Column 3: Contact & Hearth Location */}
          <div className="space-y-3 text-sm">
            <h4 className="font-serif text-lg font-bold text-amber-100">Visit Our Kitchen</h4>
            <div className="space-y-2.5 text-bakery-200">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>124 Flour Street, Old Town Bakery District, CA 93301</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+1 (555) 019-2834</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>hello@sweetcrustbakery.com</span>
              </p>
            </div>
          </div>

          {/* Column 4: Quick Links */}
          <div className="space-y-3 text-sm">
            <h4 className="font-serif text-lg font-bold text-amber-100">Quick Navigation</h4>
            <ul className="space-y-2 text-bakery-200">
              <li>
                <Link to="/" className="hover:text-amber-300 transition-colors">Our Bakes & Menu</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-300 transition-colors">Shopping Basket</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-300 transition-colors">Customer & Baker Login</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-amber-300 transition-colors">Order Tracking</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-bakery-800/80 text-center text-xs text-bakery-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Sweet Crust Bakery. Baked with pure flour, water, salt & passion.</p>
          <p className="flex items-center gap-1">
            Built with MERN Stack <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" /> & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
