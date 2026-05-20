import { showAddFormBtn, closeAddFormBtn } from "./handleAddModal.js"; 
import { showDeleteForm, closeDeleteForm } from "../modules/delete/handleDeleteModal.js"
import { handleDeleteProduct } from "./delete/handleDelete.js";
import { handleEdit } from "./edit/handleEdit.js";
import { apiFetch } from "../../modules/apiFetch.js";
import { API_URL } from "../../config.js";

let isInitialized = false;
let initializationPromise = null;

export async function initializeAdminPanel() {
    if (isInitialized) {
        console.log("Admin panel already initialized");
        return;
    }
    
    if (initializationPromise) {
        console.log("Initialization already in progress");
        return initializationPromise;
    }
    
    initializationPromise = (async () => {
        try {
            
            const response = await apiFetch(`${API_URL}/admin/actions`, {
                method: "GET"
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    
                    console.log("Unauthorized, waiting for token refresh...");
                    return;
                }
                throw new Error(`HTTP ${response.status}`);
            }
            
            
            await Promise.all([
                showAddFormBtn(),
                showDeleteForm(),
                handleDeleteProduct()
            ]);
            
            closeAddFormBtn();
            closeDeleteForm();
            handleEdit();
            
            isInitialized = true;
            console.log("Admin panel initialized successfully");
            
        } catch (error) {
            console.error("Error initializing admin panel:", error);
            
            if (error.message.includes('401') || error.message.includes('Session expired')) {
                redirectToLogin();
            }
        } finally {
            initializationPromise = null;
        }
    })();
    
    return initializationPromise;
}