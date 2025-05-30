import Actor from "../controllers/actor-controller.js"

class ActorRouter{

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.actor = new Actor(this.databaseUtils);
    }
    /**
     * Loads all the routes for the actor entity.
     */
    loadActorRoutes(){
        this.app.get('/actor', this.actor.getActor);
    }
}


export default ActorRouter;