import { download } from './download.js';
import { createSaveDir } from './lib/file-utils.js';
import { splitVideoBySize } from './lib/split-file.js';
import { transcription } from './transcription.js';
import { translate } from './translate.js';

const AUDIO_SEGMENT_SIZE_MB = 20;

async function start() {
  try {
    const downloadedPath = await download('https://www.youtube.com/watch?v=aV1271hd9ew');

    const outputs = splitVideoBySize(
      downloadedPath,
      createSaveDir('data/output'),
      AUDIO_SEGMENT_SIZE_MB
    );

    for (const output of outputs) {
      const transcript = await transcription(output);
      const translated = await translate(transcript);
      process.stdout.write(translated);
    }
  } catch (e: any) {
    if (e.response) {
      console.log(e.response.status);
      console.log(e.response.data);
    } else {
      console.log(e.message);
    }
  }
}

start();
