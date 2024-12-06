const axios = require("axios");
const crypto = require("crypto"); // Required for SHA-256 hashing

const BASE_URL = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api"; // Base URL

// Step 1: Retrieve encKey from /customer/getAPIEncpkey
const getEncKey = async () => {
  const endpoint = "/customer/getAPIEncpkey"; // Endpoint for Step 1
  const data = {
    userId: "488059", // Replace with your actual userId
    userData: "U2FsdGVkX18wKWRDAjdqPced0UptKdLyX3+dTIHd+a0=", // Encrypted data (replace with your actual encrypted data)
  };

  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const encKey = response.data.encKey; // Assuming the response contains encKey in response.data.encKey
    console.log("encKey retrieved:", encKey);
    return encKey; // Return the encKey for Step 2
  } catch (error) {
    console.error(
      "Error retrieving encKey:",
      error.response ? error.response.data : error.message
    );
    throw error; // Propagate the error to handle it higher up if needed
  }
};

// Step 2: Retrieve userSID from /customer/getUserSID using the encKey
const getUserSID = async (encKey) => {
  const endpoint = "/customer/getUserSID"; // Endpoint for Step 2
  const data = {
    userId: "488059", // Replace with your actual userId
    userData: encKey, // Use the encKey obtained from Step 1
  };

  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const userSID = response.data.userSID; // Assuming the response contains userSID in response.data.userSID
    console.log("userSID retrieved:", userSID);
    return userSID; // Return the userSID for further use
  } catch (error) {
    console.error(
      "Error retrieving userSID:",
      error.response ? error.response.data : error.message
    );
  }
};

// Step 3: Generate Session ID using SHA-256
const generateSessionID = (userId, apiKey, encKey) => {
  // Concatenate userId, apiKey, and encKey
  const concatenatedString = `${userId}${apiKey}${encKey}`;

  // Hash the concatenated string using SHA-256
  const hash = crypto.createHash("sha256");
  hash.update(concatenatedString);
  const sessionID = hash.digest("hex"); // Session ID as hexadecimal

  console.log("Generated Session ID:", sessionID);
  return sessionID;
};

// Main execution
(async () => {
  try {
    const userId = "488059"; // Replace with your actual userId
    const apiKey =
      "FTlDyv5M6j931VGZ6elvlU7HgWYkWy5IWrFeyAAF15QULcYIgsPS8Cyli4lFW481DF6sfDy7zkfNXQ6XFclL0RkuTIJeFRK566xOZM3qcQRhvIyn3AFiTrhIhdy883by";
    const encKey = await getEncKey(); // Step 1: Retrieve encKey

    if (encKey) {
      const userSID = await getUserSID(encKey); // Step 2: Retrieve userSID

      if (userSID) {
        // Step 3: Generate the Session ID using the userId, apiKey, and encKey
        const sessionID = generateSessionID(userId, apiKey, encKey);
        // Now you can use sessionID for the rest of the API calls
        console.log(sessionID);
      }
    }
  } catch (error) {
    console.error("Process failed:", error.message);
  }
})();
