import { createBasicMessageComponent } from "../../../discordUtils.js";
import { parseSuggestionsFile, updateSuggestionsFile } from "../../../fileUtils.js";
import { NotFoundError } from "../../../notFoundError.js";

export const handleEditCommand = (res, data) => {
  try {
    const { title, new_title, new_watched, new_participated, new_theme } = parseOptions(data.options);

    if (![new_title, new_watched, new_participated, new_theme].some(value => value)) {
      throw new RangeError('You have to provide at least 1 option that needs to be changed!');
    }

    const movies = parseSuggestionsFile();
    const movie = movies.find(movie => movie.title.toLowerCase() === title.toLowerCase());

    if (!movie) throw new NotFoundError(`${title} is not in the list!`);

    movie.title = new_title !== null && new_title.trim().length > 0 ? new_title : movie.title;
    movie.watched = new_watched !== null ? new_watched : movie.watched;
    movie.participated = new_participated !== null ? new_participated : movie.participated;
    movie.theme = new_theme !== null && new_theme.trim().length > 0 ? new_theme : movie.theme;

    updateSuggestionsFile(movies);

    console.log(`${title} has been edited!`);
    return res.send(createBasicMessageComponent(`${title} has been edited!`, true));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while editing a movie!';
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
  const optionsValues = {
    title: '',
    new_title: null,
    new_watched: null,
    new_participated: null,
    new_theme: null
  };

  options.forEach(option => optionsValues[option.name] = option.value);

  return optionsValues;
}