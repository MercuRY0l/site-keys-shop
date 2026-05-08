


export async function loadCurrentUser(){
    try{
        const response = await fetch("http://127.0.0.1:8000/api/auth/me/", {
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