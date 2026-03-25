'use client';
import Image from 'next/image';
import Link from 'next/link';
import { TextAnimate } from '@/components/ui/text-animate';

export default function HeroSection() {
    return (
        <section className="bg-[var(--pink)] relative h-[70vh] md:h-[60vh] w-full overflow-hidden flex items-center justify-center">
            {/* Contenedor central de texto */}
            <div className='z-10 flex flex-col justify-center items-center text-center px-8'>
                <TextAnimate
                    variants={{
                        hidden: {
                            opacity: 0,
                            y: 30,
                            rotate: 45,
                            scale: 0.5,
                        },
                        show: (i) => ({
                            opacity: 1,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                            transition: {
                                delay: i * 0.2,
                                duration: 0.8,
                                y: {
                                    type: "spring",
                                    damping: 12,
                                    stiffness: 200,
                                    mass: 0.8,
                                },
                                rotate: {
                                    type: "spring",
                                    damping: 8,
                                    stiffness: 150,
                                },
                                scale: {
                                    type: "spring",
                                    damping: 10,
                                    stiffness: 300,
                                },
                            },
                        }),

                    }}
                    by="character"
                    className="text-lg md:text-[24px] tracking-wider mt-2" style={{ fontFamily: 'vidaloka, serif' }}>
                    Bienvenidos a
                </TextAnimate>
                <TextAnimate
                    animation="blurInUp" by="character" duration={3}
                    className="title-hover text-6xl md:text-[80px] font-bold text-[var(--title)] tracking-wider" style={{ fontFamily: 'Cookie, cursive' }}>
                    Poppi Makeup
                </TextAnimate>

                <Link
                    href="/ProductsSection"
                    className="title-hover bg-white text-[var(--title)] px-8 py-2.5 rounded-full mt-8 border border-[var(--title)] hover:bg-[var(--title)] hover:text-white transition duration-500 text-sm md:text-base font-medium">
                    Ver Productos
                </Link>
            </div>

            {/* Imágenes Decorativas con posicionamiento responsivo */}
            {/* Imagen 7 - Arriba Derecha (Cerca del medio en móvil) */}
            <Image
                src="/heroimg/7.png"
                alt="Decorative makeup 1"
                width={250}
                height={200}
                className="absolute top-10 right-0 lg:right-[10%] opacity-40 md:opacity-50 hover:opacity-100 transition duration-500 w-[200px] lg:w-[250px]"
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
            {/* Imagen 5 - Arriba Izquierda (Cerca del medio en móvil) */}
            <Image
                src="/heroimg/5.png"
                alt="Decorative makeup 2"
                width={250}
                height={200}
                className="absolute top-15 left-0 lg:left-[10%] opacity-40 md:opacity-50 hover:opacity-100 transition duration-500 w-[200px] lg:w-[250px]"
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
            {/* Imagen 6 - Abajo Izquierda */}
            <Image
                src="/heroimg/6.png"
                alt="Decorative makeup 3"
                width={250}
                height={200}
                className="absolute bottom-10 left-0 lg:left-0 opacity-40 md:opacity-50 hover:opacity-100 transition duration-500 w-[200px] lg:w-[250px]"
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
            {/* Imagen 4 - Abajo Derecha */}
            <Image
                src="/heroimg/4.png"
                alt="Decorative makeup 4"
                width={250}
                height={200}
                className="absolute bottom-10 right-0 lg:right-0 opacity-40 md:opacity-50 hover:opacity-100 transition duration-500 w-[200px] lg:w-[250px]"
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
        </section>
    );
}