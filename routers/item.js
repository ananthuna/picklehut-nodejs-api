const express = require('express')
const Item = require('../models/Item')
const Auth = require('../middleware/auth')
const router = new express.Router()
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage }).single('file')




// router.post('/imageUpload', async (req, res) => {
//     console.log(req.files.file);
//     console.log(req.body);
// })  

//create item
router.post('/addItem', Auth, async (req, res) => {
    console.log(req.files.file.name);
    const imageFile = req.files.file
    await upload(req,res,(err)=>{

    })
    // imageFile.mv(`${__dirname}/public/pickle.jpg`,
    //     (err) => {
    //         if (err) {
    //             return res.status(500).send(err)
    //         }
    //     }
    // )
    // let item = JSON.parse(req.body.item)
    //     console.log(item);
    // try {
    //     const newItem = new Item({
    //         ...item,
    //         owner: req.user._id,
    //         imageUrl: `/public/${req.files.file.name}`
    //     })
    //     await newItem.save()
    //     res.status(201).json(newItem)
    // } catch (err) {
    //     res.status(400).json(err.message)
    // }
})

//fetch item
router.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id })
        if (!item) {
            res.status(404).json({ error: "Item not found" })
        }
        res.status(200).json(item)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//fetch all items
router.get('/items', async (req, res) => {
    try {
        const items = await Item.find({})
        res.status(200).json(items)
    } catch (error) {
        res.status(400).json(error)
    }
})


//update item
router.patch('/items/:id', Auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'category', 'price', 'url', 'weight', 'off']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try {
        const item = await Item.findOne({ _id: req.params.id })
        if (!item) {
            return res.status(404).json({ error: 'invalid product selection' })
        }
        updates.forEach((update) => item[update] = req.body[update])
        await item.save()
        res.status(201).json(item)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//delete items
router.delete('/items/:id', Auth, async (req, res) => {
    try {
        const deletedItem = await Item.findOneAndDelete({ _id: req.params.id })
        if (!deletedItem) {
            res.status(404).json({ error: "Item not found" })
        }
        res.send(deletedItem)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

module.exports = router