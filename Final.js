function scoreGeneration(){ //displays score
	scoreOutput += 1;
	scoreDisplay.innerHTML = scoreOutput;
}

function generateEnemy(){
	enemyPos.push(new EnemyData(parseInt((Math.random()*360)-180),parseInt((Math.random()*70)-200)));
}

function EnemyData(horz, vert){
	this.x = horz;
	this.y = vert;
}

function drawEnemy(){ //draws the enemies
	for (var d = 0; d < enemyPos.length; d++){
		ctx.clearRect(enemyPos[d].x-10,enemyPos[d].y-24,20,20);
	}
	for (var i = 0; i < enemyPos.length; i++){ //then creates new enemies
		ctx.save();
		ctx.beginPath();
		ctx.arc(enemyPos[i].x,enemyPos[i].y,10,0,2*Math.PI);
		if (i % 2 === 0){ //every second enemy is a different color, will switch if enemy gets to the bottom
			ctx.fillStyle = "Purple";
		}
		else{
			ctx.fillStyle = "Orange";
		}
		ctx.fill();
		ctx.restore();
		enemyPos[i].y = enemyPos[i].y + 1;
		checkCollision();
	}

}

function checkCollision(){
	for (var t = 0; t < enemyPos.length; t++){
		var index = enemyPos[t].y.indexOf(215);
		if (index != -1){
			enemyPos[t].splice(index,1);
			scoreOutput = scoreOutput - 10;
		}
		if (enemyPos[t].x < x+20 && enemyPos[t].x > x-20 && enemyPos[t].y < y+20 && enemyPos[t].y > y-32){
			ctx.clearRect(-200,-200,400,400);
			enemyPos = [];
			currentLives = currentLives - 1;
			livesDisplay.innerHTML = currentLives;
			x = 0;
			y = 150;
			if (currentLives === 0){
				livesDisplay.innerHTML = "GAME OVER";
				endGame();
			}
			else{
				drawPlayer(x,y);
			}
		}
	}
}
	
function drawPlayer(x,y){ //draws the player avatar
	ctx.save();
	ctx.beginPath();
	ctx.clearRect(-17+x,-26+y,34,53);
	ctx.moveTo(x+0,y-20); //top
	ctx.lineTo(x+10,y+20); //top to bottom right
	ctx.lineTo(x+0,y+10); //to middle
	ctx.lineTo(x-10, y+20); //to bottom left
	ctx.lineTo(x+0,y-20); //back to top
	ctx.fillStyle = "Grey";
	ctx.fill();
	ctx.restore();
}

function BulletData(x,y){
	this.bulletX = x;
	this.bulletY = y;
}

function animateBullet(BulletData){
	ctx.clearRect(bulletData.bulletX-5,bulletData.bulletY-25,10,10);
	if (bulletCheck === false){
		bulletGenerator = setInterval(animateBullet,1);
		bulletCheck = true;
	}
	for (var t = 0; t < enemyPos.length; t++){
		if (bulletData.bulletY - 30 < enemyPos[t].y && bulletData.bulletY + 10 > enemyPos[t].y && bulletData.bulletX - 13 < enemyPos[t].x && bulletData.bulletX + 13 > enemyPos[t].x){
			clearInterval(bulletGenerator);
			ctx.clearRect(enemyPos[t].x-15,enemyPos[t].y-15,50,40);
			bulletCheck = false;
			enemyPos.splice(t,1);
			ctx.arc(enemyPos[t].x,enemyPos[t].y,3,0,2*Math.PI);
			ctx.fill();
			scoreOutput = scoreOutput + 25;
		}
		else if (bulletData.bulletY == -200){
			clearInterval(bulletGenerator);
			bulletCheck = false;
		}
		else if (bulletData.bulletY != -200){
			ctx.beginPath();
			ctx.arc(bulletData.bulletX,bulletData.bulletY-30,3,0,2*Math.PI);
			ctx.fillStyle = "Red";
			ctx.fill();
			bulletData.bulletY = bulletData.bulletY - 1;
		}
	}
}

function endGame(){
	clearInterval(score);
	clearInterval(makeEnemy);
	clearInterval(enemyToCanvas);
	clearInterval(timer);
	clearInterval(bulletGenerator);
	ctx.clearRect(-200,-200,400,400);
	enemyPos = [];
	x = 0;
	y = 150;
	gameInstance = 0;
	if (currentLives === 0){
	enemyRate = 2000;
	enemySpeed = 100;
	time = 20;
	scoreOutput = 0;
	}
}

function pauseGame(){
	pauseCheck = true;
	clearInterval(bulletGenerator);
	clearInterval(score);
	clearInterval(makeEnemy);
	clearInterval(enemyToCanvas);
	clearInterval(timer);
}

function startGame(){
	gameInstance++;
	if (gameInstance <= 1){
		ctx.clearRect(-200,-200,400,400);
		currentLives = 3;
		livesDisplay.innerHTML = currentLives;
		score = 0;
		drawPlayer(x,y);
	}
	if (gameInstance <= 1 || pauseCheck === true){
		score = setInterval(scoreGeneration, 100); //displays the score for how long you've been alive
		makeEnemy = setInterval(generateEnemy,enemyRate);
		enemyToCanvas = setInterval(drawEnemy,enemySpeed);
		timer = setInterval(countDown,1000);
		bulletCheck = false;
	}
	pauseCheck = false;
}

function countDown(){
	time = time-1;
	timeLeft.innerHTML = time;
	if(time === 0){
		clearInterval(timer);
		endGame();
		enemyRate = enemyRate - 200;
		enemySpeed = enemySpeed - 10;
		time = 20;
		startGame();
	}
}

addEventListener("keydown", function(event){ //listens for keypresses
	if (event.keyCode == 37 && pauseCheck === false && x != -190){ //left arrow
		x = x-5;
	}
	if (event.keyCode == 39 && pauseCheck === false && x != 190){ //right arrow
		x = x+5;
	}
	if (event.keyCode == 38 && pauseCheck === false && y != -180){ //up arrow
		y = y-5;
	}
	if (event.keyCode == 40 && pauseCheck === false && y != 180){ //down arrow
		y = y+5;
	}
	drawPlayer(x,y);
	if (event.keyCode == 32 && pauseCheck === false && bulletCheck === false){ //spacebar
		bulletData = new BulletData (x,y);
		animateBullet(bulletData);
	}
});

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
ctx.fillText("JS Invaders",120,50);
ctx.font = "15px Arial";
ctx.fillText("Kill enemy circles to prevent them from reaching the bottom",5,100);
ctx.fillText("of the screen.Survive for 20 seconds to move to the next",5,120);
ctx.fillText("level. Every enemy killed and the longer you survive",5,140);
ctx.fillText("increases score.Once a bullet is shot, it can only be",5,160);
ctx.fillText("reloaded once it hits something.",5,180);
ctx.fillText("Spacebar = shoot               Enemy hits bottom = -10 points",5,260);
ctx.fillText("Up Arrow = move up           Enemy destroyed = +25 points ",5,280);
ctx.fillText("Down Arrow = move down",5,300);
ctx.fillText("Left Arrow = move left",5,320);
ctx.fillText("Right Arrow = move right",5,340);
var scoreDisplay = document.getElementById("score");
var livesDisplay = document.getElementById("lives");
document.getElementById("myCanvas").style.backgroundColor = "CornSilk";
ctx.font = "30px Arial";
ctx.fillText("JS Invaders",0,0);

var enemyRate = 2000;
var enemySpeed = 100;
var enemyPos = new Array(0);

var x = 0; //player positions
var y = 150;
var bulletData;
var bulletGenerator;
var bulletCheck = false;

var time = 20;
var timer;

var currentLives = 3;
var pauseCheck = false;
var scoreOutput = 0; //for displaying score
var gameInstance = 0;
var score;
var makeEnemy;
var enemyToCanvas;
ctx.translate(200,200);