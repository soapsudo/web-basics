import Model from "./model.js";

class MovieActorModel extends Model{
    
    constructor(db){
        super(db);
    }

    /**
    * Deletes a movie-actor record from the database based on the given movie ID and actor ID.
    * 
    * @param {*} movieId - Given movie ID to delete the record for.
    * @param {*} actorId - Given actor ID to delete the record for.
    * @returns Void OR error object if it should happen.
    */
    async deleteMovieActorRecord(movieId, actorId){

        const sql = `DELETE FROM movie_actor WHERE movie_id = ? AND actor_id = ?`;

        try{
            await this.db.execute(sql, [movieId, actorId]);

        }catch(error){
            throw new Error(error.message);
        }
    }
}

export default MovieActorModel;