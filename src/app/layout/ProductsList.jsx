'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../Components/ProductCard';
import { supabase } from '../supabase/supabaseClient';

export default function ProductsList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    images:product_images(image_url, is_main, display_order),
                    colors:product_colors(name, hex, stock)
                `)
                .eq('featured', true)
                .limit(4);

            if (error) throw error;

            // Normalizar productos
            const normalizedProducts = data.map(product => ({
                ...product,
                images: product.images?.sort((a, b) => a.display_order - b.display_order) || [],
                image: product.images?.find(img => img.is_main)?.image_url
                    || product.images?.[0]?.image_url
                    || null,
            }));

            setProducts(normalizedProducts);
        } catch (error) {
            console.error('Error loading featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-[#f790b1] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2
                            className="text-4xl mb-2"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            Productos Destacados
                        </h2>
                        <p className="text-gray-600">Lo más vendido de esta semana</p>
                    </div>


                    <Link
                        href="/productsSection"
                        className="px-8 py-2.5 rounded-full mt-8 border-2 border-[#f790b1] text-[#000000] hover:bg-[#f790b1] hover:text-white transition-colors hidden md:block cursor-pointer "
                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                    >
                        Ver todo
                    </Link>

                </div>

                {/* Grid de productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Ver todo en mobile */}
                <div className="text-center mt-8 md:hidden">
                    <Link
                        href="/productsSection"
                        className="inline-block text-[#f790b1] hover:text-[#f570a0] transition-colors"
                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                    >
                        Ver todo
                    </Link>
                </div>

            </div>
        </section>
    );
}
