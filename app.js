require('dotenv').config();
const helmet= require('helmet');
const fs = require("fs");
const morgan = require("morgan");
const express= require('express');
const cors= require('cors')
const app = express();
const path= require('path')
const sequelize= require('./connection/database');
const bodyParser = require('body-parser');
const Users = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const Download=require('./models/download')
const Forgotpassword= require('./models/forgotPassword');
const purchaseRoutes = require('./routes/purchase')
const reportRoutes= require('./routes/reports');
const userRoutes = require('./routes/users')
const expenseRoutes = require('./routes/expense')
const premiumFeatureRoutes = require('./routes/premiumFeature')
const forgotPassword=  require('./routes/forgotPassword');
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );
// app.use(morgan("combined", { stream: accessLogStream }));
// app.use(helmet());

app.use(express.static(path.join(__dirname+ 'views')));  
app.use(bodyParser.json({extended:false}));
app.use(cors());
app.use('/user', userRoutes);
app.use('/expense',expenseRoutes );
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', forgotPassword);
app.use('/report',reportRoutes);

Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Order);
Order.belongsTo(Users);

Users.hasMany(Forgotpassword);
Forgotpassword.belongsTo(Users);

Users.hasMany(Download);
Download.belongsTo(Users);


sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(process.env.PORT ||5500, ()=>
{
    console.log("Server Is Started!");
})})
  .catch(err => {
    console.log(err);
});
