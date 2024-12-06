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
    //console.log(response);
    // const authorizationHeader = response.headers["authorization"];
    // console.log(authorizationHeader);
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
    console.log(response);
    const authorizationHeader = response.headers["authHeader"];
    //console.log(authorizationHeader);

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
    // console.log("Fetching encryption key...");
    const encryptionKey = await getEncryptionKey(userId);

    // console.log("Encryption Key:", encryptionKey);

    // console.log("Hashing user data...");
    const userData = hashUserData(userId, apiKey, encryptionKey);
    // console.log("user id : - ", userId);
    // console.log("api key  : - ", apiKey);
    // console.log("encryption key : - ", encryptionKey);
    // console.log("Hashed User Data:", userData);

    // console.log("Fetching session ID...");
    const sessionId = await getSessionId(userId, userData);

    // console.log("Session ID:", sessionId);

    return sessionId;
  } catch (error) {
    console.error("Error during authentication:", error);
    return null;
  }
}

// // Example usage:
// const session__id = await authenticateUser(userId);
// console.log("newwnenwnwnew :- ", session__id);
 function authenticateUser(userId).then((sessionId) => {
  if (sessionId) {
    //console.log("Authentication successful! Session ID:", sessionId);
  } else {
    console.log("Authentication failed.");
  }
});

async function createWebSocketSession() {
  const response = await axiosInstance.post(
    `${BASE_URL}ws/createWsSession`,
    {
      loginType: "API",
    },
    {
      headers: {
        Authorization: BEARER_TOKEN,
      },
    }
  );
  console.log(response.data);
  return response.data;
}
authenticateUser(userId);

await createWebSocketSession();
