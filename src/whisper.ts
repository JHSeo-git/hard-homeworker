import 'dotenv/config';

import fs from 'node:fs/promises';

import { Configuration, OpenAIApi } from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in '.env'");
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function transcription(filePath: string) {
  const rawFile = await fs.readFile(filePath, 'utf-8');
  const file = new File([rawFile], 'audio.wav');

  const response = await openai.createTranscription(file, 'whisper-1');

  return response;
}
