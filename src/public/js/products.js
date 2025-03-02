console.log('📌 Script products.js cargado correctamente');

// ✅ Escuchar clic en los botones "Agregar al carrito"
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.dataset.productId;
            const cartId = '67c385651f8d0d56e95aee31'; // ⚠️ Reemplaza con el ID del carrito real

            try {
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
        });
    });
});