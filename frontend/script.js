fetch('http://localhost:3000/movies')
    .then(response => response.json())
    .then(data => {
        const usersDiv = document.getElementById('movies');
        usersDiv.innerHTML = '<ul class="no-bullets">' + 
            data.map(movie => `<li><img src="data:image/jpeg;base64,${movie.image}" class="movie-image"/></li>`).join('') + 
            '</ul>';
    })
    .catch(error => console.error('Error fetching images:', error));