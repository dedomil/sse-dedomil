const express = require("express");
const cors = require("cors");
const { createSession } = require("better-sse");
const playingSong = require("./channels/playingSong");

const app = express();

app.use(cors({ origin: "*" }));

app.get("/stream", async (req, res) => {
    let session = await createSession(req, res);
    playingSong.register(session);

    res.on("close", () => {
        playingSong.deregister(session);
    });
})

app.listen(process.env.PORT || 8000, () => {
    console.log("started server");
});