'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Upload,
    Button,
    Space,
    Card,
    Row,
    Col,
    App,
    Divider,
    Spin
} from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../supabase/supabaseClient';

const { TextArea } = Input;

export default function ProductForm({ isEdit = false, recordId }) {
    const { message } = App.useApp();
    const router = useRouter();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(isEdit);
    const [images, setImages] = useState([]);
    const [colors, setColors] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    // Cargar categorías
    useEffect(() => {
        loadCategories();
    }, []);

    // Cargar datos del producto si es edición
    useEffect(() => {
        if (isEdit && recordId) {
            loadProduct();
        }
    }, [isEdit, recordId]);

    const loadCategories = async () => {
        try {
            // Categorías principales
            const { data: mainCats, error: mainError } = await supabase
                .from('categories')
                .select('*')
                .is('parent_id', null)
                .order('name');

            if (mainError) throw mainError;
            setCategories(mainCats || []);

            // Subcategorías
            const { data: subCats, error: subError } = await supabase
                .from('categories')
                .select('*')
                .not('parent_id', 'is', null)
                .order('name');

            if (subError) throw subError;
            setSubcategories(subCats || []);
        } catch (error) {
            console.error('Error loading categories:', error);
            message.error('Error al cargar categorías');
        }
    };

    const loadProduct = async () => {
        try {
            setLoadingData(true);

            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          images:product_images(id, image_url, is_main, display_order),
          colors:product_colors(id, name, hex, stock)
        `)
                .eq('id', recordId)
                .single();

            if (error) throw error;

            // Setear valores del formulario
            form.setFieldsValue({
                name: data.name,
                description: data.description,
                price: data.price,
                discount: data.discount || 0,
                stock: data.stock || 0,
                category_id: data.category_id,
                subcategory_id: data.subcategory_id,
                featured: data.featured || false,
                features: data.features || [],
            });

            // Setear imágenes
            if (data.images) {
                const sortedImages = data.images.sort((a, b) => a.display_order - b.display_order);
                setImages(sortedImages.map(img => ({
                    id: img.id,
                    url: img.image_url,
                    isMain: img.is_main,
                    displayOrder: img.display_order,
                })));
            }

            // Setear colores
            if (data.colors) {
                setColors(data.colors);
            }
        } catch (error) {
            console.error('Error loading product:', error);
            message.error('Error al cargar el producto');
        } finally {
            setLoadingData(false);
        }
    };

    // Subir imagen
    const handleImageUpload = async (file) => {
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setImages([...images, {
                url: publicUrl,
                isMain: images.length === 0,
                displayOrder: images.length,
            }]);

            message.success('Imagen subida exitosamente');
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error('Error al subir la imagen');
        } finally {
            setUploading(false);
        }
        return false;
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        if (images[index].isMain && newImages.length > 0) {
            newImages[0].isMain = true;
        }
        setImages(newImages);
    };

    const setMainImage = (index) => {
        const newImages = images.map((img, i) => ({
            ...img,
            isMain: i === index,
        }));
        setImages(newImages);
    };

    const addColor = () => {
        setColors([...colors, { name: '', hex: '#f790b1', stock: 0 }]);
    };

    const updateColor = (index, field, value) => {
        const newColors = [...colors];
        newColors[index][field] = value;
        setColors(newColors);
    };

    const removeColor = (index) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleSubmit = async (values) => {
        if (images.length === 0) {
            message.error('Debes subir al menos una imagen');
            return;
        }

        setLoading(true);
        try {
            const productData = {
                name: values.name,
                description: values.description || null,
                price: parseFloat(values.price),
                discount: parseInt(values.discount) || 0,
                stock: parseInt(values.stock) || 0,
                category_id: values.category_id || null,
                subcategory_id: values.subcategory_id,
                featured: values.featured || false,
                features: values.features || [],
            };

            let productId = recordId;

            if (isEdit) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', recordId);

                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert(productData)
                    .select()
                    .single();

                if (error) throw error;
                productId = data.id;
            }

            // Guardar imágenes
            if (isEdit) {
                await supabase
                    .from('product_images')
                    .delete()
                    .eq('product_id', productId);
            }

            const imageData = images.map((img, index) => ({
                product_id: productId,
                image_url: img.url,
                is_main: img.isMain,
                display_order: index,
            }));

            const { error: imagesError } = await supabase
                .from('product_images')
                .insert(imageData);

            if (imagesError) throw imagesError;

            // Guardar colores
            if (isEdit) {
                await supabase
                    .from('product_colors')
                    .delete()
                    .eq('product_id', productId);
            }

            const validColors = colors.filter(c => c.name && c.hex);
            if (validColors.length > 0) {
                const colorData = validColors.map(color => ({
                    product_id: productId,
                    name: color.name,
                    hex: color.hex,
                    stock: parseInt(color.stock) || 0,
                }));

                const { error: colorsError } = await supabase
                    .from('product_colors')
                    .insert(colorData);

                if (colorsError) throw colorsError;
            }

            message.success(isEdit ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
            router.push('/admin/adminLayout/products');
        } catch (error) {
            console.error('Error saving product:', error);
            message.error(`Error al guardar el producto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="p-6">
                <div className="text-center py-16">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-600">Cargando producto...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.push('/admin/adminLayout')}
                        >
                            Volver
                        </Button>
                        <h1 className="text-2xl font-bold m-0">
                            {isEdit ? 'Editar Producto' : 'Crear Producto'}
                        </h1>
                    </div>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        featured: false,
                        discount: 0,
                        stock: 0,
                    }}
                >
                    <Row gutter={24}>
                        <Col span={16}>
                            <Card title="Información del Producto" className="mb-6">
                                <Form.Item
                                    label="Nombre del Producto"
                                    name="name"
                                    rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
                                >
                                    <Input size="large" placeholder="Ej: Velvet Matte Lipstick" />
                                </Form.Item>

                                <Form.Item label="Descripción" name="description">
                                    <TextArea rows={4} placeholder="Describe el producto..." />
                                </Form.Item>
                                <Form.Item label="Características" name="features">
                                    <TextArea rows={4} placeholder="Describe las características del producto..." />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Precio"
                                            name="price"
                                            rules={[{ required: true, message: 'Ingresa el precio' }]}
                                        >
                                            <InputNumber
                                                size="large"
                                                prefix="$"
                                                style={{ width: '100%' }}
                                                min={0}
                                                step={0.01}
                                                placeholder="0.00"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Descuento (%)" name="discount">
                                            <InputNumber
                                                size="large"
                                                style={{ width: '100%' }}
                                                min={0}
                                                max={100}
                                                placeholder="0"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Stock" name="stock">
                                    <InputNumber
                                        size="large"
                                        style={{ width: '100%' }}
                                        min={0}
                                        placeholder="0"
                                    />
                                </Form.Item>
                            </Card>

                            <Card title="Categorías" className="mb-6">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Categoría Principal" name="category_id">
                                            <Select size="large" placeholder="Seleccionar" allowClear>
                                                {categories.map(cat => (
                                                    <Select.Option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Subcategoría"
                                            name="subcategory_id"
                                            rules={[{ required: true, message: 'Selecciona una subcategoría' }]}
                                        >
                                            <Select size="large" placeholder="Seleccionar">
                                                {subcategories.map(sub => (
                                                    <Select.Option key={sub.id} value={sub.id}>
                                                        {sub.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>

                            <Card title="Imágenes del Producto" className="mb-6">
                                <Upload
                                    beforeUpload={handleImageUpload}
                                    showUploadList={false}
                                    accept="image/*"
                                    disabled={uploading}
                                >
                                    <Button icon={<UploadOutlined />} loading={uploading}>
                                        Subir Imagen
                                    </Button>
                                </Upload>

                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative border rounded-lg p-2">
                                            <img
                                                src={image.url}
                                                alt={`Producto ${index + 1}`}
                                                className="w-full h-32 object-cover rounded"
                                            />
                                            <div className="mt-2 space-y-1">
                                                <Button
                                                    size="small"
                                                    type={image.isMain ? 'primary' : 'default'}
                                                    block
                                                    onClick={() => setMainImage(index)}
                                                >
                                                    {image.isMain ? '★ Principal' : 'Hacer principal'}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    danger
                                                    block
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {images.length === 0 && (
                                    <div className="text-center py-8 text-gray-400">
                                        No hay imágenes. Sube al menos una imagen.
                                    </div>
                                )}
                            </Card>

                            <Card title="Colores / Variantes (Opcional)">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {colors.map((color, index) => (
                                        <Card key={index} size="small" className="mb-2">
                                            <Row gutter={8} align="middle">
                                                <Col span={8}>
                                                    <Input
                                                        placeholder="Nombre del color"
                                                        value={color.name}
                                                        onChange={(e) => updateColor(index, 'name', e.target.value)}
                                                    />
                                                </Col>
                                                <Col span={6}>
                                                    <Input
                                                        type="color"
                                                        value={color.hex}
                                                        onChange={(e) => updateColor(index, 'hex', e.target.value)}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Col>
                                                <Col span={6}>
                                                    <InputNumber
                                                        placeholder="Stock"
                                                        value={color.stock}
                                                        onChange={(value) => updateColor(index, 'stock', value)}
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Col>
                                                <Col span={4}>
                                                    <Button danger icon={<DeleteOutlined />} onClick={() => removeColor(index)} />
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}

                                    <Button type="dashed" icon={<PlusOutlined />} onClick={addColor} block>
                                        Agregar Color
                                    </Button>
                                </Space>
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card title="Configuración">
                                <Form.Item label="Producto Destacado" name="featured" valuePropName="checked">
                                    <Switch />
                                </Form.Item>

                                <Divider />

                                <div className="text-sm text-gray-600">
                                    <p className="mb-2">
                                        <strong>Nota:</strong>
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Al menos una imagen es requerida</li>
                                        <li>La primera imagen será la principal por defecto</li>
                                        <li>Los colores son opcionales</li>
                                        <li>Si agregas colores, cada uno tendrá su propio stock</li>
                                    </ul>
                                </div>

                                <Divider />

                                <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                                    {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}