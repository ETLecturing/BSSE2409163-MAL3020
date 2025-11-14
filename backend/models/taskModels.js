import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ["Pending", "Ongoing", "Completed"], 
    default: "Pending" 
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });


export default mongoose.model("Task", taskSchema);
