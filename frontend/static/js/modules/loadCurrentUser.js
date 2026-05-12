
import { API_URL } from "../config.js";

export async function loadCurrentUser(){
    try{
        const response = await fetch(`${API_URL}/api/auth/me/`, {
            credentials : "include"
        })

        if (response.ok){
            
            const user = await response.json()
            return user;

        }
        else{
            console.log("Ошибка при получении данных пользователя, пользователь не авторизован!");
        }
    }

    catch(error){
        console.log(error)
    }
} 