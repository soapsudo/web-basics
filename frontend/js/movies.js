async function loadMovies() {
    try {
      const response = await fetch('http://localhost:3000/movies');  
      const data = await response.json();
      const movies = document.getElementById('movies');
      const ul = document.createElement('ul');

      ul.className = 'no-bullets';
  
      data.forEach(movie => {
        const li = document.createElement('li');
        const img = document.createElement('img');

        img.src = `${movie.image}`;
        img.className = 'movie-image';

        li.appendChild(img);
        ul.appendChild(li);
      });
  
      movies.innerHTML = '';
      movies.appendChild(ul);
      
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }
  
  loadMovies();