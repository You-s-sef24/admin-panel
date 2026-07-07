import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getUsers() {
    const res = await axios.get(`${BASE_URL}/users`);
    return res.data;
}