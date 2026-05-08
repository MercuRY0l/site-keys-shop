
import { loadAllProductsCatalog } from "./loadAllProductsCatalog.js";
import { loadAllGamesCatalog } from "./loadAllGamesCatalog.js";
import { loadAllDlcCatalog } from "./loadAllDlcCatalog.js";
import { loadAllSubscribesCatalog } from "./loadAllSubscribes.js";
import { loadProduct } from "./loadProduct.js";
import {openProduct} from "./openProduct.js";

import {login} from "../auth/auth.js"

import { loadInfoAboutUser } from "./loadInfoAboutUser.js";
import { cartShowItems } from "../cart/modules/cartShowItems.js";
import { handleCartClicks } from "../cart/modules/cartFunctions.js";
import { handleCartLink } from "../cart/modules/handleCartLink.js";
import { inCartFunctions } from "../cart/modules/inCartFunctions.js";
import { inProductFunctions } from "../product/inProductFunctions.js";
import { showOrders } from "../order/showOrders.js";
import { searchFunction } from "../search/searchFunction.js";


export async function initializeUserFunctions() {

    login();

    await Promise.all([
        loadInfoAboutUser(),
        loadAllProductsCatalog(),
        loadAllGamesCatalog(),
        loadAllDlcCatalog(),
        loadAllSubscribesCatalog(),
        
        loadProduct(),
        
        cartShowItems(),
        inCartFunctions(),
        handleCartLink(),
        showOrders()
        
    ]);  
    searchFunction();
    inProductFunctions();
    openProduct();
    handleCartClicks();
    
    
    
}