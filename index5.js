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

// Step 2: Retrieve userSID from /customer/getUserSID using the encKey, apiKey, and userId
const getUserSID = async (encKey, apiKey, userId) => {
  const endpoint = "/customer/getUserSID"; // Endpoint for Step 2
  const data = {
    userId: userId, // Use the userId provided in the code
    userData: encKey, // Use the encKey obtained from Step 1
    apiKey: apiKey, // Include the API key
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
