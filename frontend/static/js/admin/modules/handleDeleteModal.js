import { loadAllProducts } from "./loadAllProducts.js";

export async function showDeleteForm() {

    const button = document.getElementById("showDeleteFormBtn");
    const modal = document.getElementById("deleteModal");
    

    if (!button) {
        console.error("Ошибка: Кнопка showDeleteFormBtn не найдена");
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

    await loadAllProducts();
}

export function closeDeleteForm(){
    const modal = document.getElementById("deleteModal");
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