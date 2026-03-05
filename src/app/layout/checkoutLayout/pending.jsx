'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Clock } from 'lucide-react';

export default function CheckoutPendingPage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">

                        <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock className="text-yellow-600" size={48} />
                        </div>

                        <h1
                            className="text-4xl mb-4 text-yellow-600"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            Pago Pendiente
                        </h1>

                        <p className="text-xl text-gray-700 mb-8">
                            Estamos esperando la confirmación de tu pago
                        </p>

                        {paymentId && (
                            <div className="bg-gray-50 rounded-xl p-6 mb-8">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ID de Pago:</span>
                                    <span className="font-bold">#{paymentId}</span>
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
                            <h3 className="font-bold text-blue-900 mb-3">¿Qué significa esto?</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>• Si pagaste con efectivo, puede demorar hasta 3 días hábiles</li>
                                <li>• Si pagaste con transferencia, verifica que se haya procesado</li>
                                <li>• Recibirás un email cuando se confirme el pago</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/"
                                className="flex-1 bg-[#f790b1] text-white py-4 rounded-full hover:bg-[#f570a0] transition-colors shadow-lg text-center"
                                style={{ fontFamily: '"Fredoka One", sans-serif' }}
                            >
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
