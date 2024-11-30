import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


if(!process.env.MONGODB_URI){
    throw new error('Please provide the MONGODB_URI in .env file');
    // console.error('Please set MONGODB_URI');
    // process.exit(1);
}

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected DB.')
    }catch(error){
        console.log('mongodb connection error', error);
        process.exit(1);
    }
}

export default connectDB;