import Model from './model.js'

class ActorModel extends Model {

    constructor(db) {
        super(db);
    }


    /**
     * Inserts actors for the given movie entity record, with checks if the given actors are already saved in the database.
     * Actor records known in the database get reused.
     * 
     * @param {*} actors - JSON array with actor datas. 
     * @param {*} movieId - Given movie for which the actor recods need to be inserted.
     * @returns Void OR an error if the query didn't go through.
     */


    async insertActorsForMovie(actors, movieId) {
    
        for (let i = 0; i < actors.length; i++) {

            const fullName = actors[i].trim().split(' ');

            let firstName = '';
            let lastName = '';
            
            for(let j = 0; j < fullName.length; j++){
                if(j===0) firstName += fullName[j];
                else lastName += fullName[j]
            }
            
            let existingActor;

            try{
                existingActor = await this.getActorByFullName(firstName, lastName);

            }catch(error){
                throw new Error(error.message);
            }

            if (existingActor !== null) {
                try {
                    await this.insertActorIntoActorMovie(existingActor.actor_id, movieId);

                } catch (error) {
                    throw new Error(`Failed to link existing actor: ${error.message}`);
                }

            } else {
                try {
                    const actor = await this.insertActorIntoActor(firstName, lastName);
                    await this.insertActorIntoActorMovie(actor.actor_id, movieId);
                
                } catch (error) {
                    throw new Error(`Failed to insert and link new actor: ${error.message}`);
                }
            }
        }
    }


    /**
     * Inserts an actor record into the database. If the record with exactly same data already exists, it gets updated.
     * 
     * @param {*} firstName - Actor's first name. 
     * @param {*} lastName - Actor's last name.
     * @returns JSON object with the inserted actor entity record OR an error if the query didn't go through.
     */

    async insertActorIntoActor(firstName, lastName) {
        
        try {
            const sql = `INSERT OR REPLACE INTO actor (first_name, last_name) VALUES ('${firstName}', '${lastName}')`;
            await this.db.execute(sql);
    
            const actor = await this.getActorByFullName(firstName, lastName);
    
            return actor;

        } catch (error) {
            throw new Error(`Failed to insert actor: ${error.message}`);
        }
    }
    
    /**
     * Adds a new many-to-many relation for the actor and movie.
     * 
     * @param {*} actorId - Actor entity record ID. 
     * @param {*} movieId - Movie entity record ID.
     * @returns Void OR an error if the query didn't go through.
     */

    async insertActorIntoActorMovie(actorId, movieId) {

        try {
            const sql = `INSERT INTO movie_actor (movie_id, actor_id) VALUES (${movieId}, ${actorId}) ON CONFLICT DO NOTHING`;
            const result = await this.db.execute(sql);
            
            return result;

        } catch (error) {
            throw new Error(`Failed to insert movie_actor: ${error.message}`);
        }
    }
    

    /**
     * Gets an actor entity record from the database based on the first and last name.
     * 
     * @param {*} firstName - Actor's first name. 
     * @param {*} lastName - Actor's last name.
     * @returns JSON object with the actor entity record data OR an error if the query didn't go through.
     */
    async getActorByFullName(firstName, lastName) {
       
        try {
            const sql = `SELECT * FROM actor WHERE first_name = '${firstName}' AND last_name = '${lastName}'`;
            const actor = await this.db.fetchFirst(sql);
    
            return actor || null;

        } catch (error) {
            throw new Error(`Failed to fetch actor: ${error.message}`);
        }
    }

}

export default ActorModel;