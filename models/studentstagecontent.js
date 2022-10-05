const mongoose = require('mongoose');

const studentstagecontent = new mongoose.Schema({
    session: {
        type: 'string',
        required: true,
    },
    studentId: {
        type: 'string',
        required: true,
    },
    studentMission:{
        type:'object',
        required:false,
    },
    studentManage:{
        type:'object',
        required:false,
    },
    studentMinding:{
        type:'object',
        required:false,
    },
    studentResponse:{
        type:'object',
        required:false,
    }
})

module.exports = mongoose.model('studentstage', studentstagecontent)