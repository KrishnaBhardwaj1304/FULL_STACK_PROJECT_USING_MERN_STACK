import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  ChefHat,
  ShoppingBag,
  Package,
  DollarSign,
  Flame,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'new-product'
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Pastries',
    imageUrl: '',
    dietaryTags: '',
    weightOrUnit: 'per piece',
    ingredients: '',
    featured: false,
  });

  const [actionNotice, setActionNotice] = useState(null);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const showNotice = (msg, type = 'success') => {
    setActionNotice({ msg, type });
    setTimeout(() => setActionNotice(null), 3500);
  };

  const fetchOrders = async (status = orderStatusFilter) => {
    try {
      setLoadingOrders(true);
      const data = await api.getAllOrders(status);
      setOrders(data);
    } catch (err) {
      console.error(err);
      showNotice(err.message || 'Failed to fetch orders', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      showNotice(err.message || 'Failed to fetch products', 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showNotice(`Order status updated to "${newStatus}"!`);
      // Update locally
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
      );
    } catch (err) {
      showNotice(err.message || 'Could not update status', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) return;
    try {
      await api.deleteProduct(id);
      showNotice(`"${name}" removed from bakery menu.`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      showNotice(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.imageUrl || !newProduct.description) {
      showNotice('Please complete all required fields.', 'error');
      return;
    }

    try {
      setSubmittingProduct(true);
      const created = await api.createProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
      });

      showNotice(`🎉 Successfully added "${created.name}" to the bakery menu!`);
      setProducts((prev) => [created, ...prev]);
      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: 'Pastries',
        imageUrl: '',
        dietaryTags: '',
        weightOrUnit: 'per piece',
        ingredients: '',
        featured: false,
      });
      setActiveTab('products');
    } catch (err) {
      showNotice(err.message || 'Failed to add product', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeBakingOrders = orders.filter((o) => ['Received', 'Baking'].includes(o.orderStatus)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-bakery-200 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shadow-inner">
            <ChefHat className="w-6 h-6 text-cinnamon" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl font-bold text-bakery-900">Baker Admin Portal</h1>
              <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Head Baker
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage oven batches, update customer orders, and add delicious bakery items
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchOrders();
              fetchProducts();
              showNotice('Dashboard refreshed!');
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-bakery-200 text-stone-700 hover:bg-bakery-100 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cinnamon" /> Refresh
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div
          className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm border ${
            actionNotice.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {actionNotice.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{actionNotice.msg}</span>
        </div>
      )}

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-bakery-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Total Orders</span>
            <span className="text-2xl font-bold font-serif text-stone-900">{orders.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-bakery-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Total Revenue</span>
            <span className="text-2xl font-bold font-serif text-stone-900">
              ${totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-bakery-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">In Oven / Prep</span>
            <span className="text-2xl font-bold font-serif text-stone-900">{activeBakingOrders}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-bakery-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Menu Items</span>
            <span className="text-2xl font-bold font-serif text-stone-900">{products.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-bakery-200 mb-8 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-cinnamon text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-bakery-100 border border-bakery-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-cinnamon text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-bakery-100 border border-bakery-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Menu Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('new-product')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'new-product'
              ? 'bg-cinnamon text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-bakery-100 border border-bakery-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Pastry</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Status filter bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {['All', 'Received', 'Baking', 'Ready for Pickup', 'Out for Delivery', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setOrderStatusFilter(status);
                  fetchOrders(status);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  orderStatusFilter === status
                    ? 'bg-bakery-900 text-white shadow-sm'
                    : 'bg-white border border-bakery-200 text-stone-600 hover:bg-bakery-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Orders list */}
          {loadingOrders ? (
            <div className="p-12 text-center text-xs text-stone-400">Loading incoming orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-bakery-200 text-center text-stone-500 text-sm">
              No orders found for this status.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-white rounded-2xl p-5 border border-bakery-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-bakery-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-cinnamon text-sm bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs text-stone-400 ml-2 font-medium">
                        Customer: <strong className="text-stone-800">{ord.customerInfo?.name}</strong> (
                        {ord.customerInfo?.phone})
                      </span>
                    </div>

                    {/* Change Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-500">Status:</span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="bg-bakery-50 border border-bakery-300 font-bold text-xs text-cinnamon rounded-xl px-3 py-1.5 focus:outline-none focus:border-cinnamon cursor-pointer"
                      >
                        <option value="Received">📋 Received</option>
                        <option value="Baking">🔥 Baking</option>
                        <option value="Ready for Pickup">🛍️ Ready for Pickup</option>
                        <option value="Out for Delivery">🚚 Out for Delivery</option>
                        <option value="Completed">✅ Completed</option>
                        <option value="Cancelled">❌ Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Items & Customer Address */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="md:col-span-2 space-y-1.5">
                      <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">
                        Baked Items:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {ord.items?.map((it, i) => (
                          <span
                            key={i}
                            className="bg-bakery-50 border border-bakery-200 px-2.5 py-1 rounded-lg text-stone-800"
                          >
                            <strong>{it.quantity}x</strong> {it.name} (${it.price.toFixed(2)})
                          </span>
                        ))}
                      </div>
                      {ord.specialInstructions && (
                        <p className="text-amber-800 bg-amber-50 p-2 rounded-lg italic mt-2">
                          Note: "{ord.specialInstructions}"
                        </p>
                      )}
                    </div>

                    <div className="bg-bakery-50/70 p-3 rounded-xl border border-bakery-100 space-y-1">
                      <span className="font-bold text-stone-700 block">
                        Fulfillment: <span className="capitalize">{ord.fulfillmentType}</span>
                      </span>
                      {ord.fulfillmentType === 'delivery' && (
                        <p className="text-stone-600">
                          {ord.customerInfo?.address?.street}, {ord.customerInfo?.address?.city} {ord.customerInfo?.address?.zipCode}
                        </p>
                      )}
                      <p className="text-stone-500 font-medium pt-1">
                        Payment: <span className="uppercase text-stone-800 font-bold">{ord.paymentMethod}</span> ({ord.paymentStatus})
                      </p>
                      <p className="font-serif font-bold text-base text-cinnamon pt-1">
                        Total: ${ord.totalAmount?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-500 font-medium">
              Showing all items currently live in the customer bakery menu
            </span>
            <button
              onClick={() => setActiveTab('new-product')}
              className="px-4 py-2 bg-cinnamon text-white text-xs font-bold rounded-xl shadow-sm hover:bg-bakery-800 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Pastry
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod._id}
                className="bg-white rounded-2xl p-4 border border-bakery-200 shadow-sm flex gap-4 items-center justify-between"
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-16 h-16 rounded-xl object-cover border border-bakery-100 shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <span className="text-[10px] font-bold uppercase text-cinnamon bg-amber-50 px-1.5 py-0.5 rounded">
                    {prod.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-stone-900 truncate mt-0.5">
                    {prod.name}
                  </h4>
                  <span className="font-bold text-xs text-stone-700">
                    ${prod.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteProduct(prod._id, prod.name)}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Delete from menu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ADD NEW BAKERY PRODUCT FORM */}
      {activeTab === 'new-product' && (
        <div className="max-w-2xl bg-white rounded-3xl p-8 border border-bakery-200 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-bakery-900 mb-1">
            Add a New Artisan Creation
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Fill in the details below to add a fresh baked item directly into your store's live menu.
          </p>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Cardamom Bun"
                  className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category *
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                >
                  <option value="Pastries">Pastries</option>
                  <option value="Breads">Breads</option>
                  <option value="Cakes">Cakes</option>
                  <option value="Cookies">Cookies</option>
                  <option value="Savory">Savory</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="4.50"
                  className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Unit / Weight
                </label>
                <input
                  type="text"
                  value={newProduct.weightOrUnit}
                  onChange={(e) => setNewProduct({ ...newProduct, weightOrUnit: e.target.value })}
                  placeholder="e.g. per piece / 500g"
                  className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Image URL *
              </label>
              <input
                type="url"
                required
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Description *
              </label>
              <textarea
                rows={3}
                required
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Tender cardamom-infused brioche knotted with butter and pearl sugar..."
                className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-xs focus:outline-none focus:border-cinnamon"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dietary Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newProduct.dietaryTags}
                  onChange={(e) => setNewProduct({ ...newProduct, dietaryTags: e.target.value })}
                  placeholder="Vegetarian, Organic"
                  className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ingredients (comma-separated)
                </label>
                <input
                  type="text"
                  value={newProduct.ingredients}
                  onChange={(e) => setNewProduct({ ...newProduct, ingredients: e.target.value })}
                  placeholder="Wheat Flour, Butter, Cardamom, Sugar"
                  className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="px-5 py-2.5 border border-bakery-300 rounded-xl text-xs font-semibold text-stone-600 hover:bg-bakery-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submittingProduct}
                className="px-6 py-2.5 bg-cinnamon hover:bg-bakery-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {submittingProduct ? 'Saving...' : 'Add to Menu'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
