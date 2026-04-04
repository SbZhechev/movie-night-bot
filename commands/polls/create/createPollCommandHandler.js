import { createBasicMessageComponent, createPollMessage, endPoll } from "../../../discordUtils.js"
import { NotFoundError } from "../../../notFoundError.js";
import { getMoviesForPoll } from "../../utils.js";
import { DEFAULT_POLL_DURATION } from "../../../constants.js";
import { MOVIE_PROPERTIES_MAP } from "../../../constants.js";
import { getList } from "../../../google-sheets/utils.js";
import { handleCreatePoll } from "../../utils.js";

export const handleCreatePollCommand = async (res, data, channelId, member) => {
  try {
    const { title, size, participated, theme, duration } = parseOptions(data.options);

    const movies = await getList();

    let pollOptions = getMoviesForPoll({ movies, size, participated, theme });

    let answers = pollOptions.map((option, index) => {
      return {
        answer_id: index,
        poll_media: { text: option[MOVIE_PROPERTIES_MAP.TITLE] }
      }
    })

    let pollObject = {
      question: { text: title },
      answers,
      duration,
      allow_multiselect: true
    };

    await handleCreatePoll(channelId, pollObject, member);

    return res.send(createBasicMessageComponent('You got it boss!', true));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while creating a poll!';
    let isEphemeral = false;
    if (error instanceof NotFoundError) {
      errorMessage = error.message;
      isEphemeral = true;
    } else {
      console.error(error.message);
    }

    return res.send(createBasicMessageComponent(errorMessage, isEphemeral));
  }
}

const parseOptions = (options) => {
  const optionsValues = {
    title: '',
    size: 10,
    participated: false,
    theme: null,
    duration: DEFAULT_POLL_DURATION
  };

  if (!options) return optionsValues;

  options.forEach(option => optionsValues[option.name] = option.value);

  return optionsValues;
}