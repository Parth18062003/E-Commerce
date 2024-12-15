// utils/fetchInventory.ts

import axios from 'axios';

export const fetchInventoryData = async (productId: string) => {
  try {
    const response = await axios.get(`http://192.168.29.159:8082/api/v1/inventory/${productId}`);
    return response.data; // returns the inventory data
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return [];
  }
};
