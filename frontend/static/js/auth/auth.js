
import {showToast} from "../modules/showToast.js"
import { loadCurrentUser } from "../modules/loadCurrentUser.js"
import {clearCartUI} from "../cart/modules/clearCartUI.js"

function clearAuthFields(){

    const loginInput = document.getElementById("login-input")
    const emailInput = document.getElementById("email-input")
    const passwordInput1 = document.getElementById("password-input1")
    const passwordInput2 = document.getElementById("password-input2")

    if (loginInput) loginInput.value = "";
    if (emailInput) emailInput.value = "";
    if (passwordInput1) passwordInput1.value = "";
    if (passwordInput2) passwordInput2.value = "";
}

function closeAuthModal(){
    const modal = document.getElementById("authModal")
    modal.style.display = "none"
}

export function loadUserFunctions(username){

    const authBtn = document.querySelector(".js-auth");

    authBtn.innerHTML = `
        <i class="fa-solid fa-user-check"></i>
        <h3 id="loginText">${username}</h3>

        <div class="user-menu" id="userMenu">
            <a href="/profile">Профиль</a>
            <a href="/orders">Заказы</a>
            <button id="logoutBtn">Выйти</button>
        </div>
    `;

    authBtn.classList.add("logged-in");

    initUserItem();

}

async function initUserItem(){
    
    const authBtn = document.querySelector(".js-auth");
    const userMenu = document.getElementById("userMenu")

    authBtn.onclick = () => {
        userMenu.classList.toggle("active");
        
    }

    document.addEventListener("click", (e) => {
        if (!authBtn.contains(e.target)){
            userMenu.classList.remove("active");
            e.stopPropagation();
        }
    });

    document.addEventListener("click", (e) => {
        if(!authBtn.contains(e.target) && !userMenu.contains(e.target)){
            userMenu.classList.remove("active");
        }
    })

    authBtn.addEventListener("mouseleave", () =>{
        setTimeout(() => {
            if(userMenu.matches(":hover")){
                userMenu.classList.remove("active")
            }
        }, 200)
    })

    userMenu.addEventListener("mouseleave", () => {
        userMenu.classList.remove("active");
    });

    const logoutBtn = document.getElementById("logoutBtn")

    logoutBtn.onclick = async () => {
        try{
        const response = await fetch("http://127.0.0.1:8000/auth/logout/", {
            method : "POST"
        })

            if (response.ok){
                authBtn.innerHTML = `
                <i class="fa-solid fa-user"></i>
                <h3 id="loginText">Войти</h3>`
                authBtn.classList.remove("logged-in");
                clearCartUI();
                window.location.href = "/"

                }
            

            else{
                console.log(error);
            }

    
        }
        catch(error){
            console.log(error);
        }
    }
}


export async function login() {


    const auth_btn = document.querySelector(".js-auth")
    const modal = document.getElementById("authModal")
    const title = document.getElementById("authTitle")
    const closeBtn = document.getElementById("closeAuthModal")
    const switchModeBtn = document.getElementById("switchModeBtn")

    const submitBtn = document.getElementById("authSubmit")

    const loginInput = document.getElementById("login-input")
    const emailInput = document.getElementById("email-input")
    const passwordInput1 = document.getElementById("password-input1")
    const passwordInput2 = document.getElementById("password-input2")

    let mode = "login"

    auth_btn.addEventListener("click", (e) => {
        if(auth_btn.classList.contains("logged-in")) return;
        modal.style.display = "flex";
        e.stopPropagation();
        
    })

    closeBtn.onclick = () => modal.style.display = "none";

    modal.onclick = (e) => { 
        if (e.target === modal) modal.style.display = "none"; 
       
    }

    switchModeBtn.onclick = () => {
        clearAuthFields();
        if (mode === "login"){
        
        mode="register"
        switchModeBtn.innerText = "Войти"
        title.innerText = "Регистрация"
        submitBtn.innerText = "Зарегистрироваться"
        
        
        
        if(emailInput) emailInput.style.display = "block"
        if(passwordInput2) passwordInput2.style.display = "block"
        
        }

        else {
            clearAuthFields();
            mode="login"
            switchModeBtn.innerText = "Регистрация";
            title.innerText = "Вход";
            submitBtn.innerText = "Войти";
            
            if(emailInput) emailInput.style.display = "none"
            if(passwordInput2) passwordInput2.style.display = "none"

        }
    }

    submitBtn.onclick = async() => {
        try{
            let url = ""
            let payload = {}

            if (mode === "login"){
                url = "http://127.0.0.1:8000/auth/login/";
                payload = {
                    username : loginInput.value,
                    password : passwordInput1.value
                };
            }
            else{
                url = "http://127.0.0.1:8000/auth/register/";
                payload = {
                    username : loginInput.value,
                    email : emailInput.value,
                    password : passwordInput1.value,
                    password_repeat : passwordInput2.value
                };

            }
            

            const response = await fetch(url, {
                    method:"POST", 
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

            const data = await response.json();
            
            

            if (response.ok){
                showToast(mode === "login"
                    ? "Успешный вход!"
                    : "Регистрация успешна!" , "success");
                
                
                clearAuthFields();
                closeAuthModal();
        
                const user = await loadCurrentUser();
                if (user) {
                loadUserFunctions(user.username);
                const auth_btn = document.querySelector(".js-auth");
                auth_btn.classList.add("logged-in");
                }
                
            }
            else{
                console.log(data);
                showToast("Ошибка при регистрации / Авторизации", "error");
                clearAuthFields();
            }

            
        }
        catch(error){
            
            console.log(error);
            }
        }
        
    }

