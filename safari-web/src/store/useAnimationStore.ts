import { create } from 'zustand';

interface Particle {
    id: string;
    startX: number;
    startY: number;
    image: string;
}

interface AnimationState {
    particles: Particle[];
    addParticle: (startX: number, startY: number, image: string) => void;
    removeParticle: (id: string) => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
    particles: [],
    addParticle: (startX, startY, image) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
            particles: [...state.particles, { id, startX, startY, image }],
        }));
    },
    removeParticle: (id) => {
        set((state) => ({
            particles: state.particles.filter((p) => p.id !== id),
        }));
    },
}));
