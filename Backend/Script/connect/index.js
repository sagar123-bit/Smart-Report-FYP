import mongoose from "mongoose";

const connectToDB = async (url) => {
  if (!url) {
    console.log(url);
    
    throw new Error("❌ MONGODB_URL is missing");
  }

  try {
    await mongoose.connect(url);
    console.log("✅ Successfully connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
  }
};

export default connectToDB;