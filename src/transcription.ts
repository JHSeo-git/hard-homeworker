import fs from 'node:fs';
import readline from 'node:readline';

import { openai } from './lib/openai.js';

/**
 * By default, the Whisper API only supports files that are less than 25 MB.
 * @see https://platform.openai.com/docs/guides/speech-to-text/longer-inputs
 */
export async function transcription(filePath: string) {
  const audio = fs.createReadStream(filePath);

  process.stdout.write('transcripting...\n');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await openai.createTranscription(
    audio as any,
    'whisper-1',
    undefined,
    undefined,
    undefined,
    undefined,
    {
      onDownloadProgress: (progressEvent) => {
        readline.cursorTo(process.stdout, 0);
        const percentCompleted = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
        process.stdout.write(`transcripting... ${percentCompleted}\n`);
      },
    }
  );

  process.stdout.write('transcripting Done!\n\n');

  const result = response.data.text;

  return result;
}
