const Sequelize=require('sequelize')
const sequelize=require('../connection/database')

const Download=sequelize.define('Download',{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    link: {
        type: Sequelize.STRING,
        allowNull: false
    },
})
module.exports=Download;