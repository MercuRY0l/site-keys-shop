export function clearCartUI() {
    document.querySelectorAll(".add-to-cart-btn.added").forEach(btn => btn.classList.remove("added"));
    document.querySelectorAll(".in-cart-label").forEach(label => label.remove());
}