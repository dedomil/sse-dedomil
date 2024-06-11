const { createChannel } = require("better-sse");
const fetchRecentTrack = require("../helpers/lastFm");

const playingSong = createChannel();

let lastTrack = ["not playing anything", null, null];

setInterval(async () => {
  let track = await fetchRecentTrack();
  if (track.length && lastTrack[0] != track[0]) {
    playingSong.broadcast(track, "track-changed");
    lastTrack = track;
  }
}, 5000);

/** new session joined the channel
 *  1) send `connected` event to the session who registered with current count and track
 *  2) broadcast channel's sesssion count to other session except this one
 */

playingSong.on("session-registered", (session) => {
  session.push([lastTrack, playingSong.sessionCount], "connected");

  playingSong.broadcast([playingSong.sessionCount], "count-updated", {
    filter: (broadcastSession) => {
      return broadcastSession != session; // comparing Session works!
    },
  });
});

playingSong.on("session-deregistered", (session) => {
  playingSong.broadcast([playingSong.sessionCount], "count-updated", {
    filter: (broadcastSession) => {
      return broadcastSession != session;
    },
  });
});

module.exports = playingSong;
