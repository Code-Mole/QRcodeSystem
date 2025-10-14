import React from 'react'


function Form() {
  return (
    <div className="formCotainer">
      <div className="message">
        <h1>Welcome to QR Code System</h1>
        <form action="" className="subFormCotainer">
          <input
            className="field"
            type="text"
            placeholder="Enter your name here"
          />
          <input
            className="field"
            type="text"
            placeholder="Enter your Program of study here"
          />
          <input
            className="field"
            type="text"
            placeholder="Enter your Phone number here"
          />
          <button className ="btn"type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Form