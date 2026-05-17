

import { showAddFormBtn, closeAddFormBtn } from "./handleAddModal.js"; 
import { showDeleteForm, closeDeleteForm } from "./handleDeleteModal.js"; 
import { addNewProduct} from "./addNewProduct.js";
import { deleteProduct } from "./deleteProduct.js";


export async function initializeAdminPanel() {
    
    await showAddFormBtn();
    closeAddFormBtn();

    await showDeleteForm();
    closeDeleteForm();

    

}; 