import { createBasicMessageComponent } from "../../../discordUtils.js";
import { replaceSuggestionsFileContent } from "../../../fileUtils.js";
import fetch from "node-fetch";

export const handleSetCommand = async (res, data) => {
  try {
    const attachments = data.resolved.attachments;
    let attachmentKey = Object.keys(attachments)[0];
    const attachment = attachments[attachmentKey];

    const response = await fetch(attachment.url, { method: 'GET' });
    let fileData = await response.text();
    replaceSuggestionsFileContent(fileData.trim());

    return res.send(createBasicMessageComponent('List updated!'));
  } catch (error) {
    let errorMessage = 'Unexpected error occured while setting the list!';
    console.error(error);

    return res.send(createBasicMessageComponent(errorMessage));
  }
};