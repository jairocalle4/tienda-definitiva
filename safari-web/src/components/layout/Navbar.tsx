import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { api } from '../../services/api';
import { motion, useAnimation } from 'framer-motion';

export const Navbar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [appName, setAppName] = useState('Safari Web');
    const cartCount = useCartStore((state) => state.getCartCount());
    const navigate = useNavigate();
    const controls = useAnimation();

    useEffect(() => {
        api.getConfig().then(config => {
            if (config.appName) setAppName(config.appName);
        });
    }, []);

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
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {appName.charAt(0)}
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hidden sm:block">
                        {appName}
                    </span>
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent focus:bg-white focus:border-indigo-500 rounded-full outline-none transition-all duration-200 text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </form>

                {/* Actions */}
                <div className="flex items-center gap-4">
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
