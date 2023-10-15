const amountInput = document.querySelector('#amt');
const descriptionInput = document.querySelector('#des');
const myForm = document.querySelector('#my-form');
const categoryInput = document.querySelector('#cat');
const expenseList = document.getElementById('expense-list');

document.addEventListener('DOMContentLoaded', create);

async function create(e) {
    e.preventDefault();
    try{ 
    let token= localStorage.getItem("token");
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
