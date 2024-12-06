const axios = require("axios"); // Ensure axios is installed with `npm install axios`
const crypto = require("crypto"); // Built-in module in Node.js
const WebSocket = require("ws");

const BASE_URL =
  "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"; // Replace with your actual base URL

const userId = "488059"; // Replace with your actual user ID
const apiKey =
  "FTlDyv5M6j931VGZ6elvlU7HgWYkWy5IWrFeyAAF15QULcYIgsPS8Cyli4lFW481DF6sfDy7zkfNXQ6XFclL0RkuTIJeFRK566xOZM3qcQRhvIyn3AFiTrhIhdy883by"; // Replace with your actual API key

// WebSocket connection
const wsUrl = "wss://ws1.aliceblueonline.com/NorenWS";
const client_id = "488059"; // Replace with your client ID
const session_id = ""; // Replace with your session ID

const ws = new WebSocket(wsUrl);

// Function to get Encryption Key
async function getEncryptionKey(userId) {
  try {
    const response = await axios.post(`${BASE_URL}customer/getAPIEncpkey`, {
      userId,
    });

    return response.data.encKey; // Adjust key name based on API response
  } catch (error) {
    console.error(
      "Error in getEncryptionKey:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Function to hash userData using SHA-256
function hashUserData(userId, apiKey, encryptionKey) {
  const data = `${userId}${apiKey}${encryptionKey}`;
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  return hash;
}

// Function to get Session ID
async function getSessionId(userId, userData) {
  try {
    const response = await axios.post(`${BASE_URL}customer/getUserSID`, {
      userId,
      userData,
    });

    return response.data.sessionID; // Adjust key name based on API response
  } catch (error) {
    console.error(
      "Error in getSessionId:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Main function to call both APIs sequentially
async function authenticateUser(userId) {
  try {
    console.log("Fetching encryption key...");
    const encryptionKey = await getEncryptionKey(userId);

    console.log("Encryption Key:", encryptionKey);

    console.log("Hashing user data...");
    const userData = hashUserData(userId, apiKey, encryptionKey);
    console.log("user id : - ", userId);
    console.log("api key  : - ", apiKey);
    console.log("encryption key : - ", encryptionKey);
    console.log("Hashed User Data:", userData);

    console.log("Fetching session ID...");
    const sessionId = await getSessionId(userId, userData);

    console.log("Session ID:", sessionId);

    return sessionId;
  } catch (error) {
    console.error("Error during authentication:", error);
    return null;
  }
}

async function sha256_encryption(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// Example usage:

authenticateUser(userId).then((sessionId) => {
  if (sessionId) {
    console.log("Authentication successful! Session ID:", sessionId);
  } else {
    console.log("Authentication failed.");
  }
});

console.log("authenticate user :- ", authenticateUser(userId).then(session_id));

// ws.onopen = async () => {
//   // Create the request payload
//   const susertoken = await sha256_encryption(
//     await sha256_encryption(session_id)
//   );
//   const request = {
//     susertoken: susertoken,
//     t: "c",
//     actid: client_id + "_API",
//     uid: client_id + "_API",
//     source: "API",
//   };

//   // Send the request as a JSON string
//   ws.send(JSON.stringify(request));
// };

// // Event handler for when the WebSocket receives a message
// ws.onmessage = (event) => {
//   const response = JSON.parse(event.data);

//   if (response.t === "cf" && response.k === "OK") {
//     console.log("Connection successful");
//   } else if (response.t === "cf" && response.k === "failed") {
//     console.log("Validation failed");
//   }
// };

// // Event handler for WebSocket errors
// ws.onerror = (error) => {
//   console.error("WebSocket Error: ", error);
// };

// // Event handler for WebSocket closure
// ws.onclose = (event) => {
//   console.log("WebSocket connection closed:", event);
// };
