import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  pinnedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project", index: true }],
  pinnedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task", index: true }],
}, { timestamps: true });


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
