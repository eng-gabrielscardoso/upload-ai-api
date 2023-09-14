import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function indexRoutes(app: FastifyInstance) {
  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      running: true,
    });
  });
}
