import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

import slugify from 'cjk-slug';
import fsExtra from 'fs-extra';
import ytdl from 'ytdl-core';

export async function download(url: string) {
  const basicInfo = await ytdl.getBasicInfo(url);
  const title = basicInfo.videoDetails.title;

  const audio = ytdl(url, { filter: (format) => format.mimeType?.includes('audio/mp4') ?? false });

  const fileName = slugify(title);
  const date = new Date().toISOString().split('T')[0];
  const fileDir = path.join(process.cwd(), 'records', 'videos', date);
  const filePath = path.join(fileDir, `${fileName}.mp4`);
  fsExtra.ensureDirSync(fileDir);

  return new Promise<string>((resolve, reject) => {
    let starttime: number;

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
      readline.moveCursor(process.stdout, 0, -1);
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
