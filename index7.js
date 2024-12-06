const axios = require("axios");
const crypto = require("crypto"); // Required for SHA-256 hashing

const BASE_URL = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api"; // Base URL

// Declare a global variable to store the hash string
let globalHashString = "";
const userId = "488059";

// Step 1: Retrieve encKey from /customer/getAPIEncpkey
const getEncKey = async () => {
  const endpoint = "/customer/getAPIEncpkey"; // Endpoint for Step 1
  const data = {
    userId: "488059", // Use environment variables for sensitive data
    userData:
      "b66203f900696c7305a34f62f66aa0cb4b5cecd76974dde75b1838cf3288333b", // Encrypted data (use environment variables)
  };

  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response contains the encKey field
    if (response.data && response.data.encKey) {
      const encKey = response.data.encKey; // Assuming the response contains encKey in response.data.encKey
      console.log("encKey retrieved:", encKey);

      // Step 2: Concatenate userId, apikey, and encKey
      const userId = "488059"; // Replace with actual userId from env
      const apikey =
        "FTlDyv5M6j931VGZ6elvlU7HgWYkWy5IWrFeyAAF15QULcYIgsPS8Cyli4lFW481DF6sfDy7zkfNXQ6XFclL0RkuTIJeFRK566xOZM3qcQRhvIyn3AFiTrhIhdy883by"; // Use actual apikey from env

      const concatenatedString = `${userId}${apikey}${encKey}`; // Concatenate the values
      console.log("Concatenated String:", concatenatedString);

      // Step 3: Hash the concatenated string using SHA-256
      const hash = crypto.createHash("sha256");
      hash.update(concatenatedString); // Update the hash with the concatenated string
      globalHashString = hash.digest("hex"); // Store the resulting hash in the global variable

      console.log("SHA-256 Hash:", globalHashString);

      return globalHashString; // Return the global hash string
    } else {
      console.error("encKey not found in the response data:", response.data);
      throw new Error("encKey not found in the response.");
    }
  } catch (error) {
    if (error.response) {
      // Server responded with a non-2xx status code
      console.error("Error retrieving encKey:", error.response.data);
    } else {
      // Something went wrong in the request
      console.error("Error retrieving encKey:", error.message);
    }
    throw error; // Propagate the error to handle it higher up if needed
  }
};

function sendData(userId, userData) {
  const headers = {
    "Content-Type": "application/json",
  };

  const data = {
    userId: "488059",
    userData: globalHashString,
  };

  axios
    .post(
      "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/customer/getUserSID",
      data,
      { headers }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Call the function to test
getEncKey().catch((error) => {
  console.error("Error in getEncKey function:", error.message);
});
console.log(`global hash String: ${globalHashString}`);

sendData(userId, globalHashString);

// You can use `globalHashString` directly in other parts of your code
