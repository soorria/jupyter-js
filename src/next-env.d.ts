/// <reference types="next" />
/// <reference types="next/types/global" />

declare module NodeJS {
  interface ProcessEnv {
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    MONGO_URI: string
    NEXTAUTH_URL: string
  }
}
