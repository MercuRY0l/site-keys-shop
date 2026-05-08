import { getUser } from "../../modules/getUser.js";
import { showToast } from "../../modules/showToast.js";

export function handleCartClicks() {
    document.addEventListener("click", async (e) => {
        const clickedCartBtn = e.target.closest(".add-to-cart-btn");
        if (!clickedCartBtn || clickedCartBtn.classList.contains("added")) return;

        const user = await getUser();
        if (!user) {
            showToast("Для данного действия необходима авторизация", "error");
            return;
        }

        const productCard = clickedCartBtn.closest(".product-card");
        if (!productCard) return;
        const product_id = productCard.dataset.id;
        const quantity = 1;

        try {
            const response = await fetch("http://127.0.0.1:8000/cart/items/", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id, quantity })
            });
            if (!response.ok) throw new Error("Не удалось добавить товар");

            clickedCartBtn.classList.add("added");
            showToast("Товар добавлен в корзину", "success");

            if (!productCard.querySelector(".in-cart-label")) {
                const label = document.createElement("div");
                label.textContent = "В корзине";
                label.className = "in-cart-label";
                productCard.appendChild(label);
            }

        } catch (error) {
            console.error(error);
            showToast("Ошибка добавления в корзину", "error");
        }
    });
}
