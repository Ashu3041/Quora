import express from "express";
import Answer from "../models/answer.model.js";
import Question from "../models/question.model.js";
import authenticateToken from "../utilities/authenticateToken.js";

const router = express.Router();

//POST- Add new answer
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const newAnswer = new Answer({
      questionId,
      userId: req.user.id,
      content,
    });

    await newAnswer.save();

    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: newAnswer._id },
    });

    res.status(201).json({ message: "Answer Added Successfully", newAnswer });
  } catch (error) {
    res.status(500).json({ message: "Error Adding Notes" });
  }
});

// Get All Answer For a Question
router.get("/:questionId", async (req, res) => {
  try {
    const answer = await Answer.find({ questionId: req.params.questionId })
      .populate("authorId", "username email")
      .sort({ createdAt: -1 });

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching answers", error });
  }
});

// PATCH - Upvote an answer
router.patch("/:id/upvote", authenticateToken, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const userId = req.user.userId;
    console.log(userId);

    // Remove from downvote if exists
    answer.downvote = answer.downvote.filter((id) => id.toString() !== userId);

    // Add to upvote if not already added
    if (!answer.upvote.includes(userId)) {
      answer.upvote.push(userId);
    }

    await answer.save();
    res.json({ message: "Upvoted successfully", answer });
  } catch (error) {
    res.status(500).json({ message: "Error upvoting", error });
  }
});

// PATCH - Downvote an answer
router.patch("/:id/downvote", authenticateToken, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const userId = req.user.userId;

    // Remove from upvote if exists
    answer.upvote = answer.upvote.filter((id) => id.toString() !== userId);

    // Add to downvote if not already added
    if (!answer.downvote.includes(userId)) {
      answer.downvote.push(userId);
    }

    await answer.save();
    res.json({ message: "Downvoted successfully", answer });
  } catch (error) {
    res.status(500).json({ message: "Error downvoting", error });
  }
});

export default router;
