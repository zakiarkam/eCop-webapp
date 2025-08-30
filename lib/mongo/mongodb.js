import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    process.exit(1); // Exit process on failure
  }
};

export default connectToDatabase;
