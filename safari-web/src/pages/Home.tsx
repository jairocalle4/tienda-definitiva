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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // setLoading(true); // Already true by default
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
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to normalize strings (remove accents, lowercase)
    const normalize = (str: string | null | undefined) =>
        (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

    // ... existing useEffect ...

    const filteredProducts = useMemo(() => {
        let result = products;

        if (search) {
            result = result.filter(product =>
                normalize(product.name).includes(normalize(search)) ||
                normalize(product.description).includes(normalize(search))
            );
        }

        if (selectedCategory) {
            result = result.filter(product => product.categoryId === selectedCategory);
        }

        // Sorting
        if (sortOrder === 'price-asc') {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            result = [...result].sort((a, b) => b.price - a.price);
        }

        return result;
    }, [search, selectedCategory, products, sortOrder]);

    // Group products by Category Name for the main view
    const productsByCategory = useMemo(() => {
        if (search || selectedCategory) return null; // Don't group if searching/filtering

        const grouped: Record<string, Product[]> = {};

        // Sort categories to ensure consistent order (optional)
        const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));

        sortedCategories.forEach(cat => {
            const catProducts = products.filter(p => p.categoryName === cat.name); // Using categoryName from product to be safe
            if (catProducts.length > 0) {
                // Sort products within category if needed
                let sorted = catProducts;
                if (sortOrder === 'price-asc') sorted = [...catProducts].sort((a, b) => a.price - b.price);
                if (sortOrder === 'price-desc') sorted = [...catProducts].sort((a, b) => b.price - a.price);

                grouped[cat.name] = sorted;
            }
        });
        return grouped;
    }, [products, categories, search, selectedCategory, sortOrder]);


    // Skeleton Components
    const ProductSkeleton = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
            <div className="aspect-[4/3] bg-gray-200"></div>
            <div className="p-4 flex-1 flex flex-col space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="mt-auto flex justify-between items-center pt-2">
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );

    const CategorySkeleton = () => (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        </div>
    );


    return (
        <div className="space-y-8 pb-12">
            {/* Hero / Location Banner - Kept as is */}
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
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </div>

            {/* Categories */}
            <section>
                <h2 className="text-sm font-bold text-gray-900 mb-3 px-1">
                    EXPLORA POR CATEGORÍAS
                </h2>
                <CategoryList
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </section>

            {/* Products Section */}
            <section className="space-y-8">
                {/* Header & Controls - Minimalist */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
                    <div>
                        {/* Show large title only if searching or filtering to give context. Otherwise, keep it clean. */}
                        {(search || selectedCategory) && (
                            <h2 className="text-xl font-medium text-gray-900 mb-1">
                                {search ? `Resultados para "${search}"` : 'Productos filtrados'}
                            </h2>
                        )}
                        <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">
                            {!loading ? `${filteredProducts.length} Productos` : 'Cargando...'}
                        </p>
                    </div>

                    {/* Sort Controls - Transparent/Minimal */}
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-400">Ordenar por</span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as any)}
                            className="bg-transparent border-b border-gray-200 py-1 pr-8 pl-1 focus:outline-none focus:border-indigo-600 text-gray-900 font-medium cursor-pointer hover:border-gray-400 transition-colors"
                        >
                            <option value="default">Relevancia</option>
                            <option value="price-asc">Precio: Bajo a Alto</option>
                            <option value="price-desc">Precio: Alto a Bajo</option>
                        </select>
                    </div>
                </div>

                {/* Content Rendering Logic */}
                {loading ? (
                    // LOADING STATE
                    <div className="space-y-12">
                        {[1, 2].map(i => <CategorySkeleton key={i} />)}
                    </div>
                ) : productsByCategory && !search && !selectedCategory ? (
                    // GROUPED VIEW (Default Home)
                    <div className="space-y-12">
                        {Object.entries(productsByCategory).map(([categoryName, items], index) => {
                            // Color themes setup
                            const themes = [
                                { color: 'text-blue-600', bg: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-100', gradient: 'from-blue-600 to-cyan-500' },
                                { color: 'text-purple-600', bg: 'bg-purple-500', lightBg: 'bg-purple-50', border: 'border-purple-100', gradient: 'from-purple-600 to-pink-500' },
                                { color: 'text-emerald-600', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', border: 'border-emerald-100', gradient: 'from-emerald-600 to-teal-500' },
                                { color: 'text-rose-600', bg: 'bg-rose-500', lightBg: 'bg-rose-50', border: 'border-rose-100', gradient: 'from-rose-600 to-orange-500' },
                                { color: 'text-amber-600', bg: 'bg-amber-500', lightBg: 'bg-amber-50', border: 'border-amber-100', gradient: 'from-amber-600 to-yellow-400' },
                                { color: 'text-indigo-600', bg: 'bg-indigo-500', lightBg: 'bg-indigo-50', border: 'border-indigo-100', gradient: 'from-indigo-600 to-violet-500' },
                            ];
                            const theme = themes[index % themes.length];

                            return (
                                <div key={categoryName} className="space-y-3">
                                    {/* Detailed Premium Header - Compact Version */}
                                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setSelectedCategory(categories.find(c => c.name === categoryName)?.id || null)}>
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${theme.lightBg} group-hover:scale-105 transition-transform duration-300 shadow-sm border ${theme.border}`}>
                                            <span className={`text-lg font-black ${theme.color}`}>
                                                {categoryName.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`text-lg font-black tracking-tight bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent uppercase`}>
                                                    {categoryName}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`h-0.5 w-6 rounded-full ${theme.bg} opacity-80`}></div>
                                                <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">
                                                    Colección Premium
                                                </p>
                                            </div>
                                        </div>
                                        <button className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${theme.lightBg} ${theme.color} text-[10px] font-black tracking-wider hover:brightness-95 transition-all shadow-sm border ${theme.border}`}>
                                            VER TODO
                                        </button>
                                    </div>

                                    {/* Products Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-4">
                                        {items.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        {Object.keys(productsByCategory).length === 0 && (
                            <div className="text-center py-20 text-gray-400 font-light">
                                Catalogo vacío por el momento.
                            </div>
                        )}
                    </div>
                ) : (
                    // SINGLE GRID VIEW (Filtered/Searched)
                    <>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24">
                                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                                    <Sparkles className="text-gray-300" />
                                </div>
                                <p className="text-gray-900 font-medium">No encontramos productos</p>
                                <p className="text-gray-500 text-sm mt-1">Intenta con otra búsqueda o categoría</p>

                                {(search || selectedCategory) && (
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(null);
                                            window.location.href = '/';
                                        }}
                                        className="mt-6 text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:underline"
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};
