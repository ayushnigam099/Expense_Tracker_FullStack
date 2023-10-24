const amountInput = document.querySelector('#amt');
const descriptionInput = document.querySelector('#des');
const myForm = document.querySelector('#my-form');
const categoryInput = document.querySelector('#cat');
const expenseList = document.getElementById('expense-list');

document.addEventListener('DOMContentLoaded', create);

// Parse the token
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message1').innerHTML = "Premium"
    document.getElementById('message').style.display = 'block';
    document.getElementById('message1').style.display = 'block';
}

function showLeaderboard() {
    const messageDiv = document.getElementById("message");
    const leaderboardTable = document.createElement("table");
    leaderboardTable.classList.add("leaderboard-table");

    const headerRow = leaderboardTable.insertRow(0);
    const nameHeader = document.createElement("th");
    nameHeader.textContent = "Name";
    const expensesHeader = document.createElement("th");
    expensesHeader.textContent = "Total Expenses";
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(expensesHeader);

    const showLeaderboardBtn = document.createElement("button");
    showLeaderboardBtn.textContent = "Show Leaderboard";
    showLeaderboardBtn.setAttribute('id', "show-leaderboard-btn")
    showLeaderboardBtn.addEventListener("click", async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5500/premium/showLeaderBoard', { headers: { "Authorization": token } });
            const userLeaderBoardArray = response.data;

            userLeaderBoardArray.forEach((userDetails, index) => {
                const row = leaderboardTable.insertRow(index + 1);
                const nameCell = row.insertCell(0);
                const expensesCell = row.insertCell(1);

                nameCell.textContent = userDetails.name;
                expensesCell.textContent = userDetails.totalExpenses || 0;
            });

            messageDiv.innerHTML= '<h1>LeaderBoard</h1>';
            messageDiv.appendChild(leaderboardTable);
        } catch (error) {
            console.error(error);
        }
    });

    // Append the "Show Leaderboard" button to the messageDiv
     messageDiv.innerHTML = ''; // Clear the messageDiv
     messageDiv.appendChild(showLeaderboardBtn);
}


async function create(e) {
    e.preventDefault();
    try{ 
    let token= localStorage.getItem("token");
    const decodeToken = parseJwt(token)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumuserMessage()
        showLeaderboard()
        reports();
        }

    let {data}= await axios.get("http://localhost:5500/expense/getexpense", { headers: {"Authorization":token}})
    for (let i = 0; i < data.data.length; i++) {
        const html = createExpenseElement(data.data[i]);
        expenseList.innerHTML = html+ expenseList.innerHTML;
    }
}
  catch(err)
  {
    if(err.response.status== 500){
        alert(`${err.response.data.message}`)
    }
   else
    {
        alert(`${err}`);
    }
  }
       
 }
 function reports()
 {
    const messageDiv = document.getElementById("report");
    const report = document.createElement("button");
    report.textContent = "Reports";
    report.setAttribute('id', "show-report-btn")
    messageDiv.appendChild(report);
    report.addEventListener('click', async ()=>
    {
        window.location.href="../Reports/reports.html";
    })

 }

function createExpenseElement(expense) {
    return `
    <tr>
    <td>${expense.amount}</td>
    <td>${expense.description}</td>
    <td>${expense.category}</td>
    <td>
        <button class="delete-btn" onclick="onDelete(event, ${expense.id})">Delete</button>
        <button class="edit-btn" onclick="onEdit(${expense.id})">Edit</button>
    </td>
</tr>`;
}

myForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();
        const details = {
            amount: amountInput.value,
            description: descriptionInput.value,
            category: categoryInput.value,
        };

        try {
            const token  = localStorage.getItem('token');
            const { data } = await axios.post("http://localhost:5500/expense/addexpense", details, { headers: {"Authorization" : token} });
            expenseList.innerHTML =  createExpenseElement(data.Success) + expenseList.innerHTML
        } 
        catch (err) {
            if(err.response.status== 400) { 
            alert(`${err.response.data.message}`);       
        }
         else if(err.response.status== 500){
            alert(`${err.response.data.message}`)
         }
         else{
            alert(`${err}`);
         }
    }
}

async function onDelete(e, id) {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
     
        const response = await axios.delete(`http://localhost:5500/expense/deleteexpense/${id}`, {
            headers: { "Authorization": token }
        });
        alert(`${response.data.message}`);

        // Remove the entry from the DOM
        e.target.parentElement.parentElement.remove();
    }
     catch (err) {
        console.log(err);
        if(err.response.status==400)
        {
            alert(`Internal Error, Please Try again `);
        }
       else if(err.response.status==404)
        {
            alert(`${err.response.data.message}`)
        }
        else{
            return document.body.innerHTML+= `<div style = "color:red;"> ${err}</div>`;
        }
        }
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:5500/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:5500/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('message').style.display = 'block';
         localStorage.setItem('token', res.data.token)
         showPremiumuserMessage()
         showLeaderboard();
         reports();
        
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', async function (response) {
    console.log(response);
    alert('Something went wrong');

    // Add the logic to update the order status to FAILED
    const res = await axios.post('http://localhost:5500/purchase/updatetransactionstatus', {
        order_id: options.order_id,
        payment_id: response.error.metadata.order_id, 
        status: 'FAILED', 
    }, { headers: {"Authorization" : token} });

    console.log(res);
});
}
