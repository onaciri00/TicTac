// static/js/app.js

document.addEventListener("DOMContentLoaded", () =>  {
    const app = document.getElementById("app");
    const startContainer = document.createElement("div");
    const gameContainer = document.createElement("div");
    const waitContainer = document.createElement("div");
    // const leftGameContainer = document.createElement("div");

    startContainer.className = "start-container";
    gameContainer.className = "game-container";
    waitContainer.className = "wait-container";
    // gameContainer.className = "leftGame-container";

    // Start Screen

    startContainer.innerHTML = `
        <h1>Welcome to Tic Tac Toe</h1>
        <button class="select" id="startGame">Start a Game</button>
    `;


    // Game Screen
    gameContainer.innerHTML = `
        <h1>Tic Tac Toe</h1>
        <div id="game-board">
            <div class="square" data-index="0"></div>
            <div class="square" data-index="1"></div>
            <div class="square" data-index="2"></div>
            <div class="square" data-index="3"></div>
            <div class="square" data-index="4"></div>
            <div class="square" data-index="5"></div>
            <div class="square" data-index="6"></div>
            <div class="square" data-index="7"></div>
            <div class="square" data-index="8"></div>
        </div>
        <div id="alert_move">Your turn. Place your move</div>
    `;
    waitContainer.innerHTML=`
        <div class="loader-container">
            <div class="loading-text">Loading<span class="dots"></span></div>
        </div>
        `;

    app.appendChild(startContainer);
    app.appendChild(gameContainer);
    app.appendChild(waitContainer);

    let charChoice = null;
    let roomCode =null;
    let currentTurn = 'X'; 
    fetch('http://127.0.0.1:8000/api/rooms/')
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            roomCode = data[0].code; // Use the room code from the API
            
        } else {
            // If no rooms are available, create a new room
            createRoom();
        }
    })
    .catch(error => {
        console.error("Error fetching rooms:", error);
    });

// Function to create a new room
function createRoom() {

    fetch('http://127.0.0.1:8000/api/rooms/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"code":1})
    })
    .then(response => response.json())
    .then(data => {
        roomCode = data.code; 
        
    })
    .catch(error => {
        console.error("Error creating room:", error);
    });
}
     // Example room code; should be dynamically set

    document.getElementById("startGame").addEventListener("click", function() {
        wait_page();
        connectWebSocket();

    });

    function wait_page()
    {
        console.log("wait fuction");
        waitContainer.classList.add("active");
        startContainer.classList.remove("active");
        startContainer.style.display = "none";
    }
    function startGame() {
        console.log("start fuction");

        startContainer.classList.remove("active");
        gameContainer.classList.add("active");
        waitContainer.classList.remove("active");
    }

    function connectWebSocket() {
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/play/${roomCode}/`);

        socket.onopen = function() {
            console.log('WebSocket connection established.');
            socket.send(JSON.stringify({
                "event": "START",
                "message": ""
            }));
        };

        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            const message = data.message;
            const eventType = data.event;

            console.log("event type is ", eventType, "message is ", message);
            switch (eventType) {
                case "CHOICE":
                    charChoice = message; 
                    wait_page();
                    break;
                case "START":
                    initializeGame();
                    break;
                case "MOVE":
                    handleMove(message);
                    break;
                case "TURN":
                    if (message.includes('X')) {
                        currentTurn = 'X';
                    } else {
                        currentTurn = 'O';
                    }
                    document.getElementById("alert_move").textContent = message;
                                document.getElementById("alert_move").textContent = `Your turn. Place your move ${currentTurn}`;

                    break;
                case "END":
                    alert(message);
                    resetGame();
                    break;
                case "wait":
                    wait_page(message);
            }
        };

        document.querySelectorAll('.square').forEach((element, index) => {
            element.addEventListener('click', function() {
                if (validMove(index) && isPlayerTurn()) {
                    const moveData = {
                        "event": "MOVE",
                        "message": {
                            "index": index,
                            "player": currentTurn
                        }
                    };
                    socket.send(JSON.stringify(moveData));
                }
            });
        });

        function validMove(index) {
                return document.querySelector(`.square[data-index='${index}']`).textContent === '';
        }

        // function handleMove(message) {
        //     const index = message.index;
        //     const player = message.player;
        //     // Update the game board UI
        //     console.log("Index: ", index, "Player: ", player);
        //     document.querySelector(`.square[data-index='${index}']`).textContent = player;
        // }

        function isPlayerTurn() {
            return charChoice === currentTurn;
        }
        
        // After receiving a move update from the server
        function handleMove(message) {
            const index = message.index;
            const player = message.player;
        
            document.querySelector(`.square[data-index='${index}']`).textContent = player;
            
            // Switch turns after a move
            if (currentTurn === 'X') {
                currentTurn = 'O';
            } else {
                currentTurn = 'X';
            }
            
        }
        function initializeGame() {
            console.log("intitialze fuction");
            document.getElementById("alert_move").textContent = `Your turn. Place your move ${charChoice}`;

            startGame();
        }

        function resetGame() {
            alert("Game is Over");
            document.querySelectorAll('.square').forEach((element) => {
                element.textContent = '';
            });
            document.getElementById("alert_move").textContent = `Your turn. Place your move ${charChoice}`;
        }

    }
});
