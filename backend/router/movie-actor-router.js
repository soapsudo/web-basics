import MovieActor from "../controllers/movie-actor.js";

class MovieActorRouter {

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.movieActor = new MovieActor(this.databaseUtils);
    }

    /**
     * Loads all the routes for the movie-actor many-to-many relation.
     */
    loadMovieActorRoutes(){
        this.app.delete('/movie-actor/:id/:actorid', this.movieActor.deleteMovieActor);  
        
    }

}

export default MovieActorRouter;