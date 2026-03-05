'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';

export default function ProductFilters({
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    priceRange,
    setPriceRange,
    showOnlyInStock,
    setShowOnlyInStock,
    showOnlyOnSale,
    setShowOnlyOnSale,
    onClearFilters
}) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

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

    const [expandedSections, setExpandedSections] = useState({
        category: true,
        price: true,
        availability: true,
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Organizar categorías en un árbol (padres e hijos)
    const categoryTree = useMemo(() => {
        const parents = categories.filter(c => !c.parent_id);
        return parents.map(parent => ({
            ...parent,
            subcategories: categories.filter(c => c.parent_id === parent.id)
        }));
    }, [categories]);

    return (

        <aside className="bg-white rounded-2xl shadow-md p-6 sticky top-24 h-fit">
            {/* Header con botón limpiar */}
            <div className="flex items-center justify-between mb-6">
                <h3
                    className="text-2xl"
                    style={{ fontFamily: '"Fredoka One", sans-serif' }}
                >
                    Filtros
                </h3>
                <button
                    onClick={onClearFilters}
                    className="text-sm text-gray-500 hover:text-[#f790b1] transition-colors flex items-center gap-1"
                >
                    <X size={16} />
                    Limpiar
                </button>
            </div>

            {/* Categorías */}
            <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                    onClick={() => toggleSection('category')}
                    className="w-full flex items-center justify-between mb-3"
                >
                    <span
                        className="text-lg"
                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                    >
                        Categorías
                    </span>
                    {expandedSections.category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.category && (
                    <div className="space-y-2">
                        {/* Todas las categorías */}
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === null}
                                onChange={() => {
                                    setSelectedCategory(null);
                                    setSelectedSubcategory(null);
                                }}
                                className="mr-3 accent-[#f790b1]"
                            />
                            <span className="text-gray-700 group-hover:text-[#f790b1] transition-colors">
                                Todas
                            </span>
                        </label>

                        {/* Árbol de categorías */}
                        {categoryTree.map((parent) => (
                            <div key={parent.id}>
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === parent.id && selectedSubcategory === null}
                                        onChange={() => {
                                            setSelectedCategory(parent.id);
                                            setSelectedSubcategory(null);
                                        }}
                                        className="mr-3 accent-[#f790b1]"
                                    />
                                    <span className={`text-gray-700 group-hover:text-[#f790b1] transition-colors ${selectedCategory === parent.id ? 'font-bold text-[#f790b1]' : 'font-medium'}`}>
                                        {parent.name}
                                    </span>
                                </label>

                                {/* Subcategorías (solo si el padre está seleccionado) */}
                                {selectedCategory === parent.id && parent.subcategories.length > 0 && (
                                    <div className="ml-6 mt-2 space-y-2 border-l-2 border-pink-50 pl-4">
                                        {parent.subcategories.map(sub => (
                                            <label key={sub.id} className="flex items-center cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="subcategory"
                                                    checked={selectedSubcategory === sub.id}
                                                    onChange={() => setSelectedSubcategory(sub.id)}
                                                    className="mr-3 accent-[#f790b1]"
                                                />
                                                <span className={`text-sm group-hover:text-[#f790b1] transition-colors ${selectedSubcategory === sub.id ? 'text-[#f790b1] font-medium' : 'text-gray-600'}`}>
                                                    {sub.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rango de precio */}
            <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between mb-3"
                >
                    <span
                        className="text-lg"
                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                    >
                        Precio
                    </span>
                    {expandedSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.price && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                placeholder="Mín"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#f790b1] focus:outline-none"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                                type="number"
                                placeholder="Máx"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#f790b1] focus:outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Disponibilidad */}
            <div>
                <button
                    onClick={() => toggleSection('availability')}
                    className="w-full flex items-center justify-between mb-3"
                >
                    <span
                        className="text-lg"
                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                    >
                        Disponibilidad
                    </span>
                    {expandedSections.availability ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.availability && (
                    <div className="space-y-3">
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={showOnlyInStock}
                                onChange={(e) => setShowOnlyInStock(e.target.checked)}
                                className="mr-3 accent-[#f790b1]"
                            />
                            <span className="text-gray-700 group-hover:text-[#f790b1] transition-colors">
                                Solo en stock
                            </span>
                        </label>

                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={showOnlyOnSale}
                                onChange={(e) => setShowOnlyOnSale(e.target.checked)}
                                className="mr-3 accent-[#f790b1]"
                            />
                            <span className="text-gray-700 group-hover:text-[#f790b1] transition-colors">
                                Solo en oferta
                            </span>
                        </label>
                    </div>
                )}
            </div>

        </aside>
    );
}