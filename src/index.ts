import express from 'express'
import cors from 'cors'

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get("/",async(req,res)=>{
    res.json({
        Message:"Succesfull"
    })
})

app.listen(3000,()=>console.log("App listening on port 3000"))