

import { initializeUserFunctions } from "./modules/initializeUserFunctions.js";
import { animateCartMainPage } from "./modules/animateCartMainPage.js";

document.addEventListener("DOMContentLoaded", async () => {

    animateCartMainPage();
    await initializeUserFunctions();

})

