const { createSession } = require("better-sse");
const express = require("express");
const cors = require("cors");

const playingSongChannel = require("./channels/playingSong");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*" }));

app.get("/", async (req, res) => {
  let session = await createSession(req, res);
  playingSongChannel.register(session);

  res.on("close", () => {
    playingSongChannel.deregister(session);
  });
});

app.get("/ping", (req, res) => {
  playingSongChannel.broadcast([], "ping");
  res.send();
});

app.listen(PORT, () => {
  console.log(`started server on ${PORT}`);
});
