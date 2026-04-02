import path from 'path';
import fs from 'fs';
import { EOL } from 'os';
import { NotFoundError } from './notFoundError.js';
import { MOVIE_PROPERTIES_MAP } from './constants.js';

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
  const content = newContentArray.map(movie => {
    return `${movie.title},${movie.watched},${movie.participated},${movie.theme}`;
  });

  content.unshift('title,watched,participated,theme');
  fs.writeFileSync(suggestionsFilePath, content.join(EOL));
}

export const replaceSuggestionsFileContent = (newContent) => {
  fs.writeFileSync(suggestionsFilePath, newContent, { flag: 'w' });
}

export const getMoviesForPoll = ({ movies, size, theme }) => {
  let pollOptions = movies.filter(movieData => {
    const notWatched = movieData[MOVIE_PROPERTIES_MAP.WATCHED].toLowerCase() === 'false';
    const themeMatches = theme ?
      movieData[MOVIE_PROPERTIES_MAP.THEME].toLowerCase() === theme.toLowerCase() :
      movieData[MOVIE_PROPERTIES_MAP.THEME].toLowerCase() !== 'christmas';

    return notWatched && themeMatches;
  });

  if (movies.length === 0) {
    throw new NotFoundError('No movie meets the requirements! You can try setting participated option to true or use different theme.');
  }

  return pollOptions.slice(0, size);
}