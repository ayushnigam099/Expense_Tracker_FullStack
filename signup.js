// START: SignUp Listener
async function SignUp(e){
    e.preventDefault();
    
  try{
    const details={
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value
    }
    const response= await axios.post("http://localhost:5500/user/signup", details);
    if(response.status === 200)     
    {
        window.location.href= "./Login/login.html" // Change the page on successful account creation
    }
    else{
        throw new Error("Failed to login");
    }
  }
  catch(err)
  {
    document.body.innerHTML+= `<div style = "color:red;"> ${err}</div>`;
  }
}
//END: SignUp Listener

// 