
import { login } from "./login.js";
import { showAddFormBtn } from "./showAddFormBtn.js"; 
import { showDeleteFormBtn } from "./showDeleteFormBtn.js"; 
import { addNewProduct} from "./addNewProduct.js";
import { deleteProductById } from "./deleteProduct.js";


export function initializeAdminPanel() {
    console.log("Admin panel initialized");

    document.getElementById("login-btn").addEventListener("click", login);


    showAddFormBtn();
    showDeleteFormBtn();
    
    document.getElementById("addProductBtn").addEventListener("click", addNewProduct);

    document.getElementById("deleteProductBtn").addEventListener("click", deleteProductById);

}; 