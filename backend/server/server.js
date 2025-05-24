import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import DatabaseUtils from '../models/database-utils.js';
import Router from '../router/router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Set up multer for file uploads
// The upload directory is created if it does not exist
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); 
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const app = express();
const port = 3000;

class Server {

  /**
   * Server class that initializes the Express server and sets up routes.
   * @param {string} rootDirectory - The root directory for the server, used for database utilities.
   */
  constructor(rootDirectory) {
    this.corsOptions = this.corsOptions();
    this.databaseUtils = new DatabaseUtils(rootDirectory);
  }

  /**
   * Starts the Express server and sets up middleware and routes.
   */
  startServer() {
    app.use(cors(this.corsOptions));
    app.use('/uploads', express.static(uploadDir));
    app.use(express.json());

    this.loadRouter();

    //Global error handler
    app.use(function (err, req, res, next){
        res
        .status(err.status || 500)
        .json({
           message: err.message || 'Something went wrong!'
        });

    });

    app.listen(port, () => {
      console.log(`Backend listening at http://localhost:${port}`);
    });
  }

  /**
   * Loads the router and sets up all the routes for the application.
   * @return Void
   */
  loadRouter(){
    this.router = new Router(app, this.databaseUtils);
    this.router.loadRoutes(upload);
  }


  /**
   * CORS options for the server.
   * Allows requests from specific origins (static frontend when only using index.html and docker from localhost) and handles errors.
   * @return {Object} CORS options object.
   */
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
          callback(new Error('Not allowed by CORS')); //Middleware handles this error
        }
      }
    };
  }
}

export default Server;