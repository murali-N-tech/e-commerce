import React, { useState, useEffect, useContext } from 'react';
// IMPORTANT: Please verify this path. If this component is at 'client/src/pages/ProductManagePage.jsx',
// then 'AuthContext.jsx' should be located at 'client/src/context/AuthContext.jsx'.
// Double-check the exact file name and case-sensitivity on your file system.
import AuthContext from '../context/AuthContext.jsx';
// IMPORTANT: Please verify this path. If this component is at 'client/src/pages/ProductManagePage.jsx',
// then 'productService.js' should be located at 'client/src/services/productService.js'.
// Double-check the exact file name and case-sensitivity on your file system.
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

  // State for delete confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated or not an admin after auth loading completes
    if (!loading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      onNavigate('home');
      return;
    }
    // Fetch products if user is authenticated and is an admin
    if (isAuthenticated && user && user.role === 'admin') {
      fetchProducts();
    }
  }, [isAuthenticated, user, loading, onNavigate]);

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const fetchedProducts = await productService.getProducts();
      // Ensure fetchedProducts is an array; handle cases where it might be an object with a 'products' key
      setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : (fetchedProducts.products || []));
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorProducts(error.message || "Failed to fetch products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Resets the form fields and states related to adding/editing
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

  // Handles creating or updating a product
  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    setFormMessage('');
    setFormLoading(true);

    // Basic validation for form fields
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
      // Preserve rating/reviews on update; default to 0 for new products
      rating: editingProduct ? editingProduct.rating : 0,
      numReviews: editingProduct ? editingProduct.numReviews : 0, // Ensure numReviews is handled
    };

    try {
      if (editingProduct) {
        // If editingProduct is set, update the existing product
        await productService.updateProduct(editingProduct._id, productData, user.token);
        setFormMessage('Product updated successfully!');
      } else {
        // Otherwise, create a new product
        await productService.createProduct(productData, user.token);
        setFormMessage('Product added successfully!');
      }
      resetForm(); // Clear the form after successful operation
      fetchProducts(); // Re-fetch the product list to show updated data
    } catch (error) {
      console.error("Error saving product:", error);
      setFormMessage(error.message || 'Failed to save product. Please try again.');
    } finally {
      setFormLoading(false); // Reset form loading state
    }
  };

  // Opens the delete confirmation modal
  const handleOpenDeleteConfirmModal = (productId) => {
    setProductToDeleteId(productId);
    setShowDeleteConfirmModal(true);
  };

  // Closes the delete confirmation modal
  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setProductToDeleteId(null);
  };

  // Handles product deletion after confirmation
  const handleConfirmDelete = async () => {
    if (!productToDeleteId) return; // Should not happen if modal is opened correctly

    handleCloseDeleteConfirmModal(); // Close the modal immediately

    try {
      await productService.deleteProduct(productToDeleteId, user.token);
      setFormMessage('Product deleted successfully!');
      fetchProducts(); // Re-fetch the product list to reflect deletion
    } catch (error) {
      console.error("Error deleting product:", error);
      setFormMessage(error.message || 'Failed to delete product.');
    }
  };

  // Sets up the form for editing an existing product
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setImageUrl(product.imageUrl);
    setCategory(product.category);
    setCountInStock(product.countInStock);
    setIsAddingNew(false); // Hide the "Add New Product" toggle if editing
    setFormMessage(''); // Clear any previous form messages
  };

  // Display loading state for authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-indigo-700 text-2xl">
        <Loader size={30} className="animate-spin mr-3" /> Loading admin content...
      </div>
    );
  }

  // Display authorization error if not authenticated or not an admin
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4 flex-col">
        <XCircle size={30} className="mb-3" />
        You are not authorized to view this page.
        <button
          onClick={() => onNavigate('login')}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      {/* Page Title - Responsive text sizing */}
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-800 mb-8 sm:mb-12 text-center">Manage Products</h2>

      {/* Add/Edit Product Form Section */}
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 md:p-10 mb-8 sm:mb-12 w-full max-w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <div className="flex gap-2 flex-wrap justify-center"> {/* Added flex-wrap and justify-center for mobile buttons */}
            {!editingProduct && (
              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                <PlusCircle size={20} />
                <span>{isAddingNew ? 'Hide Form' : 'Add New Product'}</span>
              </button>
            )}
            {editingProduct && (
              <button
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-gray-500 transition-colors duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
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
            {/* Grid for Price/Image and Category/Stock - responsive columns */}
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
              className="mt-4 w-full bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              disabled={formLoading}
            >
              {formLoading ? <Loader size={20} className="animate-spin" /> : (editingProduct ? <Edit size={20} /> : <PlusCircle size={20} />)}
              <span>{formLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}</span>
            </button>
          </form>
        )}
      </div>

      {/* Existing Products Section */}
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Existing Products</h3>
      {loadingProducts ? (
        <div className="flex items-center justify-center min-h-[200px] text-indigo-700 text-xl">
          <Loader size={24} className="animate-spin mr-2" /> Loading products...
        </div>
      ) : errorProducts ? (
        <div className="text-center text-red-600 text-lg p-4">
          <XCircle size={24} className="inline-block mr-2" /> Error: {errorProducts}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">No products found. Add some using the form above!</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-2 sm:p-4">
          <table className="min-w-[700px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  {/* Truncate ID for mobile display */}
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-gray-500 overflow-hidden text-ellipsis max-w-[100px] sm:max-w-none">{product._id}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/E2E8F0/64748B?text=No+Img`; }}
                    />
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
                      className="text-indigo-600 hover:text-indigo-900 mr-2 p-2 rounded-full hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      title="Edit Product"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteConfirmModal(product._id)} // Use custom modal handler
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">Confirm Deletion</h3>
            <p className="text-sm sm:text-base text-gray-700 mb-6 text-center">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCloseDeleteConfirmModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagePage;
