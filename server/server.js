const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const AuthRouter = require("./routes/auth.routes");
const ProjectRouter = require("./routes/project.routes");
const mongoose = require("mongoose");
const morgan = require("morgan");

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

app.use(`/projectmania/auth`, AuthRouter);
app.use(`/projectmania/projects`, ProjectRouter);





async function connectDB() {
  return new Promise((resolve, reject) => {
    mongoose
    .connect(process.env.MONGO_URL)
    .then(() => resolve(console.log("Connected to database")))
    .catch(() => reject(console.log("Failed to connect to database")));
  })
}

async function startServer() {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
} 

startServer();