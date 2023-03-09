const express = require('express')
const Auth = require('../middleware/auth')
const Wishlist = require('../models/Wishlist')
const Item = require('../models/Item')

const router = new express.Router()

//get wishlist for icon
router.get('/list', Auth, async (req, res) => {
    const owner = req.user._id
    try {
        const wishlist = await Wishlist.findOne({ owner })
        if (wishlist) return res.status(200).json(wishlist)
    } catch (err) {
        res.status(401).json(err.message)
    }
})

//add to wishlist
router.post('/list', Auth, async (req, res) => {
    console.log("addto wishlist");
    const owner = req.user._id
    const itemId = req.body.itemId
    try {
        const wishlist = await Wishlist.findOne({ owner });
        const item = await Item.findOne({ _id: itemId });
        if (!item) {
            return res.status(404).json({ message: "item not found" });
        }
        if (!wishlist) {
            const wishlist = new Wishlist({
                owner,
                items: [{
                    itemId
                }]
            })
            await wishlist.save()
            return res.status(201).json(wishlist)
        } else {
            const wishlist = await Wishlist.findOne({ owner })
            let Item
            wishlist.items.forEach((item) => {
                if (item.itemId == itemId) {
                    Item = item
                    const itemIndex = wishlist.items.findIndex((item) => item.itemId == itemId);
                    wishlist.items.splice(itemIndex, 1);
                }
            })
            if (!Item) {
                wishlist.items = [...wishlist.items, { itemId }]
            }
            await wishlist.save()
            return res.status(201).json(wishlist)
        }
    } catch (err) {
        console.log(err.message);
        res.status(401).json(err.message)
    }
})

//get wishlist for page
router.get('/wishlistitems', Auth, async (req, res) => {
    const owner = req.user._id
    let arry = []
    try {
        const wishlist = await Wishlist.findOne({ owner })
        if (!wishlist) {
            return res.status(401).json('invalid selection')
        } else {
            wishlist.items.forEach(async (item) => {
                const Items = await Item.findOne({ _id: item.itemId })
                arry = [...arry, Items]
                wishlist.items.length === arry.length && res.status(200).json(arry)
            })
        }
    } catch (err) {
        res.status(401).json(err.message)
    }
})
module.exports = router