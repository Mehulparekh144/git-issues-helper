import { Schema, model } from "mongoose";

const fileSchema = new Schema({
  summary: {
    type: String,
  },
  filePath: {
    type: String,
  },
  vector: {
    type: [Number],
  },
});

const issueSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  summary: {
    type: String,
  },
  vector: {
    type: [Number],
  },
  ai_answer: {
    type: String,
  },
});

const gitSchema = new Schema({
  repoURL: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  files: {
    type: [fileSchema],
  },
  issues: {
    type: [issueSchema],
  },
});

export const Git = model("Git", gitSchema);
