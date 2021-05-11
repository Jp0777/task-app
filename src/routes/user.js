const express = require('express')
const router = new express.Router();
const User = require('../models/user')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../Emails/email')
const sendEmail = require('../Emails/sendinblue')
const multer = require('multer')
const avatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        const parts = file.originalname.split('.');
        if (parts[1] === 'jpg' || parts[1] === 'jpeg' || parts[1] === 'png')
            return cb(undefined, true);
        cb(new Error('Should be jpg,jpeg,png'))
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        // const token = await user.genrateAuthToken();
        await user.save();
        sendEmail(user.email, user.name, `Welcome ${user.name},You have succesfully signed up`)
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e);
    }


})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);

        const token = await user.genrateAuthToken();

        res.send({ user, token })
    } catch (e) {
        res.status(404).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {

    try {
        req.user.tokens = [];
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'email', 'password', 'age'];
    const isValid = updates.every((update) => {
        return validUpdates.includes(update)
    })
    if (!isValid)
        return res.status(400).send({ "error": "Not a valid field to be updated" })
    try {
        updates.forEach((update) => {
            return req.user[update] = req.body[update]
        })

        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.delete('/users/me', auth, async (req, res) => {
    try {

        const deletedTasks = await Task.deleteMany({ 'owner': req.user._id })
        const deleted = await User.findOneAndDelete({ _id: req.user._id });
        sendEmail(deleted.email, deleted.name, `Welcome ${deleted.name},You have succesfully deleted your account`)
        res.send(deleted)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({ 'error': err.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send()
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar)
            throw new Error()
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router;