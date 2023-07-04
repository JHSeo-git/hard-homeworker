import { execSync } from 'node:child_process';
import path from 'node:path';

export function splitVideoBySize(
  inputFilePath: string,
  outputDirectory: string,
  sizeLimit: number
) {
  const duration = getVideoDuration(inputFilePath);
  const basename = path.parse(inputFilePath).name;
  const extension = path.basename(inputFilePath).split('.').pop();

  const sizeLimitBytes = sizeLimit * 1024 * 1024;

  let currDuration = 0;
  let i = 1;

  console.log(`Duration of source video: ${duration}`);

  const outputs: string[] = [];
  while (currDuration < duration) {
    const nextFilename = `${basename}-${i}.${extension}`;
    const outputFilePath = path.join(outputDirectory, nextFilename);

    const ffmpegCommand = `ffmpeg -hide_banner -y -ss ${currDuration} -i "${inputFilePath}" -fs "${sizeLimitBytes}" -c copy "${outputFilePath}"`;
    console.log(ffmpegCommand);

    try {
      execSync(ffmpegCommand);
    } catch (error) {
      console.error(`Errored to split part ${i}:`, error);
    }
    outputs.push(outputFilePath);

    const newDuration = getVideoDuration(outputFilePath);
    currDuration += newDuration;
    i++;

    console.log(`Duration of ${nextFilename}: ${newDuration}`);
    console.log(`Part No. ${i} starts at ${currDuration}`);
  }

  return outputs;
}

function getVideoDuration(file: string) {
  const ffprobeCommand = `ffprobe -i "${file}" -show_entries format=duration -v quiet -of default=noprint_wrappers=1:nokey=1|cut -d. -f1`;
  const output = execSync(ffprobeCommand).toString().trim();
  return parseInt(output, 10);
}
