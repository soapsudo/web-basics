import Movie from "../controllers/movie-controller.js";

class MovieRouter {

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.movie = new Movie(this.databaseUtils);
    }

    /**
     * Loads all the routes for the movie entity.
     * @param {*} upload - Callback function for handling file uploads.
     * @return Void
     */
    loadMovieRoutes(upload){
        this.app.get('/movies', this.movie.getAll);  
        this.app.get('/movies/:id', this.movie.getOne);
        this.app.delete('/movies/:id', this.movie.deleteMovie);
        this.app.post('/movie', upload.single('image'), this.movie.addMovie);
        this.app.put('/movie/:id', upload.single('image'), this.movie.updateMovie);
    }

}

export default MovieRouter;