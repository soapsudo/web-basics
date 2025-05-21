import WatchlistRouter from '../router/watchlist-router.js';
import MovieRouter from '../router/movie-router.js';
import ImageRouter from '../router/image-router.js';
import MovieActorRouter from '../router/movie-actor-router.js';
import ActorRouter from '../router/actor-router.js';

class Router{

    constructor(app, databaseUtils){
        this.movieRouter = new MovieRouter(app, databaseUtils);
        this.imageRouter = new ImageRouter(app, databaseUtils);
        this.movieActorRouter = new MovieActorRouter(app, databaseUtils);
        this.actorRouter = new ActorRouter(app, databaseUtils);
        this.watchlistRouter = new WatchlistRouter(app, databaseUtils);
    }

    loadRoutes(upload){
        this.movieRouter.loadMovieRoutes(upload);
        this.imageRouter.loadImageRoutes();
        this.movieActorRouter.loadMovieActorRoutes();
        this.actorRouter.loadActorRoutes();
        this.watchlistRouter.loadWatchlistRoutes();
    }
}

export default Router;