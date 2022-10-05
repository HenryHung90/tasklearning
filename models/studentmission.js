const mongoose = require('mongoose');

const studentmission = new mongoose.Schema({
    session:{
        type:'string',
        required:true,
    },
    studentId:{
        type: 'string',
        required: true,
    },
    week: {
        type: 'string',
        required: true,
    },
    studentSelect: {
        type: 'object',
        required: true,
    },
})

module.exports = mongoose.model('studentmission', studentmission)