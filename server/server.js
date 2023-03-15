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

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

app.use(`/projectmania/auth`, AuthRouter);
app.use(`/projectmania/projects`, ProjectRouter);





async function connectDB() {
  return mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✔ Connected to database"))
    .catch(() => console.log("Failed connecting to database"));
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