import { API_URL } from "../../config.js";
import { apiFetch } from "../../modules/apiFetch.js";



export async function updateCartButtonState(cartBtn) {
    const product_id = cartBtn.dataset.productId;

    try {
        const response = await apiFetch(`${API_URL}/cart/items/get`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) return;

        const cartItems = await response.json();

        if (cartItems.some(item => item.product_id == product_id)) {
            cartBtn.classList.add("added");
            cartBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
            cartBtn.disabled = true;
            cartBtn.style.cursor = "default";
        }
    } catch (err) {
        console.error(err);
    }
}
