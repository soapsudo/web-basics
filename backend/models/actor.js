import Model from './model.js'

class ActorModel extends Model {

    constructor(db) {
        super(db);
    }

    async insertActorsForMovie(actors, movieId) {
    
    
        for (let i = 0; i < actors.length; i++) {

            const fullName = actors[i].trim().split(' ');
            const firstName = fullName[0];
            const lastName = fullName[1];
    
            const existingActor = await this.getActorByFullName(firstName, lastName);

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
    
    async insertActorIntoActor(firstName, lastName) {
        
        try {
            const sql = `INSERT OR REPLACE INTO actor (first_name, last_name) VALUES ('${firstName}', '${lastName}')`;
            await this.db.execute(sql);
    
            const actor = await this.getActorByFullName(firstName, lastName);
    
            return actor;

        } catch (error) {
            console.error('Error inserting actor:', error.message);
            throw new Error(`Failed to insert actor: ${error.message}`);
        }
    }
    
    async insertActorIntoActorMovie(actorId, movieId) {

        try {
            const sql = `INSERT INTO movie_actor (movie_id, actor_id) VALUES (${movieId}, ${actorId}) ON CONFLICT DO NOTHING`;
            const result = await this.db.execute(sql);
            
            return result;

        } catch (error) {
            console.error('Error inserting movie_actor:', error.message);
            throw new Error(`Failed to insert movie_actor: ${error.message}`);
        }
    }
    
    async getActorByFullName(firstName, lastName) {
       
        try {
            const sql = `SELECT * FROM actor WHERE first_name = '${firstName}' AND last_name = '${lastName}'`;
            const actor = await this.db.fetchFirst(sql);
    
            return actor || null;

        } catch (error) {
            console.error('Error fetching actor:', error.message);
            throw new Error(`Failed to fetch actor: ${error.message}`);
        }
    }

}

export default ActorModel;