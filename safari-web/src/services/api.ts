import type { Product, Category } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api';

const fetchWithTimeout = async (url: string, options = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    try {
        console.log(`Fetching: ${url}`);
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        console.error(`Fetch error for ${url}:`, error);
        throw error;
    }
};

export const api = {
    async getProducts(): Promise<Product[]> {
        console.log('API: Fetching products...');
        const res = await fetchWithTimeout(`${API_URL}/products`);
        if (!res.ok) {
            console.error('API: Failed to fetch products', res.status, res.statusText);
            throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        console.log('API: Products received:', data);
        return data;
    },

    async getProduct(id: string): Promise<Product> {
        const res = await fetchWithTimeout(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
    },

    async getCategories(): Promise<Category[]> {
        const res = await fetchWithTimeout(`${API_URL}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
    },

    async getConfig(): Promise<{ appName: string; whatsappNumber: string }> {
        try {
            const res = await fetchWithTimeout(`${API_URL}/config`);
            if (!res.ok) throw new Error('Failed to fetch config');
            return res.json();
        } catch (e) {
            console.warn('Config fetch failed, using default', e);
            return { appName: 'Safari Web', whatsappNumber: '' };
        }
    }
};
