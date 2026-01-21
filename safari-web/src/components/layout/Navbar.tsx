import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Info } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { motion, useAnimation } from 'framer-motion';

export const Navbar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const cartCount = useCartStore((state) => state.getCartCount());
    const navigate = useNavigate();
    const controls = useAnimation();

    useEffect(() => {
        if (cartCount > 0) {
            controls.start({
                scale: [1, 1.2, 1],
                transition: { duration: 0.3 }
            });
        }
    }, [cartCount, controls]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-1 group">
                    <div className="relative flex items-center justify-center">
                        <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter group-hover:bg-gradient-to-l transition-all duration-500 bg-[length:200%_auto]">
                            JC
                        </span>
                    </div>
                    <span className="text-xl font-bold text-gray-700 tracking-widest pl-1 border-l-2 border-gray-300 ml-1 h-6 flex items-center">
                        TECH
                    </span>
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-12 py-2 bg-gray-100 border border-transparent focus:bg-white focus:border-indigo-500 rounded-full outline-none transition-all duration-200 text-sm shadow-inner"
                    />
                    <button
                        type="submit"
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center group"
                        title="Buscar"
                    >
                        <Search size={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                </form>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/about"
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Acerca de Nosotros"
                    >
                        <Info size={24} />
                    </Link>

                    <Link
                        to="/cart"
                        id="cart-icon-container"
                        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <motion.div
                            animate={controls}
                            className="relative"
                        >
                            <ShoppingCart className="text-gray-700" size={24} />
                            {cartCount > 0 && (
                                <motion.span
                                    key={cartCount}
                                    initial={{ scale: 1.5, backgroundColor: '#4f46e5' }}
                                    animate={{ scale: 1, backgroundColor: '#ef4444' }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </motion.div>
                    </Link>
                </div>
            </div>
        </header>
    );
};
