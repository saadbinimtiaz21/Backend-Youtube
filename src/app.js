import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
// app.use is commonlly used for middlewares and configuration methods.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
// express.json is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.json({ limit: "1Mb"}))
// express.urlencoded is used to parse the incoming requests with urlencoded payloads.
app.use(express.urlencoded({extended: true , limit: "1Mb"}))
// express.static is a built-in middleware function in Express. It serves static files and is based on serve-static package
app.use(express.static("public"))
// cookies we use to store small pieces of data on the client side and send them back to the server with each request.
app.use(cookieParser())

// Routes import 
import userRouter from "./routes/user.routes.js"
app.use('/api/v1/users', userRouter )

// here we dont need to write /register because
// we have already specified /users in the app.use() method above
// so the complete path for registration becomes /users/register

//http://localhost:8000/api/v1/users/register

export {app};