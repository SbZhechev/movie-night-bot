import { DuplicateError } from '../../../duplicateError.js';
import { createBasicMessageComponent } from '../../../discordUtils.js';
import { sheetsAPI, SPREAD_SHEET_ID } from '../../../google-sheets/index.js';
import { MOVIE_PROPERTIES_MAP } from '../../../constants.js';

export const handleAddCommand = async (res, data) => {
  try {
    let { title, watched, participated, theme, position } = parseOptions(data.options);

    const sheetsClient = await sheetsAPI();

    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: SPREAD_SHEET_ID,
      range: 'Movie List'
    });

    const movies = response.data.values;

    if (movies.some(movieData => movieData[MOVIE_PROPERTIES_MAP.TITLE].toLowerCase() === title.toLowerCase())) {
      throw new DuplicateError(`${title} is already in the list!`);
    }

    const newSuggestion = [title, watched, participated, theme];

    if (!position) {
      await sheetsClient.spreadsheets.values.append({
        spreadsheetId: SPREAD_SHEET_ID,
        range: 'Movie List',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [newSuggestion],
        }
      });
    } else {
      movies.splice(position, 0, newSuggestion);

      await sheetsClient.spreadsheets.values.update({
        spreadsheetId: SPREAD_SHEET_ID,
        range: 'Movie List',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          majorDimension: 'ROWS',
          values: movies,
        }
      });
    }

    console.log(`${title} added to the list!`);
    return res.send(createBasicMessageComponent(`${title} added to the list!`));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while adding a suggestion!';
    let isEphemeral = false;
    if (error instanceof DuplicateError) {
      errorMessage = error.message
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
    watched: false,
    participated: false,
    theme: 'none',
    position: null
  };

  options.forEach(option => optionsValues[option.name] = option.value);

  return optionsValues;
}