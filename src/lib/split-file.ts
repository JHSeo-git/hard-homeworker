import { execSync } from 'node:child_process';
import path from 'node:path';

import { getExtensionFromPath, getFileNameFromPath } from './file-utils.js';

export function splitVideoBySize(
  inputFilePath: string,
  outputDirectory: string,
  sizeLimit: number
) {
  const duration = getVideoDuration(inputFilePath);
  const basename = getFileNameFromPath(inputFilePath);
  const extension = getExtensionFromPath(inputFilePath);

  const sizeLimitBytes = sizeLimit * 1024 * 1024;

  let currDuration = 0;
  let i = 1;

  process.stdout.write('splitting...\n');
  process.stdout.write(`Duration of source video: ${duration}\n`);

  const outputs: string[] = [];
  while (currDuration < duration) {
    const nextFilename = `${basename}-${i}.${extension}`;
    const outputFilePath = path.join(outputDirectory, nextFilename);

    const ffmpegCommand = `ffmpeg -loglevel panic -hide_banner -y -ss ${currDuration} -i "${inputFilePath}" -fs "${sizeLimitBytes}" -c copy "${outputFilePath}"`;

    try {
      execSync(ffmpegCommand);
    } catch (error: any) {
      process.stdout.write(error.message);
    }
    outputs.push(outputFilePath);

    const newDuration = getVideoDuration(outputFilePath);
    currDuration += newDuration;
    i++;

    process.stdout.write(`Duration of ${nextFilename}: ${newDuration}\n`);
    process.stdout.write(`Part No. ${i} starts at ${currDuration}\n`);
  }

  process.stdout.write('splitting Done!\n\n');

  return outputs;
}

function getVideoDuration(file: string) {
  const ffprobeCommand = `ffprobe -i "${file}" -show_entries format=duration -v quiet -of default=noprint_wrappers=1:nokey=1|cut -d. -f1`;
  const output = execSync(ffprobeCommand).toString().trim();
  return parseInt(output, 10);
}
