'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Row, Col, Statistic, Table, Tag, Button, Space } from 'antd';
import {
    ShoppingOutlined,
    TagsOutlined,
    FolderOutlined,
    TruckOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    EyeOutlined,
    EditOutlined
} from '@ant-design/icons';
import { supabase } from '../../supabase/supabaseClient';

export default function DashboardLayout() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        outOfStock: 0,
        categories: 0,
        subcategories: 0,
        shippingZones: 0,
    });
    const [recentProducts, setRecentProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Estadísticas de productos
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('*');

            if (productsError) throw productsError;

            const activeProducts = products?.filter(p => p.stock > 0).length || 0;
            const outOfStock = products?.filter(p => p.stock === 0).length || 0;

            // Categorías
            const { data: categories, error: categoriesError } = await supabase
                .from('categories')
                .select('*');

            if (categoriesError) throw categoriesError;

            const mainCategories = categories?.filter(c => !c.parent_id).length || 0;
            const subCategories = categories?.filter(c => c.parent_id).length || 0;

            // Zonas de envío
            const { data: zones, error: zonesError } = await supabase
                .from('shipping_zones')
                .select('id');

            if (zonesError) throw zonesError;

            // Productos recientes
            const { data: recent, error: recentError } = await supabase
                .from('products')
                .select(`
          *,
          subcategory:categories!products_subcategory_id_fkey(name),
          images:product_images(image_url, is_main)
        `)
                .order('created_at', { ascending: false })
                .limit(5);

            if (recentError) throw recentError;

            // Productos con bajo stock
            const { data: lowStock, error: lowStockError } = await supabase
                .from('products')
                .select(`
          *,
          subcategory:categories!products_subcategory_id_fkey(name)
        `)
                .lte('stock', 5)
                .gt('stock', 0)
                .order('stock', { ascending: true })
                .limit(5);

            if (lowStockError) throw lowStockError;

            setStats({
                totalProducts: products?.length || 0,
                activeProducts,
                outOfStock,
                categories: mainCategories,
                subcategories: subCategories,
                shippingZones: zones?.length || 0,
            });

            setRecentProducts(recent || []);
            setLowStockProducts(lowStock || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const recentColumns = [
        {
            title: 'Producto',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <div className="flex items-center gap-3">
                    {record.images?.[0] && (
                        <img
                            src={record.images.find(i => i.is_main)?.image_url || record.images[0]?.image_url}
                            alt={name}
                            className="w-10 h-10 object-cover rounded"
                        />
                    )}
                    <span className="font-medium">{name}</span>
                </div>
            ),
        },
        {
            title: 'Categoría',
            dataIndex: ['subcategory', 'name'],
            key: 'category',
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${parseFloat(price).toFixed(2)}`,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
                    {stock}
                </Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => router.push(`/admin/adminLayout/products/show/${record.id}`)}
                    >
                        Ver
                    </Button>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/admin/adminLayout/products/edit/${record.id}`)}
                    >
                        Editar
                    </Button>
                </Space>
            ),
        },
    ];

    const lowStockColumns = [
        {
            title: 'Producto',
            dataIndex: 'name',
            key: 'name',
            render: (name) => <span className="font-medium">{name}</span>,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <Tag color="orange" className="font-bold">
                    ⚠️ {stock} restantes
                </Tag>
            ),
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => router.push(`/admin/adminLayout/products/edit/${record.id}`)}
                >
                    Reabastecer
                </Button>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
                <p className="text-gray-600">
                    Bienvenido al panel de administración de Poppimakecup
                </p>
            </div>

            {/* Estadísticas principales */}
            <Row gutter={[16, 16]} className="mb-8">
                <Col xs={24} sm={12} lg={8}>
                    <Card variant="borderless" className="shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title="Total de Productos"
                            value={stats.totalProducts}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#f790b1' }}
                            loading={loading}
                        />
                        <div className="mt-2 text-sm text-gray-600">
                            <span className="text-green-600 font-semibold">{stats.activeProducts}</span> en stock •
                            <span className="text-red-600 font-semibold ml-1">{stats.outOfStock}</span> agotados
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card variant="borderless" className="shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title="Categorías"
                            value={stats.categories}
                            prefix={<FolderOutlined />}
                            valueStyle={{ color: '#9b6b9e' }}
                            loading={loading}
                        />
                        <div className="mt-2 text-sm text-gray-600">
                            <span className="font-semibold">{stats.subcategories}</span> subcategorías
                        </div>
                        <Button
                            type="link"
                            size="small"
                            className="mt-2 px-0"
                            onClick={() => router.push('/admin/adminLayout/categories')}
                        >
                            Gestionar →
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card variant="borderless" className="shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title="Zonas de Envío"
                            value={stats.shippingZones}
                            prefix={<TruckOutlined />}
                            valueStyle={{ color: '#6ba5b8' }}
                            loading={loading}
                        />
                        <div className="mt-2 text-sm text-gray-600">
                            Configuradas y listas
                        </div>
                        <Button
                            type="link"
                            size="small"
                            className="mt-2 px-0"
                            onClick={() => router.push('/admin/adminLayout/shipping-zones')}
                        >
                            Gestionar →
                        </Button>
                    </Card>
                </Col>
            </Row>

            {/* Acciones rápidas */}
            <Card title="Acciones Rápidas" variant="borderless" className="mb-8 shadow-md">
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={6}>
                        <Button
                            type="primary"
                            size="large"
                            block
                            icon={<ShoppingOutlined />}
                            onClick={() => router.push('/admin/adminLayout/products/create')}
                        >
                            Nuevo Producto
                        </Button>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Button
                            size="large"
                            block
                            icon={<FolderOutlined />}
                            onClick={() => router.push('/admin/adminLayout/categories')}
                        >
                            Categorías
                        </Button>
                    </Col>


                </Row>
            </Card>

            <Row gutter={[16, 16]} className='mt-8'>
                {/* Productos recientes */}
                <Col xs={24} lg={14}>
                    <Card
                        title="Productos Recientes"
                        className="shadow-md"
                        extra={
                            <Button
                                type="link"
                                onClick={() => router.push('/admin/adminLayout/products')}
                            >
                                Ver todos
                            </Button>
                        }
                    >
                        <Table
                            columns={recentColumns}
                            dataSource={recentProducts}
                            rowKey="id"
                            loading={loading}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                {/* Productos con bajo stock */}
                <Col xs={24} lg={10}>
                    <Card
                        title={
                            <Space>
                                <span>⚠️ Stock Bajo</span>
                                <Tag color="orange">{lowStockProducts.length}</Tag>
                            </Space>
                        }
                        className="shadow-md"
                    >
                        {lowStockProducts.length > 0 ? (
                            <Table
                                columns={lowStockColumns}
                                dataSource={lowStockProducts}
                                rowKey="id"
                                loading={loading}
                                pagination={false}
                                size="small"
                            />
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <p>✓ Todos los productos tienen stock suficiente</p>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}