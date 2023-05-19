const {Board} = require("../models/board.model");
const { hash } = require("../utils/bcrypt.utils");
const ERROR_MESSAGES = require("../utils/errors");
const { validateBoard } = require("../validations/projects.validations");

// Get all user's projects
async function getProjects(req, res) {
    try {
        const {id} = req.params;
        const projects = await Board.find({}).select({__v: 0});
        const userProjects = projects.filter(project => project.members.find(member => member._id.toString() === id.toString()));
        return res.status(200).send(userProjects);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.GET_USER_PROJECTS_FAILED});
    }
}

// Add new project
async function addProject(req, res) {
    try {
        const newProject = req.body;
        const {admin_pass} = newProject;

        const {error} = validateBoard({title: newProject.title});
        
        if (error) {
            return res.status(400).send({error: ERROR_MESSAGES.CREATE_BOARD_FAILED});
        }

        const project = await new Board({
            ...newProject,
            admin_pass: await hash(admin_pass ? admin_pass : process.env.PROJECT_ADMIN_PASS)
        }).save();

        return res.status(201).send(project);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.ADD_NEW_PROJECT_FAILED});
    }
}

// Update project
async function updateProject(req, res) {
    try {
        const updatedProject = await Board.findOneAndUpdate(
            {_id: req.params.id},
            {...req.body}
        );
        return res.status(200).send(updatedProject);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.UPDATE_PROJECT_FAILED});
    }
}

async function updateAdminPass(req, res) {
    try {
        const {admin_pass, projectId} = req.body;

        console.log(admin_pass);////////////////remove

        const update = await Board.updateOne(
            {_id: projectId},
            {$set: {admin_pass: await hash(admin_pass)}},
            {new: true}
        );

        console.log(update);//////////////////remove

        return res.status(200).send('Successfully updated admin pass code');
    } catch (error) {
        res.status(400).send({error: 'Failed updating admin pass code'});
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
            return res.status(404).send({error: ERROR_MESSAGES.TASK_NOT_FOUND});
        } else return res.status(200).send(stageContainingTask[0].stage_tasks.filter(task => task._id.toString() === task_id));
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.TASK_NOT_FOUND});
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
        res.status(400).send({error: ERROR_MESSAGES.DELETE_TASK_FAILED});
    }
}

// Delete project
async function deleteProject(req, res) {
    try {
        const {id} = req.params;

        await Board.findByIdAndDelete(id);

        return res.status(200).send("Successfully deleted project");
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.DELETE_PROJECT_FAILED});
    }
}

// Exports
module.exports = {
    getProjects,
    addProject,
    updateProject,
    getTask,
    deleteTask,
    deleteProject,
    updateAdminPass
}