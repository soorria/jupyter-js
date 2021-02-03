/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    MONGO_URI: string
    NEXTAUTH_URL: string
  }
}
