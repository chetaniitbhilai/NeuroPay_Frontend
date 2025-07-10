import axios from 'axios';

// Change baseURL as per your environment
const api = axios.create({
  baseURL: 'http://192.168.29.56:5002/api', // for physical device, replace with IP
});

export const getAllProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch products:', error.message);
    throw error;
  }
};
