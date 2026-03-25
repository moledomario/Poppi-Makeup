'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../supabase/supabaseClient';
import DashboardLayout from './DashboardLayout';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Truck,
    LogOut,
    Menu,
    X,
    Store
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/admin');
            }
            setUser(session?.user || null);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [router]);

    const checkUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/admin');
            } else {
                setUser(session.user);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            router.push('/admin');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin');
    };

    const menuItems = [
        {
            icon: Package,
            label: 'Productos',
            href: '/admin/adminLayout/products',
        },
        {
            icon: FolderTree,
            label: 'Categorías',
            href: '/admin/adminLayout/categories',
        },
        {
            icon: Truck,
            label: 'Zonas de Envío',
            href: '/admin/adminLayout/shipping-zones',
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#f790b1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Sidebar Desktop */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
                <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">

                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0 px-4 mb-8">
                        <Link href="/admin/adminLayout/products">
                            <Image
                                src="/poppit.png"
                                alt="Poppi Makecup"
                                width={100}
                                height={100}
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 px-3 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-pink-50 text-[#f790b1]'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#f790b1]'
                                        }`}
                                >
                                    <Icon className="mr-3 flex-shrink-0" size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer del sidebar */}
                    <div className="flex-shrink-0 px-3 space-y-2">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#f790b1] transition-colors"
                        >
                            <Store className="mr-3 flex-shrink-0" size={20} />
                            Ver Tienda
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="mr-3 flex-shrink-0" size={20} />
                            Cerrar sesión
                        </button>

                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Conectado como:</p>
                            <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>



            {/* Contenido principal */}
            <div className="lg:pl-64">
                {/* Header mobile */}
                <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Image
                            src="/poppit.png"
                            alt="Poppimakecup"
                            width={120}
                            height={48}
                            className="h-8 w-auto"
                        />
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Menú móvil desplegable (Estilo Header.jsx) */}
                    {sidebarOpen && (
                        <div className="mt-4 pb-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-700">
                            <nav className="flex flex-col gap-4 mt-4">
                                {menuItems.map((item) => {
                                    const isActive = pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`text-gray-700 hover:text-[#f790b1] transition-colors font-medium text-lg px-2 flex items-center justify-center py-2 rounded-lg ${isActive ? 'bg-pink-50 text-[#f790b1]' : 'bg-gray-50'
                                                }`}
                                            style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}

                                <div className="border-t border-gray-100 pt-4 space-y-4">
                                    <Link
                                        href="/"
                                        target="_blank"
                                        className="text-gray-700 hover:text-[#f790b1] transition-colors font-medium text-lg px-2 flex items-center justify-center py-2 bg-gray-50 rounded-lg"
                                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        Ver Tienda
                                    </Link>

                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setSidebarOpen(false);
                                        }}
                                        className="w-full text-red-600 hover:bg-red-50 transition-colors font-medium text-lg px-2 flex items-center justify-center py-2 bg-gray-50 rounded-lg"
                                        style={{ fontFamily: '"Fredoka One", sans-serif' }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>

                {/* Contenido */}
                <main className="flex-1">
                    <DashboardLayout />
                </main>
            </div>
        </div>
    );
}