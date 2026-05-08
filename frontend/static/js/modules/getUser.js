

export async function getUser(){
    try{
        const response = await fetch("http://127.0.0.1:8000/api/auth/me/", {
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
