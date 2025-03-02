console.log('📌 Script products.js cargado correctamente');

document.addEventListener('DOMContentLoaded', () => {
    let cartId = localStorage.getItem('cartId'); // 🛒 Intentar obtener el ID del carrito guardado

    // ✅ Función para crear un carrito si no existe
    const createCartIfNeeded = async () => {
        if (!cartId) {
            try {
                const response = await fetch('/api/carts', { method: 'POST' });
                const data = await response.json();
                cartId = data._id; // Guardar el nuevo carrito
                localStorage.setItem('cartId', cartId); // 📌 Guardar en localStorage
                console.log('🛒 Nuevo carrito creado:', cartId);
            } catch (error) {
                console.error('❌ Error al crear carrito:', error);
            }
        }
    };

    // ✅ Función para agregar productos al carrito
    const addToCart = async (productId) => {
        await createCartIfNeeded(); // Asegurar que el carrito existe antes de agregar productos

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

    // ✅ Función para redirigir a la vista de detalles del producto
    const goToProductDetails = (productId) => {
        window.location.href = `/products/${productId}`;
    };

    // ✅ Asignar eventos a botones "Agregar al carrito" y "Ver detalles"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => addToCart(button.dataset.id));
    });

    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => goToProductDetails(button.dataset.id));
    });

    // ✅ Aplicar filtros y ordenamiento
    document.getElementById("applyFilters").addEventListener("click", async () => {
        const category = document.getElementById("category").value;
        const sort = document.getElementById("sort").value;

        let url = "/api/products?"; // Base URL

        if (category) {
            url += `query=${category}`;
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
                        <p><strong>Precio:</strong> $${product.price}</p>
                        <p><strong>Categoría:</strong> ${product.category}</p>
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

                document.querySelectorAll('.view-details').forEach(button => {
                    button.addEventListener('click', () => goToProductDetails(button.dataset.id));
                });

            } else {
                console.error("❌ Error al obtener productos:", data.error);
            }
        } catch (error) {
            console.error("❌ Error al aplicar filtros:", error);
        }
    });

    // ✅ Crear carrito si no existe
    createCartIfNeeded();
});