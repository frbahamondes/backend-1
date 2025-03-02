console.log('📌 Script cart.js cargado correctamente');

document.addEventListener('DOMContentLoaded', () => {
    const cartId = '67c385651f8d0d56e95aee31'; // ⚠️ Asegúrate de usar un carrito válido

    // ✅ Función para eliminar un producto del carrito
    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (response.ok) {
                alert('❌ Producto eliminado del carrito');
                location.reload(); // Recargar la página para actualizar la vista
            } else {
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error('❌ Error al eliminar producto:', error);
        }
    };

    // ✅ Función para vaciar el carrito sin eliminarlo
    const emptyCart = async () => {
        try {
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (response.ok) {
                alert('🗑 Carrito vaciado');
                location.reload(); // Recargar la página para actualizar la vista
            } else {
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error('❌ Error al vaciar carrito:', error);
        }
    };

    // ✅ Asignar evento a los botones de eliminar productos
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', () => removeFromCart(button.dataset.id));
    });

    // ✅ Asignar evento al botón de vaciar carrito
    document.getElementById('empty-cart').addEventListener('click', emptyCart);
});
