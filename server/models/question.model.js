import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Question", questionSchema);
