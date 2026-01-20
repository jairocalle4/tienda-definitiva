export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    categoryName?: string;
    subCategoryName?: string;
    images: string[];
    videoUrl?: string; // YouTube or Cloudflare URL
    rating?: number;
    reviewCount?: number;
}

export interface Category {
    id: string;
    name: string;
    image?: string;
}

export interface CartItem extends Product {
    quantity: number;
}
