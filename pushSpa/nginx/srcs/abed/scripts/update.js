import { get_csrf_token } from "./register.js";
import { dataObject } from "./login.js";
import { settingFunction } from "./setting.js";
import { profileFunction } from "./profile.js";
import { reloadFunction } from "../script.js";

export const profileAlert = (status, jsonData)=> {
    if (status === "success") {
        reloadFunction(jsonData);
        document.querySelector("#update-alert").style.display = "none";
    }
    else if (status === "image") {

    } else {
        document.querySelector("#update-alert-failed").style.display = "none";
    }
}

const clearInputs = () => {
    const inputs = document.querySelectorAll(".account-info input");
        inputs.forEach((input) => {
        input.value = "";
    });
}

const updateForm = document.querySelector("#update-form");

const notImage = document.querySelector(".img-err");
export const update = async (event)=> {
    notImage.style.display = "none";
    event.preventDefault();
    // const fileInput = document.querySelector("#file-input");
    const formData = new FormData(updateForm);
    console.log("type: ", Object.fromEntries(formData).imageProfile.type);
    if (!Object.fromEntries(formData).imageProfile.type.includes("image")) {
        notImage.style.display = "block";
        return 0;
    }
    // formData.append("imageProfile", fileInput.files[0]);
    const token = await get_csrf_token();
    const response = await fetch('/user/update/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': token,
        },
        body: formData
    });
    const jsonResponse = await response.json();
    if (response.ok) {
        document.querySelector("#update-alert").style.display = "block";
        clearInputs();
        setTimeout(() => profileAlert("success", jsonResponse.data), 3000);
    }
    else {
        document.querySelector("#update-alert-failed").style.display = "block";
        setTimeout(() => profileAlert("failed", jsonResponse.data), 3000);
    }
    return jsonResponse.data;
};

updateForm.addEventListener("submit", update);

document.querySelector("#cancel-btn").addEventListener("click", clearInputs);

