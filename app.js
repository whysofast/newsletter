const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
const https = require("https");
const { json } = require('body-parser');
const port = 3000;
const port = process.env.PORT; //HEROKU PORT 
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("publicFiles"));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/signup.html")
})

app.post("/",(req,res)=>{
    const fname = req.body.name1;
    const lname = req.body.name2;
    const email = req.body.email;

    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: fname,
                    LNAME: lname
                }

            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/103b36b676";

    const options = {
        method: "POST",
        auth: "fast1:a1948d1d226dd2018470e25ef42f2c6f-us17"
    }

    const request = https.request(url,options,function(response){
        
        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })
        if (response.statusCode==200){
            res.sendFile(__dirname + "/success.html")
        } else{
            res.sendFile(__dirname + "/failure.html")
        }
 
    });

    request.write(jsonData);
    request.end();
})

app.post("/failure",(req,res)=>{
    res.redirect("/");
})

// API Key
// a1948d1d226dd2018470e25ef42f2c6f-us17
// List ID
// 103b36b676

app.listen(port || 3000,()=>{
    console.log(`Connected to port: ${port}`);
})