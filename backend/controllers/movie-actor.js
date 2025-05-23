import BaseController from "./base-controller.js";
import MovieActorModel from "../models/movie-actor.js";
import statusCodes from "../server/status-codes.js";


class MovieActor extends BaseController{

    constructor(databaseUtils){
        super(databaseUtils);
        this.movieActorModel = new MovieActorModel(databaseUtils);
    }

    deleteMovieActor = async (req, res) => {

        const movieId = req.params.id;
        const actorId = req.params.actorid;

        if(!movieId || !actorId){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `Bad request, no full data provided`
            }
        } 

        if(isNaN(movieId) || isNaN(actorId)){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `Bad request, no valid data provided`
            }
        } 
        if(movieId < 1 || actorId < 1){
            throw{
                status: statusCodes.BAD_REQUEST,
                message: `Bad request, no valid data provided`
            }
        }

        try{
            await this.movieActorModel.deleteMovieActorRecord(movieId, actorId);
            return res.status(200).json({message: `Record with movieID: ${movieId} and actorID: ${actorId} deleted.`});
            
        }catch(error){
            throw{
                status: statusCodes.SERVER_ERROR,
                message: `Couldn't execute the query: ${error}`
            }
        }


    }
}

export default MovieActor;