const mongoose = require('mongoose');

const datacontentmodel = new mongoose.Schema({
    session:{
        type:'string',
        required:true,
    },
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