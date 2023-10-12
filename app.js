const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const express= require('express');
const cors= require('cors')
const bcrypt = require("bcrypt")
const app = express();
const sequelize= require('./connection/database');
app.use(bodyParser.json({extended:false}));
app.use(cors());

const Users = sequelize.define('Users', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true,
      
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
      }
   
  });

app.post('/user/signup', async(req,res,next)=>
{
   function isStringValidate(string){

    if(string == undefined || string.length===0)
     return true;
    else{
      return false;
    }
   }
    try{
        const {name, email, password}= req.body;
        if(isStringValidate(name) || isStringValidate(email) || isStringValidate(password))
        {
          return res.status(400).json({err: "Please Fill All The Entries!"})
        }
        const saltrounds=10;
        bcrypt.hash(password, saltrounds, async(err, hash)=>
        {
          console.log(err);
          await Users.create({name,email,password: hash})
          res.status(200).json({Success: "User Successfully Created"}); 
        })
       }
        catch(err)
        {
            // console.log(err);
            res.status(500).json(err);
        }
        })

app.post('/user/signin', async(req,res,next)=>
{
  function isStringValidate(string){

    if(string == undefined || string.length===0)
     return true;
    else{
      return false;
    }
   }
   try{
    const {email, password}= req.body;
    if(isStringValidate(email) || isStringValidate(password))
    {
      return res.status(400).json({err:"Please Fill All The Entries!"})
    }

    let {dataValues} = await Users.findOne({
    where: {
      email: email
    }
  });
      // console.log(dataValues);
      if(dataValues.password===password){
        return res.status(200).json({Success: "True"})
      }
      else{
        return res.status(401).json({err:"Invalid Password"})
      }
    }
    catch(err)
    {
          console.log(err);
          return res.status(404).json({Message:"User Not Found"});
    }
    })

sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(5500, ()=>
{
    console.log("Server Is Started!");
})})
  .catch(err => {
    console.log(err);
});
