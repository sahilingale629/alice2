const axios = require("axios"); // Ensure axios is installed with `npm install axios`
const crypto = require("crypto"); // Built-in module in Node.js

const BASE_URL =
  "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"; // Replace with your actual base URL

const userId = "488059"; // Replace with your actual user ID
const apiKey =
  "FTlDyv5M6j931VGZ6elvlU7HgWYkWy5IWrFeyAAF15QULcYIgsPS8Cyli4lFW481DF6sfDy7zkfNXQ6XFclL0RkuTIJeFRK566xOZM3qcQRhvIyn3AFiTrhIhdy883by"; // Replace with your actual API key

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
    const encryptionKey = await getEncryptionKey(userId);
    const userData = hashUserData(userId, apiKey, encryptionKey);
    const sessionId = await getSessionId(userId, userData);
    return sessionId;
  } catch (error) {
    console.error("Error during authentication:", error);
    return null;
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

// Example usage
(async () => {
  try {
    const sessionId = await authenticateUser(userId);
    if (sessionId) {
      console.log("Authentication successful! Session ID:", sessionId);

      // Assuming `sessionId` is required as a token
      const wsSession = await createWebSocketSession(sessionId);
      console.log("WebSocket Session created:", wsSession);
    } else {
      console.log("Authentication failed.");
    }
  } catch (error) {
    console.error("Error in example usage:", error);
  }
})();
