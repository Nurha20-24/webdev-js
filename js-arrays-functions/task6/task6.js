'use strict';

const main = document.querySelector('main');

let movies = [];

const numberOfMovies = parseInt(
  prompt('Enter the number of movies you want to rate:')
);

for (let i = 0; i < numberOfMovies; i++) {
  const movieTitle = prompt('Enter movie title:');
  const movieRating = parseInt(prompt('Enter movie rating on scale 0-5:'));
  movies.push({title: movieTitle, rating: movieRating});
}

movies.sort((a, b) => b.rating - a.rating);

main.innerHTML += `Highest rated movie: ${movies[0].title} with rating ${movies[0].rating} <br>`;

main.innerHTML += `<br>All movies sorted by rating: `;
for (let movie of movies) {
  main.innerHTML += `${movie.title} - rating: ${movie.rating},  `;
}
