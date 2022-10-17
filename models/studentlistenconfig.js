const mongoose = require('mongoose');

const studentlistenconfig = new mongoose.Schema({
    session: {
        type: 'string',
        required: true,
    },
    studentId:{
        type: 'string',
        required:true,
    },
    studentMonitor:{
        type: 'array',
        required:true,
    }
})

module.exports = mongoose.model('studentlistenconfig', studentlistenconfig)