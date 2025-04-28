import Actor from "../controllers/actor.js"

class ActorRouter{

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.actor = new Actor(this.databaseUtils);
    }

    loadActorRoutes(){
        this.app.get('/actor', this.actor.getActor);
    }
}


export default ActorRouter;