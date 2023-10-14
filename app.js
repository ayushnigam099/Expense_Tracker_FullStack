const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const express= require('express');
const cors= require('cors')
const bcrypt = require("bcrypt")
const app = express();
const sequelize= require('./connection/database');
const jwt = require('jsonwebtoken')

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

  const Expense = sequelize.define('Expenses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    amount: Sequelize.FLOAT,
    category: Sequelize.STRING,
    description: Sequelize.STRING,
})


app.use(bodyParser.json({extended:false}));
app.use(cors());


app.post('/user/signup', async(req,res,next)=>
{
   const saltrounds=10; //Saltrounds for encrypting password
   function isStringValidate(string){

    if(string == undefined || string.length === 0)
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
          const hash =  await bcrypt.hash(password, saltrounds)
         await Users.create({name,email,password: hash});
          return res.status(200).json({Success: "User Successfully Created"}); 
       }
        catch(err)
        {
            //console.log(err);
            res.status(500).json(err);
        }
        })

// Token Generator
 const generateAccessToken = (id, name) => {
 return jwt.sign({ userId : id, name: name} ,'61b809c35a715f69b20b1911b54c09c62f96806377161da4b8fa598c29b0893a');
      }


 app.post('/user/signin', async (req, res, next) => {
   function isStringValidate(string){

    if(string == undefined || string.length === 0)
     return true;
    else{
      return false;
    }
   }

  try {
      const { email, password } = req.body;
  
      // Check if email or password is missing
      if (isStringValidate(email) || isStringValidate(password)) {
        return res.status(400).json({ success: false, message: "Please fill in all the fields." });
      }
  
      // Find the user by email
      const user = await Users.findOne({
        where: {
          email: email
        }
      });
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ success: false, message: 'User does not exist' });
      }
  
      // Compare the provided password with the hashed password in the database
      bcrypt.compare(password, user.dataValues.password, (err, result) => {
        if (err) {
          throw new Error('Something went wrong');
        }
  
        if (result === true) {
          return res.status(200).json({ success: true, message: "User logged in successfully" ,token: generateAccessToken(user.id, user.name)});
        } else {
          return res.status(400).json({ success: false, message: 'Password is incorrect' });
        }
      });
    } catch (error) {
      // Handle other errors
      res.status(500).json({ message: error.message, success: false });
    }
  });
        
// Expenses Middleware 
 app.post('/expense/addexpense', async(req,res,next)=>
 {
  function isStringValidate(string){
    if(string == undefined || string.length === 0)
     return true;
    else{
      return false;
    }
   }

  try{
    const { amount, description, category } = req.body;
    
    if(isStringValidate(amount) || isStringValidate(description) || isStringValidate(category)){
      return res.status(400).json({success: false, message: 'Parameters missing'})
  }
    const {dataValues}= await Expense.create({amount,description,category})
        // console.log("data",dataValues) ;
        return res.status(200).json({Success: dataValues});   
        }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ message: err.message, success: false });
    }
    })
 
app.get('/expense/getexpense', async(req,res,next)=>
    {
      try{
        const data= await Expense.findAll();
        // console.log("mewwoow",data);
        return res.status(200).json({data:data, Success: true})
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({message: "Error Occurred", success: false});
    }
    })

   
 

Users.hasMany(Expense);
Expense.belongsTo(Users);

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
