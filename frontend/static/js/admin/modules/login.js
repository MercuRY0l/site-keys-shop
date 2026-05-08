



export function login() {

    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    if (login === "admin" && password === "admin") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminActions").style.display = "block";
    } else {
        alert("Неверный логин или пароль");
    }
}