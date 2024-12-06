const axios = require("axios");
const crypto = require("crypto");
const WebSocket = require("ws");

const BASE_URL =
  "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/";
const API_KEY =
  "FTlDyv5M6j931VGZ6elvlU7HgWYkWy5IWrFeyAAF15QULcYIgsPS8Cyli4lFW481DF6sfDy7zkfNXQ6XFclL0RkuTIJeFRK566xOZM3qcQRhvIyn3AFiTrhIhdy883by";
const USER_ID = "488059";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Ensures cookies are sent if required
});

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function getEncryptedKey() {
  const response = await axiosInstance.post(
    `https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/customer/getAPIEncpkey`,
    {
      userId: "488059",
    }
  );
  return response.data;
}

async function getSessionId(encKey) {
  const concatKey = `${USER_ID}${API_KEY}${encKey}`;

  const hashData = hash(concatKey);

  const payload = {
    userId: USER_ID,
    userData: hashData,
  };

  const response = await axiosInstance.post(`customer/getUserSID`, payload);

  return response.data;
}

async function createWebSocketSession(bearer_token) {
  const response = await axiosInstance.post(
    `ws/createWsSession`,
    {
      loginType: "API",
    },
    {
      headers: {
        Authorization: bearer_token,
      },
    }
  );
  return response.data;
}

(async () => {
  try {
    // Step 1: Get Encrypted Key
    const encKeyResponse = await getEncryptedKey();
    const encKey = encKeyResponse.encKey;

    // Step 2: Get Session ID
    const sessionResponse = await getSessionId(encKey);
    const sessionID = sessionResponse.sessionID;

    // Step 3: Construct Bearer Token
    const bearer_token = `Bearer ${USER_ID} ${sessionID}`;
    console.log({ encKey, sessionID });

    // Step 4: Create WebSocket Session
    const wsSessionResponse = await createWebSocketSession(bearer_token);
    const wsSession = wsSessionResponse.result.wsSess;
    console.log("WSsession: ", wsSession);

    // Step 5: WebSocket Communication
    const ws = new WebSocket("wss://ws2.aliceblueonline.com/NorenWS/", {
      headers: {
        Authorization: bearer_token,
      },
    });

    const payload = {
      susertoken: hash(hash(sessionID)),
      t: "c",
      actid: `${USER_ID}_API`,
      uid: `${USER_ID}_API`,
      source: "API",
    };

    ws.on("open", () => {
      console.log("WebSocket connection established.");

      // Send the payload as JSON
      ws.send(JSON.stringify(payload));
      console.log("Payload sent:", payload);

      const marketDataPayload = {
        k: "NFO|54957",
        t: "d",
      };

      ws.send(JSON.stringify(marketDataPayload));
      console.log("Market data subscription payload sent:", marketDataPayload);
    });

    // Event: Message received from the server
    ws.on("message", (message) => {
      const response = JSON.parse(message);
      console.log("Response from server:", response);

      if (response.t === "cf" && response.k === "OK") {
        console.log("Connection validated successfully.");
      } else if (response.t === "cf" && response.k === "failed") {
        console.error("Connection validation failed.");
      }
    });

    // Event: Error in WebSocket
    ws.on("error", (error) => {
      console.error("WebSocket error:", error.message);
    });

    // Event: Connection closed
    ws.on("close", () => {
      console.log("WebSocket connection closed.");
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
