import * as dotenv from "dotenv-safe";
import { fastify } from "fastify";

dotenv.config();

const app = fastify();

app.get("/", async () => {
  return {
    running: true,
  };
});

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
