import { API_URL } from "../../config.js";
import {showToast } from "../../modules/showToast.js"

export async function addNewProduct() {
    const imageInput = document.getElementById("modalImageProduct");
    const file = imageInput.files[0];

    if (!file) {
        showToast("error", "Выберите картинку")
        return;
    }

    const category = document.getElementById("modalProductCategory").value;
    const name = document.getElementById("modalProductName").value;
    const price = document.getElementById("modalProductPrice").value;
    const description = document.getElementById("modalProductDescription").value;
    const quantityInput = document.getElementById("modalProductQuantity").value;


    if (!category || !name || !price || !description || !quantityInput) {
        showToast("error", "Заполните все поля")
        return;
    }

    const quantity = Number(quantityInput);

    const formData = new FormData();
    formData.append("product_category", category);
    formData.append("product_name", name);
    formData.append("product_description", description);
    formData.append("product_price", price);
    formData.append("product_quantity", quantity);
    formData.append("product_imageUrl", file);

     
    try {
        const response = await fetch(`${API_URL}/products/create/`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        console.log("Ответ сервера:", result);

        if (response.ok) {
            alert("Продукт успешно добавлен!");
            
        } else {
            alert("Ошибка при добавлении продукта: " + JSON.stringify(result.detail));
        }

    } catch (error) {
        console.error("Ошибка при добавлении продукта:", error);
    }

    clearForm();
}



function clearForm() {

    document.getElementById('modalProductCategory').selectedIndex = 0;
    
    document.getElementById('modalProductName').value = '';
    document.getElementById('modalProductDescription').value = '';
    document.getElementById('modalProductPrice').value = '';
    document.getElementById('modalProductQuantity').value = '';
    
    document.getElementById('modalImageProduct').value = '';
}