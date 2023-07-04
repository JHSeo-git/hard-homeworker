import path from 'node:path';

import slugify from 'cjk-slug';
import fsExtra from 'fs-extra/esm';

export function createSaveDir(rootDir: string) {
  const date = new Date().toISOString().split('T')[0];
  const fileDir = path.join(process.cwd(), rootDir, date);
  fsExtra.ensureDirSync(fileDir);
  return fileDir;
}

export function createSavePath(rootDir: string, fileName: string, extension: string) {
  const slugFileName = slugify(fileName);
  const fileDir = createSaveDir(rootDir);
  const filePath = path.join(fileDir, `${slugFileName}.${extension}`);

  return filePath;
}
