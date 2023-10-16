const bodyParser = require('body-parser');
const express= require('express');
const cors= require('cors')
const app = express();
const sequelize= require('./connection/database');
const Users = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/orders');

const userRoutes = require('./routes/users')
const expenseRoutes = require('./routes/expense')
app.use(bodyParser.json({extended:false}));
app.use(cors());


app.use('/user', userRoutes)
app.use('/expense',expenseRoutes )

Users.hasMany(Expense);
Expense.belongsTo(Users);

User.hasMany(Order);
Order.belongsTo(User);

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
