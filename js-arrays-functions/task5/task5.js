'use strict';

function sortArray(numbers, order) {
  let sortedArray = [...numbers]; // new array copy the original array to avoid mutating it

  if (order == 'asc') {
    sortedArray.sort((a, b) => a - b);
  } else {
    sortedArray.sort((a, b) => b - a);
  }

  return sortedArray;
}

const numbers = [5, 2, 8, 1, 9];

console.log(sortArray(numbers, 'asc'));
console.log(sortArray(numbers, 'desc'));

console.log('Original array: ', numbers); // verify the original array is not modified
