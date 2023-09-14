import { FastifyInstance } from "fastify";

export async function indexRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      running: true,
    };
  });
}
