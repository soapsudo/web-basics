import BaseController from "./base-controller.js";
import ActorModel from "../models/actor.js";

class Actor extends BaseController{

    constructor(databaseUtils){
        super(databaseUtils);
        this.actorModel = new ActorModel(databaseUtils);
    }

    getActor = async (req, res) => {

        const firstName = req.query.first;
        const lastName = req.query.last;

        if(!firstName || !lastName) return res.status(400).json({message: `Invalid request, no actor data provided.`});

        try{
            const actor = await this.actorModel.getActorByFullName(firstName, lastName);
            return res.status(200).json(actor);

        }catch(error){
            return res.status(500).json({message: `Couldn't get the actor: ${error}`});
        }

    }
}

export default Actor;