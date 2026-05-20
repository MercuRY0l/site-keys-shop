
import {deleteProduct} from "../delete/deleteProduct.js"

export async function handleDeleteProduct(){
const delete_btn = document.querySelectorAll(".delete-btn").forEach(btn=>{
        
        btn.addEventListener("click", async()=> {
            const product_id = btn.dataset.id;
            const success = await deleteProduct(product_id);

            if (success){
                btn.closest(".product-card").remove();
            }
        })
    })

}