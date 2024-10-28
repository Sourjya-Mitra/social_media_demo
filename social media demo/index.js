//seting the connections with frameworks
const mysql= require('mysql2');
const express = require('express')
const app = express();
const port=8080;
const path=require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");
// setting connections with database
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'delta_app',
    password: 'Viratkohli@18'
});
//parsing the data
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
// connecting the folders
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
//setting up view engine
app.set("view engine","ejs");
//listening to the port
app.listen(port,(req,res)=>{
    console.log(`app is listening in port ${port}`);
});
//sending responses in the routes
//to show the number of users present in the home page
app.get("/",(req,res)=>{
    let q1="SELECT COUNT (*) FROM user";
   try{
        connection.query(q1,(err,result)=>{
            if (err) throw err;
         var term = (Object.keys(result[0])[0]);
          // console.log(result[0][term]);
            let count = result[0][term];
            res.render("home.ejs",{ count });
        });
    } catch (err){
        res.send("some error occured");
    }
});
//to show the data of the users in the show page
let data=[];
let new_data = [];
app.get("/user",(req,res)=>{
    let q2="SELECT * FROM user";
    try {
       connection.query(q2,(err,result)=>{
            if(err) throw err;
             data=result;
           // console.log(typeof(data));
            let usernames= [];
            let length= data.length;
            for( let i=0;i<=length-1;i++){
                var term = (Object.keys(data[i])[1]);
              usernames.push(data[i][term]);
            };
         res.render("show.ejs", { usernames });
        });
   } catch (err){
        res.send("some error occured");
    }
});
//to show the page where NEW users will enter their data to join us
app.get("/new",(req,res)=>{
    res.render("new.ejs");
});
//sending the new post to show page from the form page
app.post("/user",(req,res)=>{
    let {username , email, password }=req.body;
    let id= uuidv4();
    let temp=[id,username , email, password];
    let q3="INSERT INTO user (id, username, email, password) VALUES (?,?,?,?)";
    try{
        connection.query(q3,temp,(err,result)=>{
            if (err) throw err;
            console.log(result);
            res.redirect("/user");
        });
    } catch(err){
        console.log(err);
        res.send("sorry server error");
    };
});
//to send to the update user data form page
app.get("/show/:username/update",(req,res)=>{
    let { username }=req.params;
    let q4=`SELECT * FROM user WHERE username='${username}'`;
          try{ connection.query(q4,(err,result)=>{
            if (err)  throw err;
            let user=result[0];
            res.render("update.ejs",{ user });
           })} catch (err){
            console.log(err);
            res.send("sorry server error");
           }
});
// to update existing data in database
app.patch("/show/:username",(req,res)=>{
     let { username } = req.params;
     let { current_username, current_email, password }=req.body;
     let q5=`SELECT * FROM user WHERE Username= '${username}'`;
     try{
        connection.query(q5,(err,result)=>{
            if (err) throw err;
           let user=result[0];
            if(password!= user.password){
                res.send("Wrong password");
            } else {
                let q6=`UPDATE user SET username = '${current_username}', email = '${current_email}' WHERE id ='${user.id}'`;
                try{
                    connection.query(q6,(err,result)=>{
                    if (err) throw err;
                      res.redirect("/user");
                })} catch(err){
                    console.log(err);
                }
            }
        })} catch (err) {
            res.send("sorry server error");
        };
    });
    //to delete data from the database
app.delete("/show/:username",(req,res)=>{
    let { username }= req.params;
    //console.log(username);});
    let q7=`DELETE FROM user WHERE username = '${username}'`;
    try{
        connection.query(q7,(err,result)=>{
         if (err) throw err;
         res.redirect("/user");
    });
   } catch(err){
    console.log(err);
    res.send("sorry could not delete");
   };
});
app.get("/show/details/:username",(req,res)=>{
    let { username }=req.params;
    let q8=`SELECT * FROM user WHERE username = '${username}'`;
    try{
        connection.query(q8,(err,result)=>{
            if (err) throw err;
            let send=result;
            res.render("details.ejs", { send });
        }); 
    } catch (err){
        console.log(err);
        res.send("some internal error");
   }
});
