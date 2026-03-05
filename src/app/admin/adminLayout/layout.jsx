'use client';

import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/nextjs-router';
import { dataProvider, liveProvider } from '@refinedev/supabase';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import { supabase } from '../../supabase/supabaseClient';


export default function RefineProvider({ children }) {

    function AppContextWrapper({ children }) {
        return children;
    }
    return (
        <RefineKbarProvider>
            <AntdRegistry>
                <ConfigProvider
                    locale={esES}
                    theme={{
                        token: {
                            colorPrimary: '#f790b1',
                            borderRadius: 8,
                            fontFamily: '"Fredoka One", sans-serif',
                        },
                    }}
                >

                    <AppContextWrapper>

                        <Refine
                            routerProvider={routerProvider}
                            dataProvider={dataProvider(supabase)}
                            liveProvider={liveProvider(supabase)}
                            resources={[
                                {
                                    name: 'products',
                                    list: '/admin/adminLayout/products',
                                    create: '/admin/adminLayout/products/create',
                                    edit: '/admin/adminLayout/products/edit/:id',
                                    show: '/admin/adminLayout/products/show/:id',
                                    meta: {
                                        label: 'Productos',
                                    },
                                },
                                {
                                    name: 'categories',
                                    list: '/admin/categories',
                                    create: '/admin/categories/create',
                                    edit: '/admin/categories/edit/:id',
                                    meta: {
                                        label: 'Categorías',
                                    },
                                },
                                {
                                    name: 'shipping_zones',
                                    list: '/admin/shipping-zones',
                                    create: '/admin/shipping-zones/create',
                                    edit: '/admin/shipping-zones/edit/:id',
                                    meta: {
                                        label: 'Zonas de Envío',
                                    },
                                },
                            ]}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                projectId: 'poppimakecup-admin',
                                liveMode: 'auto',
                            }}
                        >
                            <App>

                                {children}
                            </App>

                            <RefineKbar />
                        </Refine>

                    </AppContextWrapper>

                </ConfigProvider>
            </AntdRegistry>
        </RefineKbarProvider>
    );
}