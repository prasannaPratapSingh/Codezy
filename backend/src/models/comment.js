const mongoose=require('mongoose');
const {Schema}=mongoose;
const commentSchema=new Schema({
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'problem',
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    content:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true});

const Comment=new mongoose.model('comment',commentSchema);
module.exports=Comment;