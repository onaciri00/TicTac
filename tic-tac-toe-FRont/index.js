let boxes = document.querySelectorAll(".box");

let turn = "X";

let isGmaeovaer = false;

boxes.forEach(e  => {
    e.innerHTML = ""
    e.addEventListener("click", ()=>{
            if (!isGmaeovaer && e.innerHTML === ""){
                e.innerHTML = turn;
                CheckWin();
                CheckDraw();
                ChangeTurn();
            }
        })
})

function ChangeTurn(){
    if (turn === "X")
    {
        turn = "O";
        document.querySelector(".bg").style.left = "85px";
    }
    else
    {
        turn = "X";
        document.querySelector(".bg").style.left = "0";
    }
}

function CheckWin()
{
    let WinCondation = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < WinCondation.length; i++)
    {
        let v0 = boxes[WinCondation[i][0]].innerHTML;
        let v1 = boxes[WinCondation[i][1]].innerHTML;
        let v2 = boxes[WinCondation[i][2]].innerHTML;
        if (v0 != "" && v0 === v1&& v0 === v2){
            isGmaeovaer = true;
            storeResult(turn);
            document.querySelector("#result").innerHTML = turn + " win";
            document.querySelector("#play-again").style.display = "inline";
            for (j = 0; j < 3; j++)
            {
                boxes[WinCondation[i][j]].style.backgroundColor = "#08D9D6";
                boxes[WinCondation[i][j]].style.color = "#000";
            }
        }
    }
}


function CheckDraw()
{
    if (!isGmaeovaer)
    {
        let isDraw = true;
        boxes.forEach(e =>
            {
                if (e.innerHTML === "") 
                    isDraw = false;
            })
        if (isDraw)
        {
            isGmaeovaer = true;
            storeResult('draw');
            document.querySelector("#result").innerHTML = " draw";
            document.querySelector("#play-again").style.display = "inline";
        }
    }
}

document.querySelector("#play-again").addEventListener("click", ()=>{
    isGmaeovaer = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#result").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";
    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff"
    })
})

function storeResult(winner) {
    fetch('/api/store-result/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            winner: winner,
            date: new Date().toISOString()
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}