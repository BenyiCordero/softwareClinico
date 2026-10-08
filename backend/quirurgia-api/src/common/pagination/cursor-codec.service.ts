import { BadRequestException, Injectable } from "@nestjs/common";
import { z } from "zod";

@Injectable()
export class CursorCodecService {
    encode<T>(cursor: T): string {
        return Buffer.from(
        JSON.stringify(cursor),
        "utf8",
        ).toString("base64url");
    }

    decode<T>(encoded: string,
        schema: z.ZodType<T>,
    ): T {
    try {
      const decoded = Buffer.from(
        encoded,
        "base64url",
      ).toString("utf8");

      return schema.parse(JSON.parse(decoded));
    } catch {
      throw new BadRequestException("Invalid pagination cursor");
    }
  }
}