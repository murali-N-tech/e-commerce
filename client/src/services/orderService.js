// client/src/services/orderService.js

const API_URL = 'https://e-commerce-slp6.onrender.com/api/orders'; // Base URL for order API

/**
 * Creates a new order on the backend.
 * @param {object} orderData - The order details (orderItems, shippingAddress, paymentMethod, prices).
 * @param {string} token - The user's JWT.
 * @returns {Promise<object>} The created order object.
 */
const createOrder = async (orderData, token) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the user's token
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }

    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Fetches a single order by its ID.
 * @param {string} orderId - The ID of the order to fetch.
 * @param {string} token - The user's JWT.
 * @returns {Promise<object>} The order object.
 */
const getOrderDetails = async (orderId, token) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the user's token
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order details');
    }

    return data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

/**
 * Fetches all orders for the logged-in user.
 * @param {string} token - The user's JWT.
 * @returns {Promise<Array>} An array of order objects.
 */
const getMyOrders = async (token) => {
  try {
    const response = await fetch(`${API_URL}/myorders`, { // <-- add slash
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the user's token
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Not Found - /api/orders/myorders`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching my orders:', error);
    throw error;
  }
};

/**
 * Marks an order as paid (simulated payment).
 * In a real application, this would integrate with a payment gateway.
 * @param {string} orderId - The ID of the order to mark as paid.
 * @param {object} paymentResult - Payment success details (e.g., from PayPal/Stripe).
 * @param {string} token - The user's JWT.
 * @returns {Promise<object>} The updated order object.
 */
const payOrder = async (orderId, paymentResult, token) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}/pay`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentResult),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark order as paid');
    }

    return data;
  } catch (error) {
    console.error('Error paying order:', error);
    throw error;
  }
};

/**
 * Fetches all orders (Admin only).
 * @param {string} token - Admin user's JWT.
 * @returns {Promise<Array>} An array of all order objects.
 */
const getAllOrders = async (token) => {
  try {
    const response = await fetch(API_URL, { // GET request to base API_URL (protected by admin middleware)
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch all orders');
    }

    return data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

/**
 * Marks an order as delivered (Admin only).
 * @param {string} orderId - The ID of the order to mark as delivered.
 * @param {string} token - Admin user's JWT.
 * @returns {Promise<object>} The updated order object.
 */
const deliverOrder = async (orderId, token) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}/deliver`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark order as delivered');
    }

    return data;
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    throw error;
  }
};


const orderService = {
  createOrder,
  getOrderDetails,
  getMyOrders,
  payOrder,
  getAllOrders,
  deliverOrder,
};

export default orderService;
