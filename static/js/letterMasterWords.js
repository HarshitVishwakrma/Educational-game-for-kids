
var wordsFood = [
	'carrot',
	'potato',
	'tomato',
	'cucumber',
	'broccoli',
	'peas',
	'corn',
	'pumpkin',
	'lettuce',
	'radish',
	'eggplant',
	'onion',
	'garlic',
	'beetroot',
	'cabbage'
];



var wordsAnimals = [
	'cow',
	'dog',
	'fish',
	'bird',
	'whale',
	'lion',
	'tiger',
	'wolf',
	'frog',
	'eagle',
	'camel',
	'sheep',
	'horse',
	'panda',
	'snake',
	'zebra'
];



var wordsLands = [
	'apple',
	'mango',
	'peach',
	'grape',
	'kiwi',
	'melon',
	'lemon',
	'guava',
	'berry',
	'dates',
	'papaya',
	'banana',
	'pear',
	'beetroot',
	'cabbage'	
];

for (var i = wordsFood.length - 1; i >= 0; i--) {
	wordsFood[i].split('');
}
for (var i = wordsAnimals.length - 1; i >= 0; i--) {
	wordsAnimals[i].split('');
}
for (var i = wordsLands.length - 1; i >= 0; i--) {
	wordsLands[i].split('');
}

var randomNumber=null;
var chosenWord=null;
var missingLetterNum=null;
var missingLetter=null;
var splicedWord;
var chosenLetters;
var lettersArray;
var random2;
var theme;
var mistakes;
var mistakesWord;

var lettersOG = [	
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
]

var letterB1 = document.createElement('button');
var letterB2 = document.createElement('button');
var letterB3 = document.createElement('button');
var letterB4 = document.createElement('button');
var letterB5 = document.createElement('button');
var letterB6 = document.createElement('button');
var letterB7 = document.createElement('button');
var letterB8 = document.createElement('button');
