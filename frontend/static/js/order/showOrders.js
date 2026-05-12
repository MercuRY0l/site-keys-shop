
import { API_URL } from "../config.js"
import { apiFetch } from "../modules/apiFetch.js"


export async function showOrders() {
    const container = document.querySelector(".order-layout");
    const title = document.getElementById("order-page-title");

    if (!container || !title) return;

    const response = await apiFetch(`${API_URL}/orders/get`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        title.textContent = "Здесь пока пусто.";
        return;
    }

    
    const orders = await response.json();
    console.log(orders)

    container.innerHTML = "";

    if (!orders || orders.length === 0) {
        title.textContent = "Здесь пока пусто";
        return;
    }

    title.textContent = "Ваши заказы";

     orders.forEach(order => {
        
        const orderBlock = document.createElement("div");
        orderBlock.classList.add("order-block");

        orderBlock.innerHTML = `
            <h3>Заказ #${order.order_id} — Сумма: ${order.total_amount} ₽ </h3>
        `;

        
        order.items.forEach(item => {
            orderBlock.insertAdjacentHTML("beforeend", `
                <div class="order-item">
                    <div class="order-item-text">
                        <span class="product-title">${item.product_name}</span>
                        <span class="product-quantity">Количество: ${item.quantity}</span>
                        <span class="product-price">${item.product_price} ₽</span>
                    </div>
                </div>
            `);
        });

        container.appendChild(orderBlock);
    });
}

