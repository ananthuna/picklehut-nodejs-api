const express = require("express");
const Cart = require("../models/Cart");
const Item = require("../models/Item");
const Auth = require("../middleware/auth");
const router = new express.Router();

//get cart
router.get("/cartitems", Auth, async (req, res) => {
    const owner = req.user._id;
    try {
        const cart = await Cart.findOne({ owner });
        if (cart && cart.items.length > 0) {
            res.status(200).json(cart);
        } else {
            res.json("empty cart");
        }
    } catch (error) {
        res.status(500).send();
    }
});

//Add to cart
router.post("/cartitems", Auth, async (req, res) => {
    const owner = req.user._id;
    const { itemId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ owner });
        const item = await Item.findOne({ _id: itemId });
        if (!item) {
            res.status(404).json({ message: "item not found" });
            return;
        }
        const price = item.price;
        const name = item.name;
        //If cart already exists for user,
        if (cart) {
            const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
            //check if product exists or not
            if (itemIndex > -1) {
                let product = cart.items[itemIndex];
                product.quantity += quantity;
                cart.items[itemIndex] = product;
                cart.bill = cart.items.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0)
                await cart.save();
                res.status(200).json(cart);
            } else {
                cart.items.push({ itemId, name, quantity, price });
                cart.bill = cart.items.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0)
                await cart.save();
                res.status(200).json(cart);
            }
        } else {
            //no cart exists, create one
            const newCart = await Cart.create({
                owner,
                items: [{ itemId, name, quantity, price }],
                bill: quantity * price,
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});

//remove cart item
router.delete("/cartitems/", Auth, async (req, res) => {
    const owner = req.user._id;
    const itemId = req.query.itemId;
    try {
        let cart = await Cart.findOne({ owner });
        const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
        if (itemIndex > -1) {
            let item = cart.items[itemIndex];
            cart.bill -= item.quantity * item.price;
            if (cart.bill < 0) {
                cart.bill = 0
            }
            cart.items.splice(itemIndex, 1);
            cart.bill = cart.items.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0)
            cart = await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json("item not found");
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = router;