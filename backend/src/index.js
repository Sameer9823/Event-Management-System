import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { app } from './app.js';

dotenv.config({
    path: "./.env"
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });

        app.on('error', (err) => {
            console.error('Server error:', err);
            throw err;
        });
    })
    .catch((e) => {
        console.log("MONGO db connection failed !!!", e);
    });
