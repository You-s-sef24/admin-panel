import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getOrders() {
    const res = await axios.get(`${BASE_URL}/orders`);
    return res.data;
}