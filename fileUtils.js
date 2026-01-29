import path from 'path';
import fs from 'fs';
import { EOL } from 'os';

export const suggestionsFilePath = path.join(path.resolve(), 'suggestions.csv');

export const parseSuggestionsFile = () => {
  return fs.readFileSync(suggestionsFilePath, { encoding: 'utf8' }).split(EOL);
}

export const updateSuggestionsFile = (newContentArray) => {
  const content = newContentArray.join(EOL);

  fs.writeFileSync(suggestionsFilePath, content);
}