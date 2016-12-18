//================================================================================
// load what we need    ==========================================================
//================================================================================
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//================================================================================
//Define the Schema for comments =================================================
//================================================================================
let commentSchema = mongoose.Schema({
    created:{
        type:Date,
        default: Date.now
    },
    title:{
        type:String,
        default:'',
        trim: true,
        required:'Title cannot be blank'
    },
    content:{
        type:String,
        default:'',
        trim: true
    },
    user:{
        type:Schema.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model('Comments', commentSchema);