/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'comma-number' {
  export default any
}

declare namespace NodeJS {
  interface ProcessEnv {
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    MONGO_URI: string
    NEXTAUTH_URL: string
    SESSION_SECRET: string
    JWT_SECRET: string
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: string
    STRIPE_PRIVATE_KEY: string
    STRIPE_WEBHOOK_SECRET: string
    PREMIUM_PRICE_ID: string
  }
}
