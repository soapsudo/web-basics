import BaseController from "./base-controller.js";
import WatchlistModel from "../models/watchlist.js"
import statusCodes from "../server/status-codes.js";


class Watchlist extends BaseController{

    constructor(databaseUtils){
        super(databaseUtils);
        this.watchlistModel = new WatchlistModel(databaseUtils);
    }

    markAsWatched = async (req, res) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `Invalid ID provided.`
            }
        } 
        
        if(id < 1){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `Invalid ID provided.`
            }
        }

        try{
            await this.watchlistModel.markMovieAsWatched(id);
            return res.status(201).json({message: `Movie with the movie ID: ${id} marked as watched.`});

        }catch(error){
            throw{
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            }
        }
    }


    addToWatchlist = async (req, res) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `Invalid ID provided.`
            }
        } 

        if(id < 1){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `Invalid ID provided.`
            }
        } 

        try{
            await this.watchlistModel.putMovieInWatchlist(id);
            return res.status(201).json({message: `Movie with the movie ID: ${id} inserted into the watchlist.`});

        }catch(error){
            throw{
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            }
        }
    }

    getAllFromWatchlist = async (req, res) => {

        const filter = req.query.filter;

        if(filter){
            if(filter === 'not-watched' || filter === 'watched');
            else{
                throw{
                    status: statusCodes.BAD_REQUEST,
                    message: 'Invalid filter provided.'
                }
            } 
        }

        try{
            const watchlistMovies = await this.watchlistModel.getAllMoviesFromWatchlist(filter);
            return res.status(200).json(watchlistMovies);

        }catch(error){
            throw{
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            }
        }
    }

    getFromWatchlist = async (req, res) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `No movie ID provided.`
            }
        } 

        if(id < 1){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `Invalid ID provided.`
            }
        }

        try{
            const movie = await this.watchlistModel.getMovieFromWatchlist(id);

            if(movie) return res.status(200).json(movie);
            else return res.status(404).json({message: `No movie with the movie ID: ${id} found on the watchlist.`});

        }catch(error){
            throw{
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            }
        }
    }

    removeFromWatchlist = async (req, res) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `No movie ID provided.`
            }
        }

        if(id < 1){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `Invalid ID provided.`
            }
        }

        try{
            await this.watchlistModel.removeMovieFromWatchlist(id);
            return res.status(200).json({message: `Movie with the movie ID: ${id} deleted from the watchlist.`});

        }catch(error){
            throw{
                status: statusCodes.SERVER_ERROR,
                message: `${error.message}`
            }
        }
    }
}

export default Watchlist;