const {Board} = require("../models");

async function getProjects(req, res) {
    try {
        const {id} = req.params;
        const projects = await Board.find({});
        const userProjects = projects.filter(project => project.members.find(member => member._id === id));
        if (!userProjects.length) return res.status(404).send({error: "No projects found"});
        res.status(200).send(userProjects);
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
        const stageContainingTask = project.stages.filter(stage => {
            return stage.stage_tasks.find(task => task._id.toString() === task_id.toString());
        })
        if (!stageContainingTask || stageContainingTask === undefined) {
            res.status(404).send({error: "Task not found"});
        } else return res.status(200).send(stageContainingTask[0].stage_tasks.filter(task => task._id.toString() === task_id));
    } catch (error) {
        res.status(400).send({error: "Task not found"});
    }
}

async function deleteTask(req, res) {
    try {
        const {id: projectID, stage_id, task_id} = req.params;
        const project = await Board.findOne({_id: projectID});
        res.status(200).send();
    } catch (error) {
        res.status(400).send({error: "Failed deleting task"});
    }
}

module.exports = {
    getProjects,
    addProject,
    updateProject,
    getTask,
    deleteTask
}