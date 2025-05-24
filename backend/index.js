import Server from './server/server.js';
export const __dirname = import.meta.dirname;

// Initialize the server with the current directory, starting point for the application.
const server = new Server(__dirname);

server.startServer();