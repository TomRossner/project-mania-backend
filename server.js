const express = require("express");
const app = express();
const { Server } = require("socket.io");
const sockets = require('./sockets/events.socket');
const PORT = process.env.PORT || 5000;

// HTTP server for development
const http = require('http');
const http_Server = http.createServer(app);
const http_socketServer = new Server(http_Server);

// HTTPS server
const https = require('https');
const fs = require('fs');
const path = require('path');

// SSL certificate path
 if (process.env.CERT_PATH) {
  const certPath = path.resolve(process.env.CERT_PATH);

  const certFilePath = path.join(certPath, 'fullchain.pem');
  const privateKeyPath = path.join(certPath, 'privkey.pem');


  // Load the SSL certificate and private key files
  const certificate = fs.readFileSync(certFilePath);
  const privateKey = fs.readFileSync(privateKeyPath);

  const options = {
    key: privateKey,
    cert: certificate,
  }

  const https_Server = https.createServer(options, app);
  const https_socketServer = new Server(https_Server);
}

const cors = require("cors");
const helmet = require('helmet');
const morgan = require("morgan");
const mongoose = require("mongoose");
const os = require("os");
const cluster = require("cluster");
require("dotenv").config();
const ERROR_MESSAGES = require("./utils/errors");
const compression = require('compression');

// Routers
const AuthRouter = require("./routes/auth.routes");
const ProjectRouter = require("./routes/project.routes");
const MembersRouter = require("./routes/members.routes");
const ChatsRouter = require("./routes/chats.routes");


// Middle-wares
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: true, limit: '5mb'}));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(compression());

app.use(`/projectmania/auth`, AuthRouter);
app.use(`/projectmania/projects`, ProjectRouter);
app.use('/projectmania/members', MembersRouter);
app.use('/projectmania/chats', ChatsRouter);

mongoose.set("strictQuery", false);


// Connect to MongoDB
async function connectDB() {
  return mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ Connected to database"))
    .catch((error) => console.log(ERROR_MESSAGES.CONNECT_TO_DB_FAILED, error));
}

// Start the server using the Cluster module
// async function startServer_Clusters() {
//   if (cluster.isMaster) {
//     const NUM_WORKERS = os.cpus().length;
    
//     for (let i = 0; i < NUM_WORKERS; i++) {
//       cluster.fork();
//     }
    
//     console.log(`Master process started, forking ${NUM_WORKERS} worker processes...`);
//   } else {
//     console.log("Worker process started");
//     await connectDB();
//     https_Server.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
//     sockets.listen(https_socketServer);
//   }
// }

// Start the server
async function startServer() {
  await connectDB();
  http_Server.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
  sockets.listen(http_socketServer);
} 

// Init
// process.env.NODE_ENV === 'production' ? startServer_Clusters() : startServer();
startServer();