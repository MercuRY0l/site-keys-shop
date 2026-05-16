
import { API_URL } from "../../config.js";

export async function deleteProduct(product_id){
    try{
        const response = await fetch(`${API_URL}/products/delete/${product_id}`, {
        method: "DELETE"
    });
        const result = await response.json();
        console.log("Ответ сервера:", result);
        
        if (response.ok) { 
            alert("Продукт успешно удален!");
            return true;

        } else {
            alert("Ошибка при удалении продукта: " + (result.error || "Неизвестная ошибка"));
            return false;
        }
    }

    catch(error){
        alert(error); 
        return false;
    }
}