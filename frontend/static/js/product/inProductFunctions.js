import { updateCartButtonState } from "../cart/modules/updateCartBtnState.js";
import {showToast} from "../modules/showToast.js"
import {getProductIdFromUrl} from "../modules/getProductIdFromUrl.js"
import {apiFetch} from "../modules/apiFetch.js";
import {API_URL} from "../config.js"
import { loadCurrentUser } from "../modules/loadCurrentUser.js";

export function inProductFunctions() {
    const cart_btn = document.querySelector(".add-to-cart-btn");
    const buy_btn = document.querySelector(".buy-btn");
    const email_field = document.querySelector(".email-input")

    if (!buy_btn) return;
    if (!cart_btn) return;

    updateCartButtonState(cart_btn);

    const product_id = cart_btn.dataset.productId;
    if (!product_id) return;

    cart_btn.addEventListener("click", async () => {
        if (cart_btn.classList.contains("added")) return;

        try {
            const response = await apiFetch(`${API_URL}/cart/items/`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id, quantity: 1 })
            });

            if (!response.ok) throw new Error("Не удалось добавить товар");

            cart_btn.classList.add("added");
            cart_btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
            cart_btn.disabled = true;
            cart_btn.style.cursor = "default";
        } catch (error) {
            console.error(error);
        }
    }); 

    buy_btn.addEventListener("click", async()=>{

        const product_id = getProductIdFromUrl();
        
        if (!email_field.value.trim()){
            showToast("Необходимо ввести адрес электронной почты!", "error");
            return;
        }

        const user = await loadCurrentUser();

        if (!user){
            showToast("Для данного действия необходима авторизация!", "error");
            return;
        }
        
        try{
            
            const response = await apiFetch(`${API_URL}/orders/from-product/${product_id}`, {
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
 