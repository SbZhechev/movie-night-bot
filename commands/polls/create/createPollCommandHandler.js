import { createBasicMessageComponent, createPollMessage } from "../../../discordUtils.js"
import { NotFoundError } from "../../../notFoundError.js";
import { getMoviesForPoll, parseSuggestionsFile } from "../../../fileUtils.js";
import { handlePollResults } from "./utils.js";
import { DEFAULT_POLL_DURATION } from "../../../constants.js";

export const handleCreatePollCommand = async (res, data, channelId) => {
  try {
    const { title, size, participated, theme, duration } = parseOptions(data.options);
    let movies = parseSuggestionsFile();
    let pollOptions = getMoviesForPoll({ movies, size, participated, theme });

    let answers = pollOptions.map((option, index) => {
      return {
        answer_id: index,
        poll_media: { text: option.title }
      }
    })

    let pollObject = {
      question: { text: title },
      answers,
      duration,
      allow_multiselect: true
    };

    const messageResponse = await createPollMessage(channelId, pollObject);
    const messageData = await messageResponse.json();
    const messageId = messageData.id;

    handlePollResults(channelId, messageId, duration, title);
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