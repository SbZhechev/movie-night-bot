import { createBasicMessageComponent } from "../../../discordUtils.js";
import { NotFoundError } from "../../../notFoundError.js";
import { sheetsAPI, SPREAD_SHEET_ID } from "../../../google-sheets/index.js";
import { MOVIE_PROPERTIES_MAP } from "../../../constants.js";

export const handleEditCommand = async (res, data) => {
  try {
    const { title, new_title, new_watched, new_participated, new_theme } = parseOptions(data.options);

    if (![new_title, new_watched, new_participated, new_theme].some(value => value)) {
      throw new RangeError('You have to provide at least 1 option that needs to be changed!');
    }

    const sheetsClient = await sheetsAPI();

    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: SPREAD_SHEET_ID,
      range: 'Movie List'
    });

    const movies = response.data.values;

    let movieIndex = movies.findIndex(movieData => movieData[MOVIE_PROPERTIES_MAP.TITLE].toLowerCase() === title.toLowerCase());

    if (movieIndex < 0) throw new NotFoundError(`${title} is not in the list!`);

    const movie = movies[movieIndex];

    const newMovie = [
      new_title !== null && new_title.trim().length > 0 ? new_title : movie.title,
      new_watched !== null ? new_watched : movie.watched,
      new_participated !== null ? new_participated : movie.participated,
      new_theme !== null && new_theme.trim().length > 0 ? new_theme : movie.theme
    ];

    movies[movieIndex] = newMovie;

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SPREAD_SHEET_ID,
      range: 'Movie List',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        majorDimension: 'ROWS',
        values: movies,
      }
    });

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