import Watchlist from '../controllers/watchlist.js';
import Genre from '../controllers/genre.js';
import Director from '../controllers/director.js';
import Actor from '../controllers/actor.js';
import MovieRouter from '../router/movie-router.js'

class Router{

    constructor(app, databaseUtils){
        this.movieRouter = new MovieRouter(app, databaseUtils);
    }

    loadRoutes(upload){
        this.movieRouter.loadMovieRoutes(upload);
    }


}

export default Router;