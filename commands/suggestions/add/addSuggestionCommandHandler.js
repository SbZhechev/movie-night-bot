import { DuplicateError } from '../../../duplicateError.js';
import { parseSuggestionsFile, updateSuggestionsFile } from '../../../fileUtils.js';
import { createBasicMessageComponent } from '../../../discordUtils.js';

export const handleAddCommand = (res, data) => {
  try {
    let { title, watched, participated, theme, position } = parseOptions(data.options);

    let movies = parseSuggestionsFile();
    if (movies.some(movie => movie.title.toLowerCase() === title.toLowerCase())) {
      throw new DuplicateError(`${title} is already in the list!`);
    }

    let newSuggestion = { title, watched, participated, theme };
    if (!position) {
      movies.push(newSuggestion);
    } else {
      movies.splice(position - 1, 0, newSuggestion);
    }

    updateSuggestionsFile(movies);
    console.log(`${title} added to the list!`);
    return res.send(createBasicMessageComponent(`${title} added to the list!`));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while adding a suggestion!';
    if (error instanceof DuplicateError) {
      errorMessage = error.message
    } else {
      console.error(error);
    }

    return res.send(createBasicMessageComponent(errorMessage));
  }
}

const parseOptions = (options) => {
  let optionsValues = {
    title: '',
    watched: false,
    participated: false,
    theme: 'none',
    position: null
  };

  options.forEach(option => optionsValues[option.name] = option.value);

  return optionsValues;
}