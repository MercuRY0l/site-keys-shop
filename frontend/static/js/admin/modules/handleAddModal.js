export function showAddFormBtn() {

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
}

export function closeAddFormBtn(){
    const button = document.querySelector(".close-modal")
    const modal = document.getElementById("addModal");

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