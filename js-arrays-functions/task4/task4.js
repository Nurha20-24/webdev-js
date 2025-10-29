'use strict';

function sortArray(numbers) {
  let sortedArray = [...numbers]; // new array copy the original array to avoid mutating it

  return sortedArray.sort((a, b) => a - b);
}

const numbers = [5, 2, 8, 1, 9, 15, 3];

console.log('Sorted array: ', sortArray(numbers));

console.log('Original array: ', numbers);
