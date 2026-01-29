import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";
import {ENV} from "./env.js"

const aj = arcjet({
  key: ENV.ARCJET_KEY, 
  rules: [
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    // Only enable bot detection in production
    ...(ENV.ARCJET_ENV === "production"
      ? [
          detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE"],
          }),
        ]
      : []),
    // Create a token bucket rate limit. Other algorithms are supported.
    slidingWindow({
        mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
        max:100, // 100 requests
        interval:60, // 60 seconds
    }),
  ],
});

export default aj;