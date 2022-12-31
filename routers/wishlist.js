const express = require('express')
const Auth = require('../middleware/auth')
const Wishlist = require('../models/Wishlist')
const Item = require('../models/Item')

const router = new express.Router()

//get wishlist
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
                    itemId,
                    wish: true
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
                    item.wish ? item.wish = false : item.wish = true
                }
            })
            if (!Item) {
                wishlist.items = [...wishlist.items, { itemId, wish: true }]
            }
            await wishlist.save()
            return res.status(201).json(wishlist)
        }
    } catch (err) {
        console.log(err.message);
        res.status(401).json(err.message)
    }
})
module.exports = router