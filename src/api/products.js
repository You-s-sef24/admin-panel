import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dz0ylot2a/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "product_uploads";

export async function getProducts() {
    const res = await axios.get(`${BASE_URL}/products`);
    return res.data;
}

export async function deleteProduct(id) {
    const res = await axios.delete(`${BASE_URL}/products/${id}`);
    return res.data;
}

export async function createProduct(product) {
    const formData = new FormData();
    formData.append("file", product.image);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const uploadRes = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
    const imageUrl = uploadRes.data.secure_url;

    const res = await axios.post(`${BASE_URL}/products`, {
        ...product,
        image: imageUrl,
    });
    return res.data;
}

export async function updateProduct({ id, ...product }) {
    if (product.image instanceof File) {
        const formData = new FormData();
        formData.append("file", product.image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const uploadRes = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
        product.image = uploadRes.data.secure_url;
    }

    const res = await axios.put(`${BASE_URL}/products/${id}`, product);
    return res.data;
}