import ErrorHandler from "./error-handler.js";

const params = new URLSearchParams(window.location.search);
const search = params.get(`search`);
const sort = params.get(`sort`);

function getUrl(){
  if(search){
    return `http://localhost:3000/movies?search=${search}`;

  } 
  
  if(sort){
    return `http://localhost:3000/movies?sort=${sort}`;
  }

  return `http://localhost:3000/movies`;
}

function getAddMovieCard(){

  const addMovieCard = document.createElement(`li`);

  addMovieCard.innerHTML = `<a class="movie-card" href="../html/add-movie.html">
                              <div class="movie-item movie-item-add">
                              <img src="../images/add.png" class="movie-image-add movie-image">
                              <div class="movie-title movie-add-title">Add a new movie</div>
                              </div>
                            </a>
                        `;
  return addMovieCard;
}

//TODO error handling!
async function loadMovies() {
    try {
      const response = await fetch(getUrl());  
      const data = await response.json();

      const movies = document.getElementById(`movies`);
      const ul = document.createElement(`ul`);
      const addMovie = getAddMovieCard();

      ul.className = `movie-display`;
      ul.appendChild(addMovie);
  
      data.forEach(movie => {
        const div = document.createElement(`div`)
        div.className = `movie-item`;

        const li = document.createElement(`li`);
        const img = document.createElement(`img`);
        const title = document.createElement(`div`);
        const score = document.createElement(`div`);
        const link = document.createElement(`a`);

        link.href = `../html/single-movie.html?id=${encodeURIComponent(movie.movie_id)}`;
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
      
    } catch (error) {
        new ErrorHandler(false, `Error fetching movies: ${error}`, document);
    }
  }


  
loadMovies();