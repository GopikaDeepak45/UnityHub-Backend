import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
        console.log(`mongo db connected:${conn.connection.host}`);
    } catch (error) {
        console.log(`Error`);
        process.exit(1)
    }
}

export default connectDB