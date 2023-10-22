async function forgetPassword(e){
    e.preventDefault();
    
  try{
    const details={
        email: e.target.email.value
    }
    const response= await axios.post("http://localhost:5500/password/forgotpassword", details);
    if(response.status === 200)     
    {
        alert("Reset Link Has Been Sent To Your Mail!")
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
