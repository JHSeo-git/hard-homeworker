import fs from 'node:fs';

import { openai } from './lib/openai.js';

export async function transcription(filePath: string) {
  const audio = fs.createReadStream(filePath);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await openai.createTranscription(audio as any, 'whisper-1');

  console.log(response);

  return response;
}
``;
