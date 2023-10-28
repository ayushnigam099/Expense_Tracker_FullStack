const Expense = require('../models/expense');
const Users = require('../models/users');
const sequelize= require('../connection/database')

const addExpense = async (req, res, next) => {
  function isStringValidate(string) {
    return string === undefined || string.length === 0;
  }

  const t = await sequelize.transaction(); // Create a common transaction object

  try {
    const { amount, description, category} = req.body;

    if (isStringValidate(amount) || isStringValidate(description) || isStringValidate(category)) {
      await t.rollback(); // Roll back the common transaction
      return res.status(400).json({ success: false, message: 'Parameters missing' });
    }

    try {
      const { dataValues } = await Expense.create(
        { amount, description, category ,UserId: req.user.id },
        { transaction: t }
      );

      const newTotalExpenses = req.user.totalExpenses + Number(amount);

      const [updatedRowCount] = await Users.update(
        { totalExpenses: newTotalExpenses },
        { where: { id: req.user.id }, transaction: t }
      );

      if (updatedRowCount !== 1) {
        throw new Error('User update failed');
      }

      await t.commit(); // Commit the common transaction after both operations are successful

      return res.status(200).json({Success: dataValues });
    } catch (err) {
      await t.rollback(); // Roll back the common transaction on error
      throw err; // Re-throw the error for further handling
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, success: false });
  }
};


const getexpenses =async(req,res,next)=>
{
  try{
    const data= await Expense.findAll({where:{UserId: req.user.id}});
    return res.status(200).json({data:data, Success: true})
}
catch(err)
{
    console.log(err);
    return res.status(500).json({message: "Error Occurred", success: false});
}
}

const deleteexpense= async (req, res) => {
    const t = await sequelize.transaction();
  try {
    const expenseid = req.params.expenseid;

    if (expenseid == undefined || expenseid.length === 0) {
        return res.status(400).json({ success: false });
    }
    const expense = await Expense.findByPk(expenseid);
    await Users.update(
    {
        totalExpenses: req.user.totalExpenses - expense.amount,
    },{ where: { id: req.user.id } } ,{ transaction: t });

    let noofrows = await Expense.destroy({
        where: { id: expenseid, UserId: req.user.id }
    },{ transaction: t });

    if (noofrows === 0) {
        await t.rollback();
        return res.status(404).json({
            success: false,
            message: 'Expense doesn\'t belong to the user'
        });
    }
    await t.commit();
    return res.status(200).json({
        success: true,
        message: 'Deleted Successfully'
});
  } 
  catch (err) {
    await t.rollback();
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
    addExpense
}