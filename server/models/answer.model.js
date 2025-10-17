import mongoose from "mongoose";


const answerSchema = new mongoose.Schema({
    questionId:{
        type: mongoose.Schema.Types.ObjectId, ref:"Question"
    },
    authorId:{
        type: mongoose.Schema.Types.ObjectId, ref:"User"
    },
    content : String,
    upvote: [{type:mongoose.Schema.Types.ObjectId , ref:"User"}],
    downvote:[{type:mongoose.Schema.Types.ObjectId , ref:"User"}],
    createdAt: {type:Date , default:Date.now},
});

export default mongoose.model("Answer", answerSchema);