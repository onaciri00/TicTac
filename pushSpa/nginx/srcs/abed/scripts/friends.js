export const friendsBtn = document.querySelector("#friends");
export const friendsPart = document.querySelector("#friends-part");

import { main } from "./home.js";
import { settingPage } from "./setting.js";
import { chatPage } from "./chat.js";
import { profileId } from "./profile.js"; 
import { rankPart } from "./rank.js";
import { get_csrf_token } from "./register.js";

const frdNavBtns = document.querySelectorAll(".frd-nav-btn");
export const friendsFunc = () => {
    // document.querySelector("#online-friends").style.display = "none";
    main.style.display = "none";
    settingPage.style.display = "none";
    chatPage.style.display = "none";
    profileId.style.display = "none";
    rankPart.style.display = "none";
    friendsPart.style.display = "flex";
    document.querySelector("#suggestions").style.display = "none";
    document.querySelector("#requests").style.display = "none";
    document.querySelector("#my-friends").style.display = "flex";
    frdNavBtns[1].classList.remove('styled-nav-btn');
    frdNavBtns[2].classList.remove('styled-nav-btn');
    frdNavBtns[0].classList.add('styled-nav-btn');
    friendsFunction();
}

// friendsBtn.addEventListener("click", friendsFunc);

// nav manipulation style.
frdNavBtns[0].classList.add('styled-nav-btn');

frdNavBtns.forEach ((frdNavBtn)=> {
    frdNavBtn.addEventListener("click", (event)=> {
        frdNavBtns.forEach (frdNavBtn => {frdNavBtn.classList.remove('styled-nav-btn')});
        frdNavBtn.classList.add('styled-nav-btn');
    })
});

const myFriends = document.querySelector("#my-friends");
const requestsDiv = document.querySelector("#requests");
const suggestions = document.querySelector("#suggestions");

frdNavBtns[0].addEventListener("click", (event)=> {
    myFriends.style.display = "flex";
    suggestions.style.display = "none";
    requestsDiv.style.display = "none";
})

frdNavBtns[1].addEventListener("click", ()=> {
    myFriends.style.display = "none";
    suggestions.style.display = "none";
    requestsDiv.style.display = "flex";
})

frdNavBtns[2].addEventListener("click", ()=> {
    myFriends.style.display = "none";
    suggestions.style.display = "flex";
    requestsDiv.style.display = "none";
})

const createSuggestionCard = (jsonObject, i) => {
    const element = document.createElement("div");
    element.classList.add("friend-suggestion-card");
    const secondElement = document.createElement("div");
    secondElement.classList.add("frd-sug-header");
    const thirdElement = document.createElement("div");
    thirdElement.classList.add("frd-sug-statistics");
    const forthElement = document.createElement("div");
    forthElement.classList.add("add-del");
    element.append(secondElement, thirdElement, forthElement);

    const imageElement = document.createElement("div");
    imageElement.classList.add("frd-sug-img");
    imageElement.style.backgroundImage = `url(${jsonObject[i].imageProfile})`;
    // imageElement.style.backgroundSize= "cover";

    const sugInfos = document.createElement("div");
    sugInfos.classList.add("frd-sug-infos");
    secondElement.append(imageElement, sugInfos);

    const wins = document.createElement("div");
    wins.classList.add("wins");
    const loses = document.createElement("div");
    loses.classList.add("loses");
    const score = document.createElement("div");
    score.classList.add("score");
    thirdElement.append(wins, loses, score);

    const addBtnDiv = document.createElement("div");
    addBtnDiv.classList.add("add");
    const deleteBtnDiv = document.createElement("div");
    deleteBtnDiv.classList.add("delete");
    forthElement.append(addBtnDiv, deleteBtnDiv);

    const userName = document.createElement("h4");
    userName.classList.add("user-name");
    const pRank = document.createElement("p");
    pRank.innerHTML = "rank: 5";
    sugInfos.append(userName, pRank);

    const winsKey = document.createElement("h4");
    const winsValue = document.createElement("h4");
    winsKey.innerHTML = "Wins:";
    winsValue.classList.add("pts", "value");
    winsValue.innerHTML = "42";
    wins.append(winsKey, winsValue);

    const losesKey = document.createElement("h4");
    losesKey.innerHTML = "Loses:";
    const losesValue = document.createElement("h4");
    losesValue.innerHTML = "0";
    losesValue.classList.add("value");
    loses.append(losesKey, losesValue);

    const scoreKey = document.createElement("h4");
    scoreKey.innerHTML = "Score:";
    const scoreValue = document.createElement("h4");
    scoreValue.innerHTML = "2560";
    scoreValue.classList.add("value");
    score.append(scoreKey, scoreValue);

    const addBtn = document.createElement("button");
    addBtn.innerHTML = "Add";
    addBtn.classList.add("btn", "btn-lg");
    addBtnDiv.append(addBtn);
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.classList.add("btn", "btn-lg");
    deleteBtnDiv.append(deleteBtn);
    userName.innerHTML = jsonObject[i].username;
    document.querySelector("#suggestions").append(element);
}

export const suggestionsFunction = async ()=> {
    const response = await fetch("/user/list/");
    if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.status === "success") {
            document.querySelector("#suggestions").innerHTML = "";
            for (let i = 0; i < jsonResponse.data.length; i++) {
                createSuggestionCard(jsonResponse.data, i);
            }
            const addBtnsListen = document.querySelectorAll(".add .btn");
            for(let i = 0; i < addBtnsListen.length; i++) {
                // listen for add-friend button click event to send the id for the backend;
                addBtnsListen[i].addEventListener("click", ()=> sendIdToBackend(jsonResponse.data[i].id, "add"));
            }
    
            // const deleteBtnsListen = document.querySelectorAll(".delete .btn");
            // for(let i = 0; i < deleteBtnsListen.length; i++) {
            //     deleteBtnsListen[i].addEventListener("click", ()=> sendIdToBackend(jsonResponse.data[i].id, "delete"));
            // }
        }
        return jsonResponse.data;
    }
}

const sendIdToBackend = async (id, action) => {
    const token = await get_csrf_token();
    if (action === "add") {
        console.log("Add with id: ", id);
        const response = await fetch(`/user/send_friend/${id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': token,
            },
        });
        suggestionsFunction();
        if (response.ok) {
            const jsonResponse = await response.json();
            if (jsonResponse.status === "success") {
                alert("succesfully sent to the backend");
            } else {
                alert("already sent to the backend");
            }
        }
    }
    else if (action === "accept") {
        console.log("Accpet with id: ", id);
        const response = await fetch(`/user/accepte_request/${id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': token,
            },
        });
        requestsFunction();
    }
    else if (action === "refuse") {
        console.log("Refuse with id: ", id);
        const response = await fetch(`/user/reject_request/${id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': token,
            },
        });
        requestsFunction();
    }
    //unfriend;
    else {
        console.log("Unfiend with id: ", id);
        const response = await fetch(`/user/unfriend/${id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': token,
            },
        });
    }
    // delete if handled in backend.
}

const sugBtn = document.querySelector("#suggestion-btn");

sugBtn.addEventListener("click", suggestionsFunction);



// --------------------- display requests --------------------------//


const createRequestCards = (name, image) => {
    const element = document.createElement("div");
    element.classList.add("friend-suggestion-card");
    const secondElement = document.createElement("div");
    secondElement.classList.add("frd-sug-header");
    const thirdElement = document.createElement("div");
    thirdElement.classList.add("frd-sug-statistics");
    const forthElement = document.createElement("div");
    forthElement.classList.add("add-del");
    element.append(secondElement, thirdElement, forthElement);

    const imageElement = document.createElement("div");
    imageElement.classList.add("frd-sug-img");
    imageElement.style.backgroundImage = `url(${image})`;
    const sugInfos = document.createElement("div");
    sugInfos.classList.add("frd-sug-infos");
    secondElement.append(imageElement, sugInfos);

    const wins = document.createElement("div");
    wins.classList.add("wins");
    const loses = document.createElement("div");
    loses.classList.add("loses");
    const score = document.createElement("div");
    score.classList.add("score");
    thirdElement.append(wins, loses, score);

    const addBtnDiv = document.createElement("div");
    addBtnDiv.classList.add("add");
    const deleteBtnDiv = document.createElement("div");
    deleteBtnDiv.classList.add("delete");
    forthElement.append(addBtnDiv, deleteBtnDiv);

    const userName = document.createElement("h4");
    userName.classList.add("user-name");
    const pRank = document.createElement("p");
    pRank.innerHTML = "rank: 5";
    sugInfos.append(userName, pRank);

    const winsKey = document.createElement("h4");
    const winsValue = document.createElement("h4");
    winsKey.innerHTML = "Wins:";
    winsValue.classList.add("pts", "value");
    winsValue.innerHTML = "42";
    wins.append(winsKey, winsValue);

    const losesKey = document.createElement("h4");
    losesKey.innerHTML = "Loses:";
    const losesValue = document.createElement("h4");
    losesValue.innerHTML = "0";
    losesValue.classList.add("value");
    loses.append(losesKey, losesValue);

    const scoreKey = document.createElement("h4");
    scoreKey.innerHTML = "Score:";
    const scoreValue = document.createElement("h4");
    scoreValue.innerHTML = "2560";
    scoreValue.classList.add("value");
    score.append(scoreKey, scoreValue);

    const addBtn = document.createElement("button");
    addBtn.innerHTML = "Accept";
    addBtn.classList.add("btn", "btn-lg", "accept");
    addBtnDiv.append(addBtn);
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Refuse";
    deleteBtn.classList.add("btn", "btn-lg", "refuse");
    deleteBtnDiv.append(deleteBtn);
    userName.innerHTML = name;
    document.querySelector("#requests").append(element);
}

const requestsFunction = async ()=> {
    const response = await fetch("/user/get_requests/");
    if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.status === "success") {
            console.log(jsonResponse.data);
            document.querySelector("#requests").innerHTML = "";
            for (let i = 0; i < jsonResponse.data.length; i++) {
                createRequestCards(jsonResponse.data[i].from_user.username, jsonResponse.data[i].from_user.imageProfile);
            }
            const acceptBtnsListen = document.querySelectorAll(".add .accept");
            for(let i = 0; i < acceptBtnsListen.length; i++) {
                // listen for add-friend button click event to send the id for the backend;
                acceptBtnsListen[i].addEventListener("click", ()=> sendIdToBackend(jsonResponse.data[i].id, "accept"));
            }
            const refuseBtnsListen = document.querySelectorAll(".delete .refuse");
            for(let i = 0; i < refuseBtnsListen.length; i++) {
                // listen for add-friend button click event to send the id for the backend;
                refuseBtnsListen[i].addEventListener("click", ()=> sendIdToBackend(jsonResponse.data[i].id, "refuse"));
            }
        }
        // else if (jsonResponse.status === "failed") {
        //     alert("you already sent a request to this user.");
        // }
    }
}
const reqBtn = document.querySelector("#requests-btn");
reqBtn.addEventListener("click", requestsFunction);

// -------------- Display Friends --------------------

const createFriendCards = (name, image) => {
    const element = document.createElement("div");
    element.classList.add("friend-suggestion-card");
    const secondElement = document.createElement("div");
    secondElement.classList.add("frd-sug-header");
    const thirdElement = document.createElement("div");
    thirdElement.classList.add("frd-sug-statistics");
    const forthElement = document.createElement("div");
    forthElement.classList.add("add-del");
    element.append(secondElement, thirdElement, forthElement);

    const imageElement = document.createElement("div");
    imageElement.classList.add("frd-sug-img");
    imageElement.style.backgroundImage = `url(${image})`;
    const sugInfos = document.createElement("div");
    sugInfos.classList.add("frd-sug-infos");
    secondElement.append(imageElement, sugInfos);

    // online symbole, change the color to green in case of online;
    const online_icon = document.createElement("i");
    online_icon.innerHTML = `<i class="fa-solid fa-circle"></i>`;
    imageElement.append(online_icon);

    const wins = document.createElement("div");
    wins.classList.add("wins");
    const loses = document.createElement("div");
    loses.classList.add("loses");
    const score = document.createElement("div");
    score.classList.add("score");
    thirdElement.append(wins, loses, score);

    const addBtnDiv = document.createElement("div");
    addBtnDiv.classList.add("add");
    const deleteBtnDiv = document.createElement("div");
    deleteBtnDiv.classList.add("delete");
    forthElement.append(addBtnDiv, deleteBtnDiv);

    const userName = document.createElement("h4");
    userName.classList.add("user-name");
    const pRank = document.createElement("p");
    pRank.innerHTML = "rank: 5";
    sugInfos.append(userName, pRank);

    const winsKey = document.createElement("h4");
    const winsValue = document.createElement("h4");
    winsKey.innerHTML = "Wins:";
    winsValue.classList.add("pts", "value");
    winsValue.innerHTML = "42";
    wins.append(winsKey, winsValue);

    const losesKey = document.createElement("h4");
    losesKey.innerHTML = "Loses:";
    const losesValue = document.createElement("h4");
    losesValue.innerHTML = "0";
    losesValue.classList.add("value");
    loses.append(losesKey, losesValue);

    const scoreKey = document.createElement("h4");
    scoreKey.innerHTML = "Score:";
    const scoreValue = document.createElement("h4");
    scoreValue.innerHTML = "2560";
    scoreValue.classList.add("value");
    score.append(scoreKey, scoreValue);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Unfriend";
    deleteBtn.classList.add("btn", "btn-lg", "unfriendd");
    deleteBtnDiv.append(deleteBtn);
    userName.innerHTML = name;
    document.querySelector("#my-friends").append(element);
}

export const friendsFunction = async() => {
    const response = await fetch("/user/get_user_friends/");
    if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.status === "success") {
            document.querySelector("#my-friends").innerHTML = ""; // main parent.
            // console.log(jsonResponse.data);
            for (let i = 0; i < jsonResponse.data.length; i++) {
                createFriendCards(jsonResponse.data[i].username, jsonResponse.data[i].imageProfile);
            }
            const unfriendBtns = document.querySelectorAll(".delete .unfriendd");
            for(let i = 0; i < unfriendBtns.length; i++) {
                // listen for add-friend button click event to send the id for the backend;
                unfriendBtns[i].addEventListener("click", ()=> sendIdToBackend(jsonResponse.data[i].id, "unfriend"));
            }
        }
        return jsonResponse.data;
    }
}

const friendBtn = document.querySelector("#friend-btn");

friendBtn.addEventListener("click", friendsFunction);


