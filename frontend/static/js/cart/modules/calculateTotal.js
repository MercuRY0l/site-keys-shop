



let animationFrameId;

export function calculateTotal(products) {
    return products.reduce(
        (sum, p) => sum + (p.product_price || 0) * (p.product_quantity || 1),
        0
    );
}

export function animateTotalAmount(oldValue, newValue, totalEl) {
    const duration = 300; 
    const startTime = performance.now();

    function animate(time) {
        const progress = Math.min((time - startTime) / duration, 1);
        const currentValue = Math.round(oldValue + (newValue - oldValue) * progress);
        totalEl.textContent = `Общая сумма заказа: ${currentValue} ₽`;
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(animate);
}

export function updateTotalAmount() {
    const totalEl = document.getElementById("total-amount-order-text");
    if (!totalEl) return;

    const products = [];
    document.querySelectorAll(".cart-item").forEach(item => {
        const price = parseFloat(
            item.querySelector(".product-price").textContent.replace("₽","").trim()
        );
        const quantity = parseInt(
            item.querySelector(".product-quantity").textContent.trim()
        );
        products.push({ product_price: price, product_quantity: quantity });
    });

    const oldValue = parseInt(totalEl.textContent.replace(/\D/g, "")) || 0;
    const newValue = calculateTotal(products);

    animateTotalAmount(oldValue, newValue, totalEl);
}
