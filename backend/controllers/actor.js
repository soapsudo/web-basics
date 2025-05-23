import BaseController from "./base-controller.js";
import ActorModel from "../models/actor.js";
import statusCodes from "../server/status-codes.js";

class Actor extends BaseController{

    constructor(databaseUtils){
        super(databaseUtils);
        this.actorModel = new ActorModel(databaseUtils);
    }

    getActor = async (req, res) => {

        const firstName = req.query.first;
        const lastName = req.query.last;

        if(!firstName || !lastName){
            throw {
                status: statusCodes.BAD_REQUEST,
                message: `Invalid request, no actor data provided.`
            }
        }

        try{
            const actor = await this.actorModel.getActorByFullName(firstName, lastName);
            return res.status(200).json(actor);

        }catch(error){
            throw{
                status: statusCodes.SERVER_ERROR,
                message: `Couldn't get the requested actor: ${error}`
            }
        }

    }
}

export default Actor;