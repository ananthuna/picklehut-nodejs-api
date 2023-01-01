const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const wishListSchema = new mongoose.Schema(
    {
        owner: {
            type: ObjectID,
            required: true
        },
        items: [{
            itemId: {
                type: ObjectID,
                required: true
            }
        }]
    },
    {
        timestamps: true
    })

const Wishlist = mongoose.model('Wishlist', wishListSchema)
module.exports = Wishlist