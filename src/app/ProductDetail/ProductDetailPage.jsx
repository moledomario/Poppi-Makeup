'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '../lib/useStore';
import { supabase } from '../supabase/supabaseClient';
import { ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';

export default function ProductDetailPage({ productId }) {
    const addToCart = useStore(state => state.addToCart);

    // Estados
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    // Cargar producto desde Supabase
    useEffect(() => {
        if (productId) {
            loadProduct();
        }
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          category:categories!products_category_id_fkey(id, name, slug),
          subcategory:categories!products_subcategory_id_fkey(id, name, slug),
          images:product_images(id, image_url, is_main, display_order),
          colors:product_colors(id, name, hex, stock)
        `)
                .eq('id', productId)
                .single();

            if (error) throw error;

            // Ordenar imágenes
            if (data.images) {
                data.images = data.images.sort((a, b) => a.display_order - b.display_order);
            }

            setProduct(data);

            // Setear imagen principal
            const mainImage = data.images?.find(img => img.is_main) || data.images?.[0];
            setSelectedImage(mainImage?.image_url);

            // Setear primer color disponible
            if (data.colors && data.colors.length > 0) {
                const firstAvailable = data.colors.find(c => c.stock > 0) || data.colors[0];
                setSelectedColor(firstAvailable);
            }
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">

                <main className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center py-24">
                        <div className="w-16 h-16 border-4 border-[#f790b1] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (!product) {

        return (
            <div className="min-h-screen bg-gray-50">

                <main className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Producto no encontrado</h1>
                        <Link href="/ProductsSection" className="text-[#f790b1] hover:underline">
                            Volver a productos
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    // Verificar stock del color seleccionado o del producto general
    const availableStock = selectedColor
        ? selectedColor.stock
        : product.stock;

    const isInStock = availableStock > 0;

    // Todas las imágenes (para la galería)
    const allImages = product.images?.map(img => img.image_url) || [];

    // Manejar cambio de cantidad
    const handleQuantityChange = (increment) => {
        const newQuantity = quantity + increment;
        if (newQuantity >= 1 && newQuantity <= availableStock) {
            setQuantity(newQuantity);
        }
    };

    // Agregar al carrito
    const handleAddToCart = () => {
        addToCart(product, selectedColor, quantity);
        setAddedToCart(true);

        setTimeout(() => {
            setAddedToCart(false);
        }, 2000);
    };

    let caracteristicas = [];
    if (product.features.length > 0) {
        caracteristicas = product.features.split('\n');
    } else {
        caracteristicas = ["Bueno", "Bonito", "Barato"];
    }

    // Calcular precio con descuento
    const finalPrice = product.discount > 0
        ? parseFloat(product.price) * (1 - product.discount / 100)
        : parseFloat(product.price);

    return (
        <div className="min-h-screen bg-gray-50">


            <main className="container mx-auto px-4 py-8">

                {/* Breadcrumb */}
                <nav className="text-sm text-gray-600 mb-8">
                    <Link href="/" className="hover:text-[#f790b1]">Inicio</Link>
                    <span className="mx-2">/</span>
                    <Link href="/ProductsSection" className="hover:text-[#f790b1]">Productos</Link>
                    {product.subcategory && (
                        <>
                            <span className="mx-2">/</span>
                            <Link
                                href={`/ProductsSection?categoria=${product.category.name.toLowerCase()}`}
                                className="hover:text-[#f790b1]"
                            >
                                {product.subcategory.name}
                            </Link>
                        </>
                    )}
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Galería de imágenes */}
                    <div className="space-y-4">
                        {/* Imagen principal */}
                        <div className="relative w-full h-[500px] aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                            <Image
                                src={selectedImage}
                                alt={product.name}
                                fill
                                className="object-contain"
                                priority
                            />

                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                                {product.discount > 0 && (
                                    <span className="bg-[#f790b1] text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                                        -{product.discount}% OFF
                                    </span>
                                )}
                                {!isInStock && (
                                    <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                                        Sin Stock
                                    </span>
                                )}
                            </div>

                            {/* Botón wishlist */}
                            <button
                                onClick={() => setIsInWishlist(!isInWishlist)}
                                className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all z-10 ${isInWishlist
                                    ? 'bg-[#f790b1] text-white scale-110'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:scale-105'
                                    }`}
                                aria-label="Agregar a favoritos"
                            >
                                <Heart size={24} fill={isInWishlist ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Miniaturas - Fila horizontal debajo */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {allImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-white ${selectedImage === image
                                        ? 'border-[#f790b1] shadow-md scale-105'
                                        : 'border-gray-200 hover:border-[#f790b1] hover:shadow-sm'
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.name} - Vista ${index + 1}`}
                                        fill
                                        className="object-contain p-1"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        loading="eager"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Información del producto */}
                    <div>
                        {/* Título y precio */}
                        <h1
                            className="text-4xl mb-3"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            {product.name}
                        </h1>

                        <p className="text-gray-600 text-lg mb-6">
                            {product.description}
                        </p>

                        {/* Precio */}
                        <div className="mb-8">
                            {product.discount > 0 ? (
                                <div className="flex items-baseline gap-3">
                                    <span
                                        className="text-4xl text-[#f790b1]"
                                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                    >
                                        ${finalPrice.toFixed(2)}
                                    </span>
                                    <span className="text-2xl text-gray-400 line-through">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </span>
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                                        Ahorrás ${(parseFloat(product.price) - finalPrice).toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span
                                    className="text-4xl text-gray-800"
                                    style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                >
                                    ${parseFloat(product.price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Selector de color (solo si aplica) */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-8">
                                <label className="block text-lg font-medium mb-3">
                                    Color: <span className="text-[#f790b1]">{selectedColor.name}</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => {
                                                setSelectedColor(color);
                                                setQuantity(1); // Reset cantidad al cambiar color
                                            }}
                                            disabled={color.stock === 0}
                                            className={`relative group ${color.stock === 0 ? 'cursor-not-allowed opacity-50' : ''
                                                }`}
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-full border-4 transition-all ${selectedColor.name === color.name
                                                    ? 'border-[#f790b1] ring-2 ring-[#f790b1] ring-offset-2'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            {color.stock === 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-0.5 h-16 bg-gray-400 rotate-45"></div>
                                                </div>
                                            )}
                                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                {color.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {selectedColor && selectedColor.stock > 0 && selectedColor.stock <= 5 && (
                                    <p className="text-sm text-orange-600 mt-3">
                                        ¡Solo quedan {selectedColor.stock} unidades en este color!
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Stock disponible */}
                        {!product.colors && availableStock > 0 && availableStock <= 10 && (
                            <p className="text-sm text-orange-600 mb-4">
                                ¡Solo quedan {availableStock} unidades disponibles!
                            </p>
                        )}

                        {/* Cantidad */}
                        <div className="mb-8">
                            <label className="block text-lg font-medium mb-3">Cantidad:</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="px-4 py-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="px-6 py-3 font-medium min-w-[60px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= availableStock}
                                        className="px-4 py-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {availableStock} disponibles
                                </span>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                                className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-full transition-all ${isInStock
                                    ? addedToCart
                                        ? 'bg-green-500 text-white shadow-lg'
                                        : 'bg-[#f790b1] hover:bg-[#f570a0] text-white shadow-lg hover:shadow-xl'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                <ShoppingCart size={24} />
                                {addedToCart
                                    ? '¡Agregado!'
                                    : isInStock
                                        ? 'Agregar al carrito'
                                        : 'Sin stock'
                                }
                            </button>

                            <button
                                className="p-4 border-2 border-gray-300 rounded-full hover:border-[#f790b1] hover:text-[#f790b1] transition-colors"
                                aria-label="Compartir"
                            >
                                <Share2 size={24} />
                            </button>
                        </div>

                        {/* Información adicional */}
                        <div className="space-y-4 border-t border-gray-200 pt-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-pink-50 rounded-lg">
                                    <Truck className="text-[#f790b1]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Envío a todo el país</h4>
                                    <p className="text-sm text-gray-600">Calculá el costo al finalizar la compra</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-pink-50 rounded-lg">
                                    <Shield className="text-[#f790b1]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Compra protegida</h4>
                                    <p className="text-sm text-gray-600">Recibí el producto o te devolvemos el dinero</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-pink-50 rounded-lg">
                                    <RotateCcw className="text-[#f790b1]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Cambios y devoluciones</h4>
                                    <p className="text-sm text-gray-600">30 días para devolver tu producto</p>
                                </div>
                            </div>
                        </div>

                        {/* Descripción detallada */}
                        <div className="border-t border-gray-200 pt-8 mt-8">
                            <h3
                                className="text-2xl mb-4"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                Descripción
                            </h3>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                                {console.log('product.features:', product.features)}
                                <h4 className="font-medium mt-4 mb-2">Características:</h4>

                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {caracteristicas.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}