import React, { useEffect, useState } from "react";

function Form() {
  const [tokenValid, setTokenValid] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [contact, setContact] = useState("");

  // Get token from URL and validate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setTokenValid(false);
      setError("No token provided.");
      return;
    }

    fetch("https://qrcode-system-backend.onrender.com/api/token/validate", {
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
    setError("");
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    try {
      // Register user with backend, include the QR token as accessCode
      const registerRes = await fetch(
        "https://qrcode-system-backend.onrender.com/api/users/registerUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, program, contact, accessCode: token }),
        }
      );

      const registerData = await registerRes.json().catch(() => ({}));
      if (!registerRes.ok) {
        setError(
          registerData.msg || registerData.message || "Failed to submit form"
        );
        setSubmitting(false);
        return;
      }

      // Invalidate token after successful registration
      const invalidateRes = await fetch(
        "https://qrcode-system-backend.onrender.com/api/token/invalidate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      if (!invalidateRes.ok) {
        const data = await invalidateRes.json().catch(() => ({}));
        setError(data.error || data.message || "Failed to invalidate token");
        setSubmitting(false);
        return;
      }

      // On success, redirect to Classic Pictures
      window.location.href = "https://classicpictures.net/";
    } catch (err) {
      setError("Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  const logo = "/logo.JPG";

  return (
    <div className="formCotainer">
      <div className="logo">
        <img src={logo} alt="Classic Pictures" />
        {tokenValid === false ? (
          <p style={{ color: "red" ,fontSize: "25px"}}>{error}</p>
        ) : (
          <>
            <h2 style={{ marginTop: 8, color: "#333" }}>
              Welcome to Classic Pictures
            </h2>
            <p style={{ maxWidth: 560, margin: "8px auto", color: "#555" }}>
              We're delighted to have you here — please complete the short form
              below and you'll be redirected to our site when your submission is
              successful.
            </p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className="subFormCotainer" onSubmit={handleSubmit}>
              <input
                className="field"
                type="text"
                placeholder="Enter your name here"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="field"
                type="text"
                placeholder="Enter your Program of study here"
                required
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              />
              <input
                className="field"
                type="text"
                placeholder="Enter your Phone number here"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <button
                className="btn"
                type="submit"
                disabled={submitting || tokenValid === false}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Form;
