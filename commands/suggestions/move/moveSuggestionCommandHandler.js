import { parseSuggestionsFile, updateSuggestionsFile } from "../../../fileUtils.js";
import { NotFoundError } from "../../../notFoundError.js";
import { createBasicMessageComponent } from "../../../discordUtils.js";

export const handleMoveCommand = (res, data) => {
  try {
    const { title: movieTitle, to: newPlace, position: newPosition } = parseOptions(data.options);

    if (!newPlace && !newPosition) {
      throw new RangeError('You have to provide at least one of the options "to" or "position"!');
    }

    const movies = parseSuggestionsFile();
    const movieIndex = movies.findIndex(movie => movie.title.toLowerCase() === movieTitle.toLowerCase());

    if (movieIndex < 0) throw new NotFoundError(`${movieTitle} is not in the list!`);

    const movieData = movies.splice(movieIndex, 1)[0];

    let successMessage = `${movieTitle} moved to the ${newPlace} of the list!`;
    if (newPosition) {
      movies.splice(newPosition - 1, 0, movieData);
      successMessage = `${movieTitle} moved to position ${newPosition} in the list!`
    } else {
      switch (newPlace) {
        case 'front':
          movies.splice(0, 0, movieData);
          break;
        case 'back':
          movies.push(movieData);
          break;
        default:
          throw new TypeError('Invalid position provided!');
      }
    }
    updateSuggestionsFile(movies);

    console.log(successMessage);
    return res.send(createBasicMessageComponent(successMessage, true));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while moving a suggestion!';
    let isEphemeral = false;
    if (error instanceof NotFoundError || error instanceof RangeError) {
      errorMessage = error.message;
      isEphemeral = true;
    } else {
      console.error(error);
    }

    return res.send(createBasicMessageComponent(errorMessage, isEphemeral));
  }
}

const parseOptions = (options) => {
  let optionsValues = {
    title: '',
    to: null,
    position: null
  };

  options.forEach(option => optionsValues[option.name] = option.value);

  return optionsValues;
}