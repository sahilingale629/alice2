const axios = require("axios"); // Make sure to install axios using `npm install axios`

const BASE_URL =
  "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"; // Replace with your actual base URL

const userId = "488059"; // Replace with your actual user ID

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

// Function to get Session ID
async function getSessionId(userId, userData) {
  try {
    const response = await axios.post(`${BASE_URL}customer/getUserSID`, {
      userId,
      userData,
    });

    return response.data.sessionId; // Adjust key name based on API response
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

    console.log("Fetching session ID...");
    const sessionId = await getSessionId(userId, encryptionKey);

    console.log("Session ID:", sessionId);

    return sessionId;
  } catch (error) {
    console.error("Error during authentication:", error);
    return null;
  }
}

// Example usage:

authenticateUser(userId).then((sessionId) => {
  if (sessionId) {
    console.log("Authentication successful! Session ID:", sessionId);
  } else {
    console.log("Authentication failed.");
  }
});
