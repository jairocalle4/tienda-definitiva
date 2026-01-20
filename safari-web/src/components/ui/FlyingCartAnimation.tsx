import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationStore } from '../../store/useAnimationStore';

export const FlyingCartAnimation: React.FC = () => {
    const { particles, removeParticle } = useAnimationStore();
    const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateTargetPos = () => {
            const cartIcon = document.getElementById('cart-icon-container');
            if (cartIcon) {
                const rect = cartIcon.getBoundingClientRect();
                setTargetPos({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                });
            }
        };

        updateTargetPos();
        window.addEventListener('resize', updateTargetPos);
        return () => window.removeEventListener('resize', updateTargetPos);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{
                            x: particle.startX,
                            y: particle.startY,
                            scale: 0.8,
                            opacity: 1,
                            rotate: 0,
                        }}
                        animate={{
                            x: [particle.startX, (particle.startX + targetPos.x) / 2, targetPos.x],
                            y: [particle.startY, Math.min(particle.startY, targetPos.y) - 100, targetPos.y],
                            scale: [0.8, 1, 0.2],
                            opacity: [1, 1, 0],
                            rotate: [0, 45, 180],
                        }}
                        transition={{
                            duration: 0.9,
                            times: [0, 0.5, 1],
                            ease: "easeInOut",
                        }}
                        onAnimationComplete={() => removeParticle(particle.id)}
                        className="absolute w-12 h-12 -ml-6 -mt-6 rounded-xl overflow-hidden border-2 border-white shadow-2xl bg-white"
                    >
                        <img
                            src={particle.image}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
