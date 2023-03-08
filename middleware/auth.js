const jwt = require('jsonwebtoken')
const User = require('../models/User')
const JWT_SECRET = 'ecommercewebapi'

const auth = async (req, res, next) => {
    try {
        // console.log(req)
        const token = req.header('Authorization').replace('Bearer ', '')
        // console.log('auth');
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        // console.log(token);
        if (!user) {
            throw new Error('No autherized user')
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({ error: "Authentication required" })
    }
}
module.exports = auth