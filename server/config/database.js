import mongoose from "mongoose";


const connectDb = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10, // Optimal pool size for MongoDB Atlas Free Tier (M0 limit: 500 connections)
            minPoolSize: 2,  // Keep warm connection ready for instantaneous query response
            serverSelectionTimeoutMS: 5000, // Fail fast if cluster is unreachable
            socketTimeoutMS: 45000, // Close idle sockets to avoid connection leaks
            family: 4, // Force IPv4 to prevent DNS resolution latency on cloud providers
        });
        console.log('MongoDB connection established:', conn.connection.host);
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1);
    }
};

export default connectDb;