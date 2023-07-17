import fs from 'node:fs';

import { openai } from './lib/openai.js';

/**
 * By default, the Whisper API only supports files that are less than 25 MB.
 * @see https://platform.openai.com/docs/guides/speech-to-text/longer-inputs
 */
export async function transcription(filePath: string) {
  const audio = fs.createReadStream(filePath);

  process.stdout.write('transcripting...\n');

  const response = await openai.createTranscription(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audio as any,
    'whisper-1',
    undefined,
    undefined,
    1,
    'en'
  );

  process.stdout.write('transcripting Done!\n\n');

  const result = response.data.text;

  return result;
}
