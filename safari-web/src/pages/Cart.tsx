import React from 'react';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../utils/format';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../types';

export const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, getCartTotal, clearCart, addToCart } = useCartStore();
    const total = getCartTotal();
    const [whatsappNumber, setWhatsappNumber] = React.useState('573000000000');
    const [suggestedProducts, setSuggestedProducts] = React.useState<Product[]>([]);

    React.useEffect(() => {
        import('../services/api').then(({ api }) => {
            api.getConfig().then(config => {
                if (config.whatsappNumber) setWhatsappNumber(config.whatsappNumber);
            });
        });
    }, []);

    // Smart Cross-sell Logic
    React.useEffect(() => {
        const checkSuggestions = async () => {
            if (items.length === 0) {
                setSuggestedProducts([]);
                return;
            }

            // Check if cart has a "Camera"
            const hasCamera = items.some(item =>
                (item.categoryName && (item.categoryName.toUpperCase().includes('CAMARA') || item.categoryName.toUpperCase().includes('CÁMARA'))) ||
                (item.subCategoryName && (item.subCategoryName.toUpperCase().includes('CAMARA') || item.subCategoryName.toUpperCase().includes('CÁMARA'))) ||
                item.name.toUpperCase().includes('CAMARA') ||
                item.name.toUpperCase().includes('CÁMARA')
            );

            // Check if cart already has an "SD Card"
            const hasSD = items.some(item =>
                (item.subCategoryName && item.subCategoryName.toUpperCase().includes('MICRO SD')) ||
                item.name.toUpperCase().includes('MICRO SD') ||
                item.name.toUpperCase().includes('MEMORIA SD')
            );

            if (hasCamera && !hasSD) {
                try {
                    const { api } = await import('../services/api');
                    const allProducts = await api.getProducts();

                    // Filter for Micro SD cards
                    const sds = allProducts.filter(p =>
                        (p.categoryName && p.categoryName.toUpperCase().includes('ALMACENAMIENTO')) ||
                        (p.subCategoryName && p.subCategoryName.toUpperCase().includes('MICRO SD')) ||
                        p.name.toUpperCase().includes('MICRO SD')
                    );

                    setSuggestedProducts(sds.slice(0, 2)); // Show max 2 suggestions
                } catch (err) {
                    console.error("Error fetching suggestions:", err);
                }
            } else {
                setSuggestedProducts([]);
            }
        };

        checkSuggestions();
    }, [items]);

    const formatWhatsAppNumber = (num: string) => {
        console.log('Original number:', num);
        // Remove all non-numeric characters
        let cleaned = num.replace(/\D/g, '');

        // If it starts with '0', remove it (common in local formats)
        if (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1);
        }

        // Add country code if not present (defaulting to 593 for Ecuador)
        // Adjust length check to be more flexible if needed
        if (cleaned.length >= 9 && !cleaned.startsWith('593')) {
            const result = `593${cleaned}`;
            console.log('Formatted number (added 593):', result);
            return result;
        }

        console.log('Formatted number (no changes):', cleaned);
        return cleaned;
    };

    const handleCheckout = () => {
        const orderId = Math.random().toString(36).substring(7).toUpperCase();
        const formattedNumber = formatWhatsAppNumber(whatsappNumber);

        console.log('Checkout attempts with number:', formattedNumber);

        const message = `📦 *NUEVO PEDIDO - #${orderId}*

Hola! Quisiera realizar el siguiente pedido:

${items.map((item) => `✅ *${item.quantity}x* ${item.name} 
   Precio: ${formatPrice(item.price * item.quantity)}`).join('\n\n')}

-------------------------------
💰 *TOTAL: ${formatPrice(total)}*
-------------------------------

Por favor, confírmame disponibilidad para coordinar la entrega.`;

        const encodedMessage = encodeURIComponent(message);
        // Using api.whatsapp.com/send which is often more compatible with the Windows App and mobile
        const url = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodedMessage}`;
        console.log('Generated WhatsApp URL:', url);
        window.open(url, '_blank');
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={48} className="text-gray-300" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
                    <p className="text-gray-500 mt-2">¡Explora nuestro catálogo y descubre productos increíbles!</p>
                </div>
                <Link
                    to="/"
                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200"
                >
                    Ir a comprar
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <ShoppingBag className="text-indigo-600" />
                Mi Carrito
                <span className="text-sm font-normal text-gray-500 ml-auto bg-gray-100 px-3 py-1 rounded-full">
                    {items.length} productos
                </span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4"
                            >
                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                                        <p className="text-indigo-600 font-bold mt-1">{formatPrice(item.price)}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-indigo-600 disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-semibold w-6 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-indigo-600"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <button
                        onClick={clearCart}
                        className="text-sm text-red-500 hover:underline mt-4 pl-1"
                    >
                        Vaciar carrito
                    </button>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <AnimatePresence>
                        {suggestedProducts.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-4 shadow-sm"
                            >
                                <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-3 text-sm">
                                    <AlertCircle size={16} />
                                    ¿Olvidaste la memoria?
                                </h4>
                                <div className="space-y-3">
                                    {suggestedProducts.map(sd => (
                                        <div key={sd.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-orange-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center p-1">
                                                    <img src={sd.images[0]} alt={sd.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800 line-clamp-1">{sd.name}</p>
                                                    <p className="text-xs text-indigo-600 font-bold">{formatPrice(sd.price)}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => addToCart(sd)}
                                                className="text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                                            >
                                                <Plus size={12} strokeWidth={3} /> Agregar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Resumen del pedido</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Envío</span>
                                <span className="text-green-600 font-medium">Gratis</span>
                            </div>
                            <div className="h-px bg-gray-100 my-2"></div>
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            animate={{
                                boxShadow: ["0px 0px 0px rgba(37, 211, 102, 0)", "0px 0px 20px rgba(37, 211, 102, 0.4)", "0px 0px 0px rgba(37, 211, 102, 0)"]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            onClick={handleCheckout}
                            className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <svg
                                className="w-6 h-6 fill-current"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.553 4.197 1.603 6.02L0 24l6.163-1.617a11.831 11.831 0 005.883 1.567h.005c6.637 0 12.05-5.414 12.05-12.05a11.815 11.815 0 00-3.49-8.514z" />
                            </svg>
                            Confirmar Pedido
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        <p className="text-xs text-gray-400 text-center mt-4">
                            Al confirmar, serás redirigido a WhatsApp con el detalle de tu pedido pre-cargado.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
