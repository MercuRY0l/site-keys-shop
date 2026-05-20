
import {apiFetch} from "../../../modules/apiFetch.js"
import {API_URL} from "../../../config.js"
import {showToast} from "../../../modules/showToast.js"
import {closeAllModals} from "../closeAllModals.js"
import {loadAllProducts} from "../loadAllProducts.js"

export async function openEditModal(productId, container) {
    
    try {
        
        const response = await apiFetch(`${API_URL}/products/edit/${productId}`, {
            method: "GET"
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            showToast("error", errorData.message || "Ошибка при загрузке данных товара");
            return;
        }
        
        const product = await response.json();
        
        const modal = document.createElement("div");
        modal.className = "edit-modal-overlay";
        modal.innerHTML = `
            <div class="edit-modal-content">
                <div class="edit-modal-header">
                    <h3>✏️ Редактирование товара</h3>
                    <button class="edit-modal-close">&times;</button>
                </div>
                <div class="edit-modal-body">
                    <div class="edit-form-group">
                        <label>Категория:</label>
                        <select id="modalProductCategory" class="edit-form-control">
                            <option value="Games" ${product.product_category === 'Games' ? 'selected' : ''}>Игры</option>
                            <option value="DLC" ${product.product_category === 'DLC' ? 'selected' : ''}>DLC</option>
                            <option value="Subscribes" ${product.product_category === 'Subscribes' ? 'selected' : ''}>Подписки</option>
                        </select>
                    </div>
                    
                    <div class="edit-form-group">
                        <label>Название товара:</label>
                        <input type="text" id="modalProductName" class="edit-form-control" 
                               value="${escapeHtml(product.product_name)}" 
                               placeholder="Название товара" autocomplete="off">
                    </div>
                    
                    <div class="edit-form-group">
                        <label>Описание товара:</label>
                        <textarea id="modalProductDescription" class="edit-form-control" 
                                  rows="4" placeholder="Описание товара...">${escapeHtml(product.product_description || '')}</textarea>
                    </div>
                    
                    <div class="edit-form-row">
                        <div class="edit-form-group">
                            <label>Цена (₽):</label>
                            <input type="number" id="modalProductPrice" class="edit-form-control" 
                                   value="${product.product_price}" step="0.01" placeholder="Цена (₽)">
                        </div>
                        
                        <div class="edit-form-group">
                            <label>Количество:</label>
                            <input type="number" id="modalProductQuantity" class="edit-form-control" 
                                   value="${product.product_quantity || 0}" placeholder="Количество на складе">
                        </div>
                    </div>
                    
                    <div class="edit-form-group">
                        <label>📷 Текущее изображение:</label>
                        <div class="edit-current-image">
                            <img src="${product.product_imageUrl}" alt="${product.product_name}" 
                                 style="max-width: 200px; border-radius: 8px;">
                        </div>
                        <div class="file-input">
                            <label style="font-size:0.85rem; color:#334155;">📷 Новое изображение (опционально):</label>
                            <input id="modalImageProduct" type="file" accept="image/*">
                        </div>
                    </div>
                    
                    <div class="edit-modal-footer">
                        <button class="edit-btn-cancel">❌ Отмена</button>
                        <button class="edit-btn-submit" id="confirmSaveProductBtn">💾 Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        closeAllModals();
        
        const closeBtn = modal.querySelector(".edit-modal-close");
        const cancelBtn = modal.querySelector(".edit-btn-cancel");
        const overlay = modal;
        
        const closeModal = () => {
            modal.remove();
        };
        
        closeBtn.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeModal();
        });
        
        
        const saveBtn = modal.querySelector("#confirmSaveProductBtn");
        if (saveBtn) {
            
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
            
            newSaveBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Save button clicked");
                await saveEditProduct(productId, modal);
            });
        } else {
            console.error("Save button not found in modal");
        }
        
    } catch (error) {
        console.error("Ошибка в openEditModal:", error);
        showToast("error", `Не удалось загрузить данные товара: ${error.message}`);
    }
}

export async function saveEditProduct(productId, modal) {
    console.log("saveEditProduct called with productId:", productId);
    
    try {
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const nameInput = modal.querySelector("#modalProductName");
        const categorySelect = modal.querySelector("#modalProductCategory");
        const descriptionTextarea = modal.querySelector("#modalProductDescription");
        const priceInput = modal.querySelector("#modalProductPrice");
        const quantityInput = modal.querySelector("#modalProductQuantity");
        const imageFileInput = modal.querySelector("#modalImageProduct");
        
        
        console.log("Found elements:", {
            nameInput: !!nameInput,
            categorySelect: !!categorySelect,
            descriptionTextarea: !!descriptionTextarea,
            priceInput: !!priceInput,
            quantityInput: !!quantityInput,
            imageFileInput: !!imageFileInput
        });
        
        if (!nameInput) {
            console.error("modalProductName element not found in modal");
            showToast("error", "Ошибка: поле названия не найдено");
            return false;
        }
        
        const name = nameInput.value.trim();
        const category = categorySelect ? categorySelect.value : "Games";
        const description = descriptionTextarea ? descriptionTextarea.value.trim() : "";
        const price = priceInput ? priceInput.value : null;
        const quantity = quantityInput ? quantityInput.value : 0;
        const imageFile = imageFileInput ? imageFileInput.files[0] : null;
        
        console.log("Form data:", { name, category, description, price, quantity, hasImage: !!imageFile });
        
      
        if (!name) {
            showToast("error", "Введите название товара");
            return false;
        }
        
        if (!description) {
            showToast("error", "Введите описание товара");
            return false;
        }
        
        if (!price || price <= 0) {
            showToast("error", "Введите корректную цену");
            return false;
        }
        
        const priceNum = parseFloat(price);
        const quantityNum = parseInt(quantity) || 0;
        
        if (isNaN(priceNum) || priceNum <= 0) {
            showToast("error", "Цена должна быть положительным числом");
            return false;
        }
        
        let response;
        
        if (imageFile) {
            console.log("Sending with image file");
            const formData = new FormData();
            formData.append("product_name", name);
            formData.append("product_category", category);
            formData.append("product_description", description);
            formData.append("product_price", priceNum);
            formData.append("product_quantity", quantityNum);
            formData.append("product_image", imageFile);
            
            response = await apiFetch(`${API_URL}/products/edit/${productId}`, {
                method: "PATCH",
                body: formData
            });
        } else {
            console.log("Sending without image");
            response = await apiFetch(`${API_URL}/products/edit/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    product_name: name,
                    product_category: category,
                    product_description: description,
                    product_price: priceNum,
                    product_quantity: quantityNum
                })
            });
        }
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            let errorMessage = "Ошибка при обновлении товара";
            try {
                const data = await response.json();
                errorMessage = data.message || data.error || errorMessage;
                console.error("Server error response:", data);
            } catch (e) {
                console.error("Failed to parse error response:", e);
                errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
            }
            showToast("error", errorMessage);
            return false;
        }
        
        const data = await response.json();
        console.log("Success response:", data);
        
        showToast("success", "Товар успешно обновлен");
        
        
        if (modal && modal.remove) {
            modal.remove();
        }
        
        
        if (typeof loadAllProducts === 'function') {
            await loadAllProducts();
        } else {
            console.error("loadAllProducts is not a function");
        }
        
        return true;
        
    } catch (error) {
        console.error("Ошибка при сохранении:", error);
        console.error("Error stack:", error.stack);
        showToast("error", `Произошла ошибка: ${error.message || "неизвестная ошибка"}`);
        return false;
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}