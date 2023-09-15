import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createReadStream } from "node:fs";
import { z } from "zod";
import { openai } from "../lib/openai";
import { prisma } from "../lib/prisma";

export async function transcriptionsRoutes(app: FastifyInstance) {
  app.post(
    "/transcriptions/:videoId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({
        videoId: z.string().uuid(),
      });

      const bodySchema = z.object({
        prompt: z.string(),
      });

      const { videoId } = paramsSchema.parse(request.params);

      const { prompt } = bodySchema.parse(request.body);

      const { path } = await prisma.video.findUniqueOrThrow({
        where: {
          id: videoId,
        },
      });

      const audioReadStream = createReadStream(path);

      const response = await openai.audio.transcriptions.create({
        file: audioReadStream,
        model: "whisper-1",
        language: "en",
        response_format: "json",
        temperature: 0,
        prompt,
      });

      const transcription = await prisma.video.update({
        where: {
          id: videoId,
        },
        data: {
          transcription: response.text,
        },
      });

      return reply.status(201).send(transcription);
    }
  );
}
