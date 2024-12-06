require("dotenv").config();
const WebSocket = require("ws");
const crypto = require("crypto");
const axios = require("axios");

const BASE_URL = process.env.BASE_URL;
const userId = process.env.USER_ID;
const apiKey = process.env.API_KEY;
const WS_URL = "wss://ws2.aliceblueonline.com/NorenWS/";
const bearerToken =
  "Bearer RC047 Fhrb2rt5G7Hav94X7aDZKObz2DPGVAIEQDoFcybzaeM4B3VmiYA3qbOtb4qUcRFYnHfuRGPRL3N9NZfUCc78Yrb5yFTg46dnloFlEUmOHOPzq7zGntAJARqDidhqk2rPDr08hgLqOR7TAnmeb5akhWnXuOyW1FyNAqCMMC82WdgiXI9VdKZRBTn5iMfV4Ur859plGDkjSbyV8iMpQAelCcm3l7Bb5DJfMnFnU7zUhhDv1eRsxmyXfBk1qWEprQNz";

// Function to perform double SHA-256 encryption
function doubleSha256(input) {
  //   console.log(
  //     "double sha :-",
  //     crypto
  //       .createHash("sha256")
  //       .update(crypto.createHash("sha256").update(input).digest("hex"))
  //       .digest("hex")
  //   );
  return crypto
    .createHash("sha256")
    .update(crypto.createHash("sha256").update(input).digest("hex"))
    .digest("hex");
}

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

  return crypto.createHash("sha256").update(data).digest("hex");
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

async function createWebSocketSession() {
  try {
    const response = await axios.post(
      `${BASE_URL}ws/createWsSession`,
      {
        loginType: "API",
      },
      {
        headers: {
          Authorization:
            "Bearer RC047 Fhrb2rt5G7Hav94X7aDZKObz2DPGVAIEQDoFcybzaeM4B3VmiYA3qbOtb4qUcRFYnHfuRGPRL3N9NZfUCc78Yrb5yFTg46dnloFlEUmOHOPzq7zGntAJARqDidhqk2rPDr08hgLqOR7TAnmeb5akhWnXuOyW1FyNAqCMMC82WdgiXI9VdKZRBTn5iMfV4Ur859plGDkjSbyV8iMpQAelCcm3l7Bb5DJfMnFnU7zUhhDv1eRsxmyXfBk1qWEprQNz",
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

// Step 5: Create WebSocket connection
async function createWebSocketConnection(sessionId) {
  //   console.log("websocket connection log session Id:- ", sessionId);
  //   console.log("websocket connection log user Id:- ", userId);

  const susertoken = doubleSha256(sessionId); // Double SHA-256 encryption of sessionId
  console.log("websocket connection susertoken :- ", susertoken);

  const payload = {
    susertoken: susertoken,
    t: "c",
    actid: "488059_API",
    uid: "488059_API",
    source: "API",
  };

  // Create WebSocket connection
  const ws = new WebSocket(WS_URL, {
    headers: payload,
  });

  ws.on("open", () => {
    console.log("WebSocket connection established.");
    ws.send(JSON.stringify(payload)); // Send the payload once connected
    //  console.log("Request payload sent:", payload);
  });

  ws.on("message", (message) => {
    console.log("Received message from server:", message.toString());
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
}

// Main function to authenticate and create WebSocket session
async function main() {
  try {
    console.log("Starting authentication process...");

    // Step 1: Get Encryption Key
    const encryptionKey = await getEncryptionKey(userId);
    console.log("Encryption Key retrieved.");

    // Step 2: Generate User Data Hash
    const userData = hashUserData(userId, apiKey, encryptionKey);
    console.log("User Data hashed.");

    // Step 3: Get Session ID
    const sessionId = await getSessionId(userId, userData);
    console.log("Session ID retrieved:", sessionId);

    // Step 4
    const wsSession = createWebSocketSession();
    console.log("WebSocket session created.", wsSession);

    //: Create WebSocket Connection (Step 5)
    // console.log("main function sessionID :- ", sessionId);
    // console.log("main function userId :- ", userId);

    await createWebSocketConnection(sessionId);
  } catch (error) {
    console.error("Error in the process:", error.message);
  }
}

// Run the main function
main();
