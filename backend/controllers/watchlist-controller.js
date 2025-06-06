import BaseController from "./base-controller.js";
import WatchlistModel from "../models/watchlist.js"
import MovieModel from "../models/movie.js";
import statusCodes from "../server/status-codes.js";


class Watchlist extends BaseController{

    constructor(databaseUtils){
        super(databaseUtils);
        this.watchlistModel = new WatchlistModel(databaseUtils);
        this.movieModel = new MovieModel(databaseUtils);
    }

    /**
     * Marks the movie entity record saved in the watchlist as 'watched'.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON message that the request was successful OR an error if the request didn't go through.
     */

    markAsWatched = async (req, res, next) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Invalid ID provided.`
            });
        } 
        
        if(id < 1){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Invalid ID provided.`
            });
        }
        
        const isIdInRange = await this.movieModel.isIdInRange(id);
        if(isIdInRange === false){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Invalid ID provided.`
            });
        }

        try{
            await this.watchlistModel.markMovieAsWatched(id);
            return res.status(200).json({message: `Movie with the movie ID: ${id} marked as watched.`});

        }catch(error){
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            });
        }
    }

    /**
     * Adds a new movie entity record to the 'watchlist'.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON message that the request was successful OR an error if the request didn't go through.
     */


    addToWatchlist = async (req, res, next) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Invalid ID provided.`
            });
        } 

        if(id < 1){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Invalid ID provided.`
            });
        } 

        const isIdInRange = await this.movieModel.isIdInRange(id);
        if(isIdInRange === false){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Invalid ID provided.`
            });
        }

        try{
            await this.watchlistModel.putMovieInWatchlist(id);
            return res.status(201).json({message: `Movie with the movie ID: ${id} inserted into the watchlist.`});

        }catch(error){
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            });
        }
    }

    /**
     * Gets all of the movie entities saved in the 'watchlist'.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON object with all of the movie entity records from the database OR an error if the request didn't go through.
     */


    getAllFromWatchlist = async (req, res, next) => {

        const filter = req.query.filter;

        if(filter){
            if(filter === 'not-watched' || filter === 'watched');
            else{
                return next({
                    status: statusCodes.BAD_REQUEST,
                    message: 'Invalid filter provided.'
                });
            } 
        }

        try{
            const watchlistMovies = await this.watchlistModel.getAllMoviesFromWatchlist(filter);
            return res.status(200).json(watchlistMovies);

        }catch(error){
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            });
        }
    }

    /**
     * Gets one movie entity from the watchlist, based on the id given in the path parameter.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON object with the movie entity record data OR an error if the request didn't go through.
     */

    getFromWatchlist = async (req, res, next) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `No movie ID provided.`
            });
        } 

        if(id < 1){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Invalid ID provided.`
            });
        }


        const isIdInRange = await this.movieModel.isIdInRange(id);
        if(isIdInRange === false){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Invalid ID provided.`
            });
        }

        try{
            const movie = await this.watchlistModel.getMovieFromWatchlist(id);

            if(movie){
                return res.status(200).json(movie);
            
            } else {
                return next({
                    status: statusCodes.NOT_FOUND,
                    message: `No movie with the movie ID: ${id} found on the watchlist.`
                });
            }

        }catch(error){
            throw{
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            }
        }
    }

    /**
     * Deletes a given movie entity record from the 'watchlist'.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON message that the request was successful OR an error if the request didn't go through.
     */

    removeFromWatchlist = async (req, res, next) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `No movie ID provided.`
            });
        }

        if(id < 1){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Invalid ID provided.`
            });
        }

        const isIdInRange = await this.movieModel.isIdInRange(id);
        if(isIdInRange === false){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Invalid ID provided.`
            });
        }

        try{
            await this.watchlistModel.removeMovieFromWatchlist(id);
            return res.status(200).json({message: `Movie with the movie ID: ${id} deleted from the watchlist.`});

        }catch(error){
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            });
        }
    }
}

export default Watchlist;