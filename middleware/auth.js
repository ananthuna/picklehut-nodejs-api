const jwt = require('jsonwebtoken')
const User = require('../models/User')
const JWT_SECRET = 'ecommercewebapi'

const auth = async (req, res, next) => {
    // console.log(req.body);
    try {
        // console.log('start')
        const token = req.header('Authorization').replace('Bearer ', '')
        // console.log('sec');
        const decoded = jwt.verify(token, JWT_SECRET)
        // console.log('tok');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        // console.log('user');
        if (!user) {
            throw new Error('No autherized user')
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        console.log('error 401 auth');
        res.status(401).send({ error: "Authentication required" })
    }
}
module.exports = auth