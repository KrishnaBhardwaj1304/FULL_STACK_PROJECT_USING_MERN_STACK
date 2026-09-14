import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Clock, CheckCircle2, Flame, Truck, Store, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusSteps = ['Received', 'Baking', 'Out for Delivery', 'Completed'];

export const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Could not fetch your orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStepIndex = (status) => {
    if (status === 'Ready for Pickup') return 2;
    const index = statusSteps.indexOf(status);
    return index !== -1 ? index : 0;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-bakery-200 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-bakery-900">
            My Bakery Orders
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track your freshly baked items from our stone ovens to your doorstep
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cinnamon hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Order More Bakes
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-bakery-200 animate-pulse h-48" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl p-8 border border-red-200 text-center text-red-600 text-sm">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-bakery-200 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-bakery-100 flex items-center justify-center text-2xl">
            🥖
          </div>
          <h3 className="font-serif text-xl font-bold text-bakery-900">No Orders Placed Yet</h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            You haven't ordered any fresh pastries or breads yet. Check out today's morning bake menu!
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 bg-cinnamon hover:bg-bakery-800 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Explore Bakes
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.orderStatus);

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-bakery-200 shadow-sm space-y-6"
              >
                {/* Order Top Meta */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-bakery-100 pb-4">
                  <div>
                    <span className="font-mono font-bold text-cinnamon text-base bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-stone-400 ml-3">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bakery-100 text-bakery-900 capitalize flex items-center gap-1">
                      {order.fulfillmentType === 'delivery' ? <Truck className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                      {order.fulfillmentType}
                    </span>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Visual Order Progress Bar */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-bakery-200 w-full z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-cinnamon z-0 transition-all duration-500"
                      style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                    />

                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-cinnamon text-white shadow-md ring-4 ring-amber-100'
                                : 'bg-white border-2 border-bakery-300 text-stone-400'
                            }`}
                          >
                            {idx === 0 && '📋'}
                            {idx === 1 && '🔥'}
                            {idx === 2 && (order.fulfillmentType === 'pickup' ? '🛍️' : '🚚')}
                            {idx === 3 && '✨'}
                          </div>
                          <span
                            className={`text-[11px] font-semibold mt-1.5 transition-colors ${
                              isCompleted ? 'text-bakery-900 font-bold' : 'text-stone-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items in this order */}
                <div className="bg-bakery-50/60 rounded-2xl p-4 border border-bakery-100 divide-y divide-bakery-200/60 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <span className="font-bold text-stone-900">{item.name}</span>
                          <span className="text-stone-500 block">Quantity: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-stone-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Total & Notes */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-2">
                  <div className="text-stone-500">
                    Payment: <strong className="uppercase text-stone-800">{order.paymentMethod}</strong> • Status:{' '}
                    <strong className="text-emerald-700 uppercase">{order.paymentStatus}</strong>
                  </div>

                  <div className="text-right w-full sm:w-auto">
                    <span className="text-stone-500 mr-2">Grand Total:</span>
                    <span className="font-serif text-xl font-bold text-cinnamon">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
