const params = new URLSearchParams(window.location.search);
const filter = params.get(`filter`);

/**
 * Gets the URL needed for the backend API call based on the given filter parameters.
 * @returns {string}
 */
function getUrl(){
  if(filter){
    return `http://localhost:3000/watchlist?filter=${filter}`;
  } 

  return `http://localhost:3000/watchlist`;
}

/**
 * Makes the needed backend API call and makes HTML elements with the recieved data.
 * @returns {void}
 */
async function loadMovies() {
  try {
    const response = await fetch(getUrl());
    const data = await response.json();

    if (response.status !== 200) {
      new ErrorHandler(false, data.message, document);
    }
    else {

      const movies = document.getElementById(`movies`);
      const ul = document.createElement(`ul`);
      ul.className = `movie-display`;

      data.forEach(movie => {
        const div = document.createElement(`div`)
        div.className = `movie-item`;

        const li = document.createElement(`li`);
        const img = document.createElement(`img`);
        const title = document.createElement(`div`);
        const score = document.createElement(`div`);
        const link = document.createElement(`a`);

        link.href = `../html/single-movie-watchlist.html?id=${encodeURIComponent(movie.movie_id)}`;
        link.className = `movie-card`;

        title.className = `movie-title`;
        title.innerText = `${movie.movie_title}`;

        score.className = `movie-score`;
        score.innerText = `Score: ${movie.score}/10`;

        img.loading = `lazy`;
        img.src = `${movie.image}`;
        img.className = `movie-image`;

        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(score);

        link.appendChild(div);

        li.appendChild(link);
        ul.appendChild(li);
      });

      movies.appendChild(ul);
    }
  } catch (error) {
    new ErrorHandler(false, `Error fetching movies: ${error}`, document);
  }
}


  
loadMovies();