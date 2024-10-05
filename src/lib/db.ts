import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('Already connected to database!');
        return;
    }

    try {
        const db = await mongoose.connect(uri || '', options);
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log('Database Connection failed', error);
        process.exit(1);
    }
}

export default dbConnect();
