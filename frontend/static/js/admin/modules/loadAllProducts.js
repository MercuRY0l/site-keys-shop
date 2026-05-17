

import { API_URL } from "../../config.js"
import { deleteProduct } from "./deleteProduct.js";

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

        const response = await fetch(`${API_URL}/products/`, {
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

       
        const delete_btn = document.querySelectorAll(".delete-btn").forEach(btn=>{
            
            btn.addEventListener("click", async()=> {
                const product_id = btn.dataset.id;
                const success = await deleteProduct(product_id);

                if (success){
                    btn.closest(".product-card").remove();
                }
            })
        })
        

        
        document.querySelectorAll(".edit-btn").forEach(btn => {

            btn.addEventListener("click", () => {

                const productId = btn.dataset.id;

                console.log("Редактировать товар:", productId);

                // тут открываешь модалку редактирования

            });

        });

    } catch (error) {

        console.log(error);

    }

}
