import { download } from './download.js';
import { transcription } from './transcription.js';
import { translate } from './translate.js';

async function start() {
  const path = await download('https://www.youtube.com/watch?v=cEMSGF6hGmg');
  const transcript = await transcription(path);
  const translated = await translate(transcript);

  process.stdout.write(translated);
}

start();
