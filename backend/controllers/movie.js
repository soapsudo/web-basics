import MovieModel from "../models/movie.js";
import BaseController from "./base-controller.js";

class Movie extends BaseController {

    constructor(databaseUtils) {
        super(databaseUtils);
        this.movieModel = new MovieModel(databaseUtils);
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

        const data = await this.movieModel.getAllMovies(null, search, sort);

        if (data.error) {
            return res.status(500).json({message: data});
        } else {
            return res.status(200).json(data);
        }
    }

    getOne = async (req, res) => {

        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) return res.status(400).json({message: 'Invalid ID provided'});

        const inRange = await this.movieModel.isIdInRange(parsedId);
        if (inRange === false) return res.status(400).json({message: 'Invalid ID provided'});

        const movie = await this.movieModel.getOneMovie(parsedId);

        if (movie.error) {
            return res.status(500).json(movie);

        } else {
            return res.status(200).json(movie);
        }


    }

    deleteMovie = async (req, res) => {

        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) return res.status(400).json({message: 'Invalid ID provided'});

        const inRange = await this.movieModel.isIdInRange(parsedId);
        if (inRange === false) return res.status(400).json({message: 'Invalid ID provided'});

        const movie = await this.movieModel.deleteMovie(parsedId);

        if (movie) {
            return res.status(500).json(error);

        } else {
            return res.status(200).json(movie);
        }

    }

}

export default Movie;