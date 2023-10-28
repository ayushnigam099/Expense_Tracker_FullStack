let day= document.getElementById('dailyDate');
let month= document.getElementById('monthlyMonth');
let dailyexpenseList = document.getElementById('daily-expense-list');
let monthexpenseList = document.getElementById('month-expense-list');


async function showDailyReport() {

    try {
        const date = {
            date: day.value,
        };
    
    const token  = localStorage.getItem('token');
    const { data } = await axios.post("http://localhost:5500/report/dailyreport", date, { headers: {"Authorization" : token} });
    dailyexpenseList.innerHTML=""
    for (let i = 0; i < data.data.length; i++) {
    const html = createExpenseElement(data.data[i]);
    dailyexpenseList.innerHTML = html+ dailyexpenseList.innerHTML;
    }
}
catch (err) {
    console.log(err);
    if(err.response.status== 404) { 
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

async function showMonthlyReport() {

    try {
        const monthly = {
            month: month.value,
        };
    
    const token  = localStorage.getItem('token');
    const { data } = await axios.post("http://localhost:5500/report/monthreport", monthly, { headers: {"Authorization" : token} });
    monthexpenseList.innerHTML=""
    for (let i = 0; i < data.data.length; i++) {
    const html = createExpenseElement(data.data[i]);
    monthexpenseList.innerHTML = html+ monthexpenseList.innerHTML;
    }
}
catch (err) {
    console.log(err);
    if(err.response.status== 404) { 
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

async function handleDownload() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:5500/report/download', {
          headers: { "Authorization": token }
        });
      
        if (response.status === 200) {
          const a = document.createElement("a");
          a.href = response.data.fileURl;
          a.download = 'myexpense.pdf';
          a.click();
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        console.error(err); // Handle the error directly
      }
      
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
</tr>`;
}