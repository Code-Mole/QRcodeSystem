import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

function QRcode() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    // Fetch a unique token from the backend
    const fetchToken = async () => {
      try {
        const res = await fetch(
          "https://qrcode-system-backend.onrender.com/api/token"
        );
        const data = await res.json();
        setToken(data.token);
  // point to app root which renders the Form component
  const qrUrl = `${window.location.origin}/?token=${data.token}`;
        // Generate QR code data URL using qrcode
        QRCode.toDataURL(qrUrl, { width: 256 }, (err, url) => {
          if (err) {
            setQrDataUrl("");
          } else {
            setQrDataUrl(url);
          }
        });
      } catch (error) {
        console.log(error);
        setToken("ERROR");
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Scan to Fill Out Form</h1>
      {loading ? (
        <p>Loading QR code...</p>
      ) : token === "ERROR" ? (
        <p>Failed to generate QR code.</p>
      ) : qrDataUrl ? (
        <img src={qrDataUrl} alt="QR Code" width={256} height={256} />
      ) : (
        <p>Failed to generate QR code image.</p>
      )}
      <p style={{ marginTop: "1rem" }}>This QR code is single-use.</p>
    </div>
  );
}

export default QRcode;
