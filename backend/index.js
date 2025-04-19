import Server from './server/server.js';
export const __dirname = import.meta.dirname;

const server = new Server(__dirname);

server.startServer();