const params = new URLSearchParams(window.location.search);
const id = params.get(`id`);
let addToWatchedHandler;


async function changeAddToWatched(){
    const button = document.getElementById(`single-movie-watchlist-watched`);
    
    button.setAttribute('class', 'button-green-disabled');
    button.removeEventListener('click', addToWatchedHandler);

    button.innerText = `Already watched`;
}

async function removeMovieFromWatchlist(){
    try{
        const response = await fetch(`http://localhost:3000/watchlist/${id}`, {
            method: `DELETE`
        });
        const data = await response.json();

        if(response.status !== 200) new ErrorHandler(false, data, document);
        else new ErrorHandler(true, `Successfully removed the movie from the watchlist.`, document);

    }catch(error){
        new ErrorHandler(false, error.message, document);
    }
}

async function setDeleteButtonLink(){
    const editButton = document.getElementById(`single-movie-watchlist-remove-from-watchlist`);

    editButton.addEventListener(`click`, removeMovieFromWatchlist);
}

async function addToWatchedListener(id){

    addToWatchedHandler = async function(e){
        e.preventDefault();

        try{
            const response = await fetch(`http://localhost:3000/watchlist/mark-as-watched/${id}`, {
                method: `PUT`
            })

            const data = await response.json();

            if(response.status !== 201){
                new ErrorHandler(false, data, document);
            } 
            else{
                new ErrorHandler(true, `Successfully marked the movie as watched.`, document);
                await changeAddToWatched();
            } 

        }catch(error){
            new ErrorHandler(false, error.message, document);
        }
    }

    document.getElementById(`single-movie-watchlist-watched`).addEventListener('click', addToWatchedHandler);

}

async function checkIfWatched(id){
    try{
        const response = await fetch(`http://localhost:3000/watchlist/${id}`, {
            method: `GET`
        })
        const data = await response.json();

        if(response.status === 200){
            if(data.watched === 1) await changeAddToWatched();
        }else{
            new ErrorHandler(false, data, document);
        }

    }catch(error){
        new ErrorHandler(false, error.message, document);
    }
}

async function loadData(id) {
    
    try{
        const response = await fetch(`http://localhost:3000/watchlist/${id}`);
        const data = await response.json();

        if(response.ok){
            const title = document.getElementById(`single-movie-title`);
            title.innerText = data.movie_title;

            const desc = document.getElementById(`desc`);
            desc.innerText = data.description;

            const actors = document.getElementById(`actors`);
            actors.innerText = data.actors.replaceAll(`,`, `, `);

            const year = document.getElementById(`year`);
            year.innerText = data.release_year;

            const genre = document.getElementById(`genre`);
            genre.innerText = data.category_name;

            const director = document.getElementById(`director`);
            director.innerText = data.director_name;

            const score = document.getElementById(`score`);
            score.innerText = data.score;

            const poster = document.getElementById(`poster`);
            poster.setAttribute(`src`, data.image);

        }else{
            new ErrorHandler(false, `Couldn't load the movie with the ID: ${id}`, document);
        }

    }catch(error){
        new ErrorHandler(false, `Error fetching this movie: ${error}`);
    }

}

addToWatchedListener(id);
checkIfWatched(id);
setDeleteButtonLink();
loadData(id);