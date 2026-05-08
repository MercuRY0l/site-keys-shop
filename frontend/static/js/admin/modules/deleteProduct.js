


export async function deleteProductById(){

    const form = document.getElementById("deleteProductFormContainer")

    const product_id = document.getElementById("productId").value;

    const formData = new FormData();
    formData.append("product_id", product_id)

    if (!product_id){
        alert("Заполните поле id!");
        return;
    }

    try{
        const response = await fetch("http://127.0.0.1:8000/products/delete/", {
        method: "POST",
        body : formData
    });
        const result = await response.json();
        console.log("Ответ сервера:", result);
        
        if (response.ok) { 
            alert("Продукт успешно удален!");

        } else {
            alert("Ошибка при удалении продукта: " + (result.error || "Неизвестная ошибка"));
        }
    }

    catch(error){
        alert(error); 
    }

}