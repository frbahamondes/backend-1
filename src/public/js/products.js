console.log('📌 Script products.js cargado correctamente');

document.addEventListener('DOMContentLoaded', () => {
    const cartId = '67c385651f8d0d56e95aee31'; // ⚠️ Asegúrate de usar un carrito válido

    // ✅ Función para agregar productos al carrito
    const addToCart = async (productId) => {
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
    };

    // ✅ Asignar evento a botones "Agregar al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => addToCart(button.dataset.id));
    });

    // ✅ Aplicar filtros y ordenamiento
    document.getElementById("applyFilters").addEventListener("click", async () => {
        const category = document.getElementById("category").value;
        const sort = document.getElementById("sort").value;

        let url = "/api/products?"; // Base URL

        if (category) {
            url += `query=${category}`; // 🛠️ Corrección aquí
        }

        if (sort) {
            url += (category ? "&" : "") + `sort=${sort}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                const productList = document.getElementById("product-list");
                productList.innerHTML = ""; // Limpiar lista de productos

                data.payload.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.innerHTML = `
                        <h3>${product.title}</h3>
                        <p>Precio: $${product.price}</p>
                        <p>Categoría: ${product.category}</p>
                        <p>${product.description}</p>
                        <button class="view-details" data-id="${product._id}">Ver detalles</button>
                        <button class="add-to-cart" data-id="${product._id}">Agregar al carrito</button>
                    `;

                    productList.appendChild(productCard);
                });

                // ✅ Reasignar eventos a los nuevos botones
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', () => addToCart(button.dataset.id));
                });

            } else {
                console.error("❌ Error al obtener productos:", data.error);
            }
        } catch (error) {
            console.error("❌ Error al aplicar filtros:", error);
        }
    });
});