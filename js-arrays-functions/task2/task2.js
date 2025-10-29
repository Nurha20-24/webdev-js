'use strict';
const main = document.querySelector('main');
const numbers = [];

for (let i = 1; i <= 5; i++) {
  const userInput = parseInt(prompt(`Enter Number ${i}:`));
  main.innerHTML += `Enter Number ${i}: ${userInput} <br>`;
  numbers.push(userInput);
}

main.innerHTML += `<br> Numbers: [${numbers}]<br>`;

const checkNumber = parseInt(prompt('Enter a Number to Search:'));
if (numbers.includes(checkNumber)) {
  main.innerHTML += `<br> Enter a Number to Search: ${checkNumber} <br>`;
  main.innerHTML += `Number ${checkNumber} is found in the array. <br>`;
} else {
  main.innerHTML += `Number ${checkNumber} not found in the array. <br>`;
}
numbers.pop();

main.innerHTML += `<br> Updated Numbers: [${numbers}] <br>`;

numbers.sort((a, b) => a - b);
main.innerHTML += `<br> Sorted Numbers: [${numbers}] <br>`;
