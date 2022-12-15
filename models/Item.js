const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const itemSchema = new mongoose.Schema(
    {
        owner: {
            type: ObjectID,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            default: 0
        },
        weight: {
            type: Number,
            required: true
        },
        offer: {
            type: Number
        },
        url: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    })

const Item = mongoose.model("Item", itemSchema)
module.exports = Item