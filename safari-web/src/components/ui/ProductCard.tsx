import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, AlertCircle, TrendingUp } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { useCartStore } from '../../store/useCartStore';
import { useAnimationStore } from '../../store/useAnimationStore';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const addToCart = useCartStore((state) => state.addToCart);
    const addParticle = useAnimationStore((state) => state.addParticle);
    const isOutOfStock = product.stock <= 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOutOfStock) {
            // Trigger animation
            addParticle(e.clientX, e.clientY, product.images?.[0] || '');

            // Add to cart
            addToCart(product);
        }
    };

    return (
        <div className={`relative ${isOutOfStock ? 'cursor-not-allowed' : ''}`}>
            <Link
                to={isOutOfStock ? '#' : `/product/${product.id}`}
                onClick={(e) => isOutOfStock && e.preventDefault()}
                className={`group block h-full ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : ''}`}
            >
                <motion.div
                    whileHover={isOutOfStock ? {} : { y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                >
                    <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                        />

                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                            {isOutOfStock ? (
                                <span className="bg-red-600 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                                    <AlertCircle size={10} /> AGOTADO
                                </span>
                            ) : (
                                <>
                                    <span className="bg-indigo-600 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                                        <TrendingUp size={10} /> Top Ventas
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Video Indicator */}
                        {!isOutOfStock && product.videoUrl && (
                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/20 text-white group-hover:bg-indigo-600 transition-colors z-10">
                                <Play size={14} fill="currentColor" />
                            </div>
                        )}

                        {/* Animated Add to Cart Button (PC Hover) */}
                        {!isOutOfStock && (
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-indigo-600 text-white p-3 rounded-full shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-700"
                                >
                                    <CartPlusSvg size={24} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                {product.name}
                            </h3>
                        </div>

                        <div className="mt-4 flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-indigo-900 leading-none">
                                    {formatPrice(product.price)}
                                </span>
                                {isOutOfStock ? (
                                    <span className="text-[10px] font-medium text-red-500 mt-1 uppercase tracking-wider">Sin disponibilidad</span>
                                ) : (
                                    <span className="text-[10px] font-medium text-emerald-600 mt-1 uppercase tracking-wider">En Stock</span>
                                )}
                            </div>

                            {/* Mobile Add Button */}
                            {!isOutOfStock && (
                                <button
                                    onClick={handleAddToCart}
                                    className="sm:hidden bg-indigo-50 text-indigo-600 p-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                                >
                                    <CartPlusSvg size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </Link>
        </div>
    );
};

// Alternative cleaner SVG implementation
const CartPlusSvg = ({ size = 24, ...props }: any) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        <path d="M17 6v6" />
        <path d="M20 9h-6" />
    </svg>
);

