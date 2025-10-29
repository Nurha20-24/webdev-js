'use strict';

const main = document.querySelector('main');

const numbers = [];

let userInput;

do {
  userInput = prompt("Enter a number (or 'done' to finish):");

  if (userInput !== 'done') {
    const num = parseInt(userInput);

    if (!isNaN(num)) {
      numbers.push(num);
    }
  }
} while (userInput !== 'done');

const evenNumbers = [];

for (let num of numbers) {
  if (num % 2 === 0) {
    evenNumbers.push(num);
  }
}

if (evenNumbers.length === 0) {
  main.innerHTML += '<br><br>Even Numbers: None';
} else {
  main.innerHTML += `<br><br>Even Numbers: ${evenNumbers.join(', ')}`;
}
