console.log('📌 Script cart.js cargado correctamente');

document.addEventListener('DOMContentLoaded', () => {
    const cartId = localStorage.getItem('cartId'); // 🛒 Obtener el carrito desde localStorage

    if (!cartId) {
        console.error('❌ No se encontró un carrito en localStorage');
        return;
    }

    // ✅ Función para eliminar un producto del carrito
    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            if (response.ok) {
                alert('✅ Producto eliminado del carrito');
                location.reload(); // Recargar la página para actualizar la vista
            } else {
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error('❌ Error al eliminar producto del carrito:', error);
        }
    };

    // ✅ Función para vaciar el carrito sin eliminarlo
    const emptyCart = async () => {
        try {
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                alert('🗑 Carrito vaciado correctamente');
                location.reload(); // Recargar la página para actualizar la vista
            } else {
                console.error('❌ Error al vaciar el carrito');
            }
        } catch (error) {
            console.error('❌ Error al vaciar el carrito:', error);
        }
    };

    // ✅ Asignar eventos a los botones de "Eliminar" producto
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId; // Asegurar que toma el ID correcto
            removeFromCart(productId);
        });
    });

    // ✅ Asignar evento al botón "Vaciar Carrito"
    document.getElementById('empty-cart')?.addEventListener('click', emptyCart);
});
