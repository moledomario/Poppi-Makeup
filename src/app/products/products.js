// Archivo de productos de prueba
// Las imágenes deben estar en /public/products/

export const products = [
    {
        id: 1,
        name: "Velvet Matte Lipstick",
        description: "Tono: Rose Petal",
        price: 18.99,
        originalPrice: null, // Si hay descuento, aquí va el precio original
        discount: 0, // Porcentaje de descuento
        image: "/brochas.jpg",
        gallery: [
            "/brochas.jpg",
            "/hero-img.jpg",
            "/paleta.jpg",
        ],
        category: "Labiales",
        subcategory: "Labios",
        stock: 45,
        colors: [
            { name: "Rose Petal", hex: "#d4a5a5", stock: 15 },
            { name: "Berry Kiss", hex: "#a4506c", stock: 20 },
            { name: "Coral Dreams", hex: "#ff7f7f", stock: 10 },
        ],
        featured: true,
    },
    {
        id: 2,
        name: "Dreamy Eyes Palette",
        description: "12 Tonos Profesionales",
        price: 34.50,
        originalPrice: null,
        discount: 0,
        image: "/paleta.jpg",
        gallery: [
            "/paleta.jpg",
            "/paleta.jpg",
            "/paleta.jpg",

        ],
        category: "Sombras",
        subcategory: "Ojos",
        stock: 30,
        colors: [],
        featured: true,
    },
    {
        id: 3,
        name: "Glow Liquid Drops",
        description: "Iluminador perlado",
        price: 22.00,
        originalPrice: null,
        discount: 0,
        image: "/sombra.jpg",
        gallery: [
            "/sombra.jpg",

        ],
        category: "Rubor e Iluminador",
        subcategory: "Rostro",
        stock: 0, // Sin stock
        colors: [
            { name: "Golden Glow", hex: "#f4d03f", stock: 0 },
            { name: "Rose Gold", hex: "#e8b4b8", stock: 0 },
        ],
        featured: true,
    },
    {
        id: 4,
        name: "Pro Brush Set",
        description: "8 Piezas esenciales",
        price: 45.99,
        originalPrice: null,
        discount: 0,
        image: "/pinturas.jpg",
        gallery: [
            "/pinturas.jpg",
        ],
        category: "Accesorios",
        subcategory: "Complementos para maquillaje",
        stock: 25,
        colors: [],
        featured: true,
    },
];

// Función helper para obtener productos destacados
export const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
};

// Función helper para verificar si hay stock
export const hasStock = (product) => {
    if (product.colors && product.colors.length > 0) {
        return product.colors.some(color => color.stock > 0);
    }
    return product.stock > 0;
};