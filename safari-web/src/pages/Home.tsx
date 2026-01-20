import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Sparkles } from 'lucide-react';
import { CategoryList } from '../components/ui/CategoryList';
import { ProductCard } from '../components/ui/ProductCard';
import { api } from '../services/api';
import type { Product, Category } from '../types';

export const Home: React.FC = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    api.getProducts(),
                    api.getCategories()
                ]);

                // Filter categories to only show those that have products
                const categoriesWithProducts = categoriesData.filter(cat =>
                    productsData.some(prod => prod.categoryId === cat.id)
                );

                setProducts(productsData);
                setCategories(categoriesWithProducts);
            } catch (err: any) {
                console.error('Error cargando datos:', err);
                setError(err.message || 'Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to normalize strings (remove accents, lowercase)
    const normalize = (str: string | null | undefined) =>
        (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const filteredProducts = useMemo(() => {
        if (!search && !selectedCategory) return products;
        return products.filter((product) => {
            const matchesSearch =
                normalize(product.name).includes(normalize(search)) ||
                normalize(product.description).includes(normalize(search));

            const matchesCategory = selectedCategory
                ? product.categoryId === selectedCategory
                : true;

            return matchesSearch && matchesCategory;
        });
    }, [search, selectedCategory, products]);

    if (loading) {
        return <div className="flex justify-center p-12">Cargando datos del servidor...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-red-600">
                <p className="text-xl font-bold mb-2">Error de Conexión</p>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero / Location Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="relative z-10 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center md:justify-start gap-2">
                        <Sparkles className="text-yellow-300" />
                        Variedad de productos tecnológicos
                    </h1>
                    <p className="flex items-center justify-center md:justify-start gap-2 text-indigo-100 text-lg">
                        <MapPin className="text-indigo-200" />
                        Ubicados en <span className="font-semibold text-white">La Troncal - Cañar</span>
                    </p>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </div>

            {/* Categories */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Categorías</h2>
                <CategoryList
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </section>

            {/* Products */}
            <section>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-lg font-bold text-gray-900">
                        {search ? `Resultados para "${search}"` : 'Todos los productos'}
                    </h2>
                    <span className="text-sm text-gray-500">
                        {filteredProducts.length} productos
                    </span>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No se encontraron productos.</p>
                        {(search || selectedCategory) && (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="mt-4 text-indigo-600 font-medium hover:underline"
                            >
                                Ver todos los productos
                            </button>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};
