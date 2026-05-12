


let refreshFailed = false;

export async function apiFetch(url, options={}) {
    
    const response = await fetch(url, {
        ...options,
        credentials : "include",
        headers : {
            "Content-Type" : "application/json",
            ...(options.headers || {})
            
        }
    });

    if (response.status !== 401) return response;

    const refreshResponse = await fetch("/auth/refresh", {
            method : "POST",
            credentials : "include"

        }
    )

    if (!refreshResponse.ok){
        refreshFailed = true;
        return response;
    }

    refreshFailed = false;

    return fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            ...(options.body && {
                "Content-Type": "application/json"
            }),
            ...(options.headers || {})
        }
    });
}