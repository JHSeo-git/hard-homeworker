import fs from 'node:fs';

import { openai } from './lib/openai.js';

/**
 * By default, the Whisper API only supports files that are less than 25 MB.
 * @see https://platform.openai.com/docs/guides/speech-to-text/longer-inputs
 */
export async function transcription(filePath: string) {
  const audio = fs.createReadStream(filePath);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await openai.createTranscription(audio as any, 'whisper-1');

  const result = response.data.text ?? '';

  return result;
}
