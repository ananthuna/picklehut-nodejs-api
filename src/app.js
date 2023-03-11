const express = require('express')
const userRouter = require('../routers/user')
const itemRouter = require('../routers/item')
const cartRouter = require('../routers/cart')
const wishlistRouter = require('../routers/wishlist')
const orderRouter = require('../routers/order')
const cors = require('cors')
require('../db/mongoose')
const app = express()
const path = require('path')
const fileUpload = require('express-fileupload')
const fs = require('fs')


// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
// }));
app.use(express.static('./build'));
app.use(express.static(path.resolve('./public')));

app.use(fileUpload());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const PORT = 3001

app.use('/api/user', userRouter)
app.use('/api/item', itemRouter)
app.use('/api/cart', cartRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/order', orderRouter)

// app.get('/route/*', (req, res) => {
//     console.log('/up');
//     res.sendFile(path.join(__dirname, 'build/index.html'), (err) => {
//         if (err) {

//             res.status(500).send(err)
//         }
//     })

// })


app.listen(PORT, () => {
    console.log("server is running on port:" + PORT);
})