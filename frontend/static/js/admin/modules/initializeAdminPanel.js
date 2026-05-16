

import { showAddFormBtn, closeAddFormBtn } from "./handleAddModal.js"; 
import { showDeleteForm, closeDeleteForm } from "./handleDeleteModal.js"; 
import { addNewProduct} from "./addNewProduct.js";
import { deleteProductById } from "./deleteProduct.js";


export function initializeAdminPanel() {
    
    showAddFormBtn();
    closeAddFormBtn();

    showDeleteForm();
    closeDeleteForm();

}; 