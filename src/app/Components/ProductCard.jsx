'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '../lib/useStore';

export default function ProductCard({ product }) {
    const addToCart = useStore(state => state.addToCart);

    const hasStock = () => {
        if (product.colors && product.colors.length > 0) {
            return product.colors.some(color => color.stock > 0);
        }
        return product.stock > 0;
    };

    const inStock = hasStock();
    const hasDiscount = product.discount > 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        // Si tiene colores, agregar el primer color disponible
        const firstAvailableColor = product.colors?.find(c => c.stock > 0) || null;
        addToCart(product, firstAvailableColor, 1);
    };

    return (
        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">

            {/* Imagen del producto */}
            <Link href={`/products/${product.id}`} className="block relative aspect-square bg-gradient-to-br from-pink-50 to-pink-100 overflow-hidden">
                {product.image ? (

                    < Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Sin imagen
                    </div>
                )}

                {/* Badge de descuento */}
                {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discount}%
                    </div>
                )}

                {/* Badge sin stock */}
                {!inStock && (
                    <div className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Sin Stock
                    </div>
                )}
            </Link>

            {/* Información del producto */}
            <div className="p-6">
                <Link href={`/products/${product.id}`}>
                    <h3
                        className="text-xl mb-2 text-gray-800 hover:text-[#f790b1] transition-colors"
                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                    >
                        {product.name}
                    </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-4">
                    {product.description}
                </p>

                {/* Precio y botón */}
                <div className="flex items-center justify-between">
                    <div>
                        {hasDiscount ? (
                            <div className="flex items-center gap-2">
                                <span
                                    className="text-2xl text-[#f790b1]"
                                    style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                >
                                    ${(parseFloat(product.price) * (1 - product.discount / 100)).toFixed(2)}
                                </span>
                                <span className="text-gray-400 line-through text-sm">
                                    ${parseFloat(product.price).toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span
                                className="text-2xl text-gray-800"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                ${parseFloat(product.price).toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Botón agregar al carrito */}
                    <button
                        disabled={!inStock}
                        className={`p-3 rounded-full transition-colors ${inStock
                            ? 'bg-[#f790b1] hover:bg-[#f570a0] text-white cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        aria-label="Agregar al carrito"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}