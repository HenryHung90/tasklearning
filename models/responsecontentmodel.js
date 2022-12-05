const mongoose = require('mongoose');

const responsecontentmodel = new mongoose.Schema({
    session: {
        type: 'string',
        required: true,
    },
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
    teacherResponseTime:{
        type:'string',
        required:false,
    },
    studentResponse: {
        type: 'string',
        required: false,
    },
    studentResponseTime: {
        type: 'string',
        required: false,
    },
})

module.exports = mongoose.model('responsecontentmodel', responsecontentmodel)