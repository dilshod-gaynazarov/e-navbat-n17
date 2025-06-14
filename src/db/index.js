import { connect } from "mongoose";
import config from "../config/index.js";

export const connectDB = async () => {
    try {
        await connect(config.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.log(`Error on connecting to database: ${error}`);
    }
}
