require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

const BASE_URL = process.env.BASE_URL;
const userId = process.env.USER_ID;
const apiKey = process.env.API_KEY;

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
  return crypto.createHash("sha256").update(data).digest("hex");
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

// Function to create WebSocket session
async function createWebSocketSession(bearerToken) {
  try {
    const response = await axios.post(
      `${BASE_URL}ws/createWsSession`,
      {
        loginType: "API",
      },
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    console.log("WebSocket Session:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error in createWebSocketSession:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Main function to authenticate and create a WebSocket session
async function main() {
  try {
    console.log("Starting authentication process...");

    // Step 1: Get Encryption Key
    const encryptionKey = await getEncryptionKey(userId);
    console.log("Encryption Key retrieved.");

    // Step 2: Generate User Data Hash
    const userData = hashUserData(userId, apiKey, encryptionKey);
    console.log("User Data hashed.");

    // Step 3: Get Session ID
    const sessionId = await getSessionId(userId, userData);
    console.log("Session ID retrieved:", sessionId);

    // Step 4: Create WebSocket Session
    const wsSession = await createWebSocketSession(sessionId);
    console.log("WebSocket Session created successfully:", wsSession);
  } catch (error) {
    console.error("Error in the process:", error.message);
  }
}

// Run the main function
main();
