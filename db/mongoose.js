const mongoose = require('mongoose');
const MONGODB_URL = "mongodb+srv://ananthuna:RGAv0pXqFQ34CPZZ@cluster0.ljrkqe0.mongodb.net/picklehut?retryWrites=true&w=majority"
console.log('db connecting.....');
mongoose.connect(MONGODB_URL, {
useNewUrlParser: true,
}).then(()=>console.log('database connected....'))
const db = mongoose.connection;
db.on("error123", console  .error.bind(console, "MongoDB connection error:"));   