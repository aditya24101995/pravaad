const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const env = require("dotenv");
env.config({ path: "./config/server.env" });
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const roomRoute = require("./routes/room");
const ErrorResponse = require("./utils/Error");
const connectDB = require("./config/db");

const app = express();
connectDB();
const server = http.createServer(app);
const io = socketIO(server, {
  transports: ["polling"],
  cors: {
    cors: {
      origin: "http://localhost:3000",
    },
  },
});

io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("message", (message) => {
    console.log(`message from ${socket.id} : ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);
  });
});

app.use(cookieParser());
app.use(express.json());
app.use(ErrorResponse);

//ROUTES
app.use("/api/auth", authRoute);
app.use("/api", userRoute);
app.use("/api/room", roomRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Pravaad!");
});
server.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
