import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route'

dotenv.config();

mongoose.connect(process.env.Mongo).then(() => {
	console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})
;

const app = express();
app.listen(3000, () => {
	console.log("Server is runninggg");
});

app.use( '/user', userRouter );