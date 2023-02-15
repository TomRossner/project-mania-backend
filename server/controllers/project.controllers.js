const {Board} = require("../models");
const {ObjectId} = require("mongodb");

async function getProjects(req, res) {
    try {
        const projects = await Board.find({});
        if (!projects.length) return res.status(404).send({error: "No projects found"});
        res.status(200).send(projects);
    } catch (error) {
        res.status(400).send({error: "Failed to get projects"});
    }
}

async function addProject(req, res) {
    try {
        const newProject = req.body;
        const project = await new Board(newProject).save();
        res.status(200).send(project);
    } catch (error) {
        res.status(400).send({error: "Failed to add project"});
    }
}

async function updateProject(req, res) {
    try {
        const updatedProject = await Board.findOneAndUpdate({_id: req.params.id}, req.body);
        res.status(200).send(updatedProject);
    } catch (error) {
        res.status(400).send({error: "Update failed"});
    }
}

async function getTask(req, res) {
    try {
        const {id: projectID, task_id} = req.params;
        const project = await Board.findOne({_id: projectID});
        const tasks = project.stages.map(stage => {
            return stage.stage_tasks.find(task => task._id === task_id);
        })
        const taskToReturn = tasks.filter(task => task !== undefined);
        res.status(200).send(taskToReturn);
    } catch (error) {
        res.status(400).send({error: "Task not found"});
    }
}

module.exports = {
    getProjects,
    addProject,
    updateProject,
    getTask
}