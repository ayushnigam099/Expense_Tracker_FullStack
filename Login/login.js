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
        // window.location.href= " " // Change the page on successful account creation
    }
  }
  catch(err)
  {
    console.log(err);
    if(err.response.data.err=="Invalid Password")
    {
        alert("Invalid Password");
       
    }
    else if(err.response.data.err=="Please Fill All The Entries!") { 
      document.body.innerHTML+= `<div style = "color:red;"> All Fields Are Required!</div>`;
      
    }
    else if(err.response.data.Message=="User Not Found") { 
        alert("User Not Found");
      }
      else{
        document.body.innerHTML+= `<div style = "color:red;"> ${err}</div>`;
        return;
      }
     
  }
}
//END: SignIn Listener
