import BaseController from "./base-controller.js";
import WatchlistModel from "../models/watchlist.js"

class Watchlist extends BaseController{

    constructor(databaseUtils){
        super(databaseUtils);
        this.watchlistModel = new WatchlistModel(databaseUtils);
    }

    addToWatchlist = async (req, res) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)) return res.status(400).json({message: 'No movie ID provided!'});
        if(id < 1) return res.status(400).json({message: 'Invalid movie ID provided!'});

        try{
            await this.watchlistModel.putMovieInWatchlist(id);
            return res.status(201).json({message: `Movie with the movie ID: ${id} inserted into the watchlist.`});

        }catch(error){
            return res.status(500).json({message: `${error.message}`});
        }

    }

    getFromWatchlist = async (req, res) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)) return res.status(400).json({message: 'No movie ID provided!'});
        if(id < 1) return res.status(400).json({message: 'Invalid movie ID provided!'});

        try{
            const movie = await this.watchlistModel.getMovieFromWatchlist(id);

            if(movie) return res.status(200).json(movie);
            else return res.status(404).json({message: `No movie with the movie ID: ${id} found on the watchlist.`});

        }catch(error){
            return res.status(500).json({message: `${error.message}`});
        }
    }

    removeFromWatchlist = async (req, res) => {

        const id = req.params.movieid;

        if(!id || isNaN(id)) return res.status(400).json({message: 'No movie ID provided!'});
        if(id < 1) return res.status(400).json({message: 'Invalid movie ID provided!'});

        try{
            await this.watchlistModel.removeFromWatchlist(id);
            return res.status(201).json({message: `Movie with the movie ID: ${id} deleted from the watchlist.`});

        }catch(error){
            return res.status(500).json({message: `${error.message}`});
        }
        

    }

}

export default Watchlist;