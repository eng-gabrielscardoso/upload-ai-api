import { fastifyCors } from "@fastify/cors";
import * as dotenv from "dotenv-safe";
import { fastify } from "fastify";
import { completionsRoutes } from "./routes/completions.routes";
import { indexRoutes } from "./routes/index.routes";
import { promptsRoutes } from "./routes/prompts.routes";
import { transcriptionsRoutes } from "./routes/transcriptions.routes";
import { videosRoutes } from "./routes/videos.routes";

/**
 * Application config
 */
dotenv.config();

const app = fastify();

/**
 * Application CORS
 */

/**
 * This config must be refactored as soon as possible
 *
 * @author eng-gabrielscardoso
 */
app.register(fastifyCors, {
  origin: "*",
});

/**
 * Application routes
 */
app.register(completionsRoutes);

app.register(indexRoutes);

app.register(promptsRoutes);

app.register(transcriptionsRoutes);

app.register(videosRoutes);

/**
 * Application server bootstrap
 */
(async function () {
  try {
    await app.listen({
      port: 3000,
    });

    await console.log(
      `Server running on http://localhost:${process.env.APP_PORT}`
    );
  } catch (error: unknown) {
    throw error;
  }
})();
