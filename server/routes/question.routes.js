import express from "express";
import Question from "../models/question.model.js";
import authenticateToken from "../utilities/authenticateToken.js";

const router = express.Router();

//ADD NEW QUESTION
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { title, description, tags } = req.body;


    const newQuestion = new Question({
      title,
      description,
      tags,
      authorId: req.user.userId,
    });


    //Saving Data in DB
    await newQuestion.save();

    //Response to Frontend
    res.status(201).json({ message: "Question Added Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error Adding Question", error });
  }
});

//GET ALL QUESTIONS
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("authorId", "username email")
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Question", error });
  }
});

//Single Question By QuestionID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "authorId",
      "username email"
    );
    if (!question)
      return res.status(404).json({ message: "Question Not Found" });

    //Response to DB
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Question", error });
  }
});

//Upvote a Question
router.post("/:id/upvote",authenticateToken,async(req,res)=>{
    try{
        const question = await Question.findById(req.params.id);
        if(!question) return res.status(404).json({message:"Question Not Found"});

        const userId = req.user.userId;
        const index = question.upvotes.indexOf(userId);

        if(index === -1){
            question.upvotes.push(userId);
        }else{
            question.upvotes.splice(index,1);
        }
        //Save in DB
        await question.save();
        
        //Response to Frontend
        res.json({message:"upvote Updated", totalUpvotes: question.upvotes.length});
    }catch(error){
        res.status(500).json({message:"Error updating Upvote",error});
    }
});

export default router;
