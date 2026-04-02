import { NotFoundError } from "../../../notFoundError.js";
import { createBasicMessageComponent } from "../../../discordUtils.js";
import { sheetsAPI, SPREAD_SHEET_ID } from "../../../google-sheets/index.js";
import { MOVIE_PROPERTIES_MAP } from "../../../constants.js";

export const handleDeleteCommand = async (res, data) => {
  try {
    let movieTitle = data.options[0].value;
    const sheetsClient = await sheetsAPI();

    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: SPREAD_SHEET_ID,
      range: 'Movie List'
    });

    const movies = response.data.values;

    let movieIndex = movies.findIndex(movieData => movieData[MOVIE_PROPERTIES_MAP.TITLE].toLowerCase() === movieTitle.toLowerCase());

    if (movieIndex < 0) throw new NotFoundError(`${movieTitle} is not in the list!`);

    movies.splice(movieIndex, 1);

    // clear last remaining row not covered by the new range
    const emptyRow = ['', '', '', ''];
    movies.push(emptyRow);

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SPREAD_SHEET_ID,
      range: 'Movie List',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        majorDimension: 'ROWS',
        values: movies,
      }
    });

    console.log(`${movieTitle} removed from the list!`)
    return res.send(createBasicMessageComponent(`${movieTitle} removed from the list!`, true));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while removing a movie from the list!';
    let isEphemeral = false;
    if (error instanceof NotFoundError) {
      errorMessage = error.message;
      isEphemeral = true;
    } else {
      console.error(error);
    }

    res.send(createBasicMessageComponent(errorMessage, isEphemeral));
  }
}