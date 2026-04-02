import { NotFoundError } from "../../../notFoundError.js";
import { createBasicMessageComponent } from "../../../discordUtils.js";
import { sheetsAPI, SPREAD_SHEET_ID } from "../../../google-sheets/index.js";
import { MOVIE_PROPERTIES_MAP } from "../../../constants.js";

export const handleMoveCommand = async (res, data) => {
  try {
    const { title: movieTitle, to: newPlace, position: newPosition } = parseOptions(data.options);

    if (!newPlace && !newPosition) {
      throw new RangeError('You have to provide at least one of the options "to" or "position"!');
    }

    const sheetsClient = await sheetsAPI();

    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: SPREAD_SHEET_ID,
      range: 'Movie List'
    });

    const movies = response.data.values;

    const movieIndex = movies.findIndex(movieData => movieData[MOVIE_PROPERTIES_MAP.TITLE].toLowerCase() === movieTitle.toLowerCase());

    if (movieIndex < 0) throw new NotFoundError(`${movieTitle} is not in the list!`);

    const movieToMove = movies.splice(movieIndex, 1)[0];

    let successMessage = `${movieTitle} moved to the ${newPlace} of the list!`;
    if (newPosition) {
      movies.splice(newPosition, 0, movieToMove);
      successMessage = `${movieTitle} moved to position ${newPosition} in the list!`
    } else {
      switch (newPlace) {
        case 'front':
          movies.splice(1, 0, movieToMove);
          break;
        case 'back':
          movies.push(movieToMove);
          break;
        default:
          throw new TypeError('Invalid position provided!');
      }
    }

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SPREAD_SHEET_ID,
      range: 'Movie List',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        majorDimension: 'ROWS',
        values: movies,
      }
    });

    console.log(successMessage);
    const isEphemeral = true;
    return res.send(createBasicMessageComponent(successMessage, isEphemeral));
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