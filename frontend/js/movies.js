const params = new URLSearchParams(window.location.search);
const search = params.get('search');

function getUrl(){
  if(search) return `http://localhost:3000/movies?search=${search}`;
  return `http://localhost:3000/movies`;
}

async function loadMovies() {
    try {
      const response = await fetch(getUrl());  
      const data = await response.json();
      const movies = document.getElementById('movies');
      const ul = document.createElement('ul');

      ul.className = 'movie-display';
  
      data.forEach(movie => {
        const div = document.createElement('div')
        div.className = 'movie-item';

        const li = document.createElement('li');
        const img = document.createElement('img');
        const title = document.createElement('div');
        const score = document.createElement('div');
        const link = document.createElement('a');

        link.href = `../html/single-movie.html?id=${encodeURIComponent(movie.movie_id)}`;
        link.className = 'movie-card';

        title.className = 'movie-title';
        title.innerText = `${movie.movie_title}`;

        score.className = 'movie-score';
        score.innerText = `Score: ${movie.score}/10`;

        img.src = `${movie.image}`;
        img.className = 'movie-image';

        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(score);

        link.appendChild(div);

        li.appendChild(link);
        ul.appendChild(li);
      });
  
      movies.appendChild(ul);
      
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }
  
loadMovies();