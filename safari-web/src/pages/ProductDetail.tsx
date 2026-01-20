import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import { useCartStore } from '../store/useCartStore';
import { useAnimationStore } from '../store/useAnimationStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const addToCart = useCartStore((state) => state.addToCart);
    const addParticle = useAnimationStore((state) => state.addParticle);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showVideo, setShowVideo] = useState(false);
    const [slideDirection, setSlideDirection] = useState(0);

    useEffect(() => {
        if (id) {
            api.getProduct(id)
                .then(data => {
                    setProduct(data);
                    if (data.images.length > 0) setSelectedImage(data.images[0]);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    // Helper to extract video ID for YouTube
    const getYouTubeEmbedUrl = (url: string) => {
        // Updated regex to handle shorts
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    }

    if (loading) {
        return <div className="flex justify-center p-12">Cargando...</div>;
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
                <Link to="/" className="text-indigo-600 hover:underline">
                    Volver al catálogo
                </Link>
            </div>
        );
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        if (product) {
            addParticle(e.clientX, e.clientY, selectedImage || product.images[0]);
            addToCart(product);
        }
    };

    const handleNext = () => {
        if (!product || product.images.length <= 1) return;
        setSlideDirection(1);
        const currentIdx = product.images.indexOf(selectedImage || product.images[0]);
        const nextIdx = (currentIdx + 1) % product.images.length;
        setSelectedImage(product.images[nextIdx]);
    };

    const handlePrev = () => {
        if (!product || product.images.length <= 1) return;
        setSlideDirection(-1);
        const currentIdx = product.images.indexOf(selectedImage || product.images[0]);
        const prevIdx = (currentIdx - 1 + product.images.length) % product.images.length;
        setSelectedImage(product.images[prevIdx]);
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const embedUrl = product.videoUrl ? getYouTubeEmbedUrl(product.videoUrl) : null;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Breadcrumb / Back */}
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                Volver
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Media Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                        {showVideo ? (
                            <div className="absolute inset-0 z-20 bg-black">
                                {embedUrl ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`${embedUrl}?autoplay=1`}
                                        title="Product Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    ></iframe>
                                ) : (
                                    <video
                                        src={product.videoUrl}
                                        controls
                                        autoPlay
                                        className="absolute inset-0 w-full h-full object-contain"
                                    >
                                        Tu navegador no soporta el elemento de video.
                                    </video>
                                )}
                                <button
                                    onClick={() => setShowVideo(false)}
                                    className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 backdrop-blur-md z-30 transition-all"
                                >
                                    <Pause size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-full relative cursor-grab active:cursor-grabbing p-8">
                                <AnimatePresence initial={false} custom={slideDirection}>
                                    <motion.img
                                        key={selectedImage || product.images[0]}
                                        src={selectedImage || product.images[0]}
                                        custom={slideDirection}
                                        variants={{
                                            enter: (direction: number) => ({
                                                x: direction > 0 ? 1000 : -1000,
                                                opacity: 0,
                                                scale: 0.95
                                            }),
                                            center: {
                                                zIndex: 1,
                                                x: 0,
                                                opacity: 1,
                                                scale: 1
                                            },
                                            exit: (direction: number) => ({
                                                zIndex: 0,
                                                x: direction < 0 ? 1000 : -1000,
                                                opacity: 0,
                                                scale: 0.95
                                            })
                                        }}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 }
                                        }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={1}
                                        onDragEnd={(_, { offset, velocity }) => {
                                            const swipe = swipePower(offset.x, velocity.x);
                                            if (swipe < -swipeConfidenceThreshold) {
                                                handleNext();
                                            } else if (swipe > swipeConfidenceThreshold) {
                                                handlePrev();
                                            }
                                        }}
                                        alt={product.name}
                                        className="absolute inset-0 w-full h-full object-contain p-6"
                                    />
                                </AnimatePresence>

                                {/* Navigation Arrows */}
                                {product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100 md:opacity-100"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100 md:opacity-100"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setSelectedImage(img); setShowVideo(false); }}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === img && !showVideo ? 'border-indigo-600' : 'border-transparent'
                                    }`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                        {product.videoUrl && (
                            <button
                                onClick={() => setShowVideo(true)}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-gray-100 ${showVideo ? 'border-indigo-600' : 'border-transparent'
                                    }`}
                            >
                                <Play size={24} className="text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                Nuevo
                            </span>
                            {product.rating && (
                                <div className="flex items-center text-amber-500 text-sm">
                                    <Star size={16} fill="currentColor" />
                                    <span className="ml-1 font-medium">{product.rating}</span>
                                    <span className="text-gray-400 ml-1">({product.reviewCount} reseñas)</span>
                                </div>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
                    </div>

                    <div className="text-3xl font-bold text-indigo-600">
                        {formatPrice(product.price)}
                    </div>

                    <div className="prose prose-sm text-gray-600">
                        <p>{product.description}</p>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                        >
                            <div className="relative flex items-center gap-2">
                                <ShoppingCart size={24} />
                                <span>Agregar al Carrito</span>
                                <div className="bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">
                                    +
                                </div>
                            </div>
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8">
                        <div className="bg-gray-50 p-4 rounded-xl text-center">
                            <span className="block text-2xl mb-1">🚚</span>
                            <span className="text-sm font-medium text-gray-900">Envío Gratis</span>
                            <span className="block text-xs text-gray-500">En pedidos superiores a $50</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center">
                            <span className="block text-2xl mb-1">🛡️</span>
                            <span className="text-sm font-medium text-gray-900">Garantía</span>
                            <span className="block text-xs text-gray-500">30 días de devolución</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
