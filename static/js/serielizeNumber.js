document.addEventListener("DOMContentLoaded", function () {
  const boxContainer = document.getElementById("box-container");
  const boxes = document.querySelectorAll(".box");

  // Initial random order

  let letters = getRandomConsecutiveLetters();
  console.log(letters);
  let shuffledLetters = shuffleArray(letters);

  // Place letters in boxes
  boxes.forEach((box, index) => {
    box.innerText = shuffledLetters[index];
  });

  // Add drag and drop event listeners
  boxes.forEach((box) => {
    box.addEventListener("dragstart", dragStart);
    box.addEventListener("dragover", dragOver);
    box.addEventListener("drop", drop);
  });

  function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.innerText);
  }

  function dragOver(event) {
    event.preventDefault();
  }

  // ...

  function drop(event) {
    event.preventDefault();
    const draggedLetter = event.dataTransfer.getData("text/plain");
    const targetLetter = event.target.innerText;

    // Find both the source and target boxes
    const sourceBox = Array.from(boxes).find(
      (box) => box.innerText === draggedLetter
    );
    const targetBox = event.target;

    // Swap letters
    sourceBox.innerText = targetLetter;
    targetBox.innerText = draggedLetter;

    // Check if the letters are in the correct order
    if (checkOrder()) {
      updateScore();
      document.getElementById("instructions").textContent =
        "Well done! You arranged the Numbers correctly.";
      setTimeout(function () {
        // document.getElementById("instructions").style.display = "none";
        document.getElementById("instructions").textContent = "";
        letters = getRandomConsecutiveLetters();
        console.log(letters);
        shuffledLetters = shuffleArray(letters);

        // Place letters in boxes
        boxes.forEach((box, index) => {
          box.innerText = shuffledLetters[index];
        });
      }, 3000);
    }
  }

  // ...

  function checkOrder() {
    const currentOrder = Array.from(boxes)
      .map((box) => box.innerText)
      .join("");
    const correctOrder = letters.join("");

    return currentOrder === correctOrder;
  }

  // Function to shuffle array
  function shuffleArray(array) {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }
});

function getRandomConsecutiveLetters() {
  const startingNumber = Math.floor(Math.random() * 100) + 1; // Start from a random number

  const resultArray = [];
  for (let i = startingNumber; i < startingNumber + 5; i++) {
    resultArray.push(i);
  }
  return resultArray;
}

let timer;

// Timer function
function runTimer() {
  let Timer = 60; // Set the initial time (for testing purposes, you can adjust this)

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

runTimer();

var audio = document.getElementById("audio");
var playPauseBTN = document.getElementById("playPauseBTN");
var count = 0;

function playPause() {
  if (count == 0) {
    count = 1;
    audio.play();
    playPauseBTN.innerHTML = "Pause ⏸";
  } else {
    count = 0;
    audio.pause();
    playPauseBTN.innerHTML = "Play ►";
  }
}

function stop() {
  playPause();
  audio.pause();
  audio.currentTime = 0;
  playPauseBTN.innerHTML = "Play ►";
}

const startbtn = document.getElementById("startButton");
const instruction = document.getElementById("game-instructions");
const start2 = document.getElementById("game");
const over = document.getElementById("game-over");
startbtn.addEventListener("click", function () {
  gsap.from(".left", { opacity: 0, duration: 0.5, scale: 0.3 });
  instruction.style.display = "none";
  start2.style.display = "block";
  audio.play();
});

let score = 0;

// Function to update the score
function updateScore() {
  score += 10;
  // Update the score display
  document.getElementById("scoreBox").textContent = "Score: " + score;
}

function gameOver() {
  // Stop the timer (if needed)
  clearInterval(timer);

  // Hide the game area and show the game over message
  start2.style.display = "none";
  document.getElementById("instructions").style.display = "none";
  over.style.display = "block";

  // Display the final score
  document.getElementById("final-score").textContent = "Final Score: " + score;

  // Show the new game button
  document.getElementById("new-game-button").style.display = "block";
}

// New Game Button Click Handler
document
  .getElementById("new-game-button")
  .addEventListener("click", function (event) {
    event.target.innerHTML = "saving...";
    event.target.disabled = true;
    fetch("http://localhost:3000/saveGame", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: score,
        gameName: "Number Seriation",
        date: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
      }),
    })
      .then((response) => {
        console.log(response);
      })
      .then(() => {
        location.href = "http://localhost:3000/#games55";
      })
      .catch((err) => console.log(err));
  });
