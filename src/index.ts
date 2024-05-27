import express, { Request, Response,NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import "dotenv/config"
import connectDB from './config/database'
import adminRoutes from './routes/adminRoutes'
import commAdminRoutes from './routes/commAdminRoutes'
import { errorHandler } from './middlewares/errorHandler'
import { getLandingPage } from './controllers/landingPageControlller'
import authRoutes from './routes/authRoutes';
import ConnectCloudinary from './config/cloudinary';

const app=express()
connectDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(cors({
    origin:['http://localhost:5173'],
    credentials:true
}))
//cloudinary config
ConnectCloudinary()

app.use(cookieParser())

app.get('/api/landing-page',getLandingPage)

app.use('/api/auth', authRoutes)
app.use('/api/admin',adminRoutes);
app.use('/api/commAdmin',commAdminRoutes);



app.get("/",async(req:Request, res:Response)=>{
    res.json({message:"Hello!"})
})

// Error handling middleware
app.use(errorHandler)

app.listen(3000,()=>console.log("App listening on port 3000"))