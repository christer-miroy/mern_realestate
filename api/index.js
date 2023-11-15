import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose
    .connect(process.env.MONGODB_SECRET)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })
;

const app = express();

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})