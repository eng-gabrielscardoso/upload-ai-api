import fastifyMultipart from "@fastify/multipart";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import isNull from "lodash/isNull";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline);

export async function videosRoutes(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, // 25 MB
    },
  });

  app.post("/videos", async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file();

    if (isNull(request)) {
      return reply.status(400).send({
        error: "Missing file input",
      });
    }

    const extension = path.extname(data?.filename!);

    if (extension !== ".mp3") {
      return reply.status(400).send({
        error: "Invalid input type. Make sure to upload only .MP3 files.",
      });
    }

    const fileBaseName = path.basename(data?.filename!, extension);

    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

    const uploadDestination = path.resolve(
      __dirname,
      "../../tmp",
      fileUploadName
    );

    await pump(data?.file!, fs.createWriteStream(uploadDestination));

    const video = await prisma.video.create({
      data: {
        name: data?.filename!,
        path: uploadDestination,
      },
    });

    return reply.status(201).send(video);
  });
}
