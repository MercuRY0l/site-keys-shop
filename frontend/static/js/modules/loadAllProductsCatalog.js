import { API_URL } from "../config.js";
import { getUser } from "../modules/getUser.js";
import { apiFetch } from "./apiFetch.js";

export async function loadAllProductsCatalog() {
    try {
        const container = document.getElementById("all-products-catalog");
        if (!container) return;

        const response = await apiFetch(`${API_URL}/products/`);
        const products = await response.json();

        const user = await getUser();

        let cart_items = [];
        if (user) {
            try {
                const response2 = await apiFetch(`${API_URL}/cart/items/get`, {
                    method: "GET",
                    credentials: "include"
                });
                cart_items = await response2.json();
            } catch (err) {
                console.error("Ошибка загрузки корзины:", err);
                cart_items = [];
            }
        }

        container.innerHTML = "";

        products.forEach(p => {
            const productCard = document.createElement("div");
            productCard.className = "product-card";
            productCard.dataset.id = p.product_id;
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${p.product_imageUrl}" alt="${p.product_name}">
                </div>
                <h3>${p.product_name}</h3>
                <div class="price">${p.product_price} ₽</div>
                <div class="product-actions">
                    <button type="button" class="open-product-btn">Купить</button>
                    <div class="add-to-cart-btn" id="add-to-cart-${p.product_id}">
                        <i class="fa-solid fa-cart-plus add-to-cart-icon"></i>
                        <i class="fa-solid fa-check"></i>
                    </div>
                </div>
            `; 
            container.appendChild(productCard);

            
            if (user && cart_items.some(item => item.product_id == p.product_id)) {
                const btn = productCard.querySelector(".add-to-cart-btn");
                btn.classList.add("added");

                const label = document.createElement("div");
                label.textContent = "В корзине";
                label.className = "in-cart-label";
                productCard.appendChild(label);
            }
        });

        

    } catch (error) {
        console.log("Ошибка загрузки продуктов:", error);
    }
}
