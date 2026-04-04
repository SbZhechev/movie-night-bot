import { createCronJob } from "../cron/cronJob.js";
import { editMessage, createBasicMessageComponent, createPollMessage } from "../discordUtils.js";
import { handlePollResults } from "./polls/create/utils.js";
import { MessageComponentTypes, ButtonStyleTypes } from "discord-interactions";
import { MOVIE_PROPERTIES_MAP } from "../constants.js";
import { endPoll } from "../discordUtils.js";

export const handleCreatePoll = async (channelId, pollObject, member) => {
  const messageResponse = await createPollMessage(channelId, pollObject);
  const messageData = await messageResponse.json();
  const messageId = messageData.id;

  console.log('Poll was created!');
  createCronJob(messageId, channelId, 10000, member);
  setTimeout(() => {
    endPoll(channelId, messageId);
  }, 10000);
}

export const handleUpdateList = async (res, message, member) => {
  const content = message.components[0].content;

  if (!content.includes(member.user.id)) {
    return res.send(createBasicMessageComponent('I don\'t fink u have da facilities for that, big man!', true));
  }

  let button = message.components[1].components[0];
  const [channelId, pollMessageId] = button.custom_id.split('::');

  await handlePollResults(channelId, pollMessageId, member);

  message.components[1].components[0] = {
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.SUCCESS,
    label: 'List Updated',
    custom_id: 'updated',
    disabled: true
  }

  await editMessage(channelId, message.id, message.components);

  res.send(createBasicMessageComponent('Aight, bet!', true));
}

export const getMoviesForPoll = ({ movies, size, theme }) => {
  let pollOptions = movies.filter(movieData => {
    const notWatched = movieData[MOVIE_PROPERTIES_MAP.WATCHED].toLowerCase() === 'false';
    const themeMatches = theme ?
      movieData[MOVIE_PROPERTIES_MAP.THEME].toLowerCase() === theme.toLowerCase() :
      movieData[MOVIE_PROPERTIES_MAP.THEME].toLowerCase() !== 'christmas';

    return notWatched && themeMatches;
  });

  if (movies.length === 0) {
    throw new NotFoundError('No movie meets the requirements! You can try setting participated option to true or use different theme.');
  }

  return pollOptions.slice(0, size);
}