import fs from 'node:fs';
import readline from 'node:readline';

import ytdl from 'ytdl-core';

import { createSavePath } from './lib/file-utils.js';

export async function download(url: string) {
  const basicInfo = await ytdl.getBasicInfo(url);
  const title = basicInfo.videoDetails.title;

  const audio = ytdl(url, { filter: (format) => format.mimeType?.includes('audio/mp4') ?? false });

  const filePath = createSavePath('data/download', title, 'mp4');

  return new Promise<string>((resolve, reject) => {
    let starttime: number;

    if (fs.existsSync(filePath)) {
      resolve(filePath);
      return;
    }

    audio.pipe(fs.createWriteStream(filePath));
    audio.once('response', () => {
      starttime = Date.now();
    });
    audio.on('progress', (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
      const estimatedDownloadTime = downloadedMinutes / percent - downloadedMinutes;

      process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
      process.stdout.write(
        `(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`
      );
      process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
      process.stdout.write(`, Estimated time left: ${estimatedDownloadTime.toFixed(2)} minutes `);
      readline.cursorTo(process.stdout, 0, -1);
    });
    audio.on('end', () => {
      process.stdout.write('\n\nfinished downloading!\n\n');
      resolve(filePath);
    });
    audio.on('error', (error) => {
      reject(error);
    });
  });
}
