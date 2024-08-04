const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require("express");
const app=express();
const path=require("path");
const methodOverride= require("method-override");
const { v4: uuidv4 }=require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Xyz#1234'
});

// let getRandomUser = ()=>{
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// }

// let q="INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)";

// let q="INSERT INTO user (id,username,email,password) VALUES ?";

// let user=[["123b","123_newuserb","abc@gmail.comb","abcb"],
//         ["123c","123_newuserc","abc@gmail.comc","abcc"]];

// let data=[];
// for(let i=0;i<=100;i++){
//   data.push(getRandomUser());
// }

// try{
//   connection.query(q,[data],(err, result)=>{
//   // connection.query(q,user,(err, result)=>{
//   // connection.query("SHOW TABLES",(err, result)=>{
//     if(err) throw err;
//     console.log(result);
//   });
// }catch(err){
//   console.log(err);
// }



// let getRandomUser = ()=>{
//     return {
//       Id: faker.string.uuid(),
//       username: faker.internet.userName(),
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//     };
//   }

  
  // console.log(getRandomUser());

app.get("/",(req,res)=>{
  q=`SELECT count(*) FROM user`;
  try{
  connection.query(q,(err,result)=>{
    if(err) throw err;
    // console.log(result[0]["count(*)"]);
    let count=result[0]["count(*)"];
    // res.send(result[0]);
    res.render("home.ejs",{count});
    });
  }catch(err){
    console.log(err);
    res.send("some error in DB");
  }
  // res.send("welcome to home page");
});

app.get("/users",(req,res)=>{
  q=`SELECT * FROM user`;
  try{
    connection.query(q,(err,result)=>{
    if(err) throw err;
    let data=result;
    // console.log(data[1].id);
    res.render("users.ejs",{data});
    });
    }catch(err){
      console.log(err);
      res.send("some error in DB");
    }
  });

  app.get("/users/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
      connection.query(q,(err,result)=>{
      if(err) throw err;
      console.log(result);
      let user=result[0];
      res.render("edit.ejs", {user});
      });
      }catch(err){
        console.log(err);
        res.send("some error in DB");
      }
  });

  app.patch("/users/:id",(req,res)=>{
    let {id}=req.params;
    let {password: formPass,username: newUsername}=req.body;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
      connection.query(q,(err,result)=>{
      if(err) throw err;
      let user=result[0];
      console.log(result);
      if(formPass != user.password){
        res.send("WRONG password");
      }
      else{
        let q2=`update user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/users");
        });
      }
      // res.render("edit.ejs", {user});
      });
      }catch(err){
        console.log(err);
        res.send("some error in DB");
      }
  });

  app.get("/users/:id/delete",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
      connection.query(q,(err,result)=>{
      if(err) throw err;
      console.log(result);
      let user=result[0];
      res.render("delete.ejs", {user});
      });
      }catch(err){
        console.log(err);
        res.send("some error in DB");
      }
  });

  app.post("/users/:id",(req,res)=>{
    let {id}=req.params;
    let {email: useremail, password: userpass}=req.body;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        console.log(result);
        let user=result[0];
        if(useremail != user.email || userpass != user.password){
          res.send("Invalid Details");
        }
        else{
          let q2=`DELETE FROM user WHERE id='${id}'`;
          connection.query(q2,(err,result)=>{
            if(err) throw err;
            res.redirect("/users");
          });
        }
      });
    }catch(err){
      console.log(err);
      res.send("some error in DB2");
    }
  });

  app.get("/newuser",(req,res)=>{
    // let newid=uuidv4();
    res.render("newuser.ejs");
  });

  app.post("/newuser",(req,res)=>{
    // let {newid}=req.params;
    let newid=uuidv4();
    // console.log(newid);
    let {username: newusername, email:newemail, password:newpass}=req.body;
    let q=`INSERT INTO user
    VALUES
    ('${newid}','${newusername}','${newemail}','${newpass}')`;
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.redirect("/users");
      });
    }catch(err){
      console.log(err);
      res.send("some error in DB2");
    }
  });

app.listen("8080",()=>{
console.log("server is listening to port 8080");
});