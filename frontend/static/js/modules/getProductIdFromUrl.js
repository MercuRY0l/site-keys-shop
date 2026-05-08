

export function getProductIdFromUrl(){
    const parts = window.location.pathname.split("/")
    return parts[2]
}