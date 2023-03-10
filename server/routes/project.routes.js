const express = require("express");
const ProjectRouter = express.Router();
const {getProjects, addProject, updateProject, getTask, deleteTask, deleteProject} = require("../controllers/project.controllers");
const AUTH_MW = require('../middlewares/auth.middleware');

ProjectRouter.get("/:id/all", AUTH_MW, getProjects);
ProjectRouter.post("/add", AUTH_MW, addProject);
ProjectRouter.put("/:id", AUTH_MW, updateProject);
ProjectRouter.get("/:id/:task_id", AUTH_MW, getTask);
ProjectRouter.delete("/:id/:stage_id/:task_id", AUTH_MW, deleteTask);
ProjectRouter.delete("/delete/:id", AUTH_MW, deleteProject);

module.exports = ProjectRouter;