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

  constructor(rootDirectory) {
    this.corsOptions = this.corsOptions();
    this.databaseUtils = new DatabaseUtils(rootDirectory);
  }

  startServer() {
    app.use(cors(this.corsOptions));
    //Ik moet in de API json responses teruggeven
    app.use('/uploads', express.static(uploadDir));
    app.use(express.json());

    this.loadRouter();

    app.listen(port, () => {
      console.log(`Backend listening at http://localhost:${port}`);
    });
  }

  loadRouter(){
    this.router = new Router(app, this.databaseUtils);
    this.router.loadRoutes(upload);
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