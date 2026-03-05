'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductFilters from './filters';
import ProductCard from '../Components/ProductCard';
import { supabase } from '../supabase/supabaseClient';
import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';


export default function ProductsPage() {
    // Estado de productos
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados de filtros
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [showOnlyInStock, setShowOnlyInStock] = useState(false);
    const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Cargar datos desde Supabase
    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get('categoria');

    // Sincronizar parámetro de búsqueda con el estado de categoría
    useEffect(() => {
        if (categoryQuery && categories.length > 0) {
            const found = categories.find(c =>
                c.slug === categoryQuery ||
                c.id.toString() === categoryQuery
            );

            if (found) {
                if (found.parent_id) {
                    // Si es una subcategoría, seleccionamos el padre y la subcategoría
                    setSelectedCategory(found.parent_id);
                    setSelectedSubcategory(found.id);
                } else {
                    // Si es una categoría principal
                    setSelectedCategory(found.id);
                    setSelectedSubcategory(null);
                }
            } else {
                setSelectedCategory(categoryQuery);
                setSelectedSubcategory(null);
            }
        }
    }, [categoryQuery, categories]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          category:categories!products_category_id_fkey(id, name, slug),
          subcategory:categories!products_subcategory_id_fkey(id, name, slug),
          images:product_images(image_url, is_main, display_order),
          colors:product_colors(name, hex, stock)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Ordenar imágenes de cada producto
            const normalizedProducts = data.map(product => ({
                ...product,
                images: product.images?.sort((a, b) => a.display_order - b.display_order) || [],
                // Imagen principal para ProductCard
                image: product.images?.find(img => img.is_main)?.image_url
                    || product.images?.[0]?.image_url
                    || null,
            }));

            setProducts(normalizedProducts);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
            if (error) throw error;
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    // Verificar stock
    const hasStock = (product) => {
        if (product.colors?.length > 0) {
            return product.colors.some(color => color.stock > 0);
        }
        return product.stock > 0;
    };

    // Filtrar y ordenar productos
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Filtro por categoría principal
        if (selectedCategory) {
            filtered = filtered.filter(p =>
                p.category?.id === selectedCategory ||
                p.category?.slug === selectedCategory ||
                p.category_id === selectedCategory
            );
        }

        // Filtro por subcategoría
        if (selectedSubcategory) {
            filtered = filtered.filter(p => p.subcategory?.id === selectedSubcategory);
        }

        // Filtro por rango de precio
        if (priceRange.min !== '') {
            filtered = filtered.filter(p => p.price >= parseFloat(priceRange.min));
        }
        if (priceRange.max !== '') {
            filtered = filtered.filter(p => p.price <= parseFloat(priceRange.max));
        }

        // Filtro por stock
        if (showOnlyInStock) {
            filtered = filtered.filter(p => hasStock(p));
        }

        // Filtro por ofertas
        if (showOnlyOnSale) {
            filtered = filtered.filter(p => p.discount > 0);
        }

        // Filtro por búsqueda
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.category?.name.toLowerCase().includes(query) ||
                p.subcategory?.name.toLowerCase().includes(query)
            );
        }

        // Ordenamiento
        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        return filtered;
    }, [products, selectedCategory, selectedSubcategory, priceRange, showOnlyInStock, showOnlyOnSale, searchQuery, sortBy]);

    // Limpiar filtros
    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setPriceRange({ min: '', max: '' });
        setShowOnlyInStock(false);
        setShowOnlyOnSale(false);
        setSearchQuery('');
    };

    // Contador de filtros activos
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (selectedCategory) count++;
        if (selectedSubcategory) count++;
        if (priceRange.min || priceRange.max) count++;
        if (showOnlyInStock) count++;
        if (showOnlyOnSale) count++;
        return count;
    }, [selectedCategory, selectedSubcategory, priceRange, showOnlyInStock, showOnlyOnSale]);

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb y título */}
                <div className="mb-8">
                    <nav className="text-sm text-gray-600 mb-3">
                        <a href="/" className="hover:text-[#f790b1]">Inicio</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">Productos</span>
                    </nav>

                    <h1
                        className="text-4xl mb-2"
                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                    >
                        Todos los productos
                    </h1>
                    <p className="text-gray-600">
                        {loading
                            ? 'Cargando...'
                            : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto' : 'productos'} encontrados`
                        }
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <ProductFilters
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedSubcategory={selectedSubcategory}
                            setSelectedSubcategory={setSelectedSubcategory}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            showOnlyInStock={showOnlyInStock}
                            setShowOnlyInStock={setShowOnlyInStock}
                            showOnlyOnSale={showOnlyOnSale}
                            setShowOnlyOnSale={setShowOnlyOnSale}
                            onClearFilters={clearFilters}
                        />
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-1">

                        {/* Barra de controles */}
                        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">

                            {/* Botón filtros mobile */}
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#f790b1] transition-colors"
                            >
                                <SlidersHorizontal size={20} />
                                <span>Filtros</span>
                                {activeFiltersCount > 0 && (
                                    <span className="bg-[#f790b1] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>

                            {/* Ordenamiento */}
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-gray-600 hidden sm:block">Ordenar por:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#f790b1] focus:outline-none bg-white cursor-pointer"
                                >
                                    <option value="featured">Destacados</option>
                                    <option value="price-asc">Precio: Menor a Mayor</option>
                                    <option value="price-desc">Precio: Mayor a Menor</option>
                                    <option value="name">Nombre A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Filtros Mobile Drawer */}
                        {showMobileFilters && (
                            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMobileFilters(false)}>
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3
                                            className="text-2xl"
                                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                        >
                                            Filtros
                                        </h3>
                                        <button onClick={() => setShowMobileFilters(false)} className="text-gray-500 hover:text-gray-700">
                                            ✕
                                        </button>
                                    </div>

                                    <ProductFilters
                                        categories={categories}
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={setSelectedCategory}
                                        selectedSubcategory={selectedSubcategory}
                                        setSelectedSubcategory={setSelectedSubcategory}
                                        priceRange={priceRange}
                                        setPriceRange={setPriceRange}
                                        showOnlyInStock={showOnlyInStock}
                                        setShowOnlyInStock={setShowOnlyInStock}
                                        showOnlyOnSale={showOnlyOnSale}
                                        setShowOnlyOnSale={setShowOnlyOnSale}
                                        onClearFilters={clearFilters}
                                    />

                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="w-full mt-6 bg-[#f790b1] text-white py-3 rounded-lg hover:bg-[#f570a0] transition-colors"
                                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                    >
                                        Ver {filteredProducts.length} productos
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading skeleton */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-3xl shadow-md overflow-hidden animate-pulse">
                                        <div className="aspect-square bg-gray-200" />
                                        <div className="p-6 space-y-3">
                                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                                            <div className="h-8 bg-gray-200 rounded w-1/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">😔</div>
                                <h3
                                    className="text-2xl mb-2 text-gray-800"
                                    style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                >
                                    No encontramos productos
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Intenta cambiar los filtros o buscar algo diferente
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-[#f790b1] text-white px-6 py-3 rounded-lg hover:bg-[#f570a0] transition-colors"
                                    style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}