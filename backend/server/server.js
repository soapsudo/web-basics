import express from 'express';
import cors from 'cors';
import DatabaseUtils from './database-utils.js';
import Router from '../router/router.js';

const app = express();
const port = 3000;

class Server {

  constructor(rootDirectory) {
    this.corsOptions = this.corsOptions();
    this.databaseUtils = new DatabaseUtils(rootDirectory);
  }

  startServer() {
    app.use(cors(this.corsOptions));
    //Ik moet in de API json responses teruggeven
    app.use(express.json());

    this.loadRouter();

    app.listen(port, () => {
      console.log(`Backend listening at http://localhost:${port}`);
    });
  }

  loadRouter(){
    this.router = new Router(app, this.databaseUtils);
    this.router.loadRoutes();
  }


  //Hier ga ik de backend ook beschikbaar stellen voor de statische frontend (index.html) 
  corsOptions() {
    return {
      origin: (origin, callback) => {

        const allowedOrigins = [
          undefined,
          'null',
          'http://localhost:8080'
        ];

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS')); //Middleware handelt de error verder af
        }
      }
    };
  }
}

export default Server;