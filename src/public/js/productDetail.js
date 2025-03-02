console.log('📌 Script productDetail.js cargado correctamente');

document.addEventListener('DOMContentLoaded', async () => {
    let cartId = localStorage.getItem('cartId'); // 🛒 Obtener carrito guardado

    // ✅ Función para crear un carrito solo si no existe
    const createCartIfNeeded = async () => {
        if (!cartId) {
            try {
                console.log('🛒 No se encontró un carrito, creando uno nuevo...');
                const response = await fetch('/api/carts', { method: 'POST' });
                const data = await response.json();
                cartId = data._id; // Guardamos el nuevo carrito
                localStorage.setItem('cartId', cartId);
                console.log('✅ Nuevo carrito creado con ID:', cartId);
            } catch (error) {
                console.error('❌ Error al crear el carrito:', error);
            }
        }
    };

    // ✅ Función para agregar el producto al carrito
    const addToCart = async (productId) => {
        await createCartIfNeeded(); // Asegurar que el carrito existe antes de agregar productos

        try {
            console.log(`🛍 Agregando producto ${productId} al carrito ${cartId}...`);
            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            if (response.ok) {
                alert('✅ Producto agregado al carrito');
            } else {
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error('❌ Error al agregar producto:', error);
        }
    };

    // ✅ Asignar evento al botón "Agregar al carrito"
    const addToCartButton = document.getElementById('addToCart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => addToCart(addToCartButton.dataset.id));
    }

    // ✅ Asegurar que el botón "Ver mi carrito" tenga el ID correcto
    const updateCartLink = () => {
        const cartLink = document.getElementById('cart-link');
        if (cartId && cartLink) {
            cartLink.href = `/carts/${cartId}`;
        }
    };

    await createCartIfNeeded(); // Asegurar que hay un carrito antes de actualizar el enlace
    updateCartLink();
});