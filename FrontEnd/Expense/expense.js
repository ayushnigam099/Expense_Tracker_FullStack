const amountInput = document.querySelector('#amt');
const descriptionInput = document.querySelector('#des');
const myForm = document.querySelector('#my-form');
const categoryInput = document.querySelector('#cat');
const expenseList = document.getElementById('expense-list');
const pageElement = document.getElementById("page");
const previousNode = document.getElementById("previous");
const currentNode = document.getElementById("current");
const nextNode = document.getElementById("next");
const logOut = document.getElementById("logout");
const pageDropValue = document.getElementById("pageDropValue");
const span = document.getElementById("span");

const page = 1;
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
    if (!localStorage.getItem("limit")) {
        localStorage.setItem("limit", 5);
      }
    try{ 
    let token= localStorage.getItem("token");
    const decodeToken = parseJwt(token);
    const ispremiumuser = decodeToken.ispremiumuser;
    if(ispremiumuser){
        showPremiumuserMessage()
        showLeaderboard()
        reports();
        }

    let {data}= await axios.get(`http://localhost:5500/expense/getexpense?page=${page}&limit=${localStorage.getItem(
        "limit"
      )}`, { headers: {"Authorization":token}})
    //   console.log(data.data)
    showPagination(data.data);
    for (let i = 0; i < data.data.result.length; i++) {
        const html = createExpenseElement(data.data.result[i]);
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
    const createdAt = new Date(expense.createdAt);
    // Extract the date components
    const year = createdAt.getUTCFullYear();
    const month = String(createdAt.getUTCMonth() + 1).padStart(2, '0'); // Add 1 to convert from zero-based (0-11) to (1-12)
    const day = String(createdAt.getUTCDate()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;
    return `
    <tr>
    <td>${formattedDate}</td>
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
        try {
                const details = {
                    amount: amountInput.value,
                    description: descriptionInput.value,
                    category: categoryInput.value,
                };
            
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
//
async function createBtn(page){
    expenseList.innerHTML = "";
    try{ 
        let token= localStorage.getItem("token");
        const decodeToken = parseJwt(token)
        const ispremiumuser = decodeToken.ispremiumuser
        if(ispremiumuser){
            showPremiumuserMessage()
            showLeaderboard()
            }
    
        let {data}= await axios.get(`http://localhost:5500/expense/getexpense?page=${page}&limit=${localStorage.getItem(
            "limit"
          )}`, { headers: {"Authorization":token}})
          console.log(data.data)
        showPagination(data.data);
        for (let i = 0; i < data.data.result.length; i++) {
            const html = createExpenseElement(data.data.result[i]);
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

function showPagination({ previous, current, next, start, end, count }) {
    pageElement.innerHTML = "";
    if (previous) {
      const btn1 = document.createElement("button");
      btn1.setAttribute("type", `button`);
      btn1.setAttribute("class", `btn btn-secondary btn1`);
      btn1.setAttribute("id", `previous`);
      btn1.appendChild(document.createTextNode(`${previous}`));
      btn1.addEventListener("click", (e) => {
        createBtn(parseInt(e.target.childNodes[0].wholeText));
      });
      pageElement.appendChild(btn1);
    }
    const btn2 = document.createElement("button");
    btn2.setAttribute("type", `button`);
    btn2.setAttribute("class", `btn btn-primary btn2`);
    btn2.setAttribute("id", `current`);
    btn2.appendChild(document.createTextNode(`${current}`));
    btn2.addEventListener("click", (e) => {
      createBtn(parseInt(e.target.childNodes[0].wholeText));
    });
    pageElement.appendChild(btn2);
    if (next) {
      const btn3 = document.createElement("button");
      btn3.setAttribute("type", `button`);
      btn3.setAttribute("class", `btn btn-secondary btn3`);
      btn3.setAttribute("id", `next`);
      btn3.appendChild(document.createTextNode(`${next}`));
      btn3.addEventListener("click", (e) => {
        createBtn(parseInt(e.target.childNodes[0].wholeText));
      });
      pageElement.appendChild(btn3);
    }
    span.innerHTML = `${start} - ${end} of ${count}`;
  }
  
  pageDropValue.addEventListener("change", (e) => {
    e.preventDefault();
    // limit = parseInt(pageDropValue.value);
    localStorage.setItem("limit", parseInt(pageDropValue.value));
    location.reload();
  });
  //


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

logOut.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    location.replace("http://127.0.0.1:5000/Login/login.html");
    
  });