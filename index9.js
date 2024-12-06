const BASE_URL =
  "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"; // Replace with your actual base URL

const userId = "488059"; // Replace with your actual user ID

// Function to get Encryption Key
async function getEncryptionKey(userId) {
  try {
    const response = await fetch(`${BASE_URL}customer/getAPIEncpkey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch encryption key: ${response.statusText}`);
    }

    const data = await response.json();
    return data.encryptionKey; // Adjust key name based on API response
  } catch (error) {
    console.error("Error in getEncryptionKey:", error);
    throw error;
  }
}

// Function to get Session ID
async function getSessionId(userId, userData) {
  try {
    const response = await fetch(`${BASE_URL}customer/getUserSID`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, userData }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch session ID: ${response.statusText}`);
    }

    const data = await response.json();
    return data.sessionId; // Adjust key name based on API response
  } catch (error) {
    console.error("Error in getSessionId:", error);
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
