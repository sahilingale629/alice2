const WebSocket = require("ws");
const wss = new WebSocket("wss://ws1.aliceblueonline.com/NorenWS");

const username = "488059";
const sessionId =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE3Mzg2Mzg2NTYsImlhdCI6MTczMzQ1NDY1NiwianRpIjoiMjJkMjIwYjYtODI5Yi00ZDA3LWExZDUtYzgxYzg5NjU1NzVlIiwiaXNzIjoiaHR0cHM6Ly9pZGFhcy5hbGljZWJsdWVvbmxpbmUuY29tL2lkYWFzL3JlYWxtcy9BbGljZUJsdWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMTlkODYyMDUtNjQ1OC00NGM0LWJmMWQtYmMxMzJhZTVmZmFmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWxpY2Uta2IiLCJzaWQiOiI2NTVlYTc0Mi00NTdmLTQwZmYtOThkMC0wM2JmMWRjMTUxMWEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIG9wZW5pZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1Y2MiOiI0ODgwNTkiLCJjbGllbnRSb2xlIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdLCJuYW1lIjoiS0FVU1RVQkggQkVERUtBUiIsIm1vYmlsZSI6Ijg2MjQwMzk3MzciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0ODgwNTkiLCJnaXZlbl9uYW1lIjoiS0FVU1RVQkgiLCJmYW1pbHlfbmFtZSI6IkJFREVLQVIiLCJlbWFpbCI6InNoYXJlbWFudHJhLmluZm9AZ21haWwuY29tIn0.EOpeKYzYmFD4t_VhDLyZ32-2lTLdojWV25KyMSReNDdzj4vNH57uLUQGluKklSuMa7IWNIoa8zVxenEs43vew9q05znuMZzcP-87_WPxAPUx4Ne5Khr9jOrkjV5NtQTPzi_LxmAB_Gunyx4ZXQ0jRoxAdoBkv3RyWKBS_NmMDADTmS98erb_7HcIMQ6vWKucRA3-htpNZo9AzAQWb2AJlHYpsFDcr8ua77w3bhasdt0mAbZH-4wZ2wCROYVTIVewfht5O8_K4iN3B2VrmFAkoJq3cTpaI2AnohpaFj15BXPgb8j5Q9vUCVc_8R2SY_zho28X1ubjvKrRM4PFRvR45g";
const accessToken =
  "Bearer RC047 Fhrb2rt5G7Hav94X7aDZKObz2DPGVAIEQDoFcybzaeM4B3VmiYA3qbOtb4qUcRFYnHfuRGPRL3N9NZfUCc78Yrb5yFTg46dnloFlEUmOHOPzq7zGntAJARqDidhqk2rPDr08hgLqOR7TAnmeb5akhWnXuOyW1FyNAqCMMC82WdgiXI9VdKZRBTn5iMfV4Ur859plGDkjSbyV8iMpQAelCcm3l7Bb5DJfMnFnU7zUhhDv1eRsxmyXfBk1qWEprQNz";

wss.auth = { username, sessionId, accessToken };

wss.on("open", () => {
  console.log("Connected to Alice Blue WebSocket");
});

wss.on("close", () => {
  console.log("Disconnected from Alice Blue WebSocket");
});

wss.on("message", (message) => {
  console.log(`Received message: ${message}`);
  // Process the message as needed
});

wss.on("error", (error) => {
  console.error("Error occurred:", error);
});

wss.on("disconnect", () => {
  console.log("Disconnected from Alice Blue WebSocket");
});
