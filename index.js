const {faker} = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuid } = require('uuid');
const { ifError } = require('assert');


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database:'delta_app',
  password:'mysql@123'
});

let getRandomUser = ()=>{
  return[
      
      faker.string.uuid(),
      faker.internet.username(), 
      faker.internet.email(),
      faker.internet.password(),
      
      ];
    };

let q = "insert into user (id,username,email,password) values ?";


// let users=[ ["123a","123_newusera","abc@gmail.coma","abca"],
//  ["123b","123_newuserab","abc@gmail.comab","abcab"]
// ];


//HOME ROUTE
app.get("/",(req,res)=>{
  let q ='SELECT count(*) FROM user';

  try{

connection.query(q,(err,result)=>{
  if(err)throw err;
  let count = (result[0]["count(*)"]);
  res.render("home.ejs",{count});
});
} catch(err){
  console.log(err);
  res.send("some error in DB")
}
  
});


//USERs ROUTE
app.get("/user",(req,res)=>{
  let q ='SELECT * FROM user';

  try{

connection.query(q,(err,result)=>{
  if(err)throw err;
  res.render("show.ejs",{result});
  
});
} catch(err){
  console.log(err);
  res.send("some error in DB")
}
  
});


//EDIT ROUTE
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`
  try{

    connection.query(q,(err,result)=>{
      if(err)throw err;
      console.log(result);
      let user = result[0];
      res.render("edit.ejs",{user});
      
    });
    } catch(err){
      console.log(err);
      res.send("some error in DB")
    }

});

//UPDATE ROUTE
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let{password: formpass,username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`

  try{
      connection.query(q,(err,result)=>{
        if(err)throw err;
            console.log(result);
            let user = result[0];
            if(formpass != user.password){
              res.send("WRONG password!");
            } else{
              let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`
              connection.query(q2,(err,result)=>{
                if(err) throw err;
                res.redirect("/user");
              });
            }

      });
  } catch(err){
    console.log(err);
      res.send("some error in DB");

  }
});
 
         
  


      //DELET ROUTE
     


app.get("/user/:id/delete", (req, res) => {
  
  let { id } = req.params;
        
  let q = `SELECT * FROM user WHERE id='${id}'`;
      
  try {

    connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            console.log(user);
            res.render("dele.ejs", { user });
          });
        } catch (err) {
          res.send("some error with DB");
        }
});     
    
//DELETE ROUTE

app.delete("/user/:id",(req,res)=>{
 
        let {id} = req.params;
      
        let{password: formpass} = req.body;
        

        let q = `SELECT * FROM user WHERE id='${id}'`
        try{
      
          connection.query(q,(err,result)=>{
            if(err)throw err;
            console.log(result);
            let user = result[0];
            if(formpass != user.password){
              res.send("WRONG password!");
            } else{
              let q2 = `DELETE FROM user WHERE id='${id}'`
              connection.query(q2,(err,result)=>{
                if(err) throw err;
                // res.send(result);
                res.redirect("/user");
                
              })
                
            }
            
          });
          } catch(err){
            console.log(err);
            res.send("some error in DB")
          }
});

// NEW USER
app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
})

app.post("/user/new",(req,res)=>{
  let {username,password,email} = req.body;
  let id=uuid();
  let q = `INSERT INTO user (id,username,email,password) values (?,?,?,?)`
  // let user=[id,username,email,password];

  try{

    connection.query(q,[id,username,email,password],(err,result)=>{
      if(err)throw err;
      console.log(result);
      res.redirect("/user");
      
      
    });
    } catch(err){
      console.log(err);
      res.send("some error in DB")
    }
 
});

    

app.listen("8080",()=>{
  console.log("server is listening on port 8080");
});

