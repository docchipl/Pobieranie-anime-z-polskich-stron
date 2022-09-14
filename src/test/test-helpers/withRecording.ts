import * as fs from 'fs';
import * as nock from 'nock';
import { saveRecording } from './saveRecording';
import * as path from 'path';
import { kebabCase } from 'lodash';

export const withRecording = async (dirname: string, name: string, cb: () => Promise<void>) => {
  const kebabCaseName = kebabCase(name);
  const recordingPath = path.join(dirname, '__tapes__', `${kebabCaseName}.json`);
  const recordingExists = await exists(recordingPath);

  if (recordingExists) {
    nock.disableNetConnect();
    nock.load(recordingPath);
  } else {
    nock.enableNetConnect();
    nock.recorder.rec({ dont_print: true, output_objects: true });
  }
  let error: unknown | undefined;
  try {
    await cb();
  } catch (e) {
    error = e;
  }
  if (recordingExists) {
    nock.enableNetConnect();
  } else {
    await saveRecording(dirname, kebabCaseName);
  }
  if (error) {
    throw error;
  }
};

const exists = (recordingPath: string) => {
  return new Promise((resolve) => {
    fs.exists(recordingPath, (exists) => {
      resolve(exists);
    });
  });
};
