import { readSuggestionsFile, updateSuggestionsFile } from "../../../fileUtils.js";
import { NotFoundError } from "../../../notFoundError.js";
import { createBasicMessageComponent } from "../../../discordUtils.js";

export const handleDeleteComman = (res, data) => {
  try {
    let movieTitle = data.options[0].value;
    let movies = readSuggestionsFile();

    let movieIndex = movies.findIndex(movie => movie.includes(movieTitle));

    if (movieIndex < 0) throw new NotFoundError(`${movieTitle} is not in the list!`);

    movies.splice(movieIndex, 1);
    updateSuggestionsFile(movies);

    console.log(`${movieTitle} removed from the list!`)
    return res.send(createBasicMessageComponent(`${movieTitle} removed from the list!`));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while removing a movie from the list!';
    if (error instanceof NotFoundError) {
      errorMessage = error.message;
    }

    res.send(createBasicMessageComponent(errorMessage));
  }
}