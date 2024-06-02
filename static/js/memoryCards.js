const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let isFirstClick = true;

const backgroundAudio = new Audio('../static/assets/memoryCards/Sound/background.mp3');
const cardClickAudio = new Audio('../static/assets/memoryCards/Sound/cardClick.wav');
backgroundAudio.loop = true;


document.querySelector(".score").textContent = score;

const cardsData = [
  {
    "image": "../static/assets/memoryCards/Image/chili.png",
    "name": "chili"
  },
  {
    "image": "../static/assets/memoryCards/Image/lemon.png",
    "name": "lemon"
  },
  {
    "image": "../static/assets/memoryCards/Image/strawberry.png",
    "name": "strawberry"
  },
  {
    "image": "../static/assets/memoryCards/Image/tomato.png",
    "name": "tomato"
  },
  {
    "image": "../static/assets/memoryCards/Image/watermelon.png",
    "name": "watermelon"
  },
  {
    "image": "../static/assets/memoryCards/Image/cherries.png",
    "name": "cherries"
  }
]


cards = [...cardsData, ...cardsData]
shuffleCards();
generateCards();

function shuffleCards() {
  let currentIndex = cards.length,
  randomIndex,
  temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
    <div class="front">
    <img class="front-image" src=${card.image} />
    </div>
    <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
  backgroundAudio.play();
}

function flipCard() {
  cardClickAudio.play()
  if (lockBoard) return;
  if (this === firstCard) return;
  
  this.classList.add("flipped");

  if (isFirstClick) {
    startTimer();
    isFirstClick = false;
  }

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  // score++;
  // document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

let noOfCardsSwiped = 0;

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
  if(isMatch){
    noOfCardsSwiped++;
    score = score+20;
    document.querySelector(".score").textContent = score;
  }
  if(noOfCardsSwiped == 6){
    console.log('game completed')
      clearInterval(timer);
      showPopup();
      noOfCardsSwiped = 0;  
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}


let timer;
let timeLeft = 120; // 120 seconds = 2 minutes

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `Time left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showPopup();
    }
  }, 1000);
}

function showPopup() {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Game over!</h2>
      <p>High Score: ${score}</p>
      <button onclick="newGame(event)">new Game</button>
    </div>
  `;
  document.body.appendChild(popup);
}

function newGame(event){
  event.target.innerHTML = 'saving...'
  event.target.disabled = true;
  fetch('http://localhost:3000/saveGame',{
    method : 'post',
    headers : {
      "Content-Type": 'application/json'
     },
     body : JSON.stringify({
       score : score,
       gameName : 'Memory Cards',
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
}

function restart() {
  clearInterval(timer);
  timeLeft = 120;
  score = 0;
  document.querySelector(".score").textContent = score;
  document.getElementById("timer").textContent = "Time left: 2:00"; // Reset the timer text
  gridContainer.innerHTML = "";
  generateCards();
  isFirstClick = true; // Reset the isFirstClick flag
  closePopup();
}

function closePopup() {
  const popup = document.querySelector(".popup");
  if (popup) {
    popup.remove();
  }
}


