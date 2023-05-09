const express = require("express");
const ProjectRouter = express.Router();
const {
    getProjects,
    addProject,
    updateProject,
    getTask,
    deleteTask,
    deleteProject,
    updateAdminPass
} = require("../controllers/project.controllers");
const AUTH_MW = require('../middlewares/auth.middleware');

ProjectRouter.get("/:id/all", AUTH_MW, getProjects); // Get user's projects
ProjectRouter.post("/add", AUTH_MW, addProject); // Add new project
ProjectRouter.put("/:id", AUTH_MW, updateProject); // Update project
ProjectRouter.get("/:id/:task_id", AUTH_MW, getTask); // Get task
ProjectRouter.delete("/:id/:stage_id/:task_id", AUTH_MW, deleteTask); // Delete task
ProjectRouter.delete("/delete/:id", AUTH_MW, deleteProject); // Delete project
ProjectRouter.put("/update-admin-pass", AUTH_MW, updateAdminPass); // Update admin pass code

// Export router
module.exports = ProjectRouter;