const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema(
    {
        owner: {
            type: ObjectID,
            required: true,
            ref: 'User'
        },
        orders: [{
            amount: {
                type: Number,
                required: true
            },
            address: {
                type: ObjectID,
                required: true
            },
            items: [{
                itemId: {
                    type: ObjectID,
                    required: true,
                    ref: 'Item'
                },
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                },
                status: {
                    type: String
                }
            }]
        }]
    },
    {
        timestamps: true
    })

const Order = mongoose.model('Order', orderSchema)
module.exports = Order