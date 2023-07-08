import { download } from './download.js';
import { createSaveDir, getFileNameFromPath, writeFile } from './lib/file-utils.js';
import { splitVideoBySize } from './lib/split-file.js';
import { transcription } from './transcription.js';
import { translate } from './translate.js';

const AUDIO_SEGMENT_SIZE_MB = 20;

/**
 * https://www.youtube.com/watch?v=GW0rj4sNH2w
 * https://www.youtube.com/watch?v=aV1271hd9ew
 * https://www.youtube.com/watch?v=Iyrf52cwxQI
 * https://www.youtube.com/watch?v=7GcrT0SBSnI
 * https://www.youtube.com/watch?v=AdNJ3fydeao
 * https://www.youtube.com/watch?v=KT3XKDBZW7M
 */

async function start() {
  try {
    const downloadedPath = await download('https://www.youtube.com/watch?v=AdNJ3fydeao');

    const saveDir = createSaveDir('data/output');
    const outputs = splitVideoBySize(
      downloadedPath,
      createSaveDir('data/output'),
      AUDIO_SEGMENT_SIZE_MB
    );

    const results: string[] = [];

    for (const output of outputs) {
      const transcript = await transcription(output);
      const translated = await translate(transcript);
      results.push(translated);
    }

    const fileName = getFileNameFromPath(downloadedPath);
    await writeFile(`${saveDir}/${fileName}.md`, results.join('\n'));
  } catch (e: any) {
    if (e.response) {
      console.log(e.response.status);
      console.log(e.response.data);
    } else {
      console.log(e.message);
    }
  }
}

process.stdout.write('>> Starting...\n\n');
await start();
process.stdout.write('>> done!!\n\n');
process.exit(0);
