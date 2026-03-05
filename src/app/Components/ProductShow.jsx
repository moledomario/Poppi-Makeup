'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Typography,
    Card,
    Row,
    Col,
    Tag,
    Descriptions,
    Image as AntImage,
    Space,
    Button,
    Spin,
    App
} from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { supabase } from '../supabase/supabaseClient';

const { Title, Text } = Typography;

export default function ProductShow({ recordId }) {
    const router = useRouter();
    const { message } = App.useApp();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (recordId) {
            loadProduct();
        }
    }, [recordId]);

    const loadProduct = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          category:categories!products_category_id_fkey(name, slug),
          subcategory:categories!products_subcategory_id_fkey(name, slug),
          images:product_images(id, image_url, is_main, display_order),
          colors:product_colors(id, name, hex, stock)
        `)
                .eq('id', recordId)
                .single();

            if (error) throw error;

            // Ordenar imágenes
            if (data.images) {
                data.images = data.images.sort((a, b) => a.display_order - b.display_order);
            }

            setProduct(data);
        } catch (error) {
            console.error('Error loading product:', error);
            message.error('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-24">
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-6">
                <div className="text-center py-16">
                    <p className="text-red-500 text-lg">Producto no encontrado</p>
                    <Button className="mt-4" onClick={() => router.push('/admin/products')}>
                        Volver a productos
                    </Button>
                </div>
            </div>
        );
    }

    const mainImage = product.images?.find(img => img.is_main) || product.images?.[0];
    const finalPrice = product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.push('/admin/adminLayout/products')}
                    >
                        Volver
                    </Button>
                    <h1 className="text-2xl font-bold m-0">Detalle del Producto</h1>
                </div>
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/admin/adminLayout/products/edit/${recordId}`)}
                >
                    Editar
                </Button>
            </div>

            <Row gutter={24}>

                {/* Columna de imágenes */}
                <Col xs={24} lg={10}>
                    <Card className="mb-4">

                        {/* Imagen principal */}
                        {mainImage ? (
                            <div className="mb-4 bg-gray-50 rounded-xl flex items-center justify-center" style={{ height: 400 }}>
                                <AntImage
                                    src={mainImage.image_url}
                                    alt={product.name}
                                    style={{ maxHeight: 380, objectFit: 'contain' }}
                                />
                            </div>
                        ) : (
                            <div className="w-full bg-gray-100 rounded-xl flex items-center justify-center mb-4" style={{ height: 400 }}>
                                <Text type="secondary">Sin imagen</Text>
                            </div>
                        )}

                        {/* Galería de miniaturas */}
                        {product.images?.length > 0 && (
                            <>
                                <Title level={5}>
                                    Galería ({product.images.length} {product.images.length === 1 ? 'imagen' : 'imágenes'})
                                </Title>
                                <AntImage.PreviewGroup>
                                    <div className="grid grid-cols-4 gap-2">
                                        {product.images.map((image, index) => (
                                            <div key={image.id} className="relative">
                                                <AntImage
                                                    src={image.image_url}
                                                    alt={`Vista ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: 80,
                                                        objectFit: 'cover',
                                                        borderRadius: 8,
                                                    }}
                                                />
                                                {image.is_main && (
                                                    <Tag
                                                        color="blue"
                                                        style={{ position: 'absolute', top: 4, left: 4, fontSize: 10 }}
                                                    >
                                                        Principal
                                                    </Tag>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </AntImage.PreviewGroup>
                            </>
                        )}
                    </Card>
                </Col>

                {/* Columna de información */}
                <Col xs={24} lg={14}>

                    {/* Info principal */}
                    <Card className="mb-4">
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>

                            {/* Título y destacado */}
                            <div className="flex items-start justify-between">
                                <Title level={2} style={{ margin: 0 }}>{product.name}</Title>
                                {product.featured && (
                                    <Tag color="gold" style={{ fontSize: 14 }}>⭐ Destacado</Tag>
                                )}
                            </div>

                            {/* Descripción */}
                            {product.description && (
                                <Text type="secondary" style={{ fontSize: 16 }}>
                                    {product.description}
                                </Text>
                            )}

                            {/* Precio */}
                            <div>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Precio</Text>
                                <div className="flex items-baseline gap-3">
                                    {product.discount > 0 ? (
                                        <>
                                            <Title level={2} style={{ margin: 0, color: '#f790b1' }}>
                                                ${parseFloat(finalPrice).toFixed(2)}
                                            </Title>
                                            <Text delete type="secondary" style={{ fontSize: 20 }}>
                                                ${parseFloat(product.price).toFixed(2)}
                                            </Text>
                                            <Tag color="red" style={{ fontSize: 14 }}>
                                                {product.discount}% OFF
                                            </Tag>
                                        </>
                                    ) : (
                                        <Title level={2} style={{ margin: 0 }}>
                                            ${parseFloat(product.price).toFixed(2)}
                                        </Title>
                                    )}
                                </div>
                            </div>

                            {/* Detalles */}
                            <Descriptions bordered column={2} size="small">
                                <Descriptions.Item label="Categoría">
                                    {product.category?.name || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Subcategoría">
                                    {product.subcategory?.name || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Stock">
                                    <Tag color={product.stock > 10 ? 'green' : product.stock > 0 ? 'orange' : 'red'}>
                                        {product.stock} unidades
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Descuento">
                                    {product.discount > 0 ? `${product.discount}%` : 'Sin descuento'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Destacado">
                                    {product.featured ? (
                                        <Tag icon={<CheckCircleOutlined />} color="success">Sí</Tag>
                                    ) : (
                                        <Tag icon={<CloseCircleOutlined />} color="default">No</Tag>
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="ID">
                                    <Text code copyable style={{ fontSize: 11 }}>{product.id}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>
                    </Card>

                    {/* Colores */}
                    {product.colors?.length > 0 && (
                        <Card title="Colores / Variantes" className="mb-4">
                            <div className="space-y-3">
                                {product.colors.map((color) => (
                                    <div
                                        key={color.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                        style={{ borderLeftWidth: 4, borderLeftColor: color.hex }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    backgroundColor: color.hex,
                                                    borderRadius: 8,
                                                    border: '2px solid #e5e7eb',
                                                }}
                                            />
                                            <div>
                                                <Text strong>{color.name}</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: 12 }}>{color.hex}</Text>
                                            </div>
                                        </div>
                                        <Tag color={color.stock > 10 ? 'green' : color.stock > 0 ? 'orange' : 'red'}>
                                            Stock: {color.stock}
                                        </Tag>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Fechas */}
                    <Card>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Fecha de creación">
                                {new Date(product.created_at).toLocaleString('es-AR')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Última actualización">
                                {new Date(product.updated_at).toLocaleString('es-AR')}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                </Col>
            </Row>
        </div>
    );
}