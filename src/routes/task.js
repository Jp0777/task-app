const express = require('express')
const router = new express.Router();
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id });

    try {
        await task.save();
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e);
    }

})



router.get('/tasks', auth, async (req, res) => {
    try {
        const status = {}
        const sort = {};

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }


        if (req.query.completed) {
            status.completed = req.query.completed === 'true' ? 'true' : 'false';
            const tasks = await Task.find({
                owner: req.user._id, 'completed': status.completed
            }).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sort)
            res.send(tasks)
            return;
        }


        const tasks = await Task.find({
            owner: req.user._id
        }).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sort)
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task)
            return res.status(404).send({ 'error': 'No task found related to ur account' });
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})



router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const validUpdates = ['description', 'completed']
    const isValid = updates.every((update) => {
        return validUpdates.includes(update)
    })

    if (!isValid)
        return res.status(400).send({ "error": "Not a valid field to be updated" })

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task)
            return res.status(404).send()

        updates.forEach((update) => {
            return task[update] = req.body[update]
        })

        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!deleted)
            return res.status(404).send()
        res.send(deleted)
    } catch (e) {
        res.status(400).send(e)
    }
})




module.exports = router;