const express = require('express')
const userRouter=require('../routers/user')
const itemRouter=require('../routers/item')
const cartRouter=require('../routers/cart')
const cors = require('cors')
require('../db/mongoose')
const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json())
const port = process.env.PORT
app.use('/api/user',userRouter)
app.use('/api/item',itemRouter)
app.use('/api/cart',cartRouter)


app.listen(port,()=>{
    console.log("server is running on port:"+port);
})