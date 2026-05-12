import {API_URL} from "../config.js"

const searchInput = document.querySelector(".search-input");
const searchDropdown = document.getElementById("search-dropdown");


async function search() {
    const query = searchInput.value.trim();
    if (!query) {
        searchDropdown.style.display = "none";
        return;
    }
    try {
        const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Ошибка поиска");

        const products = await response.json();

      
        searchDropdown.innerHTML = "";

        if (!products || products.length === 0) {
            searchDropdown.style.display = "none";
            return;
        }

        products.forEach(p => {
            const li = document.createElement("li");
            li.textContent = p.product_name;
            li.addEventListener("click", () => {
                
                window.location.href = `/product/${p.product_id}`;
            });
            searchDropdown.appendChild(li);
        });

        searchDropdown.style.display = "block"; 
    } catch (err) {
        console.error(err);
    }
}



export function searchFunction(){

    const search_btn = document.querySelector(".search-button")

    if (!search_btn) return;



    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });

    search_btn.addEventListener("click", () => {
        search();

        document.addEventListener("click", (e) => {
            if (!e.target.closest(".header-search")) {
                searchDropdown.style.display = "none";
            }
        });
    });

}