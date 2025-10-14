import React from 'react'

function Login() {
  return (
    <div className="formCotainer">
      <h1>Admin Login</h1>
      <form action="" className="subFormCotainer">
        <input className='field' type="text" placeholder="Email" />
        <input 
        className='field'
        type="password" placeholder="Password" />
        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login