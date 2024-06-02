const appleBox = document.getElementById("InnerappleBox");
const appleBox2 = document.getElementById("OuterappleBox");
const rightBox = document.getElementById("rightbox");
const scoreCount = document.getElementById("scoreCount");
const options = document.getElementById("optionContainer");
const instructions = document.getElementById("instructions");
const scoreDisplay = document.getElementById("scoreDisplay");

const startButton = document.getElementById("start");
startButton.addEventListener("click" , StartGame);
startButton.addEventListener("click" , playAudio);

const over = document.getElementById("gameover");
  
let numberOfApples = Math.floor(Math.random() * 7 + 2); // random number of apples between 2 to 8

let score = 0; // for counting the score
scoreCount.textContent = score;


const option1 = document.getElementById("1");
const option2 = document.getElementById("2");
const option3 = document.getElementById("3");



option1.addEventListener("click", optionButtonHandler);
option2.addEventListener("click", optionButtonHandler);
option3.addEventListener("click", optionButtonHandler);

// option1.addEventListener("click", playAudio);
// option2.addEventListener("click", playAudio);
// option3.addEventListener("click", playAudio);

restartGame(); // restarts the game after every right count

function StartGame(){
  gsap.from(".main", { opacity: 0, duration: 0.5,scale:0.3});
  gsap.from("#OuterappleBox, #rightbox, #optionContainer", { opacity: 1, duration: 0.5,scale:0.3});
  over.style.display = "none"
  startButton.style.display = "none";
  rightBox.style.display = "block"
  rightBox.style.display = "flex"
  instructions.textContent = "Count the number of apples and click on the correct option.";
  instructions.style.display = "block"
  instructions.style.color = "white"
  // Show the game content
  appleBox2.style.display = "block";
  options.style.display = "block";
  scoreCount.style.display = "block"
  options.style.display = "flex"
  playPause();
  runTimer();
  restartGame();

}

let timer;

// Timer function
function runTimer() {
    let Timer= 15; // Set the initial time (for testing purposes, you can adjust this)

    timer = setInterval(function () {
        if (Timer >= 1) {
            Timer--;
            document.querySelector("#Timerval").textContent = Timer;
        } else {
            clearInterval(timer);
            stop();
            gameOver();
        }
    }, 1000);
}
var audio2 = new Audio('../static/assets/appleCount/Sound/toy.mp3'); // Replace 'path/to/your/audio/file.mp3' with the actual path to your audio file
var correctAudio = new Audio('../static/assets/LetterMaster/Sound/correct-6033.mp3');


// Function to play the audio
function playAudio() {
    audio2.play();
}
startButton.addEventListener("click" , playAudio);


var audio = document.getElementById('audio');
var playPauseBTN = document.getElementById('playPauseBTN');
var count = 0;

function playPause(){
	if(count == 0){
		count = 1;
		audio.play();
		playPauseBTN.innerHTML = "Pause ⏸";
	}else{
		count = 0;
		audio.pause();
		playPauseBTN.innerHTML = "Play ►";
	}

}

function stop(){
	playPause()
	audio.pause();
	audio.currentTime = 0;
	playPauseBTN.innerHTML = "Play ►";
}



// checks whether the chosen answer is right or wrong
function optionButtonHandler(event) {
  if (event.target.textContent === numberOfApples.toString()) {
    correctAudio.play();
    score = score + 10;
    scoreCount.textContent = score;
    instructions.textContent = "Correct! Well done.";
    instructions.style.color = "green"
    restartGame();
  } else {
    audio2.play();
    instructions.textContent = "Oops! That's not correct. Count again.";
    instructions.style.color = "red"
  }

}


// generated random number excluding specific number
function getRandomNumberExcludingSpecific(min, max, excludedNumber) {
  let randomNumber;

  do {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (randomNumber === excludedNumber);

  return randomNumber;
}


// function to restart the game 
// deletes all the old elements and create new with new values.
function restartGame() {
  const oldElements = document.getElementsByClassName("appleImgContainer");
  const oldImages = document.getElementsByClassName("appleImage");

  while (oldElements.length > 0) {
    oldElements[0].parentNode.removeChild(oldElements[0]);
  }

  while (oldImages.length > 0) {
    oldImages[0].parentNode.removeChild(oldImages[0]);
  }

  numberOfApples = Math.floor(Math.random() * 7 + 2);

  for (let i = 0; i < numberOfApples; i++) {
    const appleImgContainer = document.createElement("div");
    appleImgContainer.classList.add("appleImgContainer");
    const appleImg = document.createElement("img");
    appleImg.src = "../static/assets/appleCount/image/apple.png";
    appleImg.classList.add("appleImage");

    appleBox.appendChild(appleImgContainer);
    appleImgContainer.appendChild(appleImg);
  }

  const rightOptionPosition = Math.floor(Math.random() * 3) + 1;

  option1.textContent = getRandomNumberExcludingSpecific(1, 20, numberOfApples);
  option2.textContent = getRandomNumberExcludingSpecific(1, 20, numberOfApples);
  option3.textContent = getRandomNumberExcludingSpecific(1, 20, numberOfApples);

  if (rightOptionPosition === 1) {
    option1.textContent = numberOfApples;
  } else if (rightOptionPosition === 2) {
    option2.textContent = numberOfApples;
  } else if (rightOptionPosition === 3) {
    option3.textContent = numberOfApples;
  }
}


function gameOver() {
  gsap.from("#gameOverBox", { opacity: 1, duration: 1, scale:1 });
  // Update the score display when the time is over
  over.style.display = "block"
  rightBox.style.display = "none"
  appleBox2.style.display = "none";
  options.style.display = "none";
  instructions.style.display = "none"
  scoreCount.style.display = "none"
  scoreDisplay.innerHTML = "Final Score: <span id='scoreCount'>" + score + "</span>";

}
function startNewGame() {
  over.style.display = "none";

  // Show the start game button and any other elements needed
  startButton.style.display = "block";
  startButton.style.opacity = 1;
  startButton.style.transform = "scale(1)";
}
// document.getElementById("butn").addEventListener("click",startNewGame);
document.getElementById("butn").addEventListener("click",playAudio);

document.getElementById('butn').addEventListener('click',(event)=>{

  event.target.innerHTML = 'saving...'
  event.target.disabled = true;
    
  fetch('http://localhost:3000/saveGame',{
    method : 'post',
    headers : {
      "Content-Type": 'application/json'
     },
     body : JSON.stringify({
       score : score,
       gameName : 'Counting',
       date : `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`
     })
   })
   .then(response =>{
     console.log(response);
   })
   .then(()=>{
    location.href = 'http://localhost:3000/#games55'
   })
   .catch(err => console.log(err))
})
