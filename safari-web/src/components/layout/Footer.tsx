import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export const Footer: React.FC = () => {
    const [appName, setAppName] = useState('Safari Web');

    useEffect(() => {
        api.getConfig().then(config => {
            if (config.appName) setAppName(config.appName);
        });
    }, []);

    return (
        <footer className="bg-white border-t border-gray-100 py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} {appName}. Todos los derechos reservados.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Precios y disponibilidad sujetos a cambios.
                </p>
            </div>
        </footer>
    );
};
