const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const helmet = require('helmet');
const morgan = require("morgan");
const mongoose = require("mongoose");
const os = require("os");
const cluster = require("cluster");
require("dotenv").config();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Routers
const AuthRouter = require("./routes/auth.routes");
const ProjectRouter = require("./routes/project.routes");
const MembersRouter = require("./routes/members.routes");


// Middle-wares
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: true, limit: '2mb'}));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(`/projectmania/auth`, AuthRouter);
app.use(`/projectmania/projects`, ProjectRouter);
app.use('/projectmania/members', MembersRouter);

mongoose.set("strictQuery", false);


// Sockets
io.on('connection', (socket) => {

  socket.on('connection', (data) => {
    console.log(`${data.userName} is connected`);
  })
})


// Connect to MongoDB
async function connectDB() {
  return mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✔ Connected to database"))
    .catch((error) => console.log("Failed connecting to database", error));
}

// Start the server using the Cluster module
async function startServer_Clusters() {
  if (cluster.isMaster) {
    const NUM_WORKERS = os.cpus().length;
    
    for (let i = 0; i < NUM_WORKERS; i++) {
      cluster.fork();
    }
    
    console.log(`Master process started, forking ${NUM_WORKERS} worker processes...`);
  } else {
    console.log("Worker process started");
    await connectDB();
    server.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
  }
}

// Start the server
async function startServer() {
  await connectDB();
  server.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
} 

// Init
process.env.NODE_ENV === 'production' ? startServer_Clusters() : startServer();