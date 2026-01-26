declare module "bun" {
  interface Env {
    LASTFM_API_KEY: string;
    LASTFM_USERNAME: string;
    POLLING_INTERVAL: string;
  }
}
