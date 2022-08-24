const mongoose = require('mongoose');

const studentminding = new mongoose.Schema({
    studentId: {
        type: 'string',
        required: true,
    },
    week: {
        type: 'string',
        required: true,
    },
    studentMinding: {
        type: 'object',
        required: true,
    },
    studentFixing:{
        type: 'string',
        required: false
    },
    studentRanking:{
        type: 'string',
        required:false,
    }
})

module.exports = mongoose.model('studentminding', studentminding)