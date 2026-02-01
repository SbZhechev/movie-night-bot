import path from 'path';
import fs from 'fs';
import { EOL } from 'os';

export const suggestionsFilePath = path.join(path.resolve(), 'suggestions.csv');

export const readSuggestionsFile = () => {
  return fs.readFileSync(suggestionsFilePath, { encoding: 'utf8' }).split(EOL);
}

export const parseSuggestionsFile = () => {
  let fileData = readSuggestionsFile();

  // remove column headers
  fileData.shift();

  let movies = fileData.map(line => {
    let [title, watched, participated, theme] = line.split(',');
    return { title, watched, participated, theme };
  });

  return movies;
}

export const updateSuggestionsFile = (newContentArray) => {
  const content = newContentArray.join(EOL);

  fs.writeFileSync(suggestionsFilePath, content);
}