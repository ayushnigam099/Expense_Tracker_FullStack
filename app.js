const bodyParser = require('body-parser');
const express= require('express');
const cors= require('cors')
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
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        
        const {dataValues}= await Users.create({
                                        name,
                                        email,
                                        password
                                            })
            console.log("data",dataValues) ;
            res.status(200).json({Success: dataValues});   
            }
        catch(err)
        {
            console.log(err);
            res.status(400).json({Failed: "Account is already created with same email"});
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
