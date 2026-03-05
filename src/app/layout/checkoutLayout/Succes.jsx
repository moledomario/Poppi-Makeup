'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '../../lib/useStore';
import { CheckCircle, Package } from 'lucide-react';

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useStore();

    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');

    useEffect(() => {
        // Limpiar el carrito después de pago exitoso
        if (status === 'approved') {
            clearCart();
        }
    }, [status, clearCart]);

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">

                        {/* Ícono de éxito */}
                        <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="text-green-500" size={48} />
                        </div>

                        {/* Título */}
                        <h1
                            className="text-4xl mb-4 text-green-600"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            ¡Pago Exitoso!
                        </h1>

                        <p className="text-xl text-gray-700 mb-8">
                            Tu compra ha sido procesada correctamente
                        </p>

                        {/* Detalles */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                            <div className="space-y-3">
                                {paymentId && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">ID de Pago:</span>
                                        <span className="font-bold">#{paymentId}</span>
                                    </div>
                                )}
                                {externalReference && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">N° de Orden:</span>
                                        <span className="font-bold">{externalReference}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Estado:</span>
                                    <span className="text-green-600 font-bold">Aprobado</span>
                                </div>
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="bg-blue-50 rounded-xl p-6 mb-8">
                            <div className="flex items-start gap-3">
                                <Package className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                                <div className="text-left">
                                    <h3 className="font-bold text-blue-900 mb-2">¿Qué sigue?</h3>
                                    <p className="text-sm text-blue-800">
                                        Recibirás un email con la confirmación de tu compra y los detalles del envío o retiro.
                                        Te contactaremos pronto para coordinar la entrega.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/"
                                className="flex-1 bg-[#f790b1] text-white py-4 rounded-full hover:bg-[#f570a0] transition-colors shadow-lg text-center"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                Volver al Inicio
                            </Link>
                            <Link
                                href="/productos"
                                className="flex-1 border-2 border-[#f790b1] text-[#f790b1] py-4 rounded-full hover:bg-pink-50 transition-colors text-center"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                Seguir Comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}