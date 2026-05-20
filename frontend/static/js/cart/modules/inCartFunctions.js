import { updateTotalAmount } from "./calculateTotal.js";
import {showToast} from "../../modules/showToast.js"
import { API_URL } from "../../config.js";
import { apiFetch } from "../../modules/apiFetch.js";

export function inCartFunctions() {
    if (window.cartQuantityHandlerAdded) return;
    window.cartQuantityHandlerAdded = true;

    document.addEventListener("click", async (e) => {
        const btn = e.target.closest(".quantity-btn");
        if (!btn) return;

        const productCard = btn.closest(".cart-item");
        if (!productCard) return;

        const product_id = productCard.dataset.id;
        const counter = productCard.querySelector(".product-quantity");
        if (!counter) return;

        let quantity = Number(counter.textContent) || 1;

        if (btn.dataset.action === "increase") {
            quantity += 1;
            counter.textContent = quantity;

            try {
                await apiFetch(`${API_URL}/cart/items/`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ product_id, quantity: 1 })
                });
            } catch (error) {
                console.error(error);
            }
        }

        if (btn.dataset.action === "decrease") {
            quantity -= 1;

            try {
                await apiFetch(`${API_URL}/cart/items/delete`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ product_id, quantity: 1 })
                });

                if (quantity <= 0) {
                    productCard.remove();
                } else {
                    counter.textContent = quantity;
                }
            } catch (error) {
                console.error(error);
            }
        }
        updateTotalAmount();
    });

    const buy_btn = document.getElementById("order-btn")
    const email_field = document.querySelector(".email-input")

    if (!buy_btn) return;
    if (!email_field) return;

    buy_btn.addEventListener("click", async()=>{
        
        if (!email_field.value.trim()){
            showToast("Необходимо ввести адрес электронной почты!", "error");
            return;
        }
        
        try{
            
            const response = await apiFetch(`${API_URL}/orders/from-cart`, {
                method : "POST",
                credentials : "include",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({
                    email: email_field.value
                })
                
            })

            if(response.ok) {
                showToast("Заказ успешно оформлен!")
            }

            const data = await response.json();

            setTimeout(() => {
                window.location.href = "/";
                
            }, 2000);
            
            return data;
            

        }
        catch(error){
            console.log(error);
        }
    })
}
