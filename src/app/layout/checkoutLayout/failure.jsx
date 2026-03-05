'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutFailurePage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">

                        <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="text-red-500" size={48} />
                        </div>

                        <h1
                            className="text-4xl mb-4 text-red-600"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            Pago Rechazado
                        </h1>

                        <p className="text-xl text-gray-700 mb-8">
                            No pudimos procesar tu pago
                        </p>

                        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                            <h3 className="font-bold mb-3">Posibles causas:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Fondos insuficientes en tu cuenta</li>
                                <li>• Datos de tarjeta incorrectos</li>
                                <li>• Tu banco rechazó la transacción</li>
                                <li>• Límite de compra excedido</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-6 mb-8">
                            <p className="text-sm text-blue-800">
                                <strong>Tip:</strong> Verifica los datos de tu tarjeta o intenta con otro método de pago.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/carrito"
                                className="flex-1 bg-[#f790b1] text-white py-4 rounded-full hover:bg-[#f570a0] transition-colors shadow-lg text-center flex items-center justify-center gap-2"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                <ArrowLeft size={20} />
                                Volver al Carrito
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-full hover:bg-gray-50 transition-colors text-center"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                Ir al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}