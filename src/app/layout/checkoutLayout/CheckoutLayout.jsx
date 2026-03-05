'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '../../lib/useStore';
import { supabase } from '../../supabase/supabaseClient';
import { ArrowLeft, MapPin, Phone, Mail, User, Package, Truck, Home, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, getSubtotal } = useStore();

    // Estados
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    });

    const [shippingZones, setShippingZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Cargar zonas de envío
    useEffect(() => {
        loadShippingZones();
    }, []);

    // Verificar que haya productos en el carrito
    useEffect(() => {
        if (!loading && cart.length === 0) {
            router.push('/cart');
        }
    }, [cart, loading, router]);

    const loadShippingZones = async () => {
        try {
            const { data, error } = await supabase
                .from('shipping_zones')
                .select('*')
                .eq('active', true)
                .order('price', { ascending: true });

            if (error) throw error;

            setShippingZones(data || []);

            // Seleccionar la primera zona por defecto (Retiro = $0)
            if (data && data.length > 0) {
                setSelectedZone(data[0]);
            }
        } catch (error) {
            console.error('Error loading shipping zones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';

        // Solo validar dirección si NO es retiro
        if (selectedZone && selectedZone.price > 0 && !formData.address.trim()) {
            newErrors.address = 'La dirección es requerida para envío a domicilio';
        }
        if (!selectedZone) newErrors.shipping = 'Selecciona un método de envío';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const orderData = {
                customer: formData,
                items: cart,
                shipping: { zone: selectedZone.name, cost: selectedZone.price },
                subtotal: getSubtotal(),
                total: getSubtotal() + selectedZone.price,
            };

            // Llamar a la API para crear la preferencia de Mercado Pago
            const response = await fetch('/api/mercadopago/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.details || 'Error al crear la preferencia de pago');
            }

            const { init_point } = await response.json();

            // Redirigir a Mercado Pago
            window.location.href = init_point;

        } catch (error) {
            console.error('Error:', error);
            alert(`Error al procesar la orden: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex items-center justify-center py-24">
                    <div className="w-16 h-16 border-4 border-[#f790b1] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) return null;

    const subtotal = getSubtotal();
    const shippingCost = selectedZone?.price || 0;
    const total = subtotal + shippingCost;

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="container mx-auto px-4 py-8">

                <nav className="text-sm text-gray-600 mb-8">
                    <Link href="/" className="hover:text-[#f790b1]">Inicio</Link>
                    <span className="mx-2">/</span>
                    <Link href="/cart" className="hover:text-[#f790b1]">Carrito</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Checkout</span>
                </nav>

                <div className="flex items-center gap-4 mb-8">
                    <Link href="/cart" className="p-2 hover:bg-gray-200 rounded-lg">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-4xl" style={{ fontFamily: '"Fredoka One", sans-serif' }}>
                        Finalizar Compra
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2 space-y-6">

                            {/* Datos personales */}
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <h2 className="text-2xl mb-4 flex items-center gap-2" style={{ fontFamily: '"Fredoka One", sans-serif' }}>
                                    <User size={24} className="text-[#f790b1]" />
                                    Datos Personales
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Nombre completo *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-300 focus:border-[#f790b1]'
                                                }`}
                                            placeholder="Juan Pérez"
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-[#f790b1]'
                                                    }`}
                                                placeholder="juan@ejemplo.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Teléfono *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-[#f790b1]'
                                                    }`}
                                                placeholder="2966123456"
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Método de envío */}
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <h2 className="text-2xl mb-4 flex items-center gap-2" style={{ fontFamily: '"Fredoka One", sans-serif' }}>
                                    <Truck size={24} className="text-[#f790b1]" />
                                    Método de Envío
                                </h2>
                                <div className="space-y-3">
                                    {shippingZones.map((zone) => (
                                        <label
                                            key={zone.id}
                                            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedZone?.id === zone.id ? 'border-[#f790b1] bg-pink-50' : 'border-gray-300 hover:border-[#f790b1]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        checked={selectedZone?.id === zone.id}
                                                        onChange={() => setSelectedZone(zone)}
                                                        className="w-5 h-5 accent-[#f790b1]"
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            {zone.price === 0 ? <Home size={20} className="text-[#f790b1]" /> : <Truck size={20} className="text-[#f790b1]" />}
                                                            <span className="font-medium">{zone.name}</span>
                                                        </div>
                                                        {zone.price === 0 && <p className="text-sm text-gray-600 ml-7 mt-1">Retirá tu pedido en nuestra tienda</p>}
                                                    </div>
                                                </div>
                                                <span className="text-xl font-bold" style={{ fontFamily: '"Fredoka One", sans-serif' }}>
                                                    {zone.price === 0 ? 'Gratis' : `$${parseFloat(zone.price).toFixed(0)}`}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.shipping && <p className="text-red-500 text-sm mt-2">{errors.shipping}</p>}
                            </div>

                            {/* Dirección (solo si es envío) */}
                            {selectedZone && selectedZone.price > 0 && (
                                <div className="bg-white rounded-2xl shadow-md p-6">
                                    <h2 className="text-2xl mb-4 flex items-center gap-2" style={{ fontFamily: '"Fredoka One", sans-serif' }}>
                                        <MapPin size={24} className="text-[#f790b1]" />
                                        Dirección de Envío
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Dirección completa *</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${errors.address ? 'border-red-500' : 'border-gray-300 focus:border-[#f790b1]'
                                                    }`}
                                                placeholder="Calle, Número, Piso/Depto"
                                            />
                                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Notas (opcional)</label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#f790b1] focus:outline-none"
                                                placeholder="Referencias, horario, etc."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resumen */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Fredoka One", sans-serif' }}>
                                    Resumen del Pedido
                                </h2>
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {cart.map((item) => (

                                        <div key={item.cartItemId} className="flex gap-3">

                                            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                <Image src={item.images[0]} alt={item.name} fill className="object-contain p-1" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{item.name}</p>
                                                {item.color && <p className="text-xs text-gray-600">Color: {item.color.name}</p>}
                                                <p className="text-sm text-gray-600">Cant: {item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-200 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Envío</span>
                                        <span className="font-medium">{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}</span>
                                    </div>
                                </div>
                                <div className="border-t-2 border-gray-300 mt-4 pt-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-lg font-medium">Total</span>
                                        <span className="text-3xl text-[#f790b1]" style={{ fontFamily: '"Fredoka One", sans-serif' }}>
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full mt-6 bg-[#f790b1] text-white py-4 rounded-full hover:bg-[#f570a0] transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                    style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                >
                                    {submitting ? 'Procesando...' : (
                                        <>
                                            <CreditCard size={20} />
                                            Ir al Pago
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-4">
                                    Serás redirigido a Mercado Pago para completar el pago
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}