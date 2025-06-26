import React, { useState, useEffect, createContext, useContext } from 'react';
import { Search, ShoppingCart, Home, Store, Package, ShoppingBag, User, LogOut, Settings, ListOrdered, X, Menu } from 'lucide-react';

// Import AuthContext and AuthProvider
import AuthContext, { AuthProvider } from './context/AuthContext.jsx';
// Import CartContext and CartProvider from the NEW dedicated file
import CartContext, { CartProvider } from './context/CartContext.jsx';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProductManagePage from './pages/ProductManagePage.jsx';
import ShippingPage from './pages/ShippingPage.jsx';
import PaymentMethodPage from './pages/PaymentMethodPage.jsx';
import PlaceOrderPage from './pages/PlaceOrderPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import ManageUsersPage from './pages/ManageUsersPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import SalesReportsPage from './pages/SalesReportsPage.jsx';

import productService from './services/productService.js';

// Product Card Component
const ProductCard = ({ product, onAddToCart, onViewDetail }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1">
    <div className="relative overflow-hidden">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover rounded-t-xl"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/94A3B8/FFFFFF?text=${product.name.split(' ').join('+')}`; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
        <button
          onClick={() => onViewDetail(product._id)}
          className="bg-white text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-indigo-50 transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
      <div className="flex flex-col mt-auto pt-3 border-t border-gray-100">
        <span className="text-2xl font-extrabold text-indigo-700 mb-3">
          ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
        >
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  </div>
);

// Mobile Sidebar Component
const MobileSidebar = ({ isOpen, onClose, onNavigate, currentPage }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const isAdmin = isAuthenticated && user && user.role === 'admin';

  const handleNavigateAndClose = (page) => {
    onNavigate(page);
    onClose();
  };

  const handleLogoutAndClose = () => {
    logout();
    onNavigate('home');
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-indigo-800 text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="p-4 border-b border-indigo-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">IndiaKart</h2>
          <button onClick={onClose} className="text-white hover:text-indigo-200">
            <X size={28} />
          </button>
        </div>

        {/* User Info */}
        {isAuthenticated && (
          <div className="p-4 border-b border-indigo-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-indigo-200">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex flex-col p-4 space-y-2">
          <button
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentPage === 'home' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
            }`}
            onClick={() => handleNavigateAndClose('home')}
          >
            <Home size={20} />
            <span className="text-lg">Home</span>
          </button>
          <button
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentPage === 'products' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
            }`}
            onClick={() => handleNavigateAndClose('products')}
          >
            <Store size={20} />
            <span className="text-lg">Products</span>
          </button>
          {isAuthenticated && (
            <button
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                currentPage === 'myOrders' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
              }`}
              onClick={() => handleNavigateAndClose('myOrders')}
            >
              <ListOrdered size={20} />
              <span className="text-lg">Orders</span>
            </button>
          )}
          {isAdmin && (
            <button
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                currentPage === 'adminDashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
              }`}
              onClick={() => handleNavigateAndClose('adminDashboard')}
            >
              <Settings size={20} />
              <span className="text-lg">Admin Dashboard</span>
            </button>
          )}
          <div className="border-t border-indigo-700 my-2"></div>
          {isAuthenticated ? (
            <>
              <button
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentPage === 'profile' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
                onClick={() => handleNavigateAndClose('profile')}
              >
                <User size={20} />
                <span className="text-lg">Profile</span>
              </button>
              <button
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-left bg-red-600 hover:bg-red-700 transition-colors"
                onClick={handleLogoutAndClose}
              >
                <LogOut size={20} />
                <span className="text-lg">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentPage === 'login' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
                onClick={() => handleNavigateAndClose('login')}
              >
                <User size={20} />
                <span className="text-lg">Login</span>
              </button>
              <button
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentPage === 'register' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
                onClick={() => handleNavigateAndClose('register')}
              >
                <User size={20} />
                <span className="text-lg">Register</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

// Header Component - Fixed for single line navigation
const Header = ({ currentPage, onNavigate, searchQuery, setSearchQuery, onToggleMobileMenu }) => {
  const { cartItems } = useContext(CartContext);
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const isAdmin = isAuthenticated && user && user.role === 'admin';

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden text-white p-2 rounded-md hover:bg-indigo-800 transition-colors"
          onClick={onToggleMobileMenu}
        >
          <Menu size={28} />
        </button>

        {/* Logo */}
        <h1
          className="text-2xl sm:text-3xl font-extrabold cursor-pointer hover:text-indigo-200 transition-colors min-w-max"
          onClick={() => onNavigate('home')}
        >
          IndiaKart
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 mx-4">
          <button
            className={`flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-full transition-colors border-2 min-w-max ${
              currentPage === 'home'
                ? 'bg-white text-indigo-800 border-indigo-700 shadow'
                : 'bg-indigo-700 text-white border-transparent hover:bg-indigo-800'
            }`}
            onClick={() => onNavigate('home')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          <button
            className={`flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-full transition-colors border-2 min-w-max ${
              currentPage === 'products'
                ? 'bg-white text-indigo-800 border-indigo-700 shadow'
                : 'bg-indigo-700 text-white border-transparent hover:bg-indigo-800'
            }`}
            onClick={() => onNavigate('products')}
          >
            <Store size={20} />
            <span>Products</span>
          </button>
          {isAuthenticated && (
            <button
              className={`flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-full transition-colors border-2 min-w-max ${
                currentPage === 'myOrders'
                  ? 'bg-white text-indigo-800 border-indigo-700 shadow'
                  : 'bg-indigo-700 text-white border-transparent hover:bg-indigo-800'
              }`}
              onClick={() => onNavigate('myOrders')}
            >
              <ListOrdered size={20} />
              <span>Orders</span>
            </button>
          )}
          {isAdmin && (
            <button
              className={`flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-full transition-colors border-2 min-w-max ${
                currentPage === 'adminDashboard'
                  ? 'bg-white text-indigo-800 border-indigo-700 shadow'
                  : 'bg-indigo-700 text-white border-transparent hover:bg-indigo-800'
              }`}
              onClick={() => onNavigate('adminDashboard')}
            >
              <Settings size={20} />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Search and User Controls */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 md:flex-none justify-end">
          {/* Search Bar */}
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-indigo-800 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300" />
          </div>

          {/* Cart Button */}
          <button
            className="relative p-3 rounded-full bg-indigo-800 hover:bg-indigo-700 transition-colors"
            onClick={() => onNavigate('cart')}
          >
            <ShoppingCart size={24} />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-indigo-900">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Authentication Links (Desktop Only) */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-indigo-100 hidden lg:inline-block">Hello, {user.name.split(' ')[0]}</span>
              <button
                className="relative p-3 rounded-full bg-indigo-800 hover:bg-indigo-700 transition-colors group"
                onClick={() => onNavigate('profile')}
              >
                <User size={24} />
                <span className="absolute left-1/2 -bottom-8 -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Profile
                </span>
              </button>
              <button
                className="relative p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors group"
                onClick={handleLogout}
              >
                <LogOut size={24} />
                <span className="absolute left-1/2 -bottom-8 -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Logout
                </span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <button
                className={`flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-full transition-colors min-w-max ${
                  currentPage === 'login' ? 'bg-indigo-800 text-white' : 'bg-white text-indigo-700 hover:bg-indigo-700 hover:text-white'
                }`}
                onClick={() => onNavigate('login')}
              >
                <User size={20} />
                <span>Login</span>
              </button>
              <button
                className={`flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-full transition-colors min-w-max ${
                  currentPage === 'register' ? 'bg-indigo-800 text-white' : 'bg-white text-indigo-700 hover:bg-indigo-700 hover:text-white'
                }`}
                onClick={() => onNavigate('register')}
              >
                <User size={20} />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-gray-800 text-gray-300 py-10 mt-20">
    <div className="container mx-auto px-2 sm:px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 className="text-xl font-bold text-white mb-4">IndiaKart</h4>
        <p className="text-sm">Your one-stop shop for all your needs. Quality products, excellent service.</p>
      </div>
      <div>
        <h4 className="text-xl font-bold text-white mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xl font-bold text-white mb-4">Contact Us</h4>
        <p className="text-sm"> Eluru <br />Tech City, TX 78901</p>
        <p className="text-sm mt-2">Email:muralinaga826@gmail.com<br />Phone:9063453458</p>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
      © {new Date().getFullYear()} IndiaKart. All rights reserved.
    </div>
  </footer>
);

// Homepage Component
const HomePage = ({ products, onAddToCart, onViewDetail, onNavigate, searchQuery }) => {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredProducts = filteredProducts.slice(0, 4);
  return (
    <div className="container mx-auto px-6 py-12">
      <section className="relative rounded-2xl p-10 md:p-16 text-center shadow-xl mb-16 overflow-hidden" style={{ minHeight: 350 }}>
      <ProductImageCarousel products={products} />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-white drop-shadow-lg">
          Discover Your Next Favorite Product
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white drop-shadow">
          Explore our curated collection of high-quality electronics, apparel, and accessories.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="bg-white text-indigo-700 px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-indigo-50 hover:scale-105 transition-all duration-300"
        >
          Shop Now
        </button>
      </div>
    </section>
      <section className="mb-16">
        <h3 className="text-4xl font-bold text-gray-800 mb-10 text-center">Featured Products</h3>
        {featuredProducts.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No featured products to display at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('products')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
          >
            <Package size={24} />
            <span>View All Products</span>
          </button>
        </div>
      </section>
      <section>
        <h3 className="text-4xl font-bold text-gray-800 mb-10 text-center">Shop by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-100 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <h4 className="text-2xl font-bold text-blue-800 mb-3">Electronics</h4>
            <p className="text-blue-700">Latest gadgets and tech innovations.</p>
          </div>
          <div className="bg-green-100 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <h4 className="text-2xl font-bold text-green-800 mb-3">Apparel</h4>
            <p className="text-green-700">Fashionable clothing for every season.</p>
          </div>
          <div className="bg-purple-100 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <h4 className="text-2xl font-bold text-purple-800 mb-3">Accessories</h4>
            <p className="text-purple-700">Add the perfect touch to your style.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Product Listing Page Component
const ProductListingPage = ({ products, onAddToCart, onViewDetail, searchQuery, setSearchQuery }) => {
  const [sortOrder, setSortOrder] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product =>
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  ).sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return a.price - b.price;
    }
    if (sortOrder === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-5xl font-extrabold text-gray-800 mb-12 text-center">Our Products</h2>

      <div className="flex flex-wrap justify-between items-center bg-gray-50 rounded-xl p-6 shadow-sm mb-10">
        <div className="flex-grow flex items-center space-x-4 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-wrap space-x-4 items-center">
          <label htmlFor="category" className="font-semibold text-gray-700">Category:</label>
          <select
            id="category"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <label htmlFor="sort" className="font-semibold text-gray-700 ml-4">Sort by:</label>
          <select
            id="sort"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-600 text-xl py-20">
          No products found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Product Detail Page Component
const ProductDetailPage = ({ productId, products, onAddToCart, onNavigate }) => {
  const product = products.find((p) => p._id === productId);

  useEffect(() => {
  }, [productId]);

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-20 text-center text-xl text-gray-600">
        Product not found.
        <button
          onClick={() => onNavigate('products')}
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/2 flex flex-col items-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-w-md h-auto object-contain rounded-xl shadow-md mb-6"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x600/94A3B8/FFFFFF?text=${product.name.split(' ').join('+')}`; }}
          />
          <div className="flex space-x-3">
            <img src={product.imageUrl} alt="thumbnail" className="w-20 h-20 object-cover rounded-lg border-2 border-indigo-400 cursor-pointer" />
            <img src={`https://placehold.co/80x80/E2E8F0/64748B?text=View+2`} alt="thumbnail" className="w-20 h-20 object-cover rounded-lg border-2 border-transparent hover:border-indigo-400 cursor-pointer" />
            <img src={`https://placehold.co/80x80/E2E8F0/64748B?text=View+3`} alt="thumbnail" className="w-20 h-20 object-cover rounded-lg border-2 border-transparent hover:border-indigo-400 cursor-pointer" />
          </div>
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">{product.name}</h2>
          <p className="text-indigo-600 text-2xl font-bold mb-4">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center mb-6 text-gray-700">
            <span className="text-yellow-500 flex items-center">
              {'⭐'.repeat(Math.floor(product.rating))}
              {product.rating % 1 !== 0 && '⭐'}
            </span>
            <span className="ml-2 text-sm">({product.reviews} reviews)</span>
          </div>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">{product.description}</p>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Product Features:</h3>
          <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
            {product.details && product.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
          <div className="flex items-center space-x-4 mb-10">
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300"
            >
              <ShoppingBag size={24} />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="flex items-center space-x-3 bg-gray-200 text-gray-800 px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-300 hover:scale-105 transition-all duration-300"
            >
              <Package size={24} />
              <span>Continue Shopping</span>
            </button>
          </div>
          <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like:</h3>
            <div className="grid grid-cols-2 gap-4">
              {products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 2).map(related => (
                    <div key={related._id} className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
                      <img src={related.imageUrl} alt={related.name} className="w-24 h-24 object-cover rounded-lg mb-3" />
                      <p className="font-semibold text-gray-800 text-md truncate w-full">{related.name}</p>
                      <p className="text-indigo-600 font-bold">₹{related.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      <button
                        onClick={() => onNavigate('productDetail', related._id)}
                        className="mt-3 text-sm text-indigo-600 hover:underline"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // Cart Page Component
    const CartPage = ({ onNavigate }) => {
      const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = subtotal > 0 ? 10.00 : 0;
      const taxRate = 0.08;
      const tax = subtotal * taxRate;
      const total = subtotal + shipping + tax;

      const handleCheckout = () => {
        if (cartItems.length === 0) {
            const messageBox = document.createElement('div');
            messageBox.className = "fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50";
            messageBox.innerHTML = `
                <div class="bg-white rounded-lg p-8 shadow-xl text-center">
                    <p class="text-xl font-semibold text-gray-800 mb-4">Your cart is empty!</p>
                    <p class="text-gray-600 mb-6">Please add items before proceeding to checkout.</p>
                    <button class="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors" onclick="this.closest('.fixed').remove()">OK</button>
                </div>
            `;
            document.body.appendChild(messageBox);
            return;
        }
        onNavigate('shipping');
      };

      const QuantityControl = ({ item }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
          >
            -
          </button>
          <span className="font-semibold text-lg">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            +
          </button>
        </div>
      );

      return (
        <div className="container mx-auto px-6 py-12">
          <h2 className="text-5xl font-extrabold text-gray-800 mb-12 text-center">Your Shopping Cart</h2>
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-10 text-center flex flex-col items-center">
              <ShoppingCart size={80} className="text-gray-400 mb-6" />
              <p className="text-gray-600 text-2xl font-semibold mb-6">Your cart is empty!</p>
              <button
                onClick={() => onNavigate('products')}
                className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 space-y-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg mr-6 shadow-sm"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/94A3B8/FFFFFF?text=${item.name.split(' ').join('+')}`; }}
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">Price: ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      <div className="flex items-center mt-2">
                        <QuantityControl item={item} />
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-bold text-indigo-700 mb-2">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1 text-sm"
                      >
                        <X size={16} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-6 border-t">
                    <button
                        onClick={() => onNavigate('products')}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                    >
                        Continue Shopping
                    </button>
                    <button
                        onClick={clearCart}
                        className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                    >
                        Clear Cart
                    </button>
                </div>
              </div>
              <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h3>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-semibold">₹{shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({taxRate * 100}%):</span>
                    <span className="font-semibold">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-extrabold text-indigo-700 border-t pt-4 mt-4">
                    <span>Total:</span>
                    <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="mt-8 w-full bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <ShoppingBag size={24} />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };

    // Product Image Carousel Component
    const ProductImageCarousel = ({ products }) => {
      const images = products
        .filter(p => p.imageUrl)
        .slice(0, 5)
        .map(p => ({ src: p.imageUrl, alt: p.name }));

      const [current, setCurrent] = useState(0);

      useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
          setCurrent((prev) => (prev + 1) % images.length);
        }, 2500);
        return () => clearInterval(interval);
      }, [images.length]);

      if (images.length === 0) return null;

      return (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden rounded-2xl">
          <img
            src={images[current].src}
            alt={images[current].alt}
            className="w-full h-full object-cover object-center transition-all duration-700"
            style={{ minHeight: 350, maxHeight: 400 }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      );
    };

    // Helper component to render the correct page based on current page state
    function PageContent({
      currentPage,
      products,
      selectedProductId,
      loading,
      error,
      navigateTo,
      setLoading,
      setError,
      setProducts,
      searchQuery,
      setSearchQuery,
    }) {
      const { addToCart } = useContext(CartContext);

      if (loading) {
        return (
          <div className="text-center py-20 text-indigo-700 text-3xl font-semibold">
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
            Loading products...
          </div>
        );
      }
      if (error) {
        return (
          <div className="text-center py-20 text-red-600 text-xl">
            Error loading products: {error}
            <p className="mt-4 text-gray-700">Please ensure your backend server is running on `http://localhost:5000` and accessible.</p>
            <button
              onClick={() => { setLoading(true); setError(null); }}
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        );
      }

      switch (currentPage) {
        case 'home':
          return (
            <HomePage
              products={products}
              onAddToCart={addToCart}
              onViewDetail={(id) => navigateTo('productDetail', id)}
              onNavigate={navigateTo}
              searchQuery={searchQuery}
            />
          );
        case 'products':
          return (
            <ProductListingPage
              products={products}
              onAddToCart={addToCart}
              onViewDetail={(id) => navigateTo('productDetail', id)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          );
        case 'productDetail':
          return (
            <ProductDetailPage
              productId={selectedProductId}
              products={products}
              onAddToCart={addToCart}
              onNavigate={navigateTo}
            />
          );
        case 'cart':
          return <CartPage onNavigate={navigateTo} />;
        case 'login':
            return <LoginPage onNavigate={navigateTo} />;
        case 'register':
            return <RegisterPage onNavigate={navigateTo} />;
        case 'profile':
            return <ProfilePage onNavigate={navigateTo} />;
        case 'adminDashboard':
            return <AdminDashboard onNavigate={navigateTo} />;
        case 'adminProducts':
            return <ProductManagePage onNavigate={navigateTo} />;
        case 'shipping':
            return <ShippingPage onNavigate={navigateTo} />;
        case 'payment':
            return <PaymentMethodPage onNavigate={navigateTo} />;
        case 'placeOrder':
            return <PlaceOrderPage onNavigate={navigateTo} />;
        case 'orderDetail':
            return <OrderDetailPage orderId={selectedProductId} onNavigate={navigateTo} />;
        case 'myOrders':
            return <OrderHistoryPage onNavigate={navigateTo} />;
        case 'adminUsers':
            return <ManageUsersPage />;
        case 'adminOrders':
            return <AdminOrdersPage onNavigate={navigateTo} />;
        case 'adminReports':
            return <SalesReportsPage />;
        default:
          return (
            <div className="text-center py-20">
              <h2 className="text-4xl text-red-500">404 - Page Not Found</h2>
              <button
                onClick={() => navigateTo('home')}
                className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>
          );
      }
    }

    // Main App Component
    export default function App() {
      const [currentPage, setCurrentPage] = useState('home');
      const [selectedProductId, setSelectedProductId] = useState(null);
      const [products, setProducts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [searchQuery, setSearchQuery] = useState('');
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

      const navigateTo = (page, productId = null) => {
        setCurrentPage(page);
        setSelectedProductId(productId);
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
      };

      useEffect(() => {
        const fetchAllProducts = async () => {
          setLoading(true);
          setError(null);
          try {
            const data = await productService.getProducts();
            setProducts(Array.isArray(data) ? data : (data.products || []));
          } catch (err) {
            setError(err.message);
            console.error("Failed to fetch products:", err);
          } finally {
            setLoading(false);
          }
        };

        fetchAllProducts();
      }, []);

      return (
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
              <Header
                currentPage={currentPage}
                onNavigate={navigateTo}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
              <MobileSidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onNavigate={navigateTo}
                currentPage={currentPage}
              />
              <main className="flex-grow py-8">
                <PageContent
                  currentPage={currentPage}
                  products={products}
                  selectedProductId={selectedProductId}
                  loading={loading}
                  error={error}
                  navigateTo={navigateTo}
                  setLoading={setLoading}
                  setError={setError}
                  setProducts={setProducts}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      );
    }
