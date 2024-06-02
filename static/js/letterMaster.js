//add event to start button
let starts = document.getElementById('start');
starts.addEventListener('click', chooseTheme);
//all of the other buttons/divs
var game = document.getElementById('game');
var which = document.getElementById('which');
var food = document.getElementById('food');
var animals = document.getElementById('animals');
var lands = document.getElementById('lands');
let main = document.querySelector(".container")
food.addEventListener('click', chooseFood);
animals.addEventListener('click', chooseAnimals);
lands.addEventListener('click', chooseLands);
let score = 0; // Declare the timer variablelwt
let timer;

// let wrongAnswer = new Audio('./music.mp3')
let wrongAnswer = new Audio('../static/assets/letterMaster/Sound/music.mp3')

// let rightAnswer = new Audio('./correct-6033.mp3')
let rightAnswer = new Audio('../static/assets/letterMaster/Sound/correct-6033.mp3')

// let optionChose = new Audio('./menu-button-88360.mp3') 
let optionChose = new Audio('../static/assets/letterMaster/Sound/menu-button-88360.mp3') 

// var backgroundMusic = new Audio('background.mp3');
var backgroundMusic = new Audio('../static/assets/letterMaster/Sound/background.mp3');

const imageContainer = document.getElementById('imageContainer');

// Timer function
function runTimer() {
    let Timer= 60; // Set the initial time (for testing purposes, you can adjust this)

    timer = setInterval(function () {
        if (Timer >= 0) {
            document.querySelector("#Timerval").textContent = Timer;
            Timer--;
        } else {
            clearInterval(timer);
            showRestartContainer();
        }
    }, 1000);
}



function updateScore() {
    let scoreDisplay = document.getElementById('score');
    scoreDisplay.innerHTML = 'Score: ' + score;
}


// Function to play background music
function playBackgroundMusic() {
    backgroundMusic.loop = true; // Set to true to loop the music
    backgroundMusic.play();
}

function pausemusic(){
    backgroundMusic.pause();
}

// Function to pause background music
function toggleBackgroundMusic() {
    var toggleButton = document.getElementById('toggle-music');

    if (backgroundMusic.paused) {
        backgroundMusic.play();
        toggleButton.textContent = 'Pause Music';
    } else {
        backgroundMusic.pause();
        toggleButton.textContent = 'Resume Music';
    }
}

// Call the playBackgroundMusic function when the start button is clicked
document.getElementById('start').addEventListener('click', playBackgroundMusic);
// Call the respective functions when the pause and stop buttons are clicked
document.getElementById('toggle-music').addEventListener('click', toggleBackgroundMusic);


//add functions for chosing a theme
function chooseTheme(){
    //Hide the 'start game' button and show the game
    optionChose.play();
    starts.style.display="none";
    which.style.display="block";
}
function chooseFood(){
    optionChose.play();
    theme = 'food';
    words = [...wordsFood];
    game.style.display = "block";
    mistakes = 0;
    startGame();
    runTimer();
   
}
function chooseAnimals(){
    optionChose.play();
    theme = 'animals';
    words = [...wordsAnimals];
    game.style.display = "block";
    mistakes = 0;
    startGame();
    runTimer();
}
function chooseLands(){
    optionChose.play();
    theme = 'lands';
    words = [...wordsLands];
    game.style.display = "block";
    mistakes = 0;
    startGame();
    runTimer();

}

let gameOver = false;

function showRestartContainer() {

    if(!gameOver){

    document.getElementById('game').style.display = 'none'; // Hide the game container
    document.getElementById('start').style.display = 'none'; // Hide the game container
    document.getElementById('restart-container').style.display = 'block'; // Show the restart container
    document.getElementById('final-score').textContent = score; // Display the final score
    document.getElementById('mistakes-count').textContent = mistakes;
    }
}


function resetGameState() {
    score = 0;
    mistakes = 0;
    // Reset any other game-related state variables
}


function stopTimer() {
    clearInterval(timer);
    showRestartContainer();
}

document.getElementById('restart-button').addEventListener('click', function (event) {
    optionChose.play();

    event.target.innerHTML = 'saving...'
    event.target.disabled = true;

    fetch('http://localhost:3000/saveGame',{
        method : 'post',
        headers : {
          "Content-Type": 'application/json'
         },
         body : JSON.stringify({
           score : score,
           gameName : 'Spell Mingle',
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
    

    resetGameState();
    // Hide the restart container
    document.getElementById('restart-container').style.display = 'none';
    // Start a new game
    document.getElementById('start').style.display = 'block'; // Hide the game container
    startGame();
    location.href = 'http://localhost:3000/#games55'
});



function chooseWord() {
    //make sure there are words left
    if (words.length < 1) {
        //say you finished if there aren't more words
        if (mistakes == 1) {
            showRestartContainer()	
        } else {
            showRestartContainer()
        }
        //reload the pag
    } else{
        //get a random number
        randomNumber = Math.floor((Math.random()*words.length));
        //choose the a random word using the random number generated
        chosenWord = [...words[randomNumber]];
        picName = Array.from(chosenWord).join('');
        
        //remove the word from the list of words, so it can't be used again
        words.splice(randomNumber, 1);
        //choose the number of the missing letter
        missingLetterNum = Math.floor((Math.random()*chosenWord.length))
        //remove letter from array and make a var of the missing letter 
        missingLetter = chosenWord[missingLetterNum];
        chosenWord.splice(missingLetterNum, 1, '_');

        const helpingImage = document.createElement('img');
        helpingImage.src = `../static/assets/LetterMaster/Images/${picName}.jpg`;
        helpingImage.id = 'helpingImage'
        imageContainer.replaceChildren(helpingImage);
    }
}

//this function will choose letters that you can choose from
function chooseLetters() {
    var randomLetters;
    var letters = [...lettersOG];
    //choose 8 random letters
    for (var i = 0; i < 8; i++) {
        //random number
        var random = Math.floor((Math.random()*letters.length));

        if (letters[random] == missingLetter) {
            random++
        }

        randomLetters += [...letters[random]];
        letters.splice(random, 1);
        chosenLetters = randomLetters;
    }
    //choose another random number
    random2 = Math.floor((Math.random()*(chosenLetters.length-9)));
    //make an array out of random chosen letters
    lettersArray = chosenLetters.split('');
    //remove the first 9 of the array (it said 'undefined')
    lettersArray.splice(0,9);
    //sort the array randomly
    lettersArray.sort(() => Math.random() - 0.5);
    //add the missing letter to a random place in the array, storing that random place so it can be used later on.
    lettersArray.splice(random2, 1, missingLetter);		
}



//function that will start the game
function startGame(time){

    //hide the theme buttons
    which.style.display="none";
    //choose a word and letters that are beneath
    chooseWord();
    chooseLetters();
    //this is where the word/letters will be shown
    var showWord = document.getElementById('word');
    var showLetters = document.getElementById('letters');
    var wordsLeft = document.getElementById('wordsLeft');
    //show how many words you have left
    let wordsLeftCount = words.length+1;
    if (words.length>=1) {
        wordsLeft.innerHTML='You have '+wordsLeftCount+' words left';
    } else{
        wordsLeft.innerHTML='You have 1 word left';
    }
    //show the word as a string
    showWord.innerHTML = chosenWord.join('');

    //make buttons out of all the letters
    letterB1.innerHTML = lettersArray[0];
    letterB2.innerHTML = lettersArray[1];
    letterB3.innerHTML = lettersArray[2];
    letterB4.innerHTML = lettersArray[3];
    letterB5.innerHTML = lettersArray[4];
    letterB6.innerHTML = lettersArray[5];
    letterB7.innerHTML = lettersArray[6];
    letterB8.innerHTML = lettersArray[7];


    showLetters.appendChild(letterB1);
    showLetters.appendChild(letterB2);
    showLetters.appendChild(letterB3);
    showLetters.appendChild(letterB4);
    showLetters.appendChild(letterB5);
    showLetters.appendChild(letterB6);
    showLetters.appendChild(letterB7);
    showLetters.appendChild(letterB8);


    let isClicked = false;

    letterB1.onclick=function(){
        if(isClicked){
            return ;
        }
        isClicked = true;

        if (random2==0) {
            rightAnswer.play();
            chosenWord.splice(missingLetterNum, 1, missingLetter);
            showWord.innerHTML = chosenWord.join('');
            showWord.style.color = 'green';
            score = score+10;
            // setTimeout(startGame, 1000);  
         
            timer = setTimeout(()=>{
                startGame()
                isClicked = false;
            },1000)
        }else{
            wrongAnswer.play();
            mistakes++;
            showWord.style.color = 'red';
            isClicked = false;
        }
    }

    letterB2.onclick=function(){

        if(isClicked){
            return;
        }
        isClicked = true;

        if (random2==1) {
            rightAnswer.play();
            chosenWord.splice(missingLetterNum, 1, missingLetter);
            showWord.innerHTML = chosenWord.join('');
            showWord.style.color = 'green';
            score = score+10;
            // setTimeout(startGame, 1000);

            timer = setTimeout(()=>{
                startGame()
                isClicked = false;
            },1000)
        }else{
            wrongAnswer.play();
            mistakes++;
            showWord.style.color = 'red';
            isClicked = false;
            
        }
    }

    letterB3.onclick=function(){
        
        if(isClicked){
            return ;
        }
        isClicked = true;

        if (random2==2) {
            rightAnswer.play();
            chosenWord.splice(missingLetterNum, 1, missingLetter);
            showWord.innerHTML = chosenWord.join('');
            showWord.style.color = 'green';
            score = score+10;
            timer = setTimeout(()=>{
                startGame()
                isClicked = false;
            },1000)
        }else{
            wrongAnswer.play();
            mistakes++;
            showWord.style.color = 'red';
            isClicked = false;
        }
    }

    letterB4.onclick=function(){

        if(isClicked){
            return ;
        }
        isClicked = true;

        if (random2==3) {
            rightAnswer.play();
            chosenWord.splice(missingLetterNum, 1, missingLetter);
            showWord.innerHTML = chosenWord.join('');
            showWord.style.color = 'green';
            score = score+10;
            timer = setTimeout(()=>{
                startGame()
                isClicked = false;
            },1000)
        }else{
            wrongAnswer.play();
            mistakes++;
            showWord.style.color = 'red';
            isClicked = false;
        }
    }

    letterB5.onclick=function(){

        if(isClicked){
            return ;
        }
        isClicked = true;

        if (random2==4) {
            rightAnswer.play();
            chosenWord.splice(missingLetterNum, 1, missingLetter);
            showWord.innerHTML = chosenWord.join('');
            showWord.style.color = 'green';
            score = score+10;
            timer = setTimeout(()=>{
                startGame()
                isClicked = false;
            },1000)
        }else{
            wrongAnswer.play();
            mistakes++;
            showWord.style.color = 'red';
            isClicked = false;
        }
    }

    letterB6.onclick=function(){

        if(isClicked){
            return ;
        }
        isClicked = true;

        if (random2==5) {
            rightAnswer.play();
            chosenWord.splice(missingLetterNum, 1, missingLetter);
            showWord.innerHTML = chosenWord.join('');
            showWord.style.color = 'green';
            score = score+10;
            timer = setTimeout(()=>{
                startGame()
                isClicked = false;
            },1000)
        }else{
            wrongAnswer.play();
            mistakes++;
            showWord.style.color = 'red';
            isClicked = false;
        }
    }

    letterB7.onclick=function(){

        if(isClicked){
            return ;
        }
        isClicked = true;

        if (random2==6) {
            rightAnswer.play();
            chosenWord.splice(missingLetterNum, 1, missingLetter);
            showWord.innerHTML = chosenWord.join('');
            showWord.style.color = 'green';
            score = score+10;
            timer = setTimeout(()=>{
                startGame()
                isClicked = false;
            },1000)
        }else{
            wrongAnswer.play();
            mistakes++;
            showWord.style.color = 'red';
            isClicked = false;
        }
    }

    letterB8.onclick=function(){

        if(isClicked){
            return ;
        }
        isClicked = true;

        if (random2==7) {
            rightAnswer.play();
            chosenWord.splice(missingLetterNum, 1, missingLetter);
            showWord.innerHTML = chosenWord.join('');
            showWord.style.color = 'green';
            score = score+10;
            timer = setTimeout(()=>{
                startGame()
                isClicked = false;
            },1000)
        }else{
            wrongAnswer.play();
            mistakes++;
            showWord.style.color = 'red';
            isClicked = false;
        }
    }

    showWord.style.color = 'black';

    updateScore();
    
}
