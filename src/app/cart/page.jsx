'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '../lib/useStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

export default function CartPage() {
    const {
        cart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        updateQuantity,
        clearCart,
        getSubtotal,
        getTotalDiscount,
    } = useStore();

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const subtotal = getSubtotal();
    const totalDiscount = getTotalDiscount();
    const shipping = 0; // Se calculará en el checkout según la zona
    const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = subtotal - couponDiscount + shipping;

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        // Aquí validarías el cupón con tu backend
        // Por ahora es solo un ejemplo
        if (couponCode.toUpperCase() === 'POPPI10') {
            setAppliedCoupon({
                code: couponCode,
                discount: subtotal * 0.1, // 10% de descuento
            });
        } else {
            alert('Cupón inválido');
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">

                <main className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white rounded-3xl shadow-lg p-12">
                            <div className="w-32 h-32 mx-auto mb-6 bg-pink-50 rounded-full flex items-center justify-center">
                                <ShoppingBag className="text-[#f790b1]" size={64} />
                            </div>
                            <h1
                                className="text-3xl mb-4"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                Tu carrito está vacío
                            </h1>
                            <p className="text-gray-600 mb-8">
                                ¡Descubre nuestros productos y comienza a comprar!
                            </p>
                            <Link
                                href="/ProductsSection"
                                className="inline-flex items-center gap-2 bg-[#f790b1] text-white px-8 py-4 rounded-full hover:bg-[#f570a0] transition-colors shadow-lg"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                Ir a comprar
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="container mx-auto px-4 py-8">

                {/* Breadcrumb */}
                <nav className="text-sm text-gray-600 mb-8">
                    <Link href="/" className="hover:text-[#f790b1]">Inicio</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Carrito</span>
                </nav>

                {/* Título */}
                <div className="flex items-center justify-between mb-8">
                    <h1
                        className="text-4xl"
                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                    >
                        Mi Carrito
                    </h1>
                    <button
                        onClick={clearCart}
                        className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Vaciar carrito
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Lista de productos */}
                    <div className="lg:col-span-2 space-y-4">

                        {cart.map((item) => (
                            <div
                                key={item.cartItemId}
                                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex gap-6">

                                    {/* Imagen del producto */}
                                    <Link
                                        href={`/products/${item.productId}`}
                                        className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden"
                                    >

                                        {item.images ? (
                                            < Image
                                                src={item.images[0]}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                                Sin imagen
                                            </div>
                                        )}
                                    </Link>

                                    {/* Información del producto */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link
                                                href={`/products/${item.productId}`}
                                                className="hover:text-[#f790b1] transition-colors"
                                            >
                                                <h3
                                                    className="text-xl mb-1"
                                                    style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                                >
                                                    {item.name}
                                                </h3>
                                            </Link>

                                            {item.color && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm text-gray-600">Color:</span>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-5 h-5 rounded-full border-2 border-gray-300"
                                                            style={{ backgroundColor: item.color.hex }}
                                                        />
                                                        <span className="text-sm font-medium">{item.color.name}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {item.discount > 0 && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                                                        {item.discount}% OFF
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-end justify-between mt-4">
                                            {/* Precio */}
                                            <div>
                                                {item.discount > 0 ? (
                                                    <div className="flex items-baseline gap-2">
                                                        <span
                                                            className="text-2xl text-[#f790b1]"
                                                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                                        >
                                                            ${item.price.toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ${item.originalPrice.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span
                                                        className="text-2xl"
                                                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                                    >
                                                        ${item.price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Controles de cantidad */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => decrementQuantity(item.cartItemId)}
                                                        disabled={item.quantity <= 1}
                                                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value) || 1;
                                                            updateQuantity(item.cartItemId, value);
                                                        }}
                                                        className="w-16 text-center font-medium border-x-2 border-gray-300 py-2"
                                                        min="1"
                                                        max={item.stock}
                                                    />
                                                    <button
                                                        onClick={() => incrementQuantity(item.cartItemId)}
                                                        disabled={item.quantity >= item.stock}
                                                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                {/* Botón eliminar */}
                                                <button
                                                    onClick={() => removeFromCart(item.cartItemId)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    aria-label="Eliminar del carrito"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Stock disponible */}
                                        {item.stock <= 5 && (
                                            <p className="text-xs text-orange-600 mt-2">
                                                ¡Solo quedan {item.stock} unidades!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen del pedido */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                            <h2
                                className="text-2xl mb-6"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                Resumen del pedido
                            </h2>

                            {/* Cupón de descuento */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">
                                    ¿Tenés un cupón?
                                </label>
                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Código de cupón"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#f790b1] focus:outline-none"
                                        disabled={appliedCoupon !== null}
                                    />
                                    {appliedCoupon ? (
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            Quitar
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-[#f790b1] text-white rounded-lg hover:bg-[#f570a0] transition-colors"
                                        >
                                            Aplicar
                                        </button>
                                    )}
                                </form>
                                {appliedCoupon && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                                        <Tag size={16} />
                                        <span>Cupón "{appliedCoupon.code}" aplicado</span>
                                    </div>
                                )}
                            </div>

                            {/* Desglose de precios */}
                            <div className="space-y-3 border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>

                                {totalDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Descuentos en productos</span>
                                        <span className="font-medium">-${totalDiscount.toFixed(2)}</span>
                                    </div>
                                )}

                                {appliedCoupon && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Cupón de descuento</span>
                                        <span className="font-medium">-${couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span>Envío</span>
                                    <span className="text-gray-500">A calcular en checkout</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t-2 border-gray-300 mt-4 pt-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-lg font-medium">Total</span>
                                    <span
                                        className="text-3xl text-[#f790b1]"
                                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                    >
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Botón de checkout */}
                            <Link
                                href="/checkout"
                                className="w-full mt-6 bg-[#f790b1] text-white py-4 rounded-full hover:bg-[#f570a0] transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                Ir al checkout
                                <ArrowRight size={20} />
                            </Link>

                            <Link
                                href="/ProductsSection"
                                className="block text-center mt-4 text-sm text-gray-600 hover:text-[#f790b1] transition-colors"
                            >
                                Continuar comprando
                            </Link>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}