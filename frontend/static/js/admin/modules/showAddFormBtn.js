



export function showAddFormBtn() {

    const addProductBtn = document.getElementById("addProductBtn");
    
    const showAddFormBtn = document.getElementById("showAddFormBtn");
    const formContainer = document.getElementById("addProductFormContainer");
    
    showAddFormBtn.addEventListener("click", () => {
        formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";



})};