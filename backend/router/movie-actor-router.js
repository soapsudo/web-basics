import MovieActor from "../controllers/movie-actor.js";

class MovieActorRouter {

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.movieActor = new MovieActor(this.databaseUtils);
    }

    loadMovieActorRoutes(){
        this.app.delete('/movie-actor/:id/:actorid', this.movieActor.deleteMovieActor);  
        
    }

}

export default MovieActorRouter;