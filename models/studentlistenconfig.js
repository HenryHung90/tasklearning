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
//Monitor
/**
 * [{time:string,operation:string,item:string,description:string}]
 * time 時間=>最小單位:秒
 * operation 操作類型=>進入 開啟 返回
 * item 觸發物品=>名稱
 * description 描述=> 描述完整操作 
 */

module.exports = mongoose.model('studentlistenconfig', studentlistenconfig)