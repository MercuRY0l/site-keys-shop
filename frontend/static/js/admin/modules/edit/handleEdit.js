

import {API_URL} from "../../../config.js"
import {apiFetch} from "../../../modules/apiFetch.js"
import {showToast} from "../../../modules/showToast.js"
import { openEditModal } from "./openEditModal.js";

export function handleEdit() {
    const container = document.getElementById("productsListContainer");

    if (!container) return;

    container.addEventListener("click", async (e) => {
        const btn = e.target.closest(".edit-btn");

        if (!btn) return;

        const productId = btn.dataset.id;

        await openEditModal(productId, container);
    });
}

