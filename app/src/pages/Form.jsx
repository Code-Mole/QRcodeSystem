import React, { useEffect, useState } from "react";

function Form() {
  const [tokenValid, setTokenValid] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Get token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setTokenValid(false);
      setError("No token provided.");
      return;
    }
    // Validate token with backend
    fetch("http://localhost:5000/api/token/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTokenValid(data.valid);
        if (!data.valid) setError("Invalid or expired token.");
      })
      .catch(() => {
        setTokenValid(false);
        setError("Error validating token.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    // TODO: send form data to backend if needed
    // Invalidate token after submit
    await fetch("http://localhost:5000/api/token/invalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    setTokenValid(false);
    setSubmitting(false);
    setError("Token used. Thank you!");
  };

  return (
    <div className="formCotainer">
      <div className="message">
        <h1>Welcome to QR Code System</h1>
        {tokenValid === false ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <form className="subFormCotainer" onSubmit={handleSubmit}>
            <input
              className="field"
              type="text"
              placeholder="Enter your name here"
              required
            />
            <input
              className="field"
              type="text"
              placeholder="Enter your Program of study here"
              required
            />
            <input
              className="field"
              type="text"
              placeholder="Enter your Phone number here"
              required
            />
            <button
              className="btn"
              type="submit"
              disabled={submitting || tokenValid === false}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Form;
