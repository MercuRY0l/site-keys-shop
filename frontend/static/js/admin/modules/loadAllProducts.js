

import { API_URL } from "../../config.js"
import { deleteProduct } from "./delete/deleteProduct.js";
import { apiFetch } from "../../modules/apiFetch.js"
import {showToast} from "../../modules/showToast.js"

export async function loadAllProducts() {

    const container = document.getElementById("productsListContainer");

    if (!container) {
        console.error("Контейнер productsListContainer не найден");
        return;
    }

    container.innerHTML = `
        <div style="text-align:center; padding:20px;">
            Загрузка товаров...
        </div>
    `;

    try {

        const response = await apiFetch(`${API_URL}/products/`, {
            method: "GET"
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            return;
        }

        container.innerHTML = "";

        data.forEach(product => {

            const card = document.createElement("div");

            card.classList.add("product-card");

            card.innerHTML = `
                <div class="product-card-image">
                    <img 
                        src="${product.product_imageUrl}" 
                        alt="${product.product_name}"
                    />
                </div>

                <div class="product-card-content">

                    <h4>${product.product_name}</h4>

                    <p class="product-category">
                        ${product.product_category}
                    </p>

                    <p class="product-price">
                        ${product.product_price} ₽
                    </p>

                    <div class="product-actions">

                        <button 
                            class="edit-btn"
                            data-id="${product.product_id}"
                        >
                            ✏️
                        </button>

                        <button 
                            class="delete-btn"
                            data-id="${product.product_id}"
                        >
                            ✖
                        </button>

                    </div>

                </div>
            `;

            container.appendChild(card);
        });


        
        

    } catch (error) {

        console.log(error);

    }

}
