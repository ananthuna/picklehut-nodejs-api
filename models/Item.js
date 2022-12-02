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
            type: Array,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        url:{
            type:String,
            required:true
        },
        weight:{
            type:String,
            required:true
        },
        off:{
            type:Number
        }
    },
    {
        timestamps: true
    })

const Item = mongoose.model("Item", itemSchema)
module.exports = Item