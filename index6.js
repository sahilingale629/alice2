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

    // Check if response contains the encKey field
    if (response.data && response.data.encKey) {
      const encKey = response.data.encKey; // Assuming the response contains encKey in response.data.encKey
      console.log("encKey retrieved:", encKey);

      // Step 2: Concatenate userId, apikey, and encKey
      const userId = "488059"; // Replace with your actual userId
      const apikey =
        "FTlDyv5M6j931VGZ6elvlU7HgWYkWy5IWrFeyAAF15QULcYIgsPS8Cyli4lFW481DF6sfDy7zkfNXQ6XFclL0RkuTIJeFRK566xOZM3qcQRhvIyn3AFiTrhIhdy883by"; // Your apikey

      const concatenatedString = `${userId}${apikey}${encKey}`; // Concatenate the values
      console.log("Concatenated String:", concatenatedString);

      // Step 3: Hash the concatenated string using SHA-256
      const hash = crypto.createHash("sha256");
      hash.update(concatenatedString); // Update the hash with the concatenated string
      const hashedString = hash.digest("hex"); // Get the resulting hash in hexadecimal format

      console.log("SHA-256 Hash:", hashedString);

      return hashedString; // Return the hashed string for further use
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




getEncKey(); // Call the function to test
