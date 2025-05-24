import MovieModel from "../models/movie.js";
import BaseController from "./base-controller.js";
import statusCodes from "../server/status-codes.js";


class Movie extends BaseController {

    constructor(databaseUtils) {
        super(databaseUtils);
        this.movieModel = new MovieModel(databaseUtils);
    }

    //In feite precies dezelfde functie zoals addMovie, maar i.v.m. de opdrachteisen is het nog overgetypt voor de PUT request.

    /**
     * Updates the given movie entity record with new data that was sent in the request body.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON object with the updated movie data OR an error if the request didn't go through.
     */

    updateMovie = async (req, res, next) => {

        if (!req.file) {
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `No image uploaded`
            });
        }

        const { movie_title, category, director_first_name, director_last_name, description, score, year, actors } = req.body;

        if (!movie_title || !category || !director_first_name || !director_last_name || !description || !score || !year || !actors) {
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `All fields are required!`
            });
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
                return next({
                    status: statusCodes.SERVER_ERROR,
                    message: `Failed to update movie: no movie ID returned`
                });
            }
        } catch (error) {
            console.error('Error updating movie:', error.message);
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `Failed to update movie: ${error.message}`
            });
        }
    }

    /**
     * Adds a new movie entity record using the data that was sent in the request body.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON object with the inserted movie data OR an error if the request didn't go through.
     */

    addMovie = async (req, res, next) => {

        if (!req.file) {
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `No image uploaded`
            });        
        }

        const { movie_title, category, director_first_name, director_last_name, description, score, year, actors } = req.body;

        if (!movie_title || !category || !director_first_name || !director_last_name || !description || !score || !year || !actors) {
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `All fields are required!`
            });
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
                return next({
                    status: statusCodes.SERVER_ERROR,
                    message: `Failed to create movie: no movie ID returned`
                });
            }
        } catch (error) {
            console.error('Error creating movie:', error.message);
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `Failed to create movie: ${error.message}`
            });
        }

    }

    /**
     * Gets all of the known movie entity records in the database, with the possibility of filtering.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON object with the all of the known movie records OR an error if the request didn't go through.
     */

    getAll = async (req, res, next) => {

        const search = req.query.search;
        const sort = req.query.sort;

        if(sort){
            if(sort === 'a-z' || sort === 'z-a');
            else {
                return next({
                    status: statusCodes.BAD_REQUEST,
                    message: `Invalid sorting provided.`
                });
            }
        }

        try{
            const data = await this.movieModel.getAllMovies(null, search, sort);
            return res.status(200).json(data);

        }catch(error){
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            });
        }
    }

    /**
     * Gets one movie entity record from the database, based on the id given in the path parameter.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON object with the updated movie data OR an error if the request didn't go through.
     */

    getOne = async (req, res, next) => {

        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)){
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `Invalid ID provided.`
            });
        }

        const inRange = await this.movieModel.isIdInRange(parsedId);
        if (inRange === false){
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `Invalid ID provided.`
            });
        } 

        try{
            const movie = await this.movieModel.getOneMovie(parsedId);            
            return res.status(200).json(movie);

        }catch(error){
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            });
        }

    }


    /**
     * Deletes one movie entity record from the database, based on the id given in the path parameter.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON object with the updated movie data OR an error if the request didn't go through.
     */

    deleteMovie = async (req, res, next) => {

        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)){
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `Invalid ID provided.`
            });
        }

        const inRange = await this.movieModel.isIdInRange(parsedId);
        if (inRange === false){
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `Invalid ID provided.`
            });
        } 

        try{
            const movie = await this.movieModel.deleteMovie(parsedId);
            return res.status(200).json(movie);

        }catch(error){
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            })
        }
    }
}

export default Movie;