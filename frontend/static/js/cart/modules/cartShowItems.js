
import { calculateTotal, updateTotalAmount } from "./calculateTotal.js";
import { apiFetch } from "../../modules/apiFetch.js";
import { API_URL } from "../../config.js"

export async function cartShowItems() {
    try {
        const title = document.getElementById("cart-page-title");
        const leftContainer = document.getElementById("left-cart-container");
        const rightContainer = document.getElementById("right-cart-container");
        const totalText = document.getElementById("total-amount-order-text");

        if (!title || !leftContainer || !rightContainer) return;

        const response = await apiFetch(`${API_URL}/cart/items/get`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) return;

        const products = await response.json();

        
        leftContainer.innerHTML = "";

        
        if (!products || products.length === 0) {
            title.textContent = "Здесь пока пусто";
            rightContainer.style.display = "none";
            return;
        }

        
        title.textContent = "Товары в вашей корзине";
        rightContainer.style.display = "block";

        totalText.textContent =
            `Общая сумма заказа: ${calculateTotal(products)} ₽`;

        products.forEach(p => {
            leftContainer.insertAdjacentHTML(
                "beforeend",
                `
                <div class="cart-item" data-id="${p.product_id}">
                    <img src="${p.product_imageUrl}" alt="${p.product_name || 'Товар'}">
                    <div class="cart-item-text">
                        <span class="product-title">${p.product_name || 'Без названия'}</span>
                        <span class="product-description">${p.product_description || ''}</span>
                        <span class="product-price">${p.product_price || 0} ₽</span>
                        <div class="product-quantity-wrapper">
                            <button class="quantity-btn" data-action="decrease">-</button>
                            <span class="product-quantity">${p.product_quantity}</span>
                            <button class="quantity-btn" data-action="increase">+</button>
                        </div>
                    </div>
                </div>
                `
            );
        });

    } catch (error) {
        console.error("Ошибка корзины:", error);
    }

    
}
