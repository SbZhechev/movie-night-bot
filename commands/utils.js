import { createPollMessage } from "../discordUtils.js";
import { createCronJob } from "../cron/cronJob.js";
import { createBasicMessageComponent } from "../../../discordUtils.js";
import { editMessage } from "../../../discordUtils.js";
import { handlePollResults } from "../../polls/create/utils.js";
import { MessageComponentTypes, ButtonStyleTypes } from "discord-interactions";

export const handleCreatePoll = async (channelId, pollObject, member) => {
  const messageResponse = await createPollMessage(channelId, pollObject);
  const messageData = await messageResponse.json();
  const messageId = messageData.id;

  console.log('Poll was created!');
  createCronJob(messageId, channelId, pollObject.duration, member);
}

export const handleUpdateList = async (res, message, member) => {
  const content = message.components[0].content;

  if (!content.includes(member.user.id)) {
    return res.send(createBasicMessageComponent('I don\'t fink u have da facilities for that, big man!', true));
  }

  let button = message.components[1].components[0];
  const [channelId, pollMessageId] = button.custom_id.split('::');

  res.send(createBasicMessageComponent('Aight, bet!', true));
  await handlePollResults(channelId, pollMessageId, member);

  message.components[1].components[0] = {
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.SUCCESS,
    label: 'List Updated',
    custom_id: 'updated',
    disabled: true
  }

  await editMessage(channelId, message.id, message.components);
}