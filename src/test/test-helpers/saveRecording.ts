import * as fs from 'fs';
import { resolve as resolvePath } from 'path';
import * as nock from 'nock';

export async function saveRecording(dirName: string, tapeName: string) {
  try {
    await fs.promises.mkdir(resolvePath(dirName, '__tapes__'));
    // eslint-disable-next-line no-empty
  } catch (e) {}
  await fs.promises.writeFile(
    resolvePath(dirName, '__tapes__', `${tapeName}.json`),
    JSON.stringify(nock.recorder.play()),
  );
}
