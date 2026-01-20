import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FlyingCartAnimation } from '../ui/FlyingCartAnimation';

export const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <FlyingCartAnimation />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-6">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
