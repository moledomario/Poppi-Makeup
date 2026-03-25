'use client';

import { useDelete } from '@refinedev/core';
import { List, useTable, EditButton, DeleteButton, ShowButton } from '@refinedev/antd';
import { Table, Space, Tag, Image as AntImage, Switch, Input, Form, Button } from 'antd';
import { PlusOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../supabase/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProductsList() {
    const router = useRouter();
    const { tableProps, searchFormProps } = useTable({
        resource: 'products',
        syncWithLocation: true,
        meta: {
            select: `
        *,
        category:categories!products_category_id_fkey(name),
        subcategory:categories!products_subcategory_id_fkey(name),
        images:product_images(image_url, is_main)
      `,
        },
    });

    const { mutate: deleteProduct } = useDelete();

    const columns = [
        {
            title: 'Imagen',
            dataIndex: ['images'],
            key: 'image',
            width: 100,
            render: (images) => {
                const mainImage = images?.find(img => img.is_main) || images?.[0];
                return mainImage ? (
                    <AntImage
                        src={mainImage.image_url}
                        alt="Producto"
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                ) : (
                    <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                    </div>
                );
            },
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Buscar producto"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <button onClick={() => confirm()} className="ant-btn ant-btn-primary ant-btn-sm">
                            Buscar
                        </button>
                        <button onClick={clearFilters} className="ant-btn ant-btn-sm">
                            Limpiar
                        </button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#f790b1' : undefined }} />
            ),
        },
        {
            title: 'Categoría',
            dataIndex: ['subcategory', 'name'],
            key: 'category',
            render: (subcategory) => subcategory || '-',
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            render: (price) => `$${parseFloat(price).toFixed(2)}`,
        },
        {
            title: 'Descuento',
            dataIndex: 'discount',
            key: 'discount',
            render: (discount) =>
                discount > 0 ? (
                    <Tag color="red">{discount}% OFF</Tag>
                ) : (
                    <Tag>Sin descuento</Tag>
                ),
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            sorter: true,
            render: (stock) => (
                <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
                    {stock} unidades
                </Tag>
            ),
        },
        {
            title: 'Destacado',
            dataIndex: 'featured',
            key: 'featured',
            render: (featured, record) => (
                <Switch
                    checked={featured}
                    onChange={(checked) => {
                        // Actualizar en Supabase
                        supabase
                            .from('products')
                            .update({ featured: checked })
                            .eq('id', record.id)
                            .then(() => {
                                window.location.reload();
                            });
                    }}
                />
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            fixed: 'right',
            width: 150,
            render: (_, record) => (
                <Space>
                    <ShowButton hideText size="small" recordItemId={record.id} />
                    <EditButton hideText size="small" recordItemId={record.id} />
                    <DeleteButton
                        hideText
                        size="small"
                        recordItemId={record.id}
                        onSuccess={() => window.location.reload()}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                style={{ marginBottom: 16 }}
            >
                Volver
            </Button>
            <Form {...searchFormProps} style={{ display: 'none' }} />
            <List
                title="Productos"
                createButtonProps={{
                    children: (
                        <>
                            <PlusOutlined /> Crear Producto
                        </>
                    ),
                }}
            >
                <Table
                    {...tableProps}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 1000 }}
                />
            </List>
        </div>
    );
}
