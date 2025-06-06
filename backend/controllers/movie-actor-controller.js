import BaseController from "./base-controller.js";
import MovieActorModel from "../models/movie-actor.js";
import statusCodes from "../server/status-codes.js";


class MovieActor extends BaseController{

    constructor(databaseUtils){
        super(databaseUtils);
        this.movieActorModel = new MovieActorModel(databaseUtils);
    }

    /**
     * Deletes a many-to-many relation of the entities movie and actor based on their respective id-s.
     * 
     * @param {*} req - Request from the middleware.
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON object with the actor data OR an error if the request didn't go through.
     */

    deleteMovieActor = async (req, res, next) => {

        const movieId = req.params.id;
        const actorId = req.params.actorid;

        if(!movieId || !actorId){
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `Bad request, no full data provided`
            });
        } 

        if(isNaN(movieId) || isNaN(actorId)){
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `Bad request, no valid data provided`
            });
        } 
        if(movieId < 1 || actorId < 1){
            return next({
                status: statusCodes.NOT_FOUND,
                message: `Bad request, no valid data provided`
            });
        }

        try{
            await this.movieActorModel.deleteMovieActorRecord(movieId, actorId);
            return res.status(200).json({message: `Record with movieID: ${movieId} and actorID: ${actorId} deleted.`});
            
        }catch(error){
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `Couldn't execute the query: ${error}`
            });
        }


    }
}

export default MovieActor;