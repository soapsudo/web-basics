const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadData(id) {
    
    try{
        const response = await fetch('http://localhost:3000/movies/' + id);
        const data = await response.json();

        const title = document.getElementById('single-movie-title');
        title.innerText = data.movie_title;

        const desc = document.getElementById('desc');
        desc.innerText = data.description;

        const actors = document.getElementById('actors');
        actors.innerText = data.actors.replaceAll(',', ', ');

        const year = document.getElementById('year');
        year.innerText = data.release_year;

        const genre = document.getElementById('genre');
        genre.innerText = data.category_name;

        const director = document.getElementById('director');
        director.innerText = data.director_name;

        const score = document.getElementById('score');
        score.innerText = data.score;

        const poster = document.getElementById('poster');
        poster.setAttribute('src', data.image);

    }catch(error){
        console.log('Error fetching this movie: ', error);
    }

}

loadData(id);