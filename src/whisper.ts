import 'dotenv/config';

import fs from 'node:fs';

import { Configuration, OpenAIApi } from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in '.env'");
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function transcription(filePath: string) {
  const audio = fs.createReadStream(filePath);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await openai.createTranscription(audio as any, 'whisper-1');

  console.log(response);

  return response;
}
