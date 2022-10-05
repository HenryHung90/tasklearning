const mongoose = require('mongoose');

const studentmanage = new mongoose.Schema({
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
    studentManage: {
        type: 'object',
        required: true,
    },
})

module.exports = mongoose.model('studentmanage', studentmanage)