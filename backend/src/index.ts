import express from "express";
import gitRouter from "./routers/git.js";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";

dotenv.config();

const app = express();
app.use(express.json());

await connectDB();

app.use("/git", gitRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
