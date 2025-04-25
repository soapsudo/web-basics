import MovieModel from "../models/movie.js";
import BaseController from "./base-controller.js";

class Movie extends BaseController{
    
    constructor(databaseUtils){
        super(databaseUtils);
        this.movieModel = new MovieModel(databaseUtils);
    }

    addMovie = async(req, res) => {
        
        console.log(req.file);

        if (!req.file) return res.status(400).json('No image uploaded');

        const { movie_title, category, director_first_name, director_last_name, description, score, year } = req.body;

        const movie = {
            movie_title,
            category,
            director_first_name,
            director_last_name,
            description,
            score,
            year,
            image: `http://localhost:3000/uploads/${req.file.filename}`
        };

        const movieInsertData = await this.movieModel.addMovie(movie);

        if(movieInsertData.movie_title){
            return res.status(201).json(movieInsertData);

        }else{
            return res.status(500).json(movieInsertData);
        }

    }

    getAll = async (req, res) => {

        const search = req.query.search;
        const data = await this.movieModel.getAllMovies(null,search);
        
        if(data.error){
            return res.status(400).json(data);
        }else{
            return res.status(200).json(data);
        }
    }

    getOne = async (req, res) => {

        const parsedId = parseInt(req.params.id);
        if(isNaN(parsedId)) return res.status(400).json('Invalid ID provided');
        
        const inRange = await this.movieModel.isIdInRange(parsedId);
        if(inRange === false) return res.status(400).json('Invalid ID provided');

        const movie = await this.movieModel.getOneMovie(parsedId);

        if(movie.error){
            return res.status(500).json(movie);

        }else{
            return res.status(200).json(movie);
        }
    

    }

    deleteMovie = async (req, res) => {

        const parsedId = parseInt(req.params.id);
        if(isNaN(parsedId)) return res.status(400).json('Invalid ID provided');
        
        const inRange = await this.movieModel.isIdInRange(parsedId);
        if(inRange === false) return res.status(400).json('Invalid ID provided');
        
        const movie = await this.movieModel.deleteMovie(parsedId);

        if(movie){
            return res.status(500).json(error);

        }else{
            return res.status(200).json(movie);
        }

    }

}

export default Movie;