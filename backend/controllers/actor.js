import BaseController from "./base-controller.js";
import ActorModel from "../models/actor.js";
import statusCodes from "../server/status-codes.js";

class Actor extends BaseController{

    constructor(databaseUtils){
        super(databaseUtils);
        this.actorModel = new ActorModel(databaseUtils);
    }

    /**
     * Gets the actor object based on his first name and last name.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns JSON object with the actor data OR an error if the request didn't go through.
     */
    getActor = async (req, res, next) => {

        const firstName = req.query.first;
        const lastName = req.query.last;

        if(!firstName || !lastName){
            return next({
                status: statusCodes.BAD_REQUEST,
                message: `Invalid request, no actor data provided.`
            });
        }

        try{
            const actor = await this.actorModel.getActorByFullName(firstName, lastName);
            return res.status(200).json(actor);

        }catch(error){
            return next({
                status: statusCodes.SERVER_ERROR,
                message: `Couldn't get the requested actor: ${error}`
            });
        }

    }
}

export default Actor;