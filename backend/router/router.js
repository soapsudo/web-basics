class Router{

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;
    }

    loadRoutes(){

        this.app.get('/', (req, res) => {
            res.send('Hello from the backend!');
          });
      
        this.app.get('/users', async (req, res) => {
            
            try{
              let response = await this.databaseUtils.fetchAll(`SELECT * FROM users`);
              res.send(response);
      
            }catch(error){
              res.send(error);
            }
      
          });

    }



}

export default Router;