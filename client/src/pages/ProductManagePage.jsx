// client/src/pages/ProductManagePage.jsx

import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import productService from '../services/productService.js';
import { PlusCircle, Edit, Trash2, Loader, CheckCircle, XCircle } from 'lucide-react'; // Icons

const ProductManagePage = ({ onNavigate }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Null for no edit, object for editing

  // Form states for adding/editing product
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or not an admin after loading
    if (!loading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      onNavigate('home');
      return;
    }
    // Fetch products if user is an admin
    if (isAuthenticated && user && user.role === 'admin') {
      fetchProducts();
    }
  }, [isAuthenticated, user, loading, onNavigate]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const fetchedProducts = await productService.getProducts();
      setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : (fetchedProducts.products || []));
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorProducts(error.message || "Failed to fetch products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setCategory('');
    setCountInStock('');
    setFormMessage('');
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    setFormMessage('');
    setFormLoading(true);

    // Basic validation
    if (!name || !description || !price || !imageUrl || !category || countInStock === '') {
      setFormMessage('Please fill in all required fields.');
      setFormLoading(false);
      return;
    }

    const productData = {
      name,
      description,
      price: Number(price),
      imageUrl,
      category,
      countInStock: Number(countInStock),
      rating: editingProduct ? editingProduct.rating : 0, // Preserve rating/reviews on update, default 0 for new
      reviews: editingProduct ? editingProduct.reviews : 0,
    };

    try {
      if (editingProduct) {
        // Update existing product
        await productService.updateProduct(editingProduct._id, productData, user.token);
        setFormMessage('Product updated successfully!');
      } else {
        // Create new product
        await productService.createProduct(productData, user.token);
        setFormMessage('Product added successfully!');
      }
      resetForm();
      fetchProducts(); // Re-fetch list to show changes
    } catch (error) {
      console.error("Error saving product:", error);
      setFormMessage(error.message || 'Failed to save product. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId, user.token);
        setFormMessage('Product deleted successfully!');
        fetchProducts(); // Re-fetch list
      } catch (error) {
        console.error("Error deleting product:", error);
        setFormMessage(error.message || 'Failed to delete product.');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setImageUrl(product.imageUrl);
    setCategory(product.category);
    setCountInStock(product.countInStock);
    setIsAddingNew(false); // Ensure "Add New" form is not active visually
    setFormMessage('');
  };

  if (loading) { // Auth loading
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-indigo-700 text-2xl">
        <Loader size={30} className="animate-spin mr-3" /> Loading admin content...
      </div>
    );
  }

  // If not authenticated or not an admin
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4">
        You are not authorized to view this page.
        <button
          onClick={() => onNavigate('login')}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-800 mb-8 sm:mb-12 text-center">Manage Products</h2>

      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 md:p-10 mb-8 sm:mb-12 w-full max-w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <div className="flex gap-2">
            {!editingProduct && (
              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <PlusCircle size={20} />
                <span>{isAddingNew ? 'Hide Form' : 'Add New Product'}</span>
              </button>
            )}
            {editingProduct && (
              <button
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-gray-500 transition-colors duration-200 flex items-center space-x-2"
              >
                <XCircle size={20} />
                <span>Cancel Edit</span>
              </button>
            )}
          </div>
        </div>

        {(isAddingNew || editingProduct) && (
          <form onSubmit={handleCreateOrUpdateProduct} className="space-y-4 sm:space-y-6">
            {formMessage && (
              <div className={`p-3 sm:p-4 rounded-lg text-center ${formMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {formMessage}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
              <input
                type="text"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 sm:px-4 bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                id="description"
                rows="3"
                className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 sm:px-4 bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 sm:px-4 bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 sm:px-4 bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                <input
                  type="text"
                  id="category"
                  className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 sm:px-4 bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="countInStock" className="block text-gray-700 text-sm font-bold mb-2">Count In Stock</label>
                <input
                  type="number"
                  id="countInStock"
                  className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 sm:px-4 bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formLoading}
            >
              {formLoading ? <Loader size={20} className="animate-spin" /> : (editingProduct ? <Edit size={20} /> : <PlusCircle size={20} />)}
              <span>{formLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}</span>
            </button>
          </form>
        )}
      </div>

      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Existing Products</h3>
      {loadingProducts ? (
        <div className="flex items-center justify-center min-h-[200px] text-indigo-700 text-xl">
          <Loader size={24} className="animate-spin mr-2" /> Loading products...
        </div>
      ) : errorProducts ? (
        <div className="text-center text-red-600 text-lg">
          <XCircle size={24} className="inline-block mr-2" /> Error: {errorProducts}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">No products found. Add some using the form above!</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-2 sm:p-4">
          <table className="min-w-[700px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">ID</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Image</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Category</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Price</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-gray-500 truncate w-24">{product._id}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                         onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/E2E8F0/64748B?text=No+Img`; }}/>
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-gray-500">{product.category}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-gray-500">
                    ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-gray-500">{product.countInStock}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                      title="Edit Product"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManagePage;
