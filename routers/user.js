const express = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const Auth = require('../middleware/auth')
const router = new express.Router()
const { ObjectId } = require('mongodb');




//signup
router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await User.findUsedEmails(req.body.email)
        console.log('1');
        await user.save()
        console.log('2');
        const { password, tokens, ...others } = user._doc
        console.log('before token');
        const token = await user.generateAuthToken()
        console.log('after token');
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
        console.log(req.body);
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
    console.log('logoutAll');
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

//Add delivery address
router.post('/address', Auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['address', 'village', 'city', 'state', 'pin', 'delivery']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        console.log('valid');
        return res.status(400).json({ error: 'invalid address' })
    }
    try {
        const user = await User.findOne({ _id: req.user._id })
        if (!user) {
            return res.status(404).json({ error: 'invalid user' })
        }
        user.address = user.address.concat({ ...req.body })
        await user.save()
        const { address, ...others } = user._doc
        res.status(201).json(address)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//get address
router.get('/address', Auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id })
        if (!user) return res.status(401).json('invalid user')
        // console.log(user._doc);
        const { address, number, firstName, ...others } = user._doc
        res.status(200).json({ address, number, firstName })
    } catch (err) {
        res.status(401).json(err.message)
    }
})

//delete address
router.delete('/address/', Auth, async (req, res) => {
    const userId = req.user._id
    const id = req.query.id
    try {
        const user = await User.findOne({ _id: userId })
        const addressIndex = user.address.findIndex((item) => item._id == id);
        user.address.splice(addressIndex, 1);
        await user.save()
        res.status(201).json(user.address)
    } catch (err) {
        res.status(401).json(err.message)
    }
})
module.exports = router