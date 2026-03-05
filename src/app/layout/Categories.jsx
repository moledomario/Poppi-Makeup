'use client';

import Image from 'next/image';
import Link from 'next/link';


const categories = [
    {
        id: 1,
        name: 'Labiales',
        image: '/categories/labiales.jpg',
        link: '/ProductsSection?categoria=labios',
    },
    {
        id: 2,
        name: 'Ojos',
        image: '/categories/ojos.jpg',
        link: '/ProductsSection?categoria=ojos',
    },
    {
        id: 3,
        name: 'Rostro',
        image: '/categories/rostro.jpg',
        link: '/ProductsSection?categoria=rostro',
    },
];

export default function CategoriesSection() {

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">

                {/* Título */}
                <h2
                    className="text-4xl text-center mb-12"
                    style={{ fontFamily: '"Fredoka One", sans-serif' }}
                >
                    Nuestras Categorías
                </h2>

                {/* Grid de categorías */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.link}
                            className="group flex flex-col items-center"
                        >
                            {/* Círculo con imagen */}
                            <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-pink-100 to-pink-50 shadow-lg group-hover:shadow-xl transition-shadow">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
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