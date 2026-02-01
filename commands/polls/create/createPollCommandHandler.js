import { createBasicMessageComponent, createPollMessage } from "../../../discordUtils.js"
import { NotFoundError } from "../../../notFoundError.js";
import { getMoviesForPoll } from "../../../fileUtils.js";

export const handleCreatePollCommand = async (res, data, channelId) => {
  try {
    const { title, size, participated, theme, duration } = parseOptions(data.options);
    let pollOptions = getMoviesForPoll({ size, participated, theme });

    let answers = pollOptions.map(option => {
      return {
        answer_id: option.title,
        poll_media: { text: option.title }
      }
    })

    let pollObject = {
      question: { text: title },
      answers,
      duration,
      allow_multiselect: true
    };

    await createPollMessage(channelId, pollObject);

    return res.send(createBasicMessageComponent('You got it boss!'));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while creating a poll!';
    if (error instanceof NotFoundError) {
      errorMessage = error.message;
    } else {
      console.error(error.message);
    }

    return res.send(createBasicMessageComponent(errorMessage));
  }
}

const parseOptions = (options) => {
  const optionsValues = {
    title: '',
    size: 10,
    participated: false,
    theme: null,
    duration: 1
  };

  if (!options) return optionsValues;

  options.forEach(option => optionsValues[option.name] = option.value);

  return optionsValues;
}