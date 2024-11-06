// export let dataObjectt = null;

import { showLogin } from "./logout.js";
import { createRequestCards, createSuggestionCard, createFriendCards, friendsFunction,  sendIdToBackend, friendsLoaded } from "./friends.js";
import { navigateTo } from "../script.js";

export const get_csrf_token = async () => {
    const response = await fetch('/get_csrf_token/');
    const jsonResponse = await response.json();
    document.querySelector('.csrf_token').value = jsonResponse.csrfToken;
    // console.log("TOKENNN: " + jsonResponse.csrfToken);
    return jsonResponse.csrfToken;
}

const registerForm = document.querySelector("#register-form");

const registrationFunction = async (event) => {
    event.preventDefault();
    const token =  await get_csrf_token();
    // console.log("++++ ", token, " +++++");
    // try {
        const formData = new FormData(registerForm);
        const response = await fetch('/register/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': token
            },
            body: formData
        });
        const jsonResponse = await response.json();
        if (response.ok) {
            // console.log("Json response: " + jsonResponse.data.username);
            if (jsonResponse.status === "success") {
                showLogin();
            }
            // else {
            //     console.log(jsonResponse.error);
            // }
            return jsonResponse;
        }
        else {
            if (response.status === 400) {
                console.log("error happened with Register function....", jsonResponse.error);
            }
        }
    // }
    // catch(err) {
    //     console.error(err);
    // }
}
registerForm.addEventListener("submit", registrationFunction);

export const showHome = async (dataObj)=> {
    // navigateTo("current");
    document.querySelector("#full-container").style.display = "flex";
    document.querySelector("#login-parent").style.display = "none";
    document.querySelector("#nav").style.display = "flex";
    document.querySelector("#main").style.display = "flex";
    document.querySelector("#us h3").innerHTML = `${dataObj.username}`;
    document.querySelector("#welcome > h1").innerHTML = `Welcome ${dataObj.firstname} ${dataObj.lastname}!`;
}
