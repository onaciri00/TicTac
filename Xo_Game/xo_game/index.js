// static/js/app.js

document.addEventListener("DOMContentLoaded", () =>  {
    const app = document.getElementById("app");
    const startContainer = document.createElement("div");
    const gameContainer = document.createElement("div");
    const waitContainer = document.createElement("div");
    const showResult = document.createElement("div");
    let is_gameOver = false;
    // const leftGameContainer = document.createElement("div");

    startContainer.className = "start-container";
    gameContainer.className = "game-container";
    waitContainer.className = "wait-container";
    showResult.className = "show-Result";
    // gameContainer.className = "leftGame-container";

    // Start Screen

    startContainer.innerHTML = `
        <h1>Welcome to Tic Tac Toe</h1>
        <button class="select" id="startGame">Start a Game</button>
    `;


    // Game Screen
    gameContainer.innerHTML = `
            <div class="first_container">
            <h3> Turn For</h3>
            <div class="first_box align">X</div>
            <div class="first_box align">O</div>
            <div class="bg"></div>
        </div>
        <div id="game-board">
            <div class="square align" data-index="0"></div>
            <div class="square align" data-index="1"></div>
            <div class="square align" data-index="2"></div>
            <div class="square align" data-index="3"></div>
            <div class="square align" data-index="4"></div>
            <div class="square align" data-index="5"></div>
            <div class="square align" data-index="6"></div>
            <div class="square align" data-index="7"></div>
            <div class="square align" data-index="8"></div>
        </div>
        <div id="alert_move">Your are </div>
        <button id="play-again">Play Again</button> <!-- Moved here -->
    `;
    waitContainer.innerHTML=`
        <div class="loader-container">
            <div class="loading-text">Loading<span class="dots"></span></div>
        </div>
        `;
    showResult.innerHTML = `
        <h2 id="result" ></h2>
        `;
    app.appendChild(startContainer);
    app.appendChild(gameContainer);
    app.appendChild(waitContainer);
    app.appendChild(showResult);
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

    document.getElementById("startGame").addEventListener("click", function() {
        wait_page();
        connectWebSocket();

    });

    function wait_page()
    {
        console.log("wait fuction");
        waitContainer.classList.add("active");
        startContainer.classList.remove("active");
        showResult.classList.remove("active");
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
                    console.log('TURN ', message, 'with ', eventType)
                    if (message.includes('X')) {
                        currentTurn = 'X';
                    } else {
                        currentTurn = 'O';
                    }
                    document.getElementById("alert_move").textContent = message;
                    document.getElementById("alert_move").textContent = `Your are ${currentTurn}`;

                    break;
                case "END":
                    console.log('game over ', message, 'with ', eventType)
                    if (message.includes(charChoice)) {
                        document.querySelector("#result").innerHTML = currentTurn + " win";
                        // keep curent turn here
                    } 
                    else {
                        if (currentTurn === 'X')
                        {
                                document.querySelector("#result").innerHTML = 'O' + " loss";

                        }
                        else
                        {

                            document.querySelector("#result").innerHTML = 'X' + " loss";
                        }
                    }
                    resetGame();
                    break;
                case "wait":
                    wait_page(message);
                    break;
                case "DRAW":
                    console.log('game Draw ', message, 'with ', eventType)
                    alert("It's a draw!");
                    resetGame();
                    break;
            }
        };

        document.querySelectorAll('.square').forEach((element, index) => {
            element.addEventListener('click', function() {
                if (validMove(index) && isPlayerTurn()) {
                    element.innerHTML = currentTurn;
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
                if (!is_gameOver)
                    return document.querySelector(`.square[data-index='${index}']`).textContent === '';
                else
                    return false;
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
                document.querySelector(".bg").style.left = "85px";
                document.querySelector(".bg").style.backgroundColor = "#08D9D6";
                gameContainer.classList.add('player-o-turn');
            } else {
                currentTurn = 'X';
                document.querySelector(".bg").style.left = "0";
                document.querySelector(".bg").style.backgroundColor = "#FF2E63";
                gameContainer.classList.remove('player-o-turn');
            }
            
        }
        function initializeGame() {
            console.log("intitialze fuction");
            document.getElementById("alert_move").textContent = `Your are ${charChoice}`;

            startGame();
        }

        function resetGame() {
            // document.querySelectorAll('.square').forEach((element) => {
            //     element.textContent = '';
            // });
            is_gameOver = true;
            console.log('this restGame');

            showResult.classList.add("active");
            showResult.style.display = "block";
            document.querySelector("#play-again").style.display = "block";
            let WinCondation = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];
            boxes = document.querySelectorAll('.square');
            // console.log('this boxes');
            for (let i = 0; i < WinCondation.length; i++)
            {
                // console.log('this boxes', i);
                let v0 = boxes[WinCondation[i][0]].innerHTML;
                let v1 = boxes[WinCondation[i][1]].innerHTML;
                let v2 = boxes[WinCondation[i][2]].innerHTML;
                console.log("the winner is ", v0);
                if (v0 != "" && v0 === v1&& v0 === v2){
                    // console.log('winner Chose');
                    for (let j = 0; j < 3; j++)
                    {
                        boxes[WinCondation[i][j]].style.backgroundColor = "#00ffa2";
                        boxes[WinCondation[i][j]].style.color = "#000";
                    }
                    // boxes.forEach(e =>
                    //     {
                    //         e.classList.add('filled');
                    //     })
                }
            }

        }
    }
    const playAgain = ()=> {
        console.log('playAgain');
        startContainer.classList.add("active");
        gameContainer.classList.remove("active");
        startContainer.style.display = "block";
        showResult.classList.remove("active");
        document.getElementById("alert_move").textContent = `Your are ${charChoice}`;
        // document.querySelector(".bg").style.left = "0";
        document.querySelector("#result").innerHTML = "";
        document.querySelector("#play-again").style.display = "none";
        // document.querySelector(".bg").style.backgroundColor = "#FF2E63";
        gameContainer.classList.remove('player-o-turn'); 
        document.querySelectorAll('.square').forEach((element) => {
            // element.classList.remove('filled');
            element.textContent = '';
            element.style.removeProperty("background-color");
            element.style.color = "#fff"
        });
    }
    document.querySelector("#play-again").addEventListener("click", playAgain);
});
/********  new    ********* */
