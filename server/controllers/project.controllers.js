const {Board} = require("../models/board.model");
const { hash } = require("../utils/bcrypt.utils");
const { validateBoard } = require("../validations/projects.validations");

// Get all user's projects
async function getProjects(req, res) {
    try {
        const {id} = req.params;
        const projects = await Board.find({});
        const userProjects = projects.filter(project => project.members.find(member => member._id.toString() === id.toString()));
        return res.status(200).send(userProjects);
    } catch (error) {
        res.status(400).send({error: "Failed to get projects"});
        throw new Error(error);
    }
}

// Add new project
async function addProject(req, res) {
    try {
        const newProject = req.body;

        const {error} = validateBoard({title: newProject.title});
        
        if (error) {
            return res.status(400).send({error: "Could not create board"});
        }

        const project = await new Board(newProject).save();

        return res.status(201).send(project);
    } catch (error) {
        res.status(400).send({error: "Failed to add project"});
        throw new Error(error);
    }
}

// Update project
async function updateProject(req, res) {
    try {
        const updatedProject = await Board.findOneAndUpdate(
            {_id: req.params.id},
            {...req.body, admin_pass: await hash(req.body.admin_pass)}
        );
        return res.status(200).send(updatedProject);
    } catch (error) {
        console.log(error)
        res.status(400).send({error: "Update failed"});
        throw new Error(error);
    }
}

// Get task
async function getTask(req, res) {
    try {
        const {id: projectID, task_id} = req.params;
        const project = await Board.findOne({_id: projectID});
        const stageContainingTask = project.stages.filter(stage => {
            return stage.stage_tasks.find(task => task._id.toString() === task_id.toString());
        })
        if (!stageContainingTask || stageContainingTask === undefined) {
            return res.status(404).send({error: "Task not found"});
        } else return res.status(200).send(stageContainingTask[0].stage_tasks.filter(task => task._id.toString() === task_id));
    } catch (error) {
        res.status(400).send({error: "Task not found"});
        throw new Error(error);
    }
}

// Delete task
async function deleteTask(req, res) {
    try {
        const {id: projectID, stage_id, task_id} = req.params;
        await Board.updateOne(
            {_id: projectID, 'stages._id': stage_id},
            {$pull: {'stages.$.stage_tasks': {_id: task_id}}}
        );
        return res.status(200).send("Successfully deleted task");
    } catch (error) {
        res.status(400).send({error: "Failed deleting task"});
        throw new Error(error);
    }
}

// Delete project
async function deleteProject(req, res) {
    try {
        const {id} = req.params;
        await Board.findByIdAndDelete(id);
        return res.status(200).send("Successfully deleted project");
    } catch (error) {
        res.status(400).send({error: "Failed deleting project"});
        throw new Error(error);
    }
}

// Exports
module.exports = {
    getProjects,
    addProject,
    updateProject,
    getTask,
    deleteTask,
    deleteProject
}