'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '../../supabase/supabaseClient';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });


            if (data.user) {
                // Login exitoso
                router.push('/admin/adminLayout');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Email o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Card de login */}
                <div className="bg-white rounded-3xl shadow-2xl px-8 py-2">

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-block h-40 w-40">
                            <Image
                                src="/poppit.png"
                                alt="Poppimakecup"
                                width={150}
                                height={150}
                                className="object-contain"
                            />
                        </div>
                        <h1
                            className="text-3xl text-gray-800 mb-2"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            Panel de Administración
                        </h1>
                        <p className="text-gray-600">
                            Ingresa tus credenciales para continuar
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#f790b1] focus:outline-none transition-colors"
                                    placeholder="admin@poppimakecup.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-[#f790b1] focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">
                                {error}
                            </div>
                        )}

                        {/* Botón submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#f790b1] text-white py-3 rounded-xl hover:bg-[#f570a0] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                        >
                            {loading ? 'Ingresando...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    {/* Link volver a la tienda */}
                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-sm text-gray-600 hover:text-[#f790b1] transition-colors"
                        >
                            ← Volver a la tienda
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    © {new Date().getFullYear()} Poppimakecup. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}