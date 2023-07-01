import { execSync } from 'node:child_process';
import fs from 'node:fs';

export function splitFile(inputFile: string, outputDir: string, segmentSize: number) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const fileSize = fs.statSync(inputFile).size;
  const segmentSizeBytes = segmentSize * 1024 * 1024; // MB를 바이트로 변환

  const segments = Math.ceil(fileSize / segmentSizeBytes);

  for (let i = 0; i < segments; i++) {
    const startByte = i * segmentSizeBytes;
    const outputFileName = `output_${i + 1}.mp4`;
    const outputFile = `${outputDir}/${outputFileName}`;

    const cmd = `ffmpeg -i ${inputFile} -c copy -ss ${startByte} -fs ${segmentSizeBytes} ${outputFile}`;
    execSync(cmd);
  }
}
