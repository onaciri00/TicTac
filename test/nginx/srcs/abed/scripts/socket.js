import { friendsFunction, createRequestCards, createFriendCards, createSuggestionCard, sendIdToBackend } from "./friends.js";

export let flag = 0;
export let socket = null;

export const createToast = (message, timeAgo) => {
    // Create toast HTML structure
    let toastHTML = `
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
        <div class="toast-header">
          <i class="fa-solid fa-circle" id="online-icon-1" style="color: green; filter: drop-shadow(green 0px 0px 1px);"></i>
          <strong class="me-auto" style="margin-left: 8px;">${message}</strong>
          <small>${timeAgo}</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${message} is online!
        </div>
      </div>
    `;

    // Convert the HTML string to a DOM element
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = toastHTML.trim();

    // Append the toast to the container
    let toastElement = tempDiv.firstChild;
    document.querySelector('body').appendChild(toastElement);

    // Show the toast using Bootstrap's toast class
    let toast = new bootstrap.Toast(toastElement);
    toast.show();
    setTimeout(() => {
        toastElement.remove();
    }, 6000);
}

export const socketFunction = async () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn && !flag) {
        console.log("the flag: ", flag);
        await friendsFunction(); // create friends cards first.
        socket = new WebSocket('wss://localhost/wss/friend_requests/');
        socket.onopen = function() {
                console.log('WebSocket connection established');
                flag++;
            };
            socket.onerror = function(error) {
                console.log(' ---| WEBSOCKET IS NOT CONNECTE |----------', error);
                console.error('WebSocket error:', error);
        };
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.status === 'success') {
                if (data.option === 'receive_frd_req'){
                    console.log("receive: ", data.data);
                    createRequestCards(data.data.from_user.username, data.data.from_user.imageProfile)
                    const acceptBtnsListen = document.querySelectorAll(".add .accept");
                    for(let i = 0; i < acceptBtnsListen.length; i++) {
                        acceptBtnsListen[i].addEventListener("click", ()=> sendIdToBackend(data.data.id, "accept"));
                    }
                    const refuseBtnsListen = document.querySelectorAll(".delete .refuse");
                    for(let i = 0; i < refuseBtnsListen.length; i++) {
                        refuseBtnsListen[i].addEventListener("click", ()=> sendIdToBackend(data.data.id, "refuse"));
                    }
                }
                if (data.option === 'accepte_request'){
                    console.log('accepted frd request : ', data.data)
                    createFriendCards(data.data.username, data.data.imageProfile, data.data.id);
                    const unfriendBtns = document.querySelectorAll(".delete .unfriendd");
                    for(let i = 0; i < unfriendBtns.length; i++) {
                        unfriendBtns[i].addEventListener("click", ()=> sendIdToBackend(data.data.id, "unfriend"));
                    }
                }
                if (data.option === 'refuse_frd_req'){
                    createSuggestionCard(data.data.username, data.data.imageProfile);
                    const addBtnsListen = document.querySelectorAll(".add .btn");
                    for(let i = 0; i < addBtnsListen.length; i++) {
                        addBtnsListen[i].addEventListener("click", ()=> sendIdToBackend(data.data.from_user_id, "add"));
                    }
                }
                if (data.option === 'unfriend'){
                    friendsFunction();
                    console.log('data222 : ', data.data)
                    const unfriendBtns = document.querySelectorAll(".delete .unfriendd");
                    for(let i = 0; i < unfriendBtns.length; i++) {
                        unfriendBtns[i].addEventListener("click", ()=> sendIdToBackend(data.data.id, "unfriend"));
                    }
                }
                if (data.option === 'is_online') {
                    console.log("data data: ", data.data);
                    const onlineIcon = document.querySelector(`#online-icon-${data.data.id}`);
                    if (onlineIcon && data.data.online_status) {
                        createToast(data.data.username, 'just now');
                        onlineIcon.style.color = "green";
                        onlineIcon.style.filter = "drop-shadow(0 0 1px green)";
                        localStorage.setItem(`online_status_${data.data.id}`, 'online');  // Store online status
                    } else if (onlineIcon && !data.data.online_status) {
                        onlineIcon.style.color = "red";
                        onlineIcon.style.filter = "drop-shadow(0 0 1px red)";
                        localStorage.setItem(`online_status_${data.data.id}`, 'offline');  // Store offline status
                    }
                }
            }
        };
        socket.onclose = function() {
            console.log('WebSocket connection closed');
            flag = 0;
        };
    }
}