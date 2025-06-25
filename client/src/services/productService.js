// client/src/services/productService.js

const API_URL = 'http://localhost:5000/api/products/';

/**
 * Fetches all products.
 * @returns {Promise<Array>} List of products.
 */
const getProducts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch products');
  }
  return await response.json();
};

/**
 * Creates a new product (Admin only).
 * @param {object} productData - The product data to create.
 * @param {string} token - Admin user's JWT.
 * @returns {Promise<object>} The created product.
 */
const createProduct = async (productData, token) => {
  const response = await fetch('http://localhost:5000/api/products/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create product');
  }
  return data;
};

/**
 * Updates an existing product (Admin only).
 * @param {string} productId - ID of the product to update.
 * @param {object} productData - The product data to update.
 * @param {string} token - Admin user's JWT.
 * @returns {Promise<object>} The updated product.
 */
const updateProduct = async (productId, productData, token) => {
  const response = await fetch(`${API_URL}${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update product');
  }
  return data;
};

/**
 * Deletes a product (Admin only).
 * @param {string} productId - ID of the product to delete.
 * @param {string} token - Admin user's JWT.
 * @returns {Promise<object>} Success message.
 */
const deleteProduct = async (productId, token) => {
  const response = await fetch(`http://localhost:5000/api/products/admin/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete product');
  }
  return data;
};

const productService = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
