import Movie from "../controllers/movie.js";

class MovieRouter {

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.movie = new Movie(this.databaseUtils);
    }

    loadMovieRoutes(upload){
        this.app.get('/movies', this.movie.getAll);  
        this.app.get('/movies/:id', this.movie.getOne);
        this.app.delete('/movies/:id', this.movie.deleteMovie);
        this.app.post('/movie', upload.single('image'), this.movie.addMovie);
        this.app.put('/movie/:id', upload.single('image'), this.movie.updateMovie);
    }

}

export default MovieRouter;