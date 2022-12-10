const express = require('express')
const Auth = require('../middleware/auth')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const User = require('../models/User')

const router = new express.Router()


//get order
router.get('/orders', Auth, async (req, res) => {
    const owner = req.user._id;
    try {
        const order = await Order.find({ owner: owner }).sort({ date: -1 });
        if (!order) return res.status(500).json()
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


//checkout
router.get('/order/checkout', (req, res) => {

})
