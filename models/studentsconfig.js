const mongoose =require('mongoose');

const studentsConfig = new mongoose.Schema({
    studentSession:{
        type:'string',
        required:true,
    },
    studentId:{
        type:'string',
        required:true,
    },
    studentPassword:{
        type:'string',
        required:true,
    },
    studentName:{
        type:'string',
        required:true,
    },
    studentAccess:{
        type:'boolean',
        required:true,
    },
    studentDetail:{
        type:'array',
        required:false
    }
})

module.exports = mongoose.model('student',studentsConfig)