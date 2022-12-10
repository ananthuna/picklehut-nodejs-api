const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema(
    {
        owner: {
            type: ObjectID,
            required: true,
            ref: 'User'
        },
        items: [{
            itemId: {
                type: ObjectID,
                required: true,
                ref: 'Item'
            },
            status: {
                type: String
            }
        }]
    },
    {
        timestamps: true
    })

const Order = mongoose.model('Order', orderSchema)
module.exports = Order