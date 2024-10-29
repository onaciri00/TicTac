const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "./img2.jpg";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function coordination(x, y)
{
	return {x:x, y:y};
}

function edgeCollision()
{
	if (ball.position.y + ball.radius >= canvas.height - 20)
	{
		ball.speed.y *= -1;
	}
	if (ball.position.y - ball.radius <= 0 + 105)
	{
		ball.speed.y *= -1;
	}
	// if (ball.position.x + ball.radius >= canvas.width)
	// {
	// 	ball.speed.x *= -1;
	// }
	// if (ball.position.x - ball.radius <= 0)
	// {
	// 	ball.speed.x *= -1;
	// }
}

function paddleCollision(paddle)
{
	if (paddle.position.y <= 80)
	{
		paddle.position.y = 100;
	}
	if (paddle.position.y + paddle.height >= canvas.height - 10)
	{
		paddle.position.y = canvas.height - paddle.height - 10;
	}
}

function Ballinfo(position, speed, radius, paddle1, paddle2)
{
	this.position = position;
	this.speed = speed;
	this.radius = radius;
	this.cfalse = 0;

	this.update = function () {
		// console.log("hereeeeeee");
		this.position.x += this.speed.x;
		this.position.y += this.speed.y;
	};

	this.draw = function() {
		if (paddle1.score < 4 && paddle2.score < 4)
		{
			ctx.fillStyle = "rgba(0,0,255)";
			ctx.strokeStyle = "rgba(0,0,255)";
		}
		else
		{
			ctx.fillStyle = "red";
			ctx.strokeStyle = "red";
		}
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	};
}

const keyPressed = [];

const key_Up_P1 = 87;
const key_Down_P1 = 83;

const key_Up_P2 = 38;
const key_Down_P2 = 40;

window.addEventListener('keydown', function(e){
	keyPressed[e.keyCode] = true;
});

window.addEventListener('keyup', function(e){
	keyPressed[e.keyCode] = false;
});

function paddleInfo(position, speed, width, height, color)
{
	this.position = position;
	this.speed = speed;
	this.height = height;
	this.width = width;
	this.info = 0;
	this.score = 0;

	this.update = function() 
	{
		if (this.info == 1)
		{
			if (keyPressed[key_Up_P1])
			{
				this.position.y -= this.speed.y;
			}
			if (keyPressed[key_Down_P1])
			{
				this.position.y += this.speed.y;
			}
		}
		if (this.info == 2)
		{
			if (keyPressed[key_Up_P2])
			{
				this.position.y -= this.speed.y;
			}
			if (keyPressed[key_Down_P2])
			{
				this.position.y += this.speed.y;
			}
		}
	};

	this.draw = function()
	{
		ctx.fillStyle = color;
		ctx.fillRect(this.position.x , this.position.y, this.width, this.height);
	};

	this.HalfWidth = function() {
		return this.width / 2;
	};
	
	this.HalfHeight = function() {
		return this.height / 2;
	}

	// console.log(this.HalfHeight());

	this.center = function()
	{
		return coordination(
			this.position.x + this.HalfWidth(),
			this.position.y + this.HalfHeight(),
		);
	};
}


function scoring(ball, paddle1, paddle2)
{
	if (ball.position.x <= -ball.radius)
	{
		paddle2.score += 1;
		document.getElementById("player2Score").innerHTML = paddle2.score;
		ball.position.x = canvas.width / 2;
		ball.position.y = canvas.height / 2;
		ball.speed.x *= -1;
		ball.speed.y *= -1;
	}
	if (ball.position.x >= canvas.width + ball.radius)
	{
		paddle1.score += 1;
		document.getElementById("player1Score").innerHTML = paddle1.score;
		ball.position.x = canvas.width / 2;
		ball.position.y = canvas.height / 2;
		ball.speed.x *= -1;
		ball.speed.y *= -1;
	}
}

function boleanCollision(ball, paddle)
{
	paddle.up = paddle.position.y;
	paddle.bot = paddle.position.y + paddle.height;
	paddle.left = paddle.position.x;
	paddle.right = paddle.position.x + paddle.width;

	ball.up = ball.position.y - ball.radius;
	ball.bot = ball.position.y + ball.radius;
	ball.left = ball.position.x - ball.radius;
	ball.right = ball.position.x + ball.radius;

	return ball.bot > paddle.up && ball.up < paddle.bot && ball.left < paddle.right && ball.right > paddle.left;
}


function ballAndPaddleCollision(ball, paddle)
{
	let dx = Math.abs(ball.position.x - paddle.center().x);
	let dy = Math.abs(ball.position.y - paddle.center().y);
	

	paddle.bot = paddle.position.y + paddle.height;
	paddle.up = paddle.position.y;
	paddle.left = paddle.position.x;
	paddle.right = paddle.position.x + paddle.width;

	ball.bot = ball.position.y + ball.radius;
	ball.up = ball.position.y - ball.radius;
	ball.left = ball.position.x - ball.radius;
	ball.right = ball.position.x + ball.radius;
	// console.log(dx);
	// console.log(dy);
	// if (paddle.info == 1)
	// 	{
	// 		if (paddle.position.x <= ball.position.x - ball.radius && paddle.position.y <= ball.position.y - ball.radius)
	// 		// if (boleanCollision(ball, paddle))
	// 		{
	// 		// 	console.log("heeere");
	// 			// ball.speed.x *= -1;
	// 			// ball.speed.y *= -1;
	// 		}
	// 	}
	// if (paddle.x <= )
	// if (dx <= (paddle.HalfWidth() + ball.radius) && dy <= (paddle.HalfHeight() + ball.radius))
	// {
		if (boleanCollision(ball, paddle))
		{
			// if (paddle.info == 1)
			// {
			// 	if (ball.position.x - ball.radius - ball.speed.x <= paddle.position.x + paddle.height && ball.position.y - ball.radius - ball.speed.y >= ball.position)
			// 	{

			// 	}
			// }
			ball.speed.y *= -1;
			if (ball.position.y > paddle.position.y && ball.position.y < paddle.position.y + paddle.height && ball.position.x + ball.radius >= paddle.position.x + paddle.width)
			{
				ball.speed.x *= -1;
				ball.speed.y *= -1;
			}
		}
	
		// ball.speed.x *= -1;
	// }
	
// 	if (paddle.info = 1)
// 	{
// 		if (ball.position.x - ball.radius >= paddle.position.x)
// 		{
// 			ball.speed.x *= -1;
// 		}
// 	}
}


const paddleN1 = new paddleInfo(coordination(0, 100), coordination(10, 10), 20, 160, "red");
paddleN1.info = 1;
const paddleN2 = new paddleInfo(coordination(canvas.width - 20, 100), coordination(10, 10), 20, 160, "blue");
paddleN2.info = 2;

const ball = new Ballinfo(coordination(canvas.width / 2, canvas.height / 2), coordination(10, 10), 10, paddleN1, paddleN2);

function gameScenery()
{
	ctx.strokeStyle = "rgb(75,0,130)";

	ctx.beginPath();
	ctx.lineWidth = 20;
	ctx.moveTo(0,80);
	ctx.lineTo(canvas.width, 80);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 20;
	ctx.moveTo(0,canvas.height);
	ctx.lineTo(canvas.width,canvas.height);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.moveTo(canvas.width / 2,0);
	ctx.lineTo(canvas.width / 2,canvas.height);
	ctx.stroke();

	ctx.beginPath()
	ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
	ctx.stroke();


	
}

function updating()
{
	ball.update();
	paddleN1.update();
	paddleN2.update();
	paddleCollision(paddleN1);
	paddleCollision(paddleN2);
	edgeCollision();
	ballAndPaddleCollision(ball, paddleN1);
	ballAndPaddleCollision(ball, paddleN2);
	scoring(ball, paddleN1, paddleN2);
}

function drawing()
{
	gameScenery();
	ball.draw();
	
	paddleN1.draw();
	paddleN2.draw();
	
}

function looping()
{
	ctx.drawImage(img, 0, 0, canvas.width , canvas.height + 100);
	ctx.fillStyle = "rgba(0,0,0,0.2)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	window.requestAnimationFrame(looping);
	
	ctx.shadowColor = "rgba(255,255,255,0.8)";
	ctx.shadowBlur = 18;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	// console.log("hereeeeeee");
	updating();
	drawing();
}

looping();