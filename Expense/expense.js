const amountInput = document.querySelector('#amt');
const descriptionInput = document.querySelector('#des');
const myForm = document.querySelector('#my-form');
const categoryInput = document.querySelector('#cat');
const expenseList = document.getElementById('expense-list');

document.addEventListener('DOMContentLoaded', create);

async function create(e) {
    e.preventDefault();
    try{ 
    let {data}= await axios.get("http://localhost:5500/expense/getexpense")
    console.log(data);
    for (let i = 0; i < data.data.length; i++) {
        const html = createExpenseElement(data.data[i]);
        expenseList.innerHTML += html;
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
        <button class="delete-btn" onclick="onDelete(${expense.id})">Delete</button>
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
            const { data } = await axios.post("http://localhost:5500/expense/addexpense", details);
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

function onDelete(id) {
    axios.delete(`http://localhost:5500/expense/delete-expense/${id}`)
        .then(() => {
            alert("Selected User Details has been removed from Database!");
        })
        .catch(err => console.error(err));

    // Remove the entry from the DOM
    const entryToRemove = document.querySelector(`[data-id="${id}"]`);
    if (entryToRemove) {
        entryToRemove.remove();
    }
}

