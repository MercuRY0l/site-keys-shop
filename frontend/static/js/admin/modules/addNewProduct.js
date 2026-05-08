

export async function addNewProduct() {
    const imageInput = document.getElementById("imageProduct");
    const file = imageInput.files[0];

    if (!file) {
        alert("Пожалуйста, выберите картинку.");
        return;
    }

    const category = document.getElementById("productCategory").value;
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const description = document.getElementById("productDescription").value;
    const quantityInput = document.getElementById("productQuantity").value;

    if (!category || !name || !price || !description || !quantityInput) {
        alert("Пожалуйста, заполните все поля.");
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
        const response = await fetch("http://127.0.0.1:8000/products/create/", {
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
}
