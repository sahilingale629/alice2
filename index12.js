const axios = require("axios"); // Ensure axios is installed with `npm install axios`
const crypto = require("crypto"); // Built-in module in Node.js

const BASE_URL =
  "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"; // Replace with your actual base URL

const userId = "488059"; // Replace with your actual user ID
const apiKey =
  "FTlDyv5M6j931VGZ6elvlU7HgWYkWy5IWrFeyAAF15QULcYIgsPS8Cyli4lFW481DF6sfDy7zkfNXQ6XFclL0RkuTIJeFRK566xOZM3qcQRhvIyn3AFiTrhIhdy883by"; // Replace with your actual API key

const apiUrl = "https://<your-api-domain>/ws/createWsSession"; // Replace with your actual API domain

// Define the Authorization Token
const authToken =
  "Bearer RC047 Fhrb2rt5G7Hav94X7aDZKObz2DPGVAIEQDoFcybzaeM4B3VmiYA3qbOtb4qUcRFYnHfuRGPRL3N9NZfUCc78Yrb5yFTg46dnloFlEUmOHOPzq7zGntAJARqDidhqk2rPDr08hgLqOR7TAnmeb5akhWnXuOyW1FyNAqCMMC82WdgiXI9VdKZRBTn5iMfV4Ur859plGDkjSbyV8iMpQAelCcm3l7Bb5DJfMnFnU7zUhhDv1eRsxmyXfBk1qWEprQNz";

// Define the payload
const payload = {
  loginType: "API",
};

// Define the headers
const headers = {
  Authorization: authToken,
  "Content-Type": "application/json",
};

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
    console.log("response :- ", response);
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

const createSession = async () => {
  try {
    const response = await axios.post(apiUrl, payload, { headers });

    // Check if the response is successful
    if (response.data.stat === "Ok") {
      console.log("Session Created Successfully!");
      console.log("Session ID:", response.data.result.wsSess);
    } else {
      console.log("Failed to Create Session:", response.data.message);
    }
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};

// Example usage:

authenticateUser(userId).then((sessionId) => {
  if (sessionId) {
    console.log("Authentication successful! Session ID:", sessionId);
  } else {
    console.log("Authentication failed.");
  }
});

// Call the function
createSession();
