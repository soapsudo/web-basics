import BaseController from "./base-controller.js";
import MovieActorModel from "../models/movie-actor.js";

class MovieActor extends BaseController{

    constructor(databaseUtils){
        super(databaseUtils);
        this.movieActorModel = new MovieActorModel(databaseUtils);
    }

    deleteMovieActor = async (req, res) => {

        const movieId = req.params.id;
        const actorId = req.params.actorid;

        if(!movieId || !actorId) return res.status(400).json({message: `Bad request, no full data provided`});
        if(isNaN(movieId) || isNaN(actorId) )return res.status(400).json({message: `Bad request, no valid data provided`});
        if(movieId < 1 || actorId < 1)return res.status(400).json({message: `Bad request, no valid data provided`});

        try{
            await this.movieActorModel.deleteMovieActorRecord(movieId, actorId);
            return res.status(200).json({message: `Record with movieID: ${movieId} and actorID: ${actorId} deleted.`});
            
        }catch(error){
            return res.status(500).json({message: `Couldn't execute the query: ${error}`});
        }


    }
}

export default MovieActor;