const main = document.querySelector('main');

const score = parseInt(
  prompt('Enter your score for course assessment (0-100):')
);

if (isNaN(score)) {
  main.innerHTML = 'Invalid input';
} else if (score > 100 || score < 0) {
  main.innerHTML = 'Score should be in between (0-100)';
} else {
  if (score >= 88) {
    main.innerHTML = `Score: ${score}. Grade: 5`;
  } else if (score >= 76) {
    main.innerHTML = `Score: ${score}. Grade: 4`;
  } else if (score >= 64) {
    main.innerHTML = `Score: ${score}. Grade: 3`;
  } else if (score >= 52) {
    main.innerHTML = `Score: ${score}. Grade: 2`;
  } else if (score >= 40) {
    main.innerHTML = `Score: ${score}. Grade: 1`;
  } else {
    main.innerHTML = `Score: ${score}. Grade: 0`;
  }
}
