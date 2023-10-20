const Expense = require('../models/expense');
const Users = require('../models/users');

const addexpense = async(req,res,next)=>
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
        await Users.update(
            {
            totalExpenses: req.user.totalExpenses + Number(amount),
            },
            { where: { id: req.user.id } }
        );
   let {dataValues}= await Expense.create({amount,description,category,UserId: req.user.id})
       return res.status(200).json({Success: dataValues});   
       }
   catch(err)
   {
       console.log(err);
       res.status(500).json({ message: err.message, success: false });
   }
   }

const getexpenses =async(req,res,next)=>
{
  try{
    const data= await Expense.findAll({where:{UserId: req.user.id}});
    // console.log("mewwoow",data);
    return res.status(200).json({data:data, Success: true})
}
catch(err)
{
    console.log(err);
    return res.status(500).json({message: "Error Occurred", success: false});
}
}

const deleteexpense= async (req, res) => {
  try {
      const expenseid = req.params.expenseid;

      if (expenseid == undefined || expenseid.length === 0) {
          return res.status(400).json({ success: false });
      }
      const expense = await Expense.findByPk(expenseid);
      await Users.update(
        {
          totalExpenses: req.user.totalExpenses - expense.amount,
        },
        { where: { id: req.user.id } }
      );
      let noofrows = await Expense.destroy({
          where: { id: expenseid, UserId: req.user.id }
      });
      if (noofrows === 0) {
          return res.status(404).json({
              success: false,
              message: 'Expense doesn\'t belong to the user'
          });
      }

      return res.status(200).json({
          success: true,
          message: 'Deleted Successfully'
      });
  } catch (err) {
      console.error(err);
      return res.status(500).json({
          success: false,
          message: 'Failed'
      });
  }
};


module.exports = {
    deleteexpense,
    getexpenses,
    addexpense
}