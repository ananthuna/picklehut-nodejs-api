const express = require('express')
const userRouter=require('../routers/user')
const itemRouter=require('../routers/item')
const cartRouter=require('../routers/cart')
const cors = require('cors')
require('../db/mongoose')
const app = express()
const path = require('path')
const fileUpload=require('express-fileupload')
const fs=require('fs')


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.static(path.resolve('./public')));
app.use(fileUpload());
app.use(express.json())
const port = process.env.PORT
app.use('/api/user',userRouter)
app.use('/api/item',itemRouter)
app.use('/api/cart',cartRouter)


app.listen(port,()=>{
    console.log("server is running on port:"+port);
})