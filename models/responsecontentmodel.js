const mongoose = require('mongoose');

const responsecontentmodel = new mongoose.Schema({
    studentId: {
        type: 'string',
        required: true,
    },
    week: {
        type: 'string',
        required: true,
    },
    teacherResponse:{
        type:'string',
        required: true,
    },
    studentResponse: {
        type: 'string',
        required: false,
    },
})

module.exports = mongoose.model('responsecontentmodel', responsecontentmodel)