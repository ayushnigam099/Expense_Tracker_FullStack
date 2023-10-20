const Razorpay = require('razorpay');
const Order = require('../models/orders')
const userController = require('./users')

const purchasePremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: "rzp_test_mVeKWzNGdo8UnF",
            key_secret: "CRi29b4GvcFCXUrKKDZfXWAM"
        });

        const amount = 49900;
        const order = await rzp.orders.create({ amount, currency: "INR" });

        await req.user.createOrder({ orderid: order.id, status: 'PENDING' });

        res.status(201).json({ order, key_id: rzp.key_id });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: 'Something went wrong', error });
    }
};

const updateTransactionStatus = async (req, res ) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id,status} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}}) //2
        if (status === 'FAILED') {
            // Update order status to FAILED
            await order.update({ status: 'FAILED' });
            return res.status(202).json({ success: true, message: "Transaction Failed" });
        }
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 =  req.user.update({ ispremiumuser: true }) 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({success: true, message: "Transaction Successful",token: userController.generateAccessToken(userId,undefined , true)});
        }).catch((error ) => {
            throw new Error(error)
        })

        
                
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' })

    }
}

module.exports = {
    purchasePremium,
    updateTransactionStatus
}
