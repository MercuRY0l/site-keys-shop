import { addNewProduct } from "./addNewProduct.js";

export async function showAddFormBtn() {

    const button = document.getElementById("showAddFormBtn");
    const modal = document.getElementById("addModal");
    

    if (!button) {
        console.error("Ошибка: Кнопка showAddFormBtn не найдена");
        return;
    }
    
    if (!modal) {
        console.error("Ошибка: Модальное окно addModal не найдено");
        return;
    }
    
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    const add_product_btn = document.getElementById("confirmAddProductBtn");
    if (!add_product_btn) return;

    add_product_btn.addEventListener("click", async()=>{
        await addNewProduct();
    })
    
}

export function closeAddFormBtn(){
    
    const modal = document.getElementById("addModal");
    const button = modal.querySelector(".close-modal")

    if (!button) {
        console.error("Ошибка: Кнопка close-modal не найдена");
        return;
    }
    
    if (!modal) {
        console.error("Ошибка: Модальное окно addModal не найдено");
        return;
    }

    button.addEventListener("click", ()=>{
        modal.classList.remove("active");

    })

}