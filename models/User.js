const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'ecommercewebapi'


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password musn\'t contain password')
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    number: {
        type: Number
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    address: [{
        address: {
            type: String
        },
        village:{
            type: String
        },
        city:{
            type: String
        },
        state:{
            type: String
        },
        pin:{
            type: String
        },
        delivery:{
            type: String
        }
    }]
},
    {
        timestams: true
    })


//Generate auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() },JWT_SECRET, { expiresIn: '24h' })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//used email check in signup
userSchema.statics.findUsedEmails = async (email) => {
    const user = await User.findOne({ email })
    if (user) {
        throw new Error('already used email')
    }
}

//login in users
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('no account')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Wrong password')
    }

    return user
}

//Hash plain password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
const User = mongoose.model("User", userSchema)
module.exports = User