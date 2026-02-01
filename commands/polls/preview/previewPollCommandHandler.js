import { createBasicMessageComponent } from "../../../discordUtils.js";
import { parseSuggestionsFile } from "../../../fileUtils.js";
import { NotFoundError } from "../../../notFoundError.js";
import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from "discord-interactions";

export const handlePreviewCommand = (res, data) => {
  try {
    const { size, theme, participated } = parseOptions(data.options);
    let movies = parseSuggestionsFile();

    movies = movies.filter(movie => {
      const notWatched = movie.watched === 'false';
      const participationMatches = participated ? true : movie.participated === 'false';
      const themeMatches = theme ?
        movie.theme.toLowerCase() === theme.toLowerCase() :
        movie.theme.toLowerCase() !== 'christmas';

      return notWatched && participationMatches && themeMatches;
    });

    if (movies.length === 0) {
      throw new NotFoundError('No movie meets the requirements! You can try setting participated option to true or use different theme.');
    }

    let moviesList = '';
    movies
      .slice(0, size)
      .forEach(movie => moviesList += `- ${movie.title}\n`);

    return res.send(
      {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2 | InteractionResponseFlags.EPHEMERAL,
          components: [
            {
              type: MessageComponentTypes.CONTAINER,
              components: [
                {
                  type: MessageComponentTypes.TEXT_DISPLAY,
                  content: '### These will be the options for the new poll: '
                },
                {
                  type: MessageComponentTypes.SEPARATOR
                },
                {
                  type: MessageComponentTypes.TEXT_DISPLAY,
                  content: moviesList
                }
              ]
            }
          ]
        }
      }
    );
  } catch (error) {
    let errorMessage = 'Unexpected error occured while creating poll preview!';
    if (error instanceof NotFoundError) {
      errorMessage = error.message;
    } else {
      console.error(error);
    }

    return res.send(createBasicMessageComponent(errorMessage));
  }
}

const parseOptions = (options) => {
  const optionsValues = {
    size: 10,
    participated: false,
    theme: null
  };

  if (!options) return optionsValues;

  options.forEach(options => {
    optionsValues[options.name] = options.value
  });

  return optionsValues;
}