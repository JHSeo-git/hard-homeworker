import { download } from './download.js';
import { createSaveDir, getFileNameFromPath, writeFile } from './lib/file-utils.js';
import { splitVideoBySize } from './lib/split-file.js';
import { getTokenLength } from './lib/tokenizor.js';
import { summarize, tldr } from './summarize.js';
import { transcription } from './transcription.js';
import { translate } from './translate.js';

const MAX_AUDIO_SIZE_MB = 20; // 25MB but 20MB to be safe
const MAX_TOKEN_LENGTH = 15000; // 16k but 15k to be safe

/**
 * https://www.youtube.com/watch?v=GW0rj4sNH2w
 * https://www.youtube.com/watch?v=aV1271hd9ew
 * https://www.youtube.com/watch?v=Iyrf52cwxQI
 * https://www.youtube.com/watch?v=7GcrT0SBSnI
 * https://www.youtube.com/watch?v=AdNJ3fydeao
 * https://www.youtube.com/watch?v=KT3XKDBZW7M
 */

async function start() {
  process.stdout.write('>> Starting...\n\n');

  try {
    // download
    const downloadedPath = await download('https://www.youtube.com/watch?v=GW0rj4sNH2w');
    const saveDir = createSaveDir('data/output');
    const outputs = splitVideoBySize(
      downloadedPath,
      createSaveDir('data/output'),
      MAX_AUDIO_SIZE_MB
    );

    // trascription
    const results: string[] = [];
    for (const output of outputs) {
      const transcript = await transcription(output);
      results.push(await translate(transcript, MAX_TOKEN_LENGTH));
    }

    // translate
    const translatedFileName = getFileNameFromPath(downloadedPath);
    const translated = results.join(' ');
    await writeFile(`${saveDir}/${translatedFileName}.md`, translated);

    // summarize
    let summarized = await summarize(translated, MAX_TOKEN_LENGTH);
    while (getTokenLength(summarized) > MAX_TOKEN_LENGTH) {
      summarized = await summarize(summarized, MAX_TOKEN_LENGTH);
    }

    // tldr
    const tldrSummarized = await tldr(summarized, MAX_TOKEN_LENGTH);
    const summarizedFileName = `${getFileNameFromPath(downloadedPath)}-summarize`;
    const summarizedWithTldr = `## TLDR\n\n${tldrSummarized}\n\n## Summary\n\n${summarized}`;
    await writeFile(`${saveDir}/${summarizedFileName}.md`, summarizedWithTldr);
  } catch (e: any) {
    if (e.response) {
      console.log(e.response.status);
      console.log(e.response.data);
    } else {
      console.log(e.message);
    }
  } finally {
    process.stdout.write('>> done!!\n\n');
  }
}

start();
