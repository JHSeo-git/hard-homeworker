import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

import slugify from 'cjk-slug';
import ytdl from 'ytdl-core';

export async function download(url: string) {
  const basicInfo = await ytdl.getBasicInfo(url);
  const title = basicInfo.videoDetails.title;

  const video = ytdl(url);

  const fileName = slugify(title);
  const filePath = path.join(process.cwd(), 'data', 'videos', `${fileName}.mp4`);

  return new Promise<string>((resolve, reject) => {
    // get youtube info
    // download
    let starttime: number;

    video.pipe(fs.createWriteStream(filePath));
    video.once('response', () => {
      starttime = Date.now();
    });
    video.on('progress', (chunkLength, downloaded, total) => {
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
    video.on('end', () => {
      process.stdout.write('\n\nfinished downloading!\n\n');
      resolve(filePath);
    });
    video.on('error', (error) => {
      reject(error);
    });
  });
}
