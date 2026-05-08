
import { getUser } from "../../modules/getUser.js";
import { showToast } from "../../modules/showToast.js";

export function handleCartLink() {
    document.addEventListener("click", async (e) => {
        const cartLink = e.target.closest(".js-cart");
        if (!cartLink) return;

        e.preventDefault();

        const user = await getUser();
        if (!user) {
            showToast("Для данного действия необходима авторизация!", "error");
            return;
        }
        window.location.href = cartLink.href;
    });
}
