


export function openProduct() {
    
    document.querySelectorAll(".open-product-btn").forEach(btn => {
        btn.addEventListener("click", () =>{
            const id = btn.closest(".product-card").dataset.id;
            window.location.href = (`/product/${id}/`)
        })

    }
    )
}