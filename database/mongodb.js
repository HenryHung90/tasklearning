//Mongodb
const mongoose = require('mongoose');
module.exports = mongoose.connect("mongodb://Henry:12345@ac-nvuer8j-shard-00-00.o3vc0w3.mongodb.net:27017,ac-nvuer8j-shard-00-01.o3vc0w3.mongodb.net:27017,ac-nvuer8j-shard-00-02.o3vc0w3.mongodb.net:27017/?ssl=true&replicaSet=atlas-d45mm5-shard-0&authSource=admin&retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
