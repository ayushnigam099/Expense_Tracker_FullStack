// START: SignUp Listener
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
        window.location.href= " " // Change the page on successful account creation
    }
    else{
        throw new Error("Failed to login");
    }
  }
  catch(err)
  {
    console.log(err)
    if(err.response.data.name=="SequelizeUniqueConstraintError")
    {
      document.body.innerHTML+= `<div style = "color:red;">Email Already Registered</div>`;
      return;
    }
    else if(err.response.data.err=="Please Fill All The Entries!") { 
      document.body.innerHTML+= `<div style = "color:red;"> All Fields Are Required!</div>`;
      return;
    }
     document.body.innerHTML+= `<div style = "color:red;"> ${err}</div>`;
  }
}
//END: SignUp Listener
