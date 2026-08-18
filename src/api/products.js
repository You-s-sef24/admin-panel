import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_API_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_API_CLOUDINARY_PRESET;

export async function getProducts() {
    const res = await axios.get(`${BASE_URL}/products`);
    return res.data;
}

export async function deleteProduct(id) {
    const res = await axios.delete(`${BASE_URL}/products/${id}`);
    return res.data;
}

export async function createProduct(product) {
    const uploadPromises = product.images.map(async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const uploadRes = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
        return uploadRes.data.secure_url;
    });

    const imageUrls = await Promise.all(uploadPromises);

    const res = await axios.post(`${BASE_URL}/products`, {
        ...product,
        images: imageUrls,
    });
    return res.data;
}

export async function updateProduct({ id, ...product }) {
    if (Array.isArray(product.images)) {
        const uploadPromises = product.images.map(async (image) => {
            if (image instanceof File) {
                const formData = new FormData();
                formData.append("file", image);
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
                const uploadRes = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
                return uploadRes.data.secure_url;
            }
            return image;
        });
        product.images = await Promise.all(uploadPromises);
    }

    const res = await axios.put(`${BASE_URL}/products/${id}`, product);
    return res.data;
}