const main = document.querySelector('main');

const firstSide = parseFloat(
  prompt('Enter the length of first side of a triangle:')
);
const secondSide = parseFloat(
  prompt('Enter the length of second side of a triangle:')
);
const thirdSide = parseFloat(
  prompt('Enter the length of third side of a triangle:')
);

if (!firstSide || !secondSide || !thirdSide) {
  main.innerHTML += 'Please enter valid numbers for all sides of the triangle.';
} else if (firstSide === secondSide && firstSide === thirdSide) {
  main.innerHTML += 'The triangle is equilateral (all sides are equal)';
} else if (
  firstSide === secondSide ||
  firstSide === thirdSide ||
  secondSide === thirdSide
) {
  main.innerHTML += 'The triangle is isosceles (two sides are equal)';
} else {
  main.innerHTML += 'The triangle is scalene (no sides are equal)';
}
