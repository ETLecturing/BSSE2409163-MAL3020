import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // optional, not indexed
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
}, { timestamps: true });


export default mongoose.model("Project", projectSchema);
