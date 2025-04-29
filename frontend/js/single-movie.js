const params = new URLSearchParams(window.location.search);
const id = params.get(`id`);
let addToWatchlistHandler;

async function setEditButtonLink(id){
    const editButton = document.getElementById(`single-movie-edit-button`);

    editButton.setAttribute(`onclick`, `location.href='../html/edit-movie.html?id=${id}'`);
}

async function changeAddToWatchlistButton(){
    const button = document.getElementById(`single-movie-add-to-watchlist`);
    
    button.setAttribute('class', 'button-green-disabled');
    button.removeEventListener('click', addToWatchlistHandler);

    button.innerText = `On watchlist`;
}

async function addToWatchlistListener(id){

    addToWatchlistHandler = async function(e){
        e.preventDefault();

        try{
            const response = await fetch(`http://localhost:3000/watchlist/${id}`, {
                method: `PUT`
            })

            const data = await response.json();

            if(response.status !== 201) {
                new ErrorHandler(false, data, document);
                return;

            } else{
                new ErrorHandler(true, `Successfully added the movie to the watchlist.`, document);
                await changeAddToWatchlistButton();
            } 

        }catch(error){
            new ErrorHandler(false, error.message, document);
        }
    }

    document.getElementById(`single-movie-add-to-watchlist`).addEventListener('click', addToWatchlistHandler);

}

async function checkIfOnWatchlist(id){
    try{
        const response = await fetch(`http://localhost:3000/watchlist/${id}`, {
            method: `GET`
        })
        const data = await response.json();

        if(response.status === 404){
        // doe niks
        }else if(response.status === 200){
            await changeAddToWatchlistButton();
        }else{
            new ErrorHandler(false, data, document);
        }

    }catch(error){
        new ErrorHandler(false, error.message, document);
    }
}

async function loadData(id) {
    
    try{
        const response = await fetch(`http://localhost:3000/movies/${id}`);
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

addToWatchlistListener(id);
checkIfOnWatchlist(id);
setEditButtonLink(id);
loadData(id);