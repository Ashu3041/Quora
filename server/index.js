import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';

//INITIALIZE
dotenv.config();
const app = express();

//MIDDLEWARES
app.use(cors());
app.use(express.json());

//IMPORT ROUTES
import authRoutes from "./routes/auth.routes.js";
import questionRoutes from "./routes/question.routes.js";
import answerRoutes from "./routes/answer.routes.js";


//ROUTES
app.use("/auth",authRoutes);
app.use("/questions", questionRoutes);
app.use("/answers",answerRoutes);

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ Mongo Error:", err));

//DEFAULT ROUTE
app.get("/", (req, res) => {
  res.json({ data: "Hello World!" });
});




//SERVER START
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));