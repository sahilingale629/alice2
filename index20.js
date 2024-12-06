const WebSocket = require("ws");
const crypto = require("crypto");

// Session ID and client ID
const sessionId =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE3Mzg2Mzg2NTYsImlhdCI6MTczMzQ1NDY1NiwianRpIjoiMjJkMjIwYjYtODI5Yi00ZDA3LWExZDUtYzgxYzg5NjU1NzVlIiwiaXNzIjoiaHR0cHM6Ly9pZGFhcy5hbGljZWJsdWVvbmxpbmUuY29tL2lkYWFzL3JlYWxtcy9BbGljZUJsdWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMTlkODYyMDUtNjQ1OC00NGM0LWJmMWQtYmMxMzJhZTVmZmFmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWxpY2Uta2IiLCJzaWQiOiI2NTVlYTc0Mi00NTdmLTQwZmYtOThkMC0wM2JmMWRjMTUxMWEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIG9wZW5pZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1Y2MiOiI0ODgwNTkiLCJjbGllbnRSb2xlIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdLCJuYW1lIjoiS0FVU1RVQkggQkVERUtBUiIsIm1vYmlsZSI6Ijg2MjQwMzk3MzciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0ODgwNTkiLCJnaXZlbl9uYW1lIjoiS0FVU1RVQkgiLCJmYW1pbHlfbmFtZSI6IkJFREVLQVIiLCJlbWFpbCI6InNoYXJlbWFudHJhLmluZm9AZ21haWwuY29tIn0.EOpeKYzYmFD4t_VhDLyZ32-2lTLdojWV25KyMSReNDdzj4vNH57uLUQGluKklSuMa7IWNIoa8zVxenEs43vew9q05znuMZzcP-87_WPxAPUx4Ne5Khr9jOrkjV5NtQTPzi_LxmAB_Gunyx4ZXQ0jRoxAdoBkv3RyWKBS_NmMDADTmS98erb_7HcIMQ6vWKucRA3-htpNZo9AzAQWb2AJlHYpsFDcr8ua77w3bhasdt0mAbZH-4wZ2wCROYVTIVewfht5O8_K4iN3B2VrmFAkoJq3cTpaI2AnohpaFj15BXPgb8j5Q9vUCVc_8R2SY_zho28X1ubjvKrRM4PFRvR45g";
const clientId = "488059";

// Generate double SHA-256 token
function generateToken(sessionId) {
  const hash1 = crypto.createHash("sha256").update(sessionId).digest("hex");
  const hash2 = crypto.createHash("sha256").update(hash1).digest("hex");
  return hash2;
}

const susertoken = generateToken(sessionId);

// WebSocket URL
const wsURL = "wss://ws1.aliceblueonline.com/NorenWS";

// WebSocket connection options to handle upgrade headers
const options = {
  headers: {
    Upgrade: "websocket",
    Connection: "Upgrade",
    "Sec-WebSocket-Key": crypto.randomBytes(16).toString("base64"),
    "Sec-WebSocket-Version": "13",
  },
};

// Create WebSocket connection with options
const ws = new WebSocket(wsURL, options);

// Handle WebSocket open
ws.on("open", () => {
  console.log("WebSocket connection established.");

  // Send authentication request
  const authRequest = {
    susertoken: susertoken,
    t: "c",
    actid: `${clientId}_API`,
    uid: `${clientId}_API`,
    source: "API",
  };

  ws.send(JSON.stringify(authRequest));
  console.log("Authentication request sent:", authRequest);
});

// Handle incoming messages
ws.on("message", (data) => {
  try {
    const response = JSON.parse(data);
    console.log("Received message:", response);

    // Authentication response handling
    if (response.t === "cf") {
      if (response.k === "OK") {
        console.log("Authentication successful.");

        // Example: Subscribe to market data
        const subscriptionRequest = {
          k: "NFO|54957#MCX|239484",
          t: "t",
        };
        ws.send(JSON.stringify(subscriptionRequest));
        console.log(
          "Market data subscription request sent:",
          subscriptionRequest
        );
      } else {
        console.error("Authentication failed:", response);
      }
    }
  } catch (err) {
    console.error("Error parsing WebSocket message:", err);
  }
});

// Handle WebSocket errors
ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});

// Handle WebSocket closure
ws.on("close", (code, reason) => {
  console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
});
