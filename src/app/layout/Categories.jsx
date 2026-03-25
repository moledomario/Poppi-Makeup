'use client';

import Image from 'next/image';
import Link from 'next/link';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const categories = [
    {
        id: 1,
        name: 'Labiales',
        image: '/categories/labiales.jpg',
        link: '/ProductsSection?categoria=labios',
        duration: 300
    },
    {
        id: 2,
        name: 'Ojos',
        image: '/categories/ojos.jpg',
        link: '/ProductsSection?categoria=ojos',
        duration: 600
    },
    {
        id: 3,
        name: 'Rostro',
        image: '/categories/rostro.jpg',
        link: '/ProductsSection?categoria=rostro',
        duration: 900
    },
];

export default function CategoriesSection() {
    useEffect(() => {
        Aos.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    return (
        <section className="py-16 categories-back">
            <div className="container mx-auto px-4">

                {/* Título */}
                <h2
                    className="text-4xl text-center mb-4 uppercase"
                    style={{ fontFamily: '"work_sans", sans-serif' }}
                >
                    Nuestras Categorías
                </h2>
                <div className="w-1/2 mx-auto h-1 bg-[var(--title)] mb-12"></div>

                {/* Grid de categorías */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.link}
                            className="group flex flex-col items-center"
                            data-aos="fade-up"
                            data-aos-delay={category.duration}
                        >
                            {/* Círculo con imagen */}
                            <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-pink-100 to-pink-50 shadow-lg group-hover:shadow-xl transition-shadow">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            {/* Nombre de categoría */}
                            <h3
                                className="text-xl text-gray-800 group-hover:text-[#f790b1] transition-colors"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                {category.name}
                            </h3>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}