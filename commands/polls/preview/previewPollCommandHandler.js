import { createBasicMessageComponent } from "../../../discordUtils.js";
import { getMoviesForPoll } from "../../utils.js";
import { NotFoundError } from "../../../notFoundError.js";
import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from "discord-interactions";
import { MOVIE_PROPERTIES_MAP } from "../../../constants.js";
import { getList } from "../../../google-sheets/utils.js";

export const handlePreviewCommand = async (res, data) => {
  try {
    const { size, theme, participated } = parseOptions(data.options);

    const movies = await getList();

    let pollCandidates = getMoviesForPoll({ movies, size, participated, theme });

    let moviesList = '';
    pollCandidates.forEach(movieData => moviesList += `- ${movieData[MOVIE_PROPERTIES_MAP.TITLE]}\n`);

    console.log('Poll preview was created!');
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