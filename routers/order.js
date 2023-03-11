const express = require('express')
const Auth = require('../middleware/auth')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const User = require('../models/User')
const Razorpay = require('razorpay')
const Item = require('../models/Item')

const router = new express.Router()

var instance = new Razorpay({
    key_id: 'rzp_test_urWhsnXVh5JJ6f',
    key_secret: 'q4bKfgJJfcfZBh3F1o3JeqH2'
})

//get order
router.get('/orders', Auth, async (req, res) => {
    const owner = req.user._id;
    try {
        const order = await Order.find({ owner: owner })
        let items = []
        if (order.length === 0) return res.status(200).json(items)
        order[0].orders.forEach((item) => {
            item.items.forEach((item) => {
                items = [...items, item]
            })
        })
        res.status(200).json(items)
    } catch (error) {
        console.log('500');
        res.status(500).json(error.message)
    }
})

//order summary
router.get('/placeOrder', Auth, async (req, res) => {
    const owner = req.user._id
    try {
        const order = await Order.findOne({ owner })
        const user = await User.findOne({ _id: owner })
        if (!order) return res.status(401).json('invalid order')
        let lastOrderIndex
        order.orders.length <= 0 ? lastOrderIndex = 0 : lastOrderIndex = order.orders.length - 1
        // console.log(lastOrderIndex);
        const bill = order.orders[lastOrderIndex].amount
        const addressId = order.orders[lastOrderIndex].address
        let address
        user.address.forEach((item) => {
            if (item._id.toString() === addressId.toString()) address = item
        })
        const items = order.orders[lastOrderIndex].items
        const orderId = order.orders[lastOrderIndex]._id
        res.status(200).json({ bill, address, items, orderId })
    } catch (err) {
        res.status(401).json(err.message)
    }
})

//place Order
router.post('/placeOrder', Auth, async (req, res) => {
    let orders =
    {
        amount: req.body.amount,
        address: req.body.address,
        items: []
    }
    const owner = req.user._id
    req.body.items.forEach((item) => {
        orders.items = [...orders.items, {
            itemId: item.itemId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            url: item.url,
            status: 'payment pending'
        }]
    })

    try {
        const order = await Order.findOne({ owner })
        const cart = await Cart.findOne({ owner })
        if (!cart) {
            console.log('cart not found');
            res.status(401).json('cart not found')
        }
        if (!order) {
            const order = new Order({
                owner,
                orders: [orders]
            })
            // cart.items = []
            // cart.bill = 0
            await order.save()
            // await cart.save()
            return res.status(201).json(order)
        } else {
            order.orders = [...order.orders, orders]
            // cart.items = []
            // cart.bill = 0
            await order.save()
            // await cart.save()
            // console.log(order);
            return res.status(201).json(order)

        }
    } catch (err) {
        console.log(err.message);
        res.status(401).json(err.message)
    }
})


//checkout
router.post('/checkout', Auth, async (req, res) => {
    const paymentMethod = req.body.payment
    const owner = req.user._id
    const orderId = req.body.orderId

    try {
        const order = await Order.findOne({ owner })
        const cart = await Cart.findOne({ owner })
        if (!order) return res.status(401).json({ message: 'invalid order' })
        //payment cash on delivery
        if (paymentMethod === 'COD') {
            order.orders.forEach((item) => {
                if (item._id.toString() === orderId) {
                    item.items.forEach((items) => {
                        items.status = 'order placed'
                    })
                }
            })
            if (cart) {
                cart.items = []
                cart.bill = 0
            }
            await order.save()
            await cart.save()
            return res.status(200).json({ order: 'placed' })
        } else {                                            //online payment
            order.orders.forEach((item) => {
                if (item._id.toString() === orderId) {
                    instance.orders.create({
                        amount: item.amount * 100,
                        currency: "INR",
                        receipt: orderId,
                        notes: {
                            key1: "value3",
                            key2: "value2"
                        }
                    }, (err, order) => {
                        return res.status(200).json({ order })
                    })
                }
            })

        }

    } catch (err) {
        // console.log(err);
        res.status(401).json(err.message)
    }

})

router.post('/verify-payment', Auth, async (req, res) => {
    const owner = req.user._id
    const razorpay_payment_id = req.body.res.razorpay_payment_id
    const razorpay_order_id = req.body.res.razorpay_order_id
    const razorpay_signature = req.body.res.razorpay_signature
    const orderId = req.body.orderId
    try {
        const order = await Order.findOne({ owner })
        const cart = await Cart.findOne({ owner })
        if (!order) return res.status(401).json({ message: 'invalid order' })
        order.orders.forEach((item) => {
            if (item._id.toString() === orderId) {
                item.items.forEach((items) => {
                    items.status = 'order placed'
                })
            }
        })
        if (cart) {
            cart.items = []
            cart.bill = 0
        }
        await cart.save()
        await order.save()
        res.status(200).send({ msg: 'order placed' })
    } catch (err) {
        res.status(401).json(err.message)
    }
})
module.exports = router