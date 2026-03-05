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
    InputNumber,
    Switch,
    App,
    Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../supabase/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ZonasEnvio() {
    const { message } = App.useApp();
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingZone, setEditingZone] = useState(null);
    const [form] = Form.useForm();
    const router = useRouter();
    useEffect(() => {
        loadZones();
    }, []);

    const loadZones = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('shipping_zones')
                .select('*')
                .order('name');

            if (error) throw error;
            setZones(data || []);
        } catch (error) {
            console.error('Error loading zones:', error);
            message.error('Error al cargar zonas de envío');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingZone(null);
        form.resetFields();
        form.setFieldsValue({ active: true });
        setModalVisible(true);
    };

    const handleEdit = (zone) => {
        setEditingZone(zone);
        form.setFieldsValue({
            name: zone.name,
            price: parseFloat(zone.price),
            active: zone.active,
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('shipping_zones')
                .delete()
                .eq('id', id);

            if (error) throw error;

            message.success('Zona de envío eliminada exitosamente');
            loadZones();
        } catch (error) {
            console.error('Error deleting zone:', error);
            message.error('Error al eliminar zona de envío');
        }
    };

    const handleToggleActive = async (id, currentActive) => {
        try {
            const { error } = await supabase
                .from('shipping_zones')
                .update({ active: !currentActive })
                .eq('id', id);

            if (error) throw error;

            message.success(`Zona ${!currentActive ? 'activada' : 'desactivada'}`);
            loadZones();
        } catch (error) {
            console.error('Error toggling zone:', error);
            message.error('Error al actualizar zona');
        }
    };

    const handleSubmit = async (values) => {
        try {
            const zoneData = {
                name: values.name,
                price: parseFloat(values.price),
                active: values.active ?? true,
            };

            if (editingZone) {
                const { error } = await supabase
                    .from('shipping_zones')
                    .update(zoneData)
                    .eq('id', editingZone.id);

                if (error) throw error;
                message.success('Zona actualizada exitosamente');
            } else {
                const { error } = await supabase
                    .from('shipping_zones')
                    .insert(zoneData);

                if (error) throw error;
                message.success('Zona creada exitosamente');
            }

            setModalVisible(false);
            form.resetFields();
            loadZones();
        } catch (error) {
            console.error('Error saving zone:', error);
            message.error('Error al guardar zona de envío');
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
            render: (price) => (
                <span className="text-lg font-semibold text-[#f790b1]">
                    ${parseFloat(price).toFixed(2)}
                </span>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'active',
            key: 'active',
            filters: [
                { text: 'Activa', value: true },
                { text: 'Inactiva', value: false },
            ],
            onFilter: (value, record) => record.active === value,
            render: (active, record) => (
                <Switch
                    checked={active}
                    onChange={() => handleToggleActive(record.id, active)}
                    checkedChildren={<CheckCircleOutlined />}
                    unCheckedChildren={<CloseCircleOutlined />}
                />
            ),
        },
        {
            title: 'Creada',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleDateString('es-AR'),
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
                        title="¿Eliminar zona?"
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

    // Calcular estadísticas
    const stats = {
        total: zones.length,
        active: zones.filter(z => z.active).length,
        avgPrice: zones.length > 0
            ? zones.reduce((sum, z) => sum + parseFloat(z.price), 0) / zones.length
            : 0,
    };

    return (
        <div className="p-6">
            <Card className="mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.push('/admin/adminLayout')}
                        >
                            Volver
                        </Button>
                        <h1 className="text-2xl font-bold">Zonas de Envío</h1>
                        <p className="text-gray-600 mt-1">
                            Gestiona las zonas y costos de envío
                        </p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        size="large"
                    >
                        Nueva Zona
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Total Zonas</div>
                        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Zonas Activas</div>
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Precio Promedio</div>
                        <div className="text-2xl font-bold text-purple-600">
                            ${stats.avgPrice.toFixed(2)}
                        </div>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={zones}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 20 }}
                />
            </Card>

            {/* Modal Create/Edit */}
            <Modal
                title={editingZone ? 'Editar Zona de Envío' : 'Nueva Zona de Envío'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText={editingZone ? 'Actualizar' : 'Crear'}
                cancelText="Cancelar"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Nombre de la Zona"
                        name="name"
                        rules={[{ required: true, message: 'Ingresa el nombre de la zona' }]}
                    >
                        <Input placeholder="Ej: CABA, GBA, Córdoba" />
                    </Form.Item>

                    <Form.Item
                        label="Precio de Envío"
                        name="price"
                        rules={[{ required: true, message: 'Ingresa el precio' }]}
                    >
                        <InputNumber
                            prefix="$"
                            style={{ width: '100%' }}
                            min={0}
                            step={0.01}
                            placeholder="0.00"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Estado"
                        name="active"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Activa"
                            unCheckedChildren="Inactiva"
                        />
                    </Form.Item>

                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                        <strong>Nota:</strong> Solo las zonas activas serán visibles para los clientes en el checkout.
                    </div>
                </Form>
            </Modal>
        </div>
    );
}