import { createResponse } from "better-sse";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { playingSongChannel } from "./channels/playingSong";
import { getRecentTracks } from "./helpers/getRecentTrack";

const app = new Hono();

app.use(cors());

// background worker, maybe use some kind of worker
async function createPolling() {
  setInterval(async () => {
    if (playingSongChannel.sessionCount === 0) return; // dont poll api if no one is listening

    const oldTrack = playingSongChannel.state.recentTrack;
    const newTrack = await getRecentTracks(process.env.LASTFM_USERNAME);

    if (oldTrack.name != newTrack.name) {
      playingSongChannel.broadcast(newTrack, "update");
      playingSongChannel.state.recentTrack = newTrack;
    }
  }, parseInt(process.env.POLLING_INTERVAL));
}

app.get("/", async (c) => {
  return createResponse(c.req.raw, (session) => {
    playingSongChannel.register(session);
  });
});

createPolling();

export default {
  fetch: app.fetch,
  idleTimeout: 0, // https://github.com/oven-sh/bun/issues/13392#issuecomment-2490671520
};
