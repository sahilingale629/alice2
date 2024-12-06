const axios = require("axios");

const BASE_URL = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api"; // Base URL

// Step 1: Retrieve encKey
const getEncKey = async () => {
  const endpoint = "/customer/getAPIEncpkey"; // Endpoint for Step 1
  const data = {
    userId: "488059",
    userData: "U2FsdGVkX18wKWRDAjdqPced0UptKdLyX3+dTIHd+a0=",
  };

  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const encKey = response.data.encKey; // Assuming encKey is in response.data.encKey
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

// Step 2: Use encKey for the next API call
const useEncKey = async (encKey) => {
  const endpoint = "/some/nextEndpoint"; // Replace with the actual endpoint for Step 2
  const data = {
    encKey: encKey,
    someOtherData: "ExampleData",
  };

  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Step 2 response:", response.data);
  } catch (error) {
    console.error(
      "Error in Step 2:",
      error.response ? error.response.data : error.message
    );
  }
};

// Main execution
(async () => {
  try {
    const encKey = await getEncKey(); // Step 1: Retrieve encKey
    await useEncKey(encKey); // Step 2: Use encKey in next API call
  } catch (error) {
    console.error("Process failed:", error.message);
  }
})();
