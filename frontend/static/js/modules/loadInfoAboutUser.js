import { loadCurrentUser } from "./loadCurrentUser.js";
import { loadUserFunctions } from "../auth/auth.js"

export async function loadInfoAboutUser(){

    const user = await loadCurrentUser();
    if (user) {
        loadUserFunctions(user.username);
        const auth_btn = document.querySelector(".js-auth");
        auth_btn.classList.add("logged-in");
    }
}
