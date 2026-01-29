import { parseSuggestionsFile, updateSuggestionsFile } from "../../../fileUtils.js";
import { NotFoundError } from "../../../notFoundError.js";
import { createBasicMessageComponent } from "../../../discordUtils.js";

export const handleMoveCommand = (res, data) => {
  try {
    const { title: movieTitle, to: newPosition } = parseOptions(data.options);

    const movies = parseSuggestionsFile();
    const movieIndex = movies.findIndex(movie => movie.includes(movieTitle));

    if (movieIndex < 0) throw new NotFoundError(`${movieTitle} is not in the list!`);

    const movieData = movies.splice(movieIndex, 1)[0];

    switch (newPosition) {
      case 'front':
        movies.splice(1, 0, movieData);
        break;
      case 'back':
        movies.push(movieData);
        break;
      default:
        throw new TypeError('Invalid position provided!');
    }
    updateSuggestionsFile(movies);

    console.log(`${movieTitle} moved to the ${newPosition} of the list!`);
    return res.send(createBasicMessageComponent(`${movieTitle} moved to the ${newPosition} of the list!`));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while moving a suggestion!';

    if (error instanceof NotFoundError) {
      errorMessage = error.message;
    } else {
      console.error(error);
    }

    return res.send(createBasicMessageComponent(errorMessage));
  }
}

const parseOptions = (options) => {
  let optionsValues = {
    title: '',
    to: ''
  };

  options.forEach(option => optionsValues[option.name] = option.value);

  return optionsValues;
}