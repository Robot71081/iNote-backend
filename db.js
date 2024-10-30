const mongoose=require('mongoose');
const mongoURI="mongodb+srv://sandesh:sandesh@sandesh.ul5bk.mongodb.net"

const connectToMongo=()=>{
    mongoose.connect(mongoURI);
    console.log("connected to mongo");
}

module.exports =connectToMongo