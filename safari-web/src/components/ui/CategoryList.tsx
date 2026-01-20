import React from 'react';
import {
    Headphones,
    Smartphone,
    Watch,
    Laptop,
    Camera,
    Gamepad2,
    Home,
    Speaker,
    Cpu,
    MousePointer2,
    Wind,
    Layers,
    type LucideIcon,
    Tablet,
    Sparkles,
    Hammer,
    ToyBrick,
    PawPrint,
    Glasses,
    Footprints,
    Utensils,
    Wifi,
    HardDrive,
    Monitor,
    Usb,
    Battery,
    Cable,
    Keyboard,
    Mic2,
    Projector,
    Printer,
    Radio,
    Zap,
    Cctv,
    Microchip,
    Gpu,
    Music,
} from 'lucide-react';
import type { Category } from '../../types';

interface CategoryListProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (id: string | null) => void;
}

// Helper for play icon
const PlayIcon = Radio;

// Intelligent Mapping: Keywords to Lucide Icons
const iconMap: { [key: string]: LucideIcon } = {
    // Audio y Sonido
    'auricular': Headphones,
    'audifono': Headphones,
    'cascos': Headphones,
    'headset': Headphones,
    'parlante': Speaker,
    'sonido': Speaker,
    'audio': Speaker,
    'altavoz': Speaker,
    'corneta': Speaker,
    'microfono': Mic2,
    'mic': Mic2,
    'grabadora': Mic2,
    'musica': Music,
    'reproductor': PlayIcon, // Using Radio/Music fallback in map for consistency
    'radio': Radio,

    // Dispositivos Móviles y Vestibles
    'celular': Smartphone,
    'telefono': Smartphone,
    'iphone': Smartphone,
    'movil': Smartphone,
    'smartphone': Smartphone,
    'android': Smartphone,
    'reloj': Watch,
    'smartwatch': Watch,
    'reloj inteligente': Watch,
    'pulsera': Watch,
    'band': Watch,
    'tablet': Tablet,
    'ipad': Tablet,
    'tableta': Tablet,

    // Computación y Laptops
    'computadora': Laptop,
    'laptop': Laptop,
    'portatil': Laptop,
    'notebook': Laptop,
    'ordenador': Laptop,
    'pc': Laptop,
    'desktop': Laptop,
    'torre': Laptop,
    'servidor': HardDrive,
    'disco duro': HardDrive,
    'ssd': HardDrive,
    'memoria': Microchip,
    'ram': Microchip,
    'procesador': Cpu,
    'cpu': Cpu,
    'tarjeta madre': Microchip,
    'placa': Microchip,
    'tarjeta de video': Gpu,
    'gpu': Gpu,
    'grafica': Gpu,

    // Periféricos y Accesorios
    'mouse': MousePointer2,
    'raton': MousePointer2,
    'teclado': Keyboard,
    'monitor': Monitor,
    'pantalla': Monitor,
    'display': Monitor,
    'impresora': Printer,
    'escanner': Printer,
    'proyector': Projector,
    'camara': Camera,
    'webcam': Camera,
    'fotografia': Camera,
    'video': Camera,
    'usb': Usb,
    'pendrive': Usb,
    'cable': Cable,
    'cargador': Zap,
    'energia': Zap,
    'bateria': Battery,
    'pila': Battery,
    'ups': Zap,

    // Gaming
    'videojuego': Gamepad2,
    'consola': Gamepad2,
    'juego': Gamepad2,
    'gamer': Gamepad2,
    'gaming': Gamepad2,
    'playstation': Gamepad2,
    'xbox': Gamepad2,
    'nintendo': Gamepad2,
    'switch': Gamepad2,
    'ps5': Gamepad2,
    'ps4': Gamepad2,

    // Redes y Conectividad
    'wifi': Wifi,
    'router': Wifi,
    'modem': Wifi,
    'red': Wifi,
    'antena': Wifi,
    'repetidor': Wifi,
    'bluetooth': Wifi,

    // Seguridad
    'camara seguridad': Cctv,
    'vigilancia': Cctv,
    'alarma': Zap,
    'seguridad': Cctv,

    // Varios Tecnología
    'tecnologia': Cpu,
    'electronica': Cpu,
    'gadget': Cpu,
    'dron': Wind,
    'vape': Wind,
    'esencia': Wind,
    'liquido': Wind,

    // Hogar y Otros
    'hogar': Home,
    'casa': Home,
    'mueble': Home,
    'electrodomestico': Utensils,
    'cocina': Utensils,
    'belleza': Sparkles,
    'perfume': Sparkles,
    'maquillaje': Sparkles,
    'herramienta': Hammer,
    'juguete': ToyBrick,
    'nino': ToyBrick,
    'mascota': PawPrint,
    'perro': PawPrint,
    'lentes': Glasses,
    'gafas': Glasses,
    'zapato': Footprints,
    'calzado': Footprints,
};

// Helper inside the same file for local use if needed, but we keep it simple

const getCategoryIcon = (name: string): LucideIcon => {
    const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    for (const keyword in iconMap) {
        if (normalized.includes(keyword)) {
            return iconMap[keyword];
        }
    }

    return Layers; // Default fallback icon
};

export const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
            <div className="flex gap-4 px-4 min-w-max">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`flex flex-col items-center gap-2 transition-all duration-200 group ${selectedCategory === null ? 'scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                >
                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${selectedCategory === null
                            ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-100 text-indigo-600'
                            : 'border-gray-100 bg-white text-gray-400 group-hover:border-indigo-200 group-hover:bg-indigo-50/30'
                            }`}
                    >
                        <Layers size={22} strokeWidth={2.5} />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedCategory === null ? 'text-indigo-600' : 'text-gray-500'}`}>
                        Todos
                    </span>
                </button>

                {categories.map((category) => {
                    const Icon = getCategoryIcon(category.name);
                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            className={`flex flex-col items-center gap-2 transition-all duration-200 group ${selectedCategory === category.id ? 'scale-105' : 'opacity-70 hover:opacity-100'
                                }`}
                        >
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${selectedCategory === category.id
                                    ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-100 text-indigo-600'
                                    : 'border-gray-100 bg-white text-gray-400 group-hover:border-indigo-200 group-hover:bg-indigo-50/30'
                                    }`}
                            >
                                <Icon size={22} strokeWidth={2.5} />
                            </div>
                            <span
                                className={`text-[11px] font-bold uppercase tracking-wider ${selectedCategory === category.id ? 'text-indigo-600' : 'text-gray-500'
                                    }`}
                            >
                                {category.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
