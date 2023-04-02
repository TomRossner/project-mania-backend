const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const os = require("os");
const cluster = require("cluster");
require("dotenv").config();
const AuthRouter = require("./routes/auth.routes");
const ProjectRouter = require("./routes/project.routes");
const MembersRouter = require("./routes/members.routes");
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const helmet = require('helmet');

io.on('connection', (socket) => {
  console.log('a user connected');
})

mongoose.set("strictQuery", false);

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: true, limit: '2mb'}));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

app.use(`/projectmania/auth`, AuthRouter);
app.use(`/projectmania/projects`, ProjectRouter);
app.use('/projectmania/members', MembersRouter);





async function connectDB() {
  return mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✔ Connected to database"))
    .catch((error) => console.log("Failed connecting to database", error));
}

async function startServer() {
  if (cluster.isMaster) {
    const NUM_WORKERS = os.cpus().length;
    
    for (let i = 0; i < NUM_WORKERS; i++) {
      cluster.fork();
    }
    
    console.log(`Master process started, forking ${NUM_WORKERS} worker processes...`);
  } else {
    console.log("Worker process started");
    await connectDB();
    app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
  }
} 

startServer();