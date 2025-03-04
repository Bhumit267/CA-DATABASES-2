const express = require("express");
const mongoose = require("mongoose")
require("dotenv").config()
const port = process.env.PORT 
const MONGO_URI = process.env.MONGO_URI
const app = express()

mongoose.connect(MONGO_URI)
    .then(()=>{
        console.log("Connected successfully")
    }).catch((error)=>{
        console.error("Error:",error)
    })

app.use(express.json())

const bookSchema = new mongoose.Schema({
    title : {
        type:String,
        required : true
    },
    author:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    publishedYear:{
        type: Number
    },
    availableCopies:{
        type:Number,
        required:true
    },
    borrowedBy:{
        type:[String],
    }


})

const books = mongoose.model("book",bookSchema)


app.post("/book",async(req,res)=>{
    try {
        const book = new books(req.json)
        await book.Save()
        if(!book){
            return res.status(400).json("missing required field")
        }
        res.status(200).json("Book posted");
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
})

app.get("/book", async(req,res)=>{
    try {
        const book = await books.find()
        if(!book){
            return res.status(404).json("Book not found")
        }
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({message:"Interval server error"})       
    }
})

app.put('/book/:id', async(req,res)=>{
    try{
        const bookid = await books.findByIdAndUpdate(req.params.id, req.body , {new:true})
        if(!bookid){
            return res.status(404).send("Book not found")
        }
        res.status(400).send(bookid)
    } catch(error){
        res.status(500).json({message:"Internal server error"})
    }
})

app.delete('/book/:id', async(req,res)=>{
    try {
        const bookid = await books.findByIdAndDelete(req.params.id);
        if(!bookid){
            return res.status(404).send("book not found")
        }
        res.status(200).send("book deleted")
    } catch (error) {
        res.status(500).json({message: "Internal server error " })      
    }
})




app.listen(port,()=>{
    console.log(`Server is running on : http://localhost:${port}`)
})
