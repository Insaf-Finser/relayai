
const { io } = require("socket.io-client");

const [conversationId, token] = process.argv.slice(2);

if (!conversationId || !token) {
  console.error(
    "Usage: node socket-test.cjs <conversationId> <accessToken>",
  );
  process.exit(1);
}

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
  auth: { token },
});

socket.on("connect", () => {
  console.log("Authenticated connection:", socket.id);

  socket.emit("conversation:join", { conversationId });
});

socket.on("conversation:joined", (data) => {
  console.log("Authorized room joined:", data.conversationId);
});

socket.on("message:new", (message) => {
  console.log("New message:", JSON.stringify(message, null, 2));
});

socket.on("conversation:error", (data) => {
  console.error("Room access denied:", data.message);
});

socket.on("connect_error", (error) => {
  console.error("Connection rejected:", error.message);
});

process.on("SIGINT", () => {
  socket.disconnect();
  process.exit(0);
});
