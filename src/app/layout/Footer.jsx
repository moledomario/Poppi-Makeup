'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin, CreditCard, Truck, Shield, Clock } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#f1c9d2] text-gray-800">

            {/* Sección de beneficios */}
            <div className="border-b border-pink-300">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full">
                                <Truck className="text-[#f790b1]" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Envíos a todo el país</h4>
                                <p className="text-xs text-gray-700">Seguimiento en tiempo real</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full">
                                <CreditCard className="text-[#9b6b9e]" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Pago seguro</h4>
                                <p className="text-xs text-gray-700">Mercado Pago y más</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full">
                                <Shield className="text-[#6ba5b8]" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Compra protegida</h4>
                                <p className="text-xs text-gray-700">Garantía de satisfacción</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full">
                                <Clock className="text-[#e89a6f]" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Atención rápida</h4>
                                <p className="text-xs text-gray-700">Respuesta dentro de 24hs</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Sección principal del footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Columna 1 - Sobre nosotros */}
                    <div>
                        <Link href="/" className="inline-block mb-4 ml-8">
                            <Image
                                src="/poppit.png"
                                alt="Poppimakecup"
                                width={150}
                                height={60}
                                className="h-12 w-auto"
                            />
                        </Link>
                        <p className="text-sm text-gray-700 mb-4">
                            Tu tienda de maquillaje online. Productos de alta calidad para resaltar tu belleza natural.
                        </p>

                        {/* Redes sociales */}
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white rounded-full hover:bg-[#1877f2] hover:text-white transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="https://www.instagram.com/poppi.makeup/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white rounded-full hover:bg-gradient-to-br hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af] hover:text-white transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} />
                            </a>

                        </div>
                    </div>

                    {/* Columna 2 - Navegación */}
                    <div>
                        <h3
                            className="text-lg mb-4"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            Navegación
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-[#f790b1] transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link href="/ProductsSection" className="hover:text-[#f790b1] transition-colors">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/ProductsSection?categoria=labios" className="hover:text-[#f790b1] transition-colors">
                                    Labios
                                </Link>
                            </li>
                            <li>
                                <Link href="/ProductsSection?categoria=ojos" className="hover:text-[#f790b1] transition-colors">
                                    Ojos
                                </Link>
                            </li>
                            <li>
                                <Link href="/ProductsSection?categoria=rostro" className="hover:text-[#f790b1] transition-colors">
                                    Rostro
                                </Link>
                            </li>
                            <li>
                                <Link href="/ProductsSection?categoria=complementos" className="hover:text-[#f790b1] transition-colors">
                                    Complementos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3 - Información */}
                    <div>
                        <h3
                            className="text-lg mb-4"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            Información
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/sobre-nosotros" className="hover:text-[#f790b1] transition-colors">
                                    Sobre Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="/preguntas-frecuentes" className="hover:text-[#f790b1] transition-colors">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                            <li>
                                <Link href="/envios" className="hover:text-[#f790b1] transition-colors">
                                    Información de Envíos
                                </Link>
                            </li>
                            <li>
                                <Link href="/cambios-devoluciones" className="hover:text-[#f790b1] transition-colors">
                                    Cambios y Devoluciones
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Columna 4 - Contacto */}
                    <div>
                        <h3
                            className="text-lg mb-4"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            Contacto
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-[#f790b1] flex-shrink-0 mt-1" size={18} />
                                <span className="text-gray-700">
                                    Santa Cruz, Argentina
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-[#9b6b9e] flex-shrink-0" size={18} />
                                <a href="tel:+541112345678" className="hover:text-[#f790b1] transition-colors">
                                    +54 2966680836
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-pink-300 bg-[#f790b1]">
                <div className="container mx-auto px-4 py-4">
                    <p className="text-center text-sm text-white">
                        © {currentYear} <span style={{ fontFamily: '"Fredoka One", sans-serif' }}>Poppimakecup</span>. Todos los derechos reservados.
                    </p>
                </div>
            </div>

        </footer>
    );
}