const amountInput = document.querySelector('#amt');
const descriptionInput = document.querySelector('#des');
const myForm = document.querySelector('#my-form');
const categoryInput = document.querySelector('#cat');
const entryDiv = document.getElementById('entry');

document.addEventListener('DOMContentLoaded', create);

function create() {
    axios.get("http://localhost:5500/expense/getexpense")
        .then(({ data }) => {
            for (let i = 0; i < data.data.length; i++) {
                const html = createExpenseElement(data.data[i]);
                entryDiv.innerHTML += html;
            }
        })
        .catch(err => console.error(err));
}

function createExpenseElement(expense) {
    return `
        <div class="new-div">
            ${expense.amount}
            🔶${expense.category}🔶
            ${expense.description}
            <button style="background-color: red; color: white; border-color: red;" 
                    onclick="onDelete(${expense.id})">Delete</button>
            <button style="background-color: green; color: white; border-color: green;" 
                    onclick="onEdit(${expense.id})">Edit</button>
        </div>`;
}

myForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();
    if (amountInput.value === '' || descriptionInput.value === '' || categoryInput.value === '') {
        alert('Please enter all fields');
    } else {
        const details = {
            Amount: amountInput.value,
            Description: descriptionInput.value,
            Category: categoryInput.value,
        };

        try {
            const { data } = await axios.post("http://localhost:4000/expense/addexpense", details);
            addOneDetail(data.Success.id);
            alert('Details Successfully Saved!');
        } catch (err) {
            console.error(err);
            alert("Duplicate Entry Found, Please Register Again!");
        }
    }
}

async function addOneDetail(ID) {
    try {
        const { data } = await axios.get(`http://localhost:4000/expense/getone/${ID}`);
        entryDiv.innerHTML += createExpenseElement(data.data);
    } catch (err) {
        console.error(err);
    }
}

function onDelete(id) {
    axios.delete(`http://localhost:4000/expense/delete-expense/${id}`)
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

