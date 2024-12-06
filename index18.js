const WebSocket = require("ws");
const { setInterval } = require("timers");

let LTP = 0;
let socketOpened = false;
let subscribeFlag = false;
let subscribeList = [];
let unsubscribeList = [];

const ws = new WebSocket("wss://ws1.aliceblueonline.com/NorenWS"); // Replace with your WebSocket URL

// Socket open callback function
ws.on("open", () => {
  console.log("Connected");
  socketOpened = true;
  if (subscribeFlag) {
    subscribeToInstruments(subscribeList);
  }
});

// Socket close callback function
ws.on("close", () => {
  socketOpened = false;
  LTP = 0;
  console.log("Closed");
});

// Socket error callback function
ws.on("error", (message) => {
  LTP = 0;
  console.log("Error :", message);
});

// Socket feed data callback function
ws.on("message", (message) => {
  const feedMessage = JSON.parse(message);
  if (feedMessage.t === "ck") {
    console.log(
      `Connection Acknowledgement status: ${feedMessage.s} (WebSocket Connected)`
    );
    subscribeFlag = true;
    console.log("subscribeFlag:", subscribeFlag);
    console.log(
      "-------------------------------------------------------------------------------"
    );
  } else if (feedMessage.t === "tk") {
    console.log(`Token Acknowledgement status: ${JSON.stringify(feedMessage)}`);
    console.log(
      "-------------------------------------------------------------------------------"
    );
  } else {
    console.log("Feed:", feedMessage);
    LTP = feedMessage.lp || LTP; // If LTP is in the response, store it in LTP variable
  }
});

// Function to subscribe to instruments
const subscribeToInstruments = (instrumentList) => {
  instrumentList.forEach((instrument) => {
    const message = JSON.stringify({
      type: "subscribe",
      instrument: instrument,
    });
    ws.send(message);
  });
};

// Simulating the WebSocket connection lifecycle and subscription
setInterval(() => {
  if (socketOpened) {
    subscribeList = [getInstrumentByToken("INDICES", 26000)]; // Example instrument token
    subscribeToInstruments(subscribeList);
    console.log(new Date());
    setTimeout(() => {
      // Unsubscribe logic (if needed)
      // unsubscribeList = [getInstrumentBySymbol("NSE", "RELIANCE")];
      // unsubscribeFromInstruments(unsubscribeList);
    }, 8000);
  }
}, 1000);

// Placeholder function for getting instrument by token
const getInstrumentByToken = (type, token) => {
  return { type: type, token: token }; // Example instrument structure
};

// Function to unsubscribe from instruments
const unsubscribeFromInstruments = (instrumentList) => {
  instrumentList.forEach((instrument) => {
    const message = JSON.stringify({
      type: "unsubscribe",
      instrument: instrument,
    });
    ws.send(message);
  });
};
