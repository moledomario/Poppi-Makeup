'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Menu, X, Home, ShoppingBag } from 'lucide-react';
import { useStore } from '../lib/useStore';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { getCartCount } = useStore();
    const router = useRouter();
    const cartCount = getCartCount();


    const handleSearch = (e) => {
        e.preventDefault();

        router.push(`/ProductsSection?categoria=${searchQuery}`);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between gap-4 md:gap-6">

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src="/poppit.png"
                            alt="Poppimakecup Logo"
                            width={150}
                            height={60}
                            className="h-10 md:h-12 w-auto"
                            priority
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        />
                    </Link>

                    {/* Acciones y Navegación Desktop */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Carrito - Visible solo en Desktop */}


                        {/* Navegación Desktop - Oculta en móvil */}
                        <nav className="hidden md:flex items-center gap-6">
                            <div className="hidden md:flex flex-1 justify-end max-w-2xl relative">
                                <form
                                    onSubmit={handleSearch}
                                    className={`flex items-center transition-all duration-500 ease-in-out border-2 border-pink-200 rounded-full bg-white overflow-hidden ${isSearchOpen ? 'w-full opacity-100 px-4 py-1' : 'w-0 opacity-0 pointer-events-none'}`}
                                >
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full py-2 bg-transparent focus:outline-none"
                                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#f790b1] hover:bg-[#f570a0] text-white p-2 rounded-full transition-colors ml-2"
                                        aria-label="Buscar"
                                    >
                                        <Search size={20} />
                                    </button>
                                </form>

                                {!isSearchOpen && (
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="text-gray-700 hover:text-[#f790b1] transition-colors p-2"
                                        aria-label="Abrir búsqueda"
                                    >
                                        <Search size={28} strokeWidth={2} />
                                    </button>
                                )}

                                {isSearchOpen && (
                                    <button
                                        onClick={() => setIsSearchOpen(false)}
                                        className="text-gray-700 hover:text-[#f790b1] transition-colors p-2 ml-2"
                                        aria-label="Cerrar búsqueda"
                                    >
                                        <X size={24} />
                                    </button>
                                )}
                            </div>
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-[#f790b1] transition-colors font-medium flex items-center gap-2"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                aria-label="Inicio"
                            >
                                <Home size={24} />
                            </Link>

                            <Link
                                href="/ProductsSection"
                                className="text-gray-700 hover:text-[#f790b1] transition-colors font-medium flex items-center gap-2"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                aria-label="Productos"
                            >
                                <ShoppingBag size={24} />
                            </Link>
                            <Link
                                href="/cart"
                                className="hidden md:relative md:flex text-gray-700 hover:text-[#f790b1] transition-colors"
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
                                ) : null}
                            </Link>
                        </nav>

                        {/* Botones de acción móvil (Búsqueda y Menú) */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setIsSearchOpen(!isSearchOpen);
                                    if (isMenuOpen) setIsMenuOpen(false);
                                }}
                                className="text-gray-700 hover:text-[#f790b1] transition-colors p-2"
                                aria-label="Toggle búsqueda"
                            >
                                {isSearchOpen ? <X size={28} /> : <Search size={28} />}
                            </button>

                            <button
                                className="text-gray-700 hover:text-[#f790b1] transition-colors p-2"
                                onClick={() => {
                                    setIsMenuOpen(!isMenuOpen);
                                    if (isSearchOpen) setIsSearchOpen(false);
                                }}
                                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                            >
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Barra de búsqueda - Móvil (Expandible) */}
                <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isSearchOpen ? 'mt-3 max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-12 rounded-full border-2 border-pink-200 focus:border-[#f790b1] focus:outline-none transition-colors text-sm"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#f790b1] hover:bg-[#f570a0] text-white p-1.5 rounded-full transition-colors"
                            >
                                <Search size={18} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Menú móvil desplegable */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-700">
                        <nav className="flex flex-col gap-4 mt-4">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-[#f790b1] transition-colors font-medium text-lg px-2 flex items-center justify-center py-2 bg-pink-50 rounded-lg"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Inicio"
                            >
                                <Home size={28} />
                            </Link>

                            <Link
                                href="/ProductsSection"
                                className="text-gray-700 hover:text-[#f790b1] transition-colors font-medium text-lg px-2 flex items-center justify-center py-2 bg-pink-50 rounded-lg"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Productos"
                            >
                                <ShoppingBag size={28} />
                            </Link>


                            <Link
                                href="/cart"
                                className="flex items-center justify-center gap-3 text-gray-700 hover:text-[#f790b1] transition-colors font-medium text-lg px-2 py-2 bg-pink-50 rounded-lg"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="relative">
                                    <ShoppingCart size={28} strokeWidth={2} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#f790b1] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>

                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}