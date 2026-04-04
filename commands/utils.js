import { createPollMessage } from "../discordUtils.js";
import { createCronJob } from "../cron/cronJob.js";

export const handleCreatePoll = async (channelId, pollObject, member) => {
  const messageResponse = await createPollMessage(channelId, pollObject);
  const messageData = await messageResponse.json();
  const messageId = messageData.id;

  console.log('Poll was created!');
  createCronJob(messageId, channelId, pollObject.duration, member);
}