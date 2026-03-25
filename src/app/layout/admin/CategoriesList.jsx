'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Card,
    Space,
    Tag,
    Modal,
    Form,
    Input,
    Select,
    App,
    Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../supabase/supabaseClient';
import { useRouter } from 'next/navigation';

export default function CategoriesList() {
    const router = useRouter();
    const { message } = App.useApp();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('categories')
                .select(`*`)


            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error loading categories:', error);
            message.error('Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        form.setFieldsValue({
            name: category.name,
            slug: category.slug,
            parent_id: category.parent_id,
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            message.success('Categoría eliminada exitosamente');
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Error al eliminar categoría');
        }
    };

    const handleSubmit = async (values) => {
        try {
            const categoryData = {
                name: values.name,
                slug: values.slug || values.name.toLowerCase().replace(/\s+/g, '-'),
                parent_id: values.parent_id || null,
            };

            if (editingCategory) {
                const { error } = await supabase
                    .from('categories')
                    .update(categoryData)
                    .eq('id', editingCategory.id);

                if (error) throw error;
                message.success('Categoría actualizada exitosamente');
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert(categoryData);

                if (error) throw error;
                message.success('Categoría creada exitosamente');
            }

            setModalVisible(false);
            form.resetFields();
            loadCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            message.error('Error al guardar categoría');
        }
    };

    const parentCategories = categories.filter(c => !c.parent_id);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <Space>
                    <span className="font-medium">{text}</span>
                    {!record.parent_id && (
                        <Tag color="blue">Principal</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            render: (text) => <span className="text-gray-500 text-sm font-mono">{text}</span>,
        },
        {
            title: 'Categoría Padre',
            dataIndex: 'parent',
            key: 'parent',
            render: (parent) => parent?.name || '-',
        },
        {
            title: 'Subcategorías',
            key: 'subcategories',
            render: (_, record) => {
                if (record.parent_id) return '-';
                const count = categories.filter(c => c.parent_id === record.id).length;
                return count > 0 ? <Tag>{count}</Tag> : '0';
            },
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="¿Eliminar categoría?"
                        description="Esta acción no se puede deshacer"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <ArrowLeftOutlined className="text-2xl mb-4 cursor-pointer" onClick={() => router.back()} />
                        <h1 className="text-2xl font-bold">Categorías</h1>
                        <p className="text-gray-600 mt-1">
                            Gestiona las categorías y subcategorías de productos
                        </p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        size="large"
                    >
                        Nueva Categoría
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 20 }}
                />
            </Card>

            {/* Modal Create/Edit */}
            <Modal
                title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText={editingCategory ? 'Actualizar' : 'Crear'}
                cancelText="Cancelar"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Nombre"
                        name="name"
                        rules={[{ required: true, message: 'Ingresa el nombre' }]}
                    >
                        <Input placeholder="Ej: Labiales" />
                    </Form.Item>

                    <Form.Item
                        label="Slug (URL amigable)"
                        name="slug"
                        help="Deja vacío para generar automáticamente"
                    >
                        <Input placeholder="Ej: labiales" />
                    </Form.Item>

                    <Form.Item
                        label="Categoría Padre (opcional)"
                        name="parent_id"
                        help="Selecciona si esta es una subcategoría"
                    >
                        <Select placeholder="Sin categoría padre (principal)" allowClear>
                            {parentCategories.map(cat => (
                                <Select.Option
                                    key={cat.id}
                                    value={cat.id}
                                    disabled={editingCategory?.id === cat.id}
                                >
                                    {cat.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}