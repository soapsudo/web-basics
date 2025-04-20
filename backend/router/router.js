import Movie from '../controllers/movie.js';
import Watchlist from '../controllers/watchlist.js';
import Genre from '../controllers/genre.js';
import Director from '../controllers/director.js';
import Actor from '../controllers/actor.js';

class Router{

    constructor(app, databaseUtils){
        this.app = app;
        this.movie = new Movie(databaseUtils);
    }

    loadRoutes(){
        this.app.get('/movies', this.movie.getAll);  

    }
}

export default Router;