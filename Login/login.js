// START: SignIn Listener
async function SignIn(e){
    e.preventDefault();
    
  try{
    const details={
        email: e.target.email.value,
        password: e.target.password.value
    }
    const response= await axios.post("http://localhost:5500/user/signin", details);
    if(response.status === 200)     
    {
        alert("User Successfully Logged In!")
        localStorage.setItem("token", response.data.token);
        // window.location.href="../Expense/expense.html"
    }
  }
  catch(err)
  {
    // console.log(err);
    if(err.response.status== 404)
    {
        alert('User does not exist');
       
    }
    else if(err.response.status== 400) { 
      alert(`${err.response.data.message}`);
      
    }
      else if(err.response.status== 500){
        alert(`${err.response.data.message}`);
      }
      else{
        document.body.innerHTML+= `<div style = "color:red;"> ${err}</div>`;
      }
  }
}
//END: SignIn Listener
