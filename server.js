const express = require("express");
const mongoose = require("mongoose");
const contactModel = require("./models/contact");

let app = express();
app.use(express.json());
app.use("/", express.static("public"));

let port = process.env.PORT || 3000;

const mongo_url = process.env.MONGODB_URL;
const mongo_user = process.env.MONGODB_USER;
const mongo_password = process.env.MONGODB_PASSWORD;

const url = `mongodb+srv://${mongo_user}:${mongo_password}@${mongo_url}/contactdata?retryWrites=true&w=majority`;

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(url);
        console.log("Connected to MongoDB on: "+conn.connection.host);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

app.get("/api/contact",function(req,res){
    contactModel.find().then(function(contact){
        return res.status(200).json(contact);
    }).catch(function(error){
        console.log("Database returned an error ", error);
        return res.status(500).json({"Message":"Internal server error"});
    })
})

app.post("/api/contact",function(req,res){
    if(!req.body){
        return res.status(400).json({"Message":"Bad request"});
    }
    if(!req.body.firstname){
        return res.status(400).json({"Message":"Bad request"});
    }
    let contact = new contactModel({
        "firstname":req.body.firstname,
        "lastname":req.body.lastname,
        "email":req.body.email,
        "phone":req.body.phone
    })
    contact.save().then(function(contact){
        return res.status(201).json(contact);
    }).catch(function(error){
        console.log("Database returned an error.",error);
        return res.status(500).json({"Message":"Internal server error"})
    })
})

app.delete("/api/contact/:id",function(req,res){
    contactModel.deleteOne({"_id":req.params.id}).then(function(){
        return res.status(200).json({"Message":"Success"})
    }).catch(function(error){
        console.log("Database returned an error.",error);
        return res.status(500).json({"Message":"Internal server error"})
    })
})

app.put("/api/contact/:id", function(req,res){
    if(!req.body){
        return res.status(400).json({"Message":"Bad request"});
    }
    if(!req.body.firstname){
        return res.status(400).json({"Message":"Bad request"});
    }
    let contact = {
        "firstname":req.body.firstname,
        "lastname":req.body.lastname,
        "email":req.body.email,
        "phone":req.body.phone
    }
    contactModel.replaceOne({"_id":req.params.id},contact).then(function(){
        return res.status(200).json({"Message":"Success"})
    }).catch(function(error){
        console.log("Database returned an error",error)
        return res.status(500).json({"Message":"Internal server error"})
    })
})

connectDB().then(() => {
    app.listen(port, () => {
        console.log("Server running in port "+port)
    })
})