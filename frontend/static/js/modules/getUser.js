import { API_URL } from "../config.js";

export async function getUser(){
    try{
        const response = await fetch(`${API_URL}/api/auth/me/`, {
            method : "GET",
            credentials : "include"
        })

        if (!response.ok)  return null;
        
        return await response.json();
    }

    catch(error){
        console.log(error);
        return null;
    }
    
}
