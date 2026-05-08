

import { getProductIdFromUrl } from "./getProductIdFromUrl.js";

export async function loadProduct(){

    try{
        const product_id = getProductIdFromUrl();

        if (!product_id) return;

        const response = await fetch(`http://127.0.0.1:8000/api/product/${product_id}/`)
        const product = await response.json()

        const container = document.querySelector(".product-info")
        const container2 = document.querySelector(".buy-box")

        if (!container){
            return;
        }
        
        container.innerHTML = 
        `<img id="product-image" src=${product.product_imageUrl} alt=${product.product_name}>
        <h2 id="productName">${product.product_name}</h2>
        <p id="productDescription">${product.product_description}</p>`


        container2.innerHTML = `
        <div class="productPrice">${product.product_price} ₽</div>
        <h2 id="emailText"></h2>
        <input type="email" class="email-input" id="email-input" placeholder="Введите адрес эл почты: ">
        <div class="buttons-row">
            <button class="buy-btn">Купить</button> 
            <button class="add-to-cart-btn" data-product-id="${product.product_id}">
                <i id="add-to-cart-icon" class="fa-solid fa-cart-plus"></i>
            </button>
        </div>
        `
        document.title = `NextGen Store | ${product.product_name}`

    } 

    catch(error){
        console.log(error);
    } 

}