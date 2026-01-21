import React from 'react';
import { MapPin, Clock, Store, Gamepad2, Zap, Disc } from 'lucide-react';

export const About: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            {/* Hero Section - Compact */}
            <div className="text-center space-y-3 mb-8">
                <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tight">
                    JC TECH
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto rounded-full"></div>
                <p className="text-gray-500 max-w-lg mx-auto leading-relaxed text-sm font-medium">
                    Tecnología, innovación y entretenimiento en un solo lugar.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Vision Card - Glass Effect */}
                    <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Store size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">Quiénes Somos</h2>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed text-pretty">
                            Somos un emprendimiento joven enfocado en ofrecer tecnología y soluciones reales. Desde dispositivos de alto rendimiento hasta opciones accesibles, tenemos lo que necesitas.
                        </p>
                    </div>

                    {/* Technical Support & Maintenance - NEW */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                        <div className="flex items-center gap-3 mb-5 relative z-10">
                            <div className="p-2 bg-blue-100/80 rounded-lg text-blue-600">
                                <Zap size={22} fill="currentColor" className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Mantenimiento & Soporte</h2>
                                <p className="text-xs text-gray-500 font-medium">Dale una segunda vida a tu equipo</p>
                            </div>
                        </div>

                        <div className="grid gap-4 bg-gray-50/50 rounded-xl p-2">
                            {/* SSD Upgrade */}
                            <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">Optimización SSD</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                                        Cambiamos tu disco duro lento por un <span className="font-bold text-emerald-600">SSD Veloz</span>. ¡Tu PC encenderá en segundos!
                                    </p>
                                </div>
                            </div>

                            {/* Software & Windows */}
                            <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">Software y Windows</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                                        Instalación de Sistema Operativo, formateo, reseteo y drivers actualizados.
                                    </p>
                                </div>
                            </div>

                            {/* Office Pack */}
                            <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                                <div className="bg-orange-50 p-2 rounded-lg text-orange-600 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                        Paquete Office
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 mb-2 leading-snug">
                                        Word, Excel, PowerPoint y más. Licencias permanentes y activas.
                                    </p>
                                    {/* Office Icons Representation */}
                                    <div className="flex gap-2">
                                        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm" title="Word">W</div>
                                        <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm" title="Excel">X</div>
                                        <div className="w-6 h-6 rounded bg-orange-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm" title="PowerPoint">P</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gaming Services Section */}
                    <div className="bg-gradient-to-br from-indigo-900 to-violet-900 p-6 rounded-2xl shadow-lg relative overflow-hidden group text-white">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                                    <Gamepad2 size={24} className="text-yellow-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Servicios Gamer Pro</h2>
                            </div>

                            <p className="text-indigo-100 text-sm mb-6 max-w-md">
                                Especialistas en el ecosistema PlayStation. Llevamos tu consola al siguiente nivel con nuestro servicio de personalización y liberación.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 mb-1 text-yellow-400">
                                        <Zap size={16} />
                                        <span className="font-bold text-xs uppercase tracking-wider">PS3 & PS4 HEN/CFW</span>
                                    </div>
                                    <p className="text-xs text-indigo-200">
                                        Instalación de "Magia" (HEN/CFW) para desbloquear todo el potencial de tu consola.
                                    </p>
                                </div>

                                <div className="bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 mb-1 text-pink-400">
                                        <Disc size={16} />
                                        <span className="font-bold text-xs uppercase tracking-wider">Retro Gaming</span>
                                    </div>
                                    <p className="text-xs text-indigo-200">
                                        Juega títulos clásicos de PS1, PS2 y emuladores retro directamente en tu consola moderna.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Column */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Location Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600 shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Ubicación</h3>
                                <p className="text-gray-500 text-xs mt-1">La Troncal - Cañar, Ecuador</p>
                                <div className="mt-3 inline-block px-3 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
                                    Centro de la ciudad
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hours Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-50 p-2.5 rounded-xl text-green-600 shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Horario</h3>
                                <div className="space-y-1 mt-2">
                                    <div className="flex justify-between items-center text-xs w-full min-w-[180px]">
                                        <span className="text-gray-500">Lun - Sáb</span>
                                        <span className="font-bold text-gray-700">9:00 AM - 7:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs w-full min-w-[180px]">
                                        <span className="text-gray-500">Domingo</span>
                                        <span className="text-red-400 font-medium">Cerrado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Element */}
                    <div className="relative h-32 rounded-2xl overflow-hidden shadow-sm group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/40"></div>
                        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                            <div>
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Tecnología Gamer</p>
                                <p className="text-white text-sm font-medium opacity-90">Personalización de Temas & Más</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
