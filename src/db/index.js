import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Connection Error ", error);
  }
};

export default connectDB;
