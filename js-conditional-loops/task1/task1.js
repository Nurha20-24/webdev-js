// Task 1

const main = document.querySelector('main');

const C = parseFloat(prompt('Enter temperature in Celsius:'));

const F = ((C * 9) / 5 + 32).toFixed(1);

const K = (C + 273.15).toFixed(1);

if (isNaN(C)) {
  main.innerHTML = 'Please enter a valid number for Temperature:';
} else {
  main.innerHTML = `Temperature in Fahrenheit: ${F}°F <br>Temperature in Kelvin: ${K}K`;
}
