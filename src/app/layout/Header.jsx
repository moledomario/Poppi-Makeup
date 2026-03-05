'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search } from 'lucide-react';
import { useStore } from '../lib/useStore';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const { getCartCount } = useStore();
    const router = useRouter();
    const cartCount = getCartCount();


    const handleSearch = (e) => {
        e.preventDefault();

        router.push(`/ProductsSection?categoria=${searchQuery}`);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-6">

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 ml-8">
                        <Image
                            src="/poppit.png"
                            alt="Poppimakecup Logo"
                            width={150}
                            height={60}
                            className="h-12 w-auto"
                            priority
                        />
                    </Link>

                    {/* Barra de búsqueda */}
                    <form
                        onSubmit={handleSearch}
                        className="flex-1 max-w-2xl"
                    >
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 pr-12 rounded-full border-2 border-pink-200 focus:border-[#f790b1] focus:outline-none transition-colors"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#f790b1] hover:bg-[#f570a0] text-white p-2 rounded-full transition-colors"
                                aria-label="Buscar"
                            >
                                <Search size={20} />
                            </button>
                        </div>

                    </form>

                    {/* Navegación y Carrito */}
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-[#f790b1] transition-colors font-medium"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            Inicio
                        </Link>

                        <Link
                            href="/ProductsSection"
                            className="text-gray-700 hover:text-[#f790b1] transition-colors font-medium"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            Productos
                        </Link>

                        {/* Carrito */}
                        <Link
                            href="/cart"
                            className="relative text-gray-700 hover:text-[#f790b1] transition-colors"
                            aria-label="Carrito de compras"
                        >
                            <ShoppingCart size={28} strokeWidth={2} />
                            {cartCount > 0 ? (
                                <span
                                    className="absolute -top-2 -right-2 bg-[#f790b1] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                >
                                    {cartCount}
                                </span>
                            ) : null

                            }
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}