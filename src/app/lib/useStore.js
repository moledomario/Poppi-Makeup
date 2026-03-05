import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // Estado del carrito
      cart: [],

      // Agregar producto al carrito
      addToCart: (product, selectedColor = null, quantity = 1) => {
        const cart = get().cart;

        // Crear identificador único basado en producto y color
        const cartItemId = selectedColor
          ? `${product.id}-${selectedColor.name}`
          : `${product.id}`;

        // Buscar si el producto ya existe en el carrito
        const existingItemIndex = cart.findIndex(
          item => item.cartItemId === cartItemId
        );

        if (existingItemIndex > -1) {
          // Si existe, actualizar cantidad
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += quantity;
          set({ cart: updatedCart });
        } else {
          // Si no existe, agregarlo
          const newItem = {
            cartItemId,
            productId: product.id,
            name: product.name,
            price: product.discount > 0
              ? product.price * (1 - product.discount / 100)
              : product.price,
            originalPrice: product.price,
            discount: product.discount,
            images: product.images?.map(img => img.image_url) || [],
            color: selectedColor,
            quantity,
            stock: selectedColor ? selectedColor.stock : product.stock,
          };
          set({ cart: [...cart, newItem] });
        }
      },

      // Eliminar producto del carrito
      removeFromCart: (cartItemId) => {
        set({ cart: get().cart.filter(item => item.cartItemId !== cartItemId) });
      },

      // Actualizar cantidad de un producto
      updateQuantity: (cartItemId, newQuantity) => {
        const cart = get().cart;
        const updatedCart = cart.map(item => {
          if (item.cartItemId === cartItemId) {
            // No permitir cantidad menor a 1 ni mayor al stock
            const validQuantity = Math.max(1, Math.min(newQuantity, item.stock));
            return { ...item, quantity: validQuantity };
          }
          return item;
        });
        set({ cart: updatedCart });
      },

      // Incrementar cantidad
      incrementQuantity: (cartItemId) => {
        const cart = get().cart;
        const item = cart.find(i => i.cartItemId === cartItemId);
        if (item && item.quantity < item.stock) {
          get().updateQuantity(cartItemId, item.quantity + 1);
        }
      },

      // Decrementar cantidad
      decrementQuantity: (cartItemId) => {
        const cart = get().cart;
        const item = cart.find(i => i.cartItemId === cartItemId);
        if (item && item.quantity > 1) {
          get().updateQuantity(cartItemId, item.quantity - 1);
        }
      },

      // Limpiar carrito
      clearCart: () => {
        set({ cart: [] });
      },

      // Obtener cantidad total de items
      getCartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      // Obtener subtotal
      getSubtotal: () => {
        return get().cart.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        );
      },

      // Obtener total de descuento
      getTotalDiscount: () => {
        return get().cart.reduce(
          (total, item) => {
            if (item.discount > 0) {
              const discountAmount = (item.originalPrice - item.price) * item.quantity;
              return total + discountAmount;
            }
            return total;
          },
          0
        );
      },

      // Verificar si un producto está en el carrito
      isInCart: (productId, colorName = null) => {
        const cartItemId = colorName
          ? `${productId}-${colorName}`
          : `${productId}`;
        return get().cart.some(item => item.cartItemId === cartItemId);
      },

      // Obtener cantidad de un producto específico en el carrito
      getProductQuantity: (productId, colorName = null) => {
        const cartItemId = colorName
          ? `${productId}-${colorName}`
          : `${productId}`;
        const item = get().cart.find(i => i.cartItemId === cartItemId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'poppimakecup-cart', // nombre en localStorage
      // Solo persistir el carrito
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);



