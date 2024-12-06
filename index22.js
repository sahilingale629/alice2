const axios = require("axios");
const crypto = require("crypto");
const WebSocket = require("ws");

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const USER_ID = process.env.USER_ID;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Ensures cookies are sent if required
});

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function getEncryptedKey() {
  try {
    const response = await axiosInstance.post(`customer/getAPIEncpkey`, {
      userId: USER_ID,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting encrypted key:", error.message);
    throw error;
  }
}

async function getSessionId(encKey) {
  try {
    const concatKey = `${USER_ID}${API_KEY}${encKey}`;
    const hashData = hash(concatKey);

    const payload = {
      userId: USER_ID,
      userData: hashData,
    };

    const response = await axiosInstance.post(`customer/getUserSID`, payload);
    return response.data;
  } catch (error) {
    console.error("Error getting session ID:", error.message);
    throw error;
  }
}

async function createWebSocketSession(bearerToken) {
  try {
    const response = await axiosInstance.post(
      `ws/createWsSession`,
      {
        loginType: "API",
      },
      {
        headers: {
          Authorization: bearerToken,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error creating WebSocket session:", error.message);
    throw error;
  }
}

async function establishWebSocketConnection() {
  try {
    const { encKey } = await getEncryptedKey();
    const { sessionID } = await getSessionId(encKey);

    const bearerToken = `Bearer ${USER_ID} ${sessionID}`;
    console.log({ encKey, sessionID });

    const wsPayload = {
      susertoken: hash(hash(sessionID)),
      t: "c",
      actid: `${USER_ID}_API`,
      uid: `${USER_ID}_API`,
      source: "API",
    };

    const ws = new WebSocket("wss://ws2.aliceblueonline.com/NorenWS/", {
      headers: {
        Authorization: bearerToken,
      },
    });

    ws.on("open", () => {
      console.log("WebSocket connection established.");
      ws.send(JSON.stringify(wsPayload));
      console.log("Payload sent:", wsPayload);
    });

    ws.on("message", (message) => {
      const response = JSON.parse(message);
      console.log("Response from server:", response);

      if (response.t === "cf" && response.k === "OK") {
        console.log("Connection validated successfully.");
      } else if (response.t === "cf" && response.k === "failed") {
        console.error("Connection validation failed.");
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error.message);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed.");
    });
  } catch (error) {
    console.error("Error establishing WebSocket connection:", error.message);
  }
}

establishWebSocketConnection();
