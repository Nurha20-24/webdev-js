// Task 2

const main = document.querySelector('main');

const Coordinates = prompt(
  'Enter X and Y coordinates separated by comma (x1,y1,x2,y2):'
);

if (Coordinates === null || Coordinates.trim() === '') {
  main.innerHTML = 'No input provided.';
} else {
  const xyCoordinates = Coordinates.split(',');

  if (xyCoordinates.length !== 4 || xyCoordinates.some(isNaN)) {
    main.innerHTML =
      'Invalid input. Please enter four valid numeric values separated by commas. ';
  } else {
    const x1 = parseFloat(xyCoordinates[0]);
    const y1 = parseFloat(xyCoordinates[1]);
    const x2 = parseFloat(xyCoordinates[2]);
    const y2 = parseFloat(xyCoordinates[3]);

    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2).toFixed(2);

    main.innerHTML = ` Point 1: (${x1}, ${y1}), Point 2: (${x2}, ${y2}) <br>Distance between two points: ${distance}`;
  }
}
