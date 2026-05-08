


export function showDeleteFormBtn() {
    
    // const products = [];

    const showDeleteFormBtn = document.getElementById("showDeleteFormBtn");
    const deleteFormContainer = document.getElementById("deleteProductFormContainer");

    showDeleteFormBtn.addEventListener("click", () => {
    deleteFormContainer.style.display = deleteFormContainer.style.display === "none" ? "block" : "none";
});


}