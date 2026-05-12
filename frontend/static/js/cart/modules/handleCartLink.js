
import { loadCurrentUser } from "../../modules/loadCurrentUser.js";
import { showToast } from "../../modules/showToast.js";

export function handleCartLink() {
    document.addEventListener("click", async (e) => {
        const cartLink = e.target.closest(".js-cart");
        if (!cartLink) return;

        e.preventDefault();

        const user = await loadCurrentUser();
        if (!user) {
            showToast("Для данного действия необходима авторизация!", "error");
            return;
        }
        window.location.href = cartLink.href;
    });
}
