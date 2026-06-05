import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/Ekart`);
        console.log("MongoDB connected successfully !");
    } catch (error) {
        console.error(`MongoDB connection failed: ${error}`);
        throw error;
    }
}

export default connectDB;