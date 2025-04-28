import Model from "./model.js";

class MovieActorModel extends Model{
    
    constructor(db){
        super(db);
    }

    async deleteMovieActorRecord(movieId, actorId){

        const sql = `DELETE FROM movie_actor WHERE movie_id = ${movieId} AND actor_id = ${actorId}`;

        try{
            await this.db.execute(sql);

        }catch(error){
            throw new Error(error.message);
        }
    }
}

export default MovieActorModel;