let refreshFailed = false;

export async function apiFetch(url, options = {}) {
    
    
    const getHeaders = (opts) => {
        const isFormData = opts.body instanceof FormData;
        const headers = {};
        
    
        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }
        
        
        return {
            ...headers,
            ...(opts.headers || {})
        };
    };
    
    
    const makeRequest = async (reqUrl, reqOptions) => {
        return fetch(reqUrl, {
            ...reqOptions,
            credentials: "include",
            headers: getHeaders(reqOptions)
        });
    };
    
    
    let response = await makeRequest(url, options);
    
    
    if (response.status !== 401) return response;
    
    
    const refreshResponse = await fetch("/auth/refresh", {
        method: "POST",
        credentials: "include"
    });
    
    if (!refreshResponse.ok) {
        refreshFailed = true;
        return response;
    }
    
    refreshFailed = false;
    
    return makeRequest(url, options);
}