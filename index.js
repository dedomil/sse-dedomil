const express = require("express");
const cors = require("cors");
const { createSession } = require("better-sse");
const playingSong = require("./channels/playingSong");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*" }));

app.get("/", async (req, res) => {
    let session = await createSession(req, res);
    playingSong.register(session);

    res.on("close", () => {
        playingSong.deregister(session);
    });
})

app.listen(PORT, () => {
    console.log(`started server on ${PORT}`);
});
