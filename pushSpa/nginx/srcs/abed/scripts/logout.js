import { get_csrf_token } from "./register.js";

export const logoutBtn = document.querySelector("#logout");

const logoutFuntion = async (event) => {
    event.preventDefault();
    try {
        const token = await get_csrf_token();
        const response = await fetch('/logout/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': token, // Include the CSRF token
            },
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            if (jsonResponse.status === "success") {
                showLogin();
                localStorage.removeItem('isLoggedIn');
            }
            return jsonResponse;
        }
    }
    catch(err) {
        console.error(err);
    }
}
logoutBtn.addEventListener("click", logoutFuntion);

import { singIn_function } from "./login.js";

export const showLogin = ()=> {
    document.querySelector("#login-parent").style.display = "flex";
    singIn_function();
    // document.querySelector("#online-friends").style.display = "none";
    document.querySelector("#nav").style.display = "none";
    document.querySelector("#main").style.display = "none";
    document.querySelector("#profile-part").style.display = "none";
    document.querySelector("#chat-part").style.display = "none";
    document.querySelector("#setting-part").style.display = "none";
    document.querySelector("#friends-part").style.display = "none";
    document.querySelector("#rank-part").style.display = "none";
}