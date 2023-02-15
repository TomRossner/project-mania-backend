const express = require("express");
const ProjectRouter = express.Router();
const {getProjects, addProject, updateProject, getTask} = require("../controllers/project.controllers");

ProjectRouter.get("/all", getProjects);
ProjectRouter.post("/add", addProject);
ProjectRouter.put("/:id", updateProject);
ProjectRouter.post("/:id/:task_id", getTask);

module.exports = ProjectRouter;