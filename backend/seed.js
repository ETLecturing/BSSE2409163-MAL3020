import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Project from "./models/projectModel.js";
import Task from "./models/taskModels.js";
import bcrypt from "bcryptjs";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    const users = [
      { name: "Alice", username: "alice", password: await bcrypt.hash("123456", 10) },
      { name: "Bob", username: "bob", password: await bcrypt.hash("123456", 10) },
      { name: "Charlie", username: "charlie", password: await bcrypt.hash("123456", 10) },
    ];
    const createdUsers = await User.insertMany(users);

    const projects = [
      {
        name: "Website Redesign",
        description: "Landing page redesign",
        team: [createdUsers[0]._id, createdUsers[1]._id],
        createdBy: createdUsers[0]._id,
      },
      {
        name: "Mobile App",
        description: "New iOS/Android app",
        team: [createdUsers[1]._id, createdUsers[2]._id],
        createdBy: createdUsers[1]._id,
      },
    ];
    const createdProjects = await Project.insertMany(projects);

    const tasks = [
      {
        title: "Design Header",
        description: "Responsive header",
        status: "Ongoing",
        projectId: createdProjects[0]._id,
        assignedTo: [createdUsers[0]._id],
        createdBy: createdUsers[0]._id,
      },
      {
        title: "Implement Footer",
        description: "Footer component",
        status: "Pending",
        projectId: createdProjects[0]._id,
        assignedTo: [createdUsers[1]._id],
        createdBy: createdUsers[0]._id,
      },
      {
        title: "Login Screen",
        description: "iOS login",
        status: "Pending",
        projectId: createdProjects[1]._id,
        assignedTo: [createdUsers[2]._id],
        createdBy: createdUsers[1]._id,
      },
    ];

    await Task.insertMany(tasks);

    console.log("Seed data added successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(seedData);
