const mongoose = require('mongoose');

const studentlearningcontent = new mongoose.Schema({
    session: {
        type: 'string',
        required: true,
    },
    studentId:{
        type: 'string',
        required:true,
    },
    learningTime:{
        type: 'object',
        required:true,
    }
})
module.exports = mongoose.model('studentlearningcontent', studentlearningcontent)