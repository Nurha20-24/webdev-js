const main = document.querySelector('main');
const p = document.createElement('p');
const userInput = parseInt(prompt('Enter a positive integer: '));
let result = 0;

if (isNaN(userInput) || userInput <= 0) {
  p.innerHTML = 'Invalid input. Please enter a positive integer';
} else {
  for (let i = 1; i <= userInput; i++) {
    result = result + i;
  }
  p.innerHTML += `The sum of all the natural numbers up to ${userInput}: <strong>${result}</strong>`;
}
main.appendChild(p);
