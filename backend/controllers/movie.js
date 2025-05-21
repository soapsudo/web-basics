import MovieModel from "../models/movie.js";
import BaseController from "./base-controller.js";
import statusCodes from "../server/status-codes.js";


class Movie extends BaseController {

    constructor(databaseUtils) {
        super(databaseUtils);
        this.movieModel = new MovieModel(databaseUtils);
    }

    //In feite precies dezelfde functie zoals addMovie, maar i.v.m. de opdrachteisen is het nog overgetypt voor de PUT request.
    updateMovie = async (req, res) => {

        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const { movie_title, category, director_first_name, director_last_name, description, score, year, actors } = req.body;

        if (!movie_title || !category || !director_first_name || !director_last_name || !description || !score || !year || !actors) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            
            const movie = {
                movie_title,
                category,
                director_first_name,
                director_last_name,
                description,
                score,
                year,
                actors,
                image: `http://localhost:3000/uploads/${req.file.filename}`
            };

            const movieInsertData = await this.movieModel.addMovie(movie);

            if (movieInsertData.movie_id) {
                return res.status(201).json(movieInsertData);
            } else {
                return res.status(500).json({ message: 'Failed to update movie: No movie ID returned' });
            }
        } catch (error) {
            console.error('Error updating movie:', error.message);
            return res.status(500).json({ message: `Failed to update movie: ${error.message}` });
        }

    }


    addMovie = async (req, res) => {

        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const { movie_title, category, director_first_name, director_last_name, description, score, year, actors } = req.body;

        if (!movie_title || !category || !director_first_name || !director_last_name || !description || !score || !year || !actors) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            
            const movie = {
                movie_title,
                category,
                director_first_name,
                director_last_name,
                description,
                score,
                year,
                actors,
                image: `http://localhost:3000/uploads/${req.file.filename}`
            };

            const movieInsertData = await this.movieModel.addMovie(movie);

            if (movieInsertData.movie_id) {
                return res.status(201).json(movieInsertData);
            } else {
                return res.status(500).json({ message: 'Failed to create movie: No movie ID returned' });
            }
        } catch (error) {
            console.error('Error creating movie:', error.message);
            return res.status(500).json({ message: `Failed to create movie: ${error.message}` });
        }

    }

    getAll = async (req, res) => {

        const search = req.query.search;
        const sort = req.query.sort;

        if(sort){
            if(sort === 'a-z' || sort === 'z-a');
            else return res.status(400).json({message: 'Invalid sorting provided.'});
        }

        try{
            const data = await this.movieModel.getAllMovies(null, search, sort);
            return res.status(200).json(data);

        }catch(error){
            return res.status(500).json({message: `${error.message}`});
        }

        
    }

    getOne = async (req, res) => {

        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) return res.status(400).json({message: 'Invalid ID provided'});

        const inRange = await this.movieModel.isIdInRange(parsedId);
        if (inRange === false) return res.status(400).json({message: 'Invalid ID provided'});

        try{
            const movie = await this.movieModel.getOneMovie(parsedId);            
            return res.status(200).json(movie);

        }catch(error){
            return res.status(500).json({message: `${error.message}`});
        }

    }

    deleteMovie = async (req, res) => {

        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) return res.status(400).json({message: 'Invalid ID provided'});

        const inRange = await this.movieModel.isIdInRange(parsedId);
        if (inRange === false) return res.status(400).json({message: 'Invalid ID provided'});

        try{
            const movie = await this.movieModel.deleteMovie(parsedId);
            return res.status(200).json(movie);

        }catch(error){
            return res.status(500).json({message: `${error.message}`});
        }
    }

}

export default Movie;