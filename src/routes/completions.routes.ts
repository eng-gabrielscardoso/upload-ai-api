import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import isNull from "lodash/isNull";
import { z } from "zod";
import { openai } from "../lib/openai";
import { prisma } from "../lib/prisma";

export async function completionsRoutes(app: FastifyInstance) {
  app.post(
    "/completions",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const bodySchema = z.object({
        videoId: z.string().uuid(),
        template: z.string(),
        temperature: z.number().min(0).max(1).default(0.5),
      });

      const { videoId, template, temperature } = bodySchema.parse(request.body);

      const video = await prisma.video.findUniqueOrThrow({
        where: {
          id: videoId,
        },
      });

      if (isNull(video.transcription)) {
        return reply.status(400).send({
          error: "Video transcription was not generated yet.",
        });
      }

      const promptMessage = template.replace(
        "{transcription}",
        video.transcription
      );

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature,
        messages: [
          {
            role: "user",
            content: promptMessage,
          },
        ],
      });

      return reply.status(201).send(response);
    }
  );
}
