import Movie from "../controllers/movie.js";

class MovieRouter {

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.movie = new Movie(this.databaseUtils);
    }

    loadMovieRoutes(){
        this.app.get('/movies', this.movie.getAll);  
        this.app.get('/movies/:id', this.movie.getOne);
        this.app.delete('/movies/:id', this.movie.deleteMovie);
    }

}

export default MovieRouter;