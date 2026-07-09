import axios from "axios";
const BASE_URL = import.meta.env.VITE_ORDERS_API_BASE_URL;

export async function getOrders() {
    const res = await axios.get(`${BASE_URL}/orders`);
    return res.data;
}

export async function getOrder(id) {
    const res = await axios.get(`${BASE_URL}/orders/${id}`);
    return res.data;
}

export async function updateOrder({ id, ...order }) {
    const res = await axios.put(`${BASE_URL}/orders/${id}`, order);
    return res.data;
}