'use strict';
const main = document.querySelector('main');
const table = document.createElement('table');
const p = document.createElement('p');

const integer = parseInt(prompt('Enter a positive integer:'));

if (isNaN(integer) || integer <= 0) {
  p.innerHTML = 'Invalid input. Please enter a positive integer.';
} else {
  p.innerHTML = `Enter a positive integer: ${integer}`;

  const caption = document.createElement('caption');
  caption.textContent = 'Multiplication Table:';
  table.appendChild(caption);

  let product = 0;

  for (let row = 1; row <= integer; row++) {
    const tr = document.createElement('tr');
    table.appendChild(tr);

    for (let column = 1; column <= integer; column++) {
      product = row * column;

      const td = document.createElement('td');
      td.textContent = `${product}`;

      td.style.padding = '5px';

      tr.appendChild(td);
    }
  }
}

main.appendChild(p);
main.appendChild(table);
