import WatchlistRouter from '../router/watchlist-router.js';
import MovieRouter from '../router/movie-router.js';
import ImageRouter from '../router/image-router.js';
import MovieActorRouter from '../router/movie-actor-router.js';
import ActorRouter from '../router/actor-router.js';

class Router{
    /**
     * Router class that initializes all the routers for the application.
     * @param {*} app - Express application instance.
     * @param {*} databaseUtils - Database utility instance for database operations.
     */
    constructor(app, databaseUtils){
        this.movieRouter = new MovieRouter(app, databaseUtils);
        this.imageRouter = new ImageRouter(app, databaseUtils);
        this.movieActorRouter = new MovieActorRouter(app, databaseUtils);
        this.actorRouter = new ActorRouter(app, databaseUtils);
        this.watchlistRouter = new WatchlistRouter(app, databaseUtils);
    }

    /**
     * Loads all the routes for the application.
     * @param {*} upload - Callback function for handling file uploads.
     */
    loadRoutes(upload){
        this.movieRouter.loadMovieRoutes(upload);
        this.imageRouter.loadImageRoutes();
        this.movieActorRouter.loadMovieActorRoutes();
        this.actorRouter.loadActorRoutes();
        this.watchlistRouter.loadWatchlistRoutes();
    }
}

export default Router;