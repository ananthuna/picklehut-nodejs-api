const mongoose = require('mongoose');
console.log('db connecting.....');
mongoose.connect(process.env.MONGODB_URL, {
useNewUrlParser: true,
}).then(()=>console.log('database connected....'))
const db = mongoose.connection;
db.on("error", console  .error.bind(console, "MongoDB connection error:"));   