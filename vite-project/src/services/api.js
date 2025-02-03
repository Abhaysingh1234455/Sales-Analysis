import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,  // Set to false for simplicity (adjust if using cookies)
});

// Set Authorization Header for all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');  // Assuming token is stored in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Add the token in Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Test endpoint to verify connection
export const testAPI = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('Error testing API:', error);
    throw error;
  }
};

export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Add fetchProductSales function
export const fetchProductSales = async () => {
  try {
    const response = await api.get('/product-sales');  // Adjust the endpoint accordingly
    return response.data;
  } catch (error) {
    console.error('Error fetching product sales data:', error);
    throw error;
  }
};

export const fetchCountrySales = async () => {
  try {
    const response = await api.get('/country-sales');  
    //console.log('Country Sales Data:', response.data); // Adjust the endpoint as necessary
    
    // Convert object data to an array of { country, sales } objects
    const countrySalesArray = Object.entries(response.data).map(([country, sales]) => ({
      country,
      sales
    }));
    
    return countrySalesArray;
  } catch (error) {
    console.error('Error fetching country sales data:', error);
    throw error;
  }
};

export const fetchMonthlySales = async () => {
  try {
    const response = await api.get('/monthly-sales');  // Adjust this endpoint according to your backend API
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly sales data:', error);
    throw error;
  }
};

export default api;
