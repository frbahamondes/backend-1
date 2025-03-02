console.log("📌 Script productDetail.js cargado correctamente");

document.addEventListener("DOMContentLoaded", () => {
    const addToCartButton = document.getElementById("addToCart");
    const cartId = "67c385651f8d0d56e95aee31"; // ⚠️ Reemplázalo con el ID real de un carrito existente

    if (addToCartButton) {
        addToCartButton.addEventListener("click", async () => {
            const productId = addToCartButton.dataset.id;

            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });

                const data = await response.json();
                if (response.ok) {
                    alert("✅ Producto agregado al carrito");
                } else {
                    alert(`❌ Error: ${data.error}`);
                }
            } catch (error) {
                console.error("❌ Error al agregar producto:", error);
            }
        });
    }
});