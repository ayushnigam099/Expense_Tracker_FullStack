const bodyParser = require('body-parser');
const express= require('express');
const cors= require('cors')
const app = express();
const sequelize= require('./connection/database');
const Users = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const purchaseRoutes = require('./routes/purchase')

const userRoutes = require('./routes/users')
const expenseRoutes = require('./routes/expense')
const premiumFeatureRoutes = require('./routes/premiumFeature')
app.use(bodyParser.json({extended:false}));
app.use(cors());


app.use('/user', userRoutes);
app.use('/expense',expenseRoutes );
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes)


Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Order);
Order.belongsTo(Users);

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
