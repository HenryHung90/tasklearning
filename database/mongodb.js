//Mongodb
const mongoose = require('mongoose');

module.exports = mongoose.connect("mongodb+srv://Henry:yzuic1082020@task.o3vc0w3.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
