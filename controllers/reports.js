const Expense = require('../models/expense');
const Users = require('../models/users');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const AWS= require('aws-sdk');
const sequelize = require('../connection/database');
const { Op } = require('sequelize'); // Import Sequelize operators

const dailyreport = async (req, res) => {
    const date = req.body.date;
    try {
        const user = await Users.findOne({
            where: { id: req.user.id }, // Assuming you are using some kind of authentication middleware to get the user ID
            include: [
                {
                    model: Expense,
                    where: {
                        createdAt: {
                            [Op.between]: [
                                new Date(date + 'T00:00:00Z'),
                                new Date(date + 'T23:59:59Z')
                            ]
                        }
                    }
                }
            ]
        });

        if (!user || !user.Expenses.length) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({data:user.Expenses});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const monthreport = async(req,res)=>{
    const month = req.body.month;
    try {
        const user = await Users.findOne({
            where: { id: req.user.id }, // Assuming you are using some kind of authentication middleware to get the user ID
            include: [
                {
                    model: Expense,
                    where: {
                        createdAt: {
                            [Op.gte]: new Date(`${month}-01T00:00:00Z`),
                            [Op.lt]: new Date(`${month}-01T00:00:00Z`).setMonth(new Date(`${month}-01T00:00:00Z`).getMonth() + 1)
                        }
                    }
                }
            ]
        });

        if (!user || !user.Expenses.length) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({data:user.Expenses});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const generatePDF = (expenses) => {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const pdfBuffer = [];
  
      doc.on('data', (chunk) => pdfBuffer.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(pdfBuffer)));
  
      // Create a PDF document
      doc.fontSize(18).text('Expense Report', { align: 'center' });
      doc.moveDown();
  
      // Define table headers and calculate column widths
      const tableHeaders = ['Date', 'Amount', 'Description', 'Category'];
      const columnWidths = calculateColumnWidths(tableHeaders, expenses);
  
      // Draw table headers horizontally
      doc.font('Helvetica-Bold');
      let xPosition = 50; // Initial x position
      tableHeaders.forEach((header, i) => {
        doc.text(header, xPosition, 200, { width: columnWidths[i], align: 'left' });
        xPosition += columnWidths[i]; // Adjust for the next column
      });
  
      // Draw table rows with text wrapping
      doc.font('Helvetica');
      expenses.forEach((expense) => {
        xPosition = 50; // Reset x position for each row
        const yPosition = doc.y + 20; // Vertical position for rows
        const createdAt = new Date(expense.createdAt);
        // Extract the date components
        const year = createdAt.getUTCFullYear();
        const month = String(createdAt.getUTCMonth() + 1).padStart(2, '0'); // Add 1 to convert from zero-based (0-11) to (1-12)
        const day = String(createdAt.getUTCDate()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year}`;
        doc.text(formattedDate, xPosition, yPosition, { width: columnWidths[0], align: 'left' });
        xPosition += columnWidths[0];
  
        doc.text(expense.amount, xPosition, yPosition, { width: columnWidths[1], align: 'left' });
        xPosition += columnWidths[1];
  
        doc.text(expense.description, xPosition, yPosition, { width: columnWidths[2], align: 'left' });
        xPosition += columnWidths[2];
  
        doc.text(expense.category, xPosition, yPosition, { width: columnWidths[3], align: 'left' });
  
        // Move to the next line for the next row
        doc.moveDown();
      });
  
      doc.end();
    });
  };
  
  // Function to calculate column widths based on content length
  function calculateColumnWidths(headers, data) {
    const minWidth = 80; // Minimum column width
    const maxWidth = 200; // Maximum column width
  
    const columnWidths = headers.map((header, index) => {
      // Calculate the maximum content width for each column
      const contentWidth = Math.max(
        header.length * 10, // Adjust as needed for header
        ...data.map((row) => (row[headers[index]] ? row[headers[index]].toString().length * 7 : 0))
      );
  
      // Ensure the column width is within the specified range
      return Math.min(maxWidth, Math.max(minWidth, contentWidth));
    });
  
    return columnWidths;
  }
  

function uploadToS3(data, filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET =process.env.IAM_USER_SECRET;

    let s3bucket= new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    var params={
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject)=>
    {
        s3bucket.upload(params, (err, s3response)=>
        {
            if(err)
            {
                reject(err);
                console.log('Something is wrong', err)
            }
            else{
                resolve(s3response.Location)
                console.log('success', s3response);
            } 
        })
    })
   
}

const downloadreport= async(req,res)=>{
    try{
    const expenses = await req.user.getExpenses();
    const pdfBuffer = await generatePDF(expenses);
    const userId= req.user.id;
    const filename = `Expense${userId}/${new Date()}.pdf`;
    const fileURl= await uploadToS3(pdfBuffer, filename);
    res.status(200).json({fileURl, success:true});
}catch(err)
{
    console.log(err);
    res.status(500).json({fileURl: "", success:false});
}
}

module.exports={
    dailyreport,
    monthreport,
    downloadreport
}