import express from "express";
import gitRouter from "./routers/git";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/git", gitRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
