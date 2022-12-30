const express = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const Auth = require('../middleware/auth')
const router = new express.Router()




//signup
router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await User.findUsedEmails(req.body.email)
        await user.save()
        const { password, tokens, ...others } = user._doc
        const token = await user.generateAuthToken()
        res.status(201).json({ ...others, token })
    } catch (err) {
        if (err.message === 'already used email') {
            res.status(200).json(err.message)
        } else {
            res.status(400).json(err.message)
        }
    }
})

//logging in
router.post('/login', async (req, res) => {
    let token = req.body.token
    var decodedToken = jwt.decode(token, { complete: true });
    var dateNow = new Date();

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const { password, tokens, ...others } = user._doc
        if (!token) {
            token = await user.generateAuthToken()
        } else {
            if (decodedToken.exp < dateNow.getTime()) {
                token = await user.generateAuthToken()
            }
        }
        res.status(201).json({ ...others, token })
    } catch (err) {
        switch (err.message) {
            case 'no account':
                res.status(200).json({ err: 'No account' })
                break;
            case 'Wrong password':
                res.status(200).json({ err: 'invalid password' })
                break;
            default:
                res.status(400).json(err.message)
        }
    }
})

//logout
router.post('/logout', Auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('logout...')
    } catch (error) {
        res.status(500).send()
    }
})

//logout all
router.post('/logoutAll', Auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//profile info
router.get('/profileinfo', Auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id })
        const { password, tokens, ...others } = user._doc
        res.status(200).json({ ...others })
    } catch (err) {
        res.status(401).json({ error: err.message })

    }
})

//profile update
router.post('/updateProfile', Auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'lastName', 'email', 'number']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try {
        const user = await User.findOne({ _id: req.user._id })
        if (!user) {
            return res.status(404).json({ error: 'invalid product selection' })
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        const { password, tokens, ...others } = user._doc
        res.status(201).json({ ...others })
    } catch (error) {
        res.status(400).json(error.message)
    }
})
module.exports = router