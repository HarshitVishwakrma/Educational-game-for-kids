
function toggleCards(cardId) {
  var cardContainer = document.getElementById('card-container' + cardId);
  // var overlay = document.querySelector('.overlay');
  var overlay = document.getElementById('overlay'+cardId)

  var cards = cardContainer.querySelectorAll('.card')

  if (cardContainer.style.display === 'none' || cardContainer.style.display === '') {
    cardContainer.style.display = 'flex';

    cards.forEach(card =>{
      card.style.display = 'inline-block'
    })
    

    overlay.style.display = 'block';
  } else {
    cardContainer.style.display = 'none';

    cards.forEach(card =>{
      card.style.display = 'none'
    })

    overlay.style.display = 'none';
  }
}

function closeCards(cardId) {
  var cardContainer = document.getElementById('card-container' + cardId);
  var overlay = document.querySelector('#overlay'+cardId);
  var cards = cardContainer.querySelectorAll('.card');

  cardContainer.style.display = 'none';
  
  cards.forEach(card=>{
    card.style.display = 'none'
  })

  overlay.style.display = 'none';
}


document.getElementById('letterMasterPlayBtn').addEventListener('click', ()=>{
  location.href = 'http://localhost:3000/spellMingle'
})

document.getElementById('serielizeTheAlphabetsPlayBtn').addEventListener('click', ()=>{
  location.href = 'http://localhost:3000/alphabetSeriation'
})

document.getElementById('flipTheCardPlayBtn').addEventListener('click', ()=>{
  location.href = 'http://localhost:3000/memoryFlip'
})

document.getElementById('appleCountPlayBtn').addEventListener('click', ()=>{
  location.href = 'http://localhost:3000/counting'
})

document.getElementById('serielizeNumberPlayBtn').addEventListener('click', ()=>{
  location.href = 'http://localhost:3000/numberSeriation'
})

document.getElementById('memoryCardsPlayBtn').addEventListener('click', ()=>{
  location.href = 'http://localhost:3000/memoryCards'
})