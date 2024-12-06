// Dependencies
const crypto = require("crypto");
const WebSocket = require("ws");

// Inputs
const session_id =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE3Mzg1NTIyODMsImlhdCI6MTczMzM2ODI4MywianRpIjoiYWQ1Nzk5MWYtOGZkNS00ZWYxLWI2ODktMTM5NTZmNDM4ODhmIiwiaXNzIjoiaHR0cHM6Ly9pZGFhcy5hbGljZWJsdWVvbmxpbmUuY29tL2lkYWFzL3JlYWxtcy9BbGljZUJsdWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMTlkODYyMDUtNjQ1OC00NGM0LWJmMWQtYmMxMzJhZTVmZmFmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWxpY2Uta2IiLCJzaWQiOiI2MDkzMWQxMS05ODg5LTRhNzAtOTRiYi0xNDVlYjQzMmIwYjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIG9wZW5pZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1Y2MiOiI0ODgwNTkiLCJjbGllbnRSb2xlIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdLCJuYW1lIjoiS0FVU1RVQkggQkVERUtBUiIsIm1vYmlsZSI6Ijg2MjQwMzk3MzciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0ODgwNTkiLCJnaXZlbl9uYW1lIjoiS0FVU1RVQkgiLCJmYW1pbHlfbmFtZSI6IkJFREVLQVIiLCJlbWFpbCI6InNoYXJlbWFudHJhLmluZm9AZ21haWwuY29tIn0.aaQYVbzwPSAMFS67M9Rp3iqe4TFL1trzfsde2P_DCeNNVmt-Acw7SpQ8YcnhJ2Q7Uz6vl8j4DVd8awICkvdW_GDA6xrUgmooHkF9bFzmAf0I5FwoibV3R8kCY9tB-UTpAbCsorbbqAKgbNOGuRR_Vf5fXEcdU4OBv8yqUw22ck-0601ALj1AqI5Vp9TgQNezKL4o44n8Bzh_jMG3R1bNLGTpShp3UdBVJKw1MOhhlIYRm7-DQzbdJifjB7-QyRaQBruwTPR9_DO3huGCFLXBbv1M1GujqdrqbzRRoYaru9ykn3NyDs-UzDyfFXDaYglhr_I6WEQNj7xFx19lMx50-w";
const client_id = "488059";

// Generate `susertoken` (double SHA256 encryption)
const hashedSession = crypto
  .createHash("sha256")
  .update(session_id)
  .digest("hex");
const susertoken = crypto
  .createHash("sha256")
  .update(hashedSession)
  .digest("hex");

// WebSocket URL
const ws_url = "wss://ws1.aliceblueonline.com/NorenWS";

// Request payload
const requestPayload = {
  susertoken: susertoken,
  t: "c",
  actid: `${client_id}_API`,
  uid: `${client_id}_API`,
  source: "API",
};

// WebSocket implementation

const ws = new WebSocket(ws_url);

ws.on("open", function open() {
  console.log("WebSocket connection opened");

  // Send the request
  ws.send(JSON.stringify(requestPayload));
});

ws.on("message", function incoming(data) {
  console.log("Response from server:", data);

  // Close the connection after receiving the response
  ws.close();
});

ws.on("error", function error(err) {
  console.error("WebSocket error:", err);
});

ws.on("close", function close() {
  console.log("WebSocket connection closed");
});
