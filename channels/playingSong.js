const { createChannel } = require("better-sse");
const fetchRecentTrack = require("../helpers/lastFm");

const playingSong = createChannel();

let lastTrack = { name: "" };

setInterval(async () => {
    let track = await fetchRecentTrack();
    if (lastTrack.name != track.name) {
        playingSong.broadcast(track, "trackChanged");
        lastTrack = track;
    }
}, 5000);

playingSong.on("session-registered", (session) => {
    session.push(lastTrack, "userJoined");
});

module.exports = playingSong;
