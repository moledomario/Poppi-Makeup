import { supabase } from './supabaseClient';

// ============================================
// PRODUCTOS
// ============================================

/**
 * Obtener todos los productos con sus relaciones
 */
export async function getAllProducts() {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories!products_category_id_fkey(id, name, slug),
      subcategory:categories!products_subcategory_id_fkey(id, name, slug),
      images:product_images(id, image_url, is_main, display_order),
      colors:product_colors(id, name, hex, stock)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    // Ordenar imágenes por display_order
    return data.map(product => ({
        ...product,
        images: product.images?.sort((a, b) => a.display_order - b.display_order) || [],
    }));
}

/**
 * Obtener productos destacados
 */
export async function getFeaturedProducts() {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories!products_category_id_fkey(name, slug),
      subcategory:categories!products_subcategory_id_fkey(name, slug),
      images:product_images(image_url, is_main, display_order),
      colors:product_colors(name, hex, stock)
    `)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

    if (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }

    return data.map(product => ({
        ...product,
        images: product.images?.sort((a, b) => a.display_order - b.display_order) || [],
    }));
}

/**
 * Obtener un producto por ID
 */
export async function getProductById(id) {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories!products_category_id_fkey(name, slug),
      subcategory:categories!products_subcategory_id_fkey(name, slug),
      images:product_images(id, image_url, is_main, display_order),
      colors:product_colors(id, name, hex, stock)
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return {
        ...data,
        images: data.images?.sort((a, b) => a.display_order - b.display_order) || [],
    };
}

/**
 * Buscar productos por texto
 */
export async function searchProducts(query) {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories!products_category_id_fkey(name, slug),
      images:product_images(image_url, is_main),
      colors:product_colors(name, hex, stock)
    `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error searching products:', error);
        return [];
    }

    return data;
}

/**
 * Filtrar productos por categoría
 */
export async function getProductsByCategory(categorySlug) {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories!products_category_id_fkey(name, slug),
      subcategory:categories!products_subcategory_id_fkey(name, slug),
      images:product_images(image_url, is_main, display_order),
      colors:product_colors(name, hex, stock)
    `)
        .eq('category.slug', categorySlug)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }

    return data.map(product => ({
        ...product,
        images: product.images?.sort((a, b) => a.display_order - b.display_order) || [],
    }));
}

// ============================================
// CATEGORÍAS
// ============================================

/**
 * Obtener todas las categorías
 */
export async function getAllCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data;
}

/**
 * Obtener categorías principales (sin parent_id)
 */
export async function getMainCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name');

    if (error) {
        console.error('Error fetching main categories:', error);
        return [];
    }

    return data;
}

/**
 * Obtener subcategorías de una categoría
 */
export async function getSubcategories(parentId) {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', parentId)
        .order('name');

    if (error) {
        console.error('Error fetching subcategories:', error);
        return [];
    }

    return data;
}

// ============================================
// ZONAS DE ENVÍO
// ============================================

/**
 * Obtener zonas de envío activas
 */
export async function getActiveShippingZones() {
    const { data, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .eq('active', true)
        .order('price');

    if (error) {
        console.error('Error fetching shipping zones:', error);
        return [];
    }

    return data;
}

// ============================================
// STORAGE (IMÁGENES)
// ============================================

/**
 * Subir imagen a Supabase Storage
 */
export async function uploadProductImage(file, productId, isMain = false) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, file);

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

    return publicUrl;
}

/**
 * Eliminar imagen de Supabase Storage
 */
export async function deleteProductImage(imageUrl) {
    // Extraer el path del archivo de la URL
    const urlParts = imageUrl.split('/products/');
    if (urlParts.length < 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
        .from('products')
        .remove([filePath]);

    if (error) {
        console.error('Error deleting image:', error);
        return false;
    }

    return true;
}