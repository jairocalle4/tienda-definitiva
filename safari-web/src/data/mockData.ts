import type { Product, Category } from '../types';

export const categories: Category[] = [
    { id: '1', name: 'Tecnología', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=60' },
    { id: '2', name: 'Hogar', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&auto=format&fit=crop&q=60' },
    { id: '3', name: 'Moda', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60' },
    { id: '4', name: 'Deportes', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=60' },
    { id: '5', name: 'Juguetes', image: 'https://images.unsplash.com/photo-1566576912902-1d544f1e31d3?w=500&auto=format&fit=crop&q=60' },
];

export const products: Product[] = [
    {
        id: '1',
        name: 'Auriculares Inalámbricos Pro',
        description: 'Sonido de alta fidelidad con cancelación de ruido activa y batería de larga duración. Perfectos para viajes y trabajo.',
        price: 129.99,
        categoryId: '1',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=60',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
        stock: 10,
        rating: 4.8,
        reviewCount: 124,
    },
    {
        id: '2',
        name: 'Smartwatch Series 5',
        description: 'Monitor de salud avanzado, GPS integrado y resistencia al agua. Tu compañero ideal para el fitness.',
        price: 89.50,
        categoryId: '1',
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
        ],
        stock: 5,
        rating: 4.5,
        reviewCount: 45,
    },
    {
        id: '3',
        name: 'Cámara DSLR Profesional',
        description: 'Captura momentos increíbles con resolución 4K y lentes intercambiables. Incluye kit básico.',
        price: 450.00,
        categoryId: '1',
        images: [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60',
        ],
        stock: 0,
        rating: 4.9,
        reviewCount: 200,
    },
    {
        id: '4',
        name: 'Sillón Eames Replica',
        description: 'Comodidad y estilo para tu sala de estar. Fabricado con cuero de alta calidad y madera.',
        price: 250.00,
        categoryId: '2',
        images: [
            'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=60',
        ],
        stock: 8,
        rating: 4.7,
        reviewCount: 89,
    },
    {
        id: '5',
        name: 'Zapatillas Running',
        description: 'Diseño ergonómico para máximo rendimiento. Suela amortiguada y tejido transpirable.',
        price: 59.99,
        categoryId: '3',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
        ],
        stock: 10,
        rating: 4.6,
        reviewCount: 67,
    },
];
