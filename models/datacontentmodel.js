const mongoose = require('mongoose');

const datacontentmodel = new mongoose.Schema({
    week:{
        type: 'string',
        required: true,
    },
    content:{
        type:'object',
        required:true,
    }
})

module.exports = mongoose.model('datacontent', datacontentmodel)