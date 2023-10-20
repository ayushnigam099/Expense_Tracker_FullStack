const Expense = require('../models/expense');
const Users = require('../models/users');
const sequelize = require('../connection/database');

const getUserLeaderBoard = async (req, res) => {
    try{
        const leaderboardofusers = await Users.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost'] ],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['users.id'],
            order:[['total_cost', 'DESC']]

        })
       
        res.status(200).json(leaderboardofusers)
    
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}

module.exports = {
    getUserLeaderBoard
}